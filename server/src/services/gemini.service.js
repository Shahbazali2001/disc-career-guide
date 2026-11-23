import { GoogleGenAI, Type } from '@google/genai';
import { env } from '../config/env.js';
import {
  generateDemoCareerReport,
  generateDemoChatReply,
} from './demoFallback.service.js';
import { CAREER_FAMILIES, DISC_TRAITS } from './discScoring.service.js';

const MODEL_CHAIN = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];
const FALLBACK_HTTP_STATUSES = new Set([404, 429, 500, 503]);
const MAX_CHAT_HISTORY_MESSAGES = 12;

let cachedClient = null;
let cachedApiKey = '';

const getApiKey = () => (process.env.GEMINI_API_KEY ?? env.GEMINI_API_KEY ?? '').trim();

const getGeminiClient = () => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return null;
  }
  if (!cachedClient || cachedApiKey !== apiKey) {
    cachedClient = new GoogleGenAI({ apiKey });
    cachedApiKey = apiKey;
  }
  return cachedClient;
};

const extractHttpStatus = (err) => {
  if (!err) return null;
  const direct = err.status ?? err.statusCode ?? err.response?.status ?? err.error?.code;
  if (typeof direct === 'number') return direct;
  if (typeof direct === 'string' && /^\d{3}$/.test(direct)) return Number(direct);

  const msg = String(err.message || '');
  const match = msg.match(/\b(404|429|500|503)\b/);
  return match ? Number(match[1]) : null;
};

const shouldFallbackModel = (err) => {
  const status = extractHttpStatus(err);
  return status !== null && FALLBACK_HTTP_STATUSES.has(status);
};

const CAREER_REPORT_SCHEMA = {
  type: Type.OBJECT,
  required: [
    'styleTitle',
    'summary',
    'strengths',
    'growthAreas',
    'careerFamilies',
    'recommendedJobs',
  ],
  properties: {
    styleTitle: {
      type: Type.STRING,
      description: 'Concise blend title, e.g. "CD Style: The Analytical Strategist".',
    },
    summary: {
      type: Type.STRING,
      description:
        '2–3 sentences describing work-style tendencies plus an explicit note that DISC is for self-reflection only, not a scientific diagnostic or hiring tool.',
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Exactly 3 core workplace strengths.',
    },
    growthAreas: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '2 to 3 constructive workplace growth areas.',
    },
    careerFamilies: {
      type: Type.ARRAY,
      description: 'All 8 career families with integer matchProbability values summing to 100.',
      items: {
        type: Type.OBJECT,
        required: ['name', 'matchProbability'],
        properties: {
          name: {
            type: Type.STRING,
            enum: CAREER_FAMILIES,
          },
          matchProbability: {
            type: Type.INTEGER,
          },
        },
      },
    },
    recommendedJobs: {
      type: Type.ARRAY,
      description:
        '20 diverse occupations (at least 12 office roles and at least 8 non-office roles across multiple families), sorted by matchPercentage descending.',
      items: {
        type: Type.OBJECT,
        required: [
          'title',
          'family',
          'isOfficeRole',
          'matchPercentage',
          'description',
          'keySkills',
          'jobDiscProfile',
          'firstStep',
        ],
        properties: {
          title: { type: Type.STRING },
          family: { type: Type.STRING, enum: CAREER_FAMILIES },
          isOfficeRole: { type: Type.BOOLEAN },
          matchPercentage: { type: Type.INTEGER },
          description: { type: Type.STRING },
          keySkills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          jobDiscProfile: {
            type: Type.OBJECT,
            required: ['D', 'I', 'S', 'C'],
            properties: {
              D: { type: Type.INTEGER },
              I: { type: Type.INTEGER },
              S: { type: Type.INTEGER },
              C: { type: Type.INTEGER },
            },
          },
          firstStep: { type: Type.STRING },
        },
      },
    },
  },
};

const clampInt = (val, min, max, fallback = min) => {
  const num = Math.round(Number(val));
  if (!Number.isFinite(num)) return fallback;
  return Math.min(max, Math.max(min, num));
};

const normalizeCareerFamilies = (rawFamilies) => {
  const map = new Map();
  if (Array.isArray(rawFamilies)) {
    for (const item of rawFamilies) {
      const name = typeof item?.name === 'string' ? item.name.trim() : '';
      if (CAREER_FAMILIES.includes(name) && !map.has(name)) {
        map.set(name, Math.max(1, clampInt(item.matchProbability, 1, 100, 10)));
      }
    }
  }

  const entries = CAREER_FAMILIES.map((name) => ({
    name,
    raw: map.get(name) ?? 5,
  }));

  const sum = entries.reduce((acc, e) => acc + e.raw, 0);
  const scaled = entries.map((e) => (e.raw / sum) * 100);
  const ints = scaled.map((v) => Math.max(1, Math.floor(v)));
  let diff = 100 - ints.reduce((acc, n) => acc + n, 0);

  const byRemainder = scaled
    .map((v, idx) => ({ idx, rem: v - Math.floor(v) }))
    .sort((a, b) => b.rem - a.rem);

  let cursor = 0;
  while (diff > 0) {
    ints[byRemainder[cursor % byRemainder.length].idx] += 1;
    diff -= 1;
    cursor += 1;
  }
  while (diff < 0) {
    const maxIdx = ints.indexOf(Math.max(...ints));
    ints[maxIdx] -= 1;
    diff += 1;
  }

  return entries
    .map((e, idx) => ({ name: e.name, matchProbability: ints[idx] }))
    .sort((a, b) => b.matchProbability - a.matchProbability);
};

const validateAndNormalizeReport = (raw) => {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Gemini returned a non-object career report.');
  }

  const styleTitle = String(raw.styleTitle || '').trim();
  const summary = String(raw.summary || '').trim();
  const strengths = Array.isArray(raw.strengths)
    ? raw.strengths.map((s) => String(s || '').trim()).filter(Boolean).slice(0, 3)
    : [];
  const growthAreas = Array.isArray(raw.growthAreas)
    ? raw.growthAreas.map((s) => String(s || '').trim()).filter(Boolean).slice(0, 3)
    : [];

  if (!styleTitle || !summary || strengths.length < 3 || growthAreas.length < 2) {
    throw new Error('Gemini career report is missing required narrative fields.');
  }

  const careerFamilies = normalizeCareerFamilies(raw.careerFamilies);

  if (!Array.isArray(raw.recommendedJobs) || raw.recommendedJobs.length < 20) {
    throw new Error('Gemini career report must include at least 20 recommended jobs.');
  }

  const normalizedJobs = raw.recommendedJobs
    .slice(0, 20)
    .map((job) => {
      const family = CAREER_FAMILIES.includes(job?.family)
        ? job.family
        : CAREER_FAMILIES[0];
      const profile = {};
      for (const trait of DISC_TRAITS) {
        profile[trait] = clampInt(job?.jobDiscProfile?.[trait], 0, 100, 50);
      }

      const keySkills = Array.isArray(job?.keySkills)
        ? job.keySkills.map((k) => String(k || '').trim()).filter(Boolean).slice(0, 3)
        : [];

      return {
        title: String(job?.title || '').trim(),
        family,
        isOfficeRole: Boolean(job?.isOfficeRole),
        matchPercentage: clampInt(job?.matchPercentage, 55, 98, 70),
        description: String(job?.description || '').trim(),
        keySkills,
        jobDiscProfile: profile,
        firstStep: String(job?.firstStep || '').trim(),
      };
    })
    .filter((job) => job.title && job.description && job.firstStep && job.keySkills.length === 3)
    .sort((a, b) => b.matchPercentage - a.matchPercentage);

  const officeCount = normalizedJobs.filter((j) => j.isOfficeRole).length;
  const nonOfficeCount = normalizedJobs.length - officeCount;

  if (normalizedJobs.length < 20 || officeCount < 12 || nonOfficeCount < 8) {
    throw new Error(
      `Gemini jobs did not meet role diversity constraints (total=${normalizedJobs.length}, office=${officeCount}, nonOffice=${nonOfficeCount}).`
    );
  }

  return {
    styleTitle,
    summary,
    strengths,
    growthAreas,
    careerFamilies,
    recommendedJobs: normalizedJobs,
  };
};

const callWithModelFallback = async (invokeFn) => {
  let lastError = null;

  for (let i = 0; i < MODEL_CHAIN.length; i += 1) {
    const model = MODEL_CHAIN[i];
    try {
      const result = await invokeFn(model);
      return { result, modelUsed: model };
    } catch (err) {
      lastError = err;
      const isLast = i === MODEL_CHAIN.length - 1;
      if (!isLast && shouldFallbackModel(err)) {
        console.warn(
          `[Gemini] Model "${model}" failed with HTTP ${extractHttpStatus(err)}; falling back to "${MODEL_CHAIN[i + 1]}".`
        );
        continue;
      }
      throw err;
    }
  }

  throw lastError;
};

/**
 * Generates a structured DISC Career Report via Gemini Structured Outputs.
 * Falls back from gemini-2.5-flash -> gemini-2.5-flash-lite on HTTP 404/429/500/503,
 * and falls back to demoFallback.service.js if API key is absent or all models fail.
 */
export const generateCareerReport = async (scores, blendLabel) => {
  const client = getGeminiClient();
  if (!client) {
    return {
      report: generateDemoCareerReport(scores, blendLabel),
      isDemoFallback: true,
      modelUsed: 'demo-fallback',
    };
  }

  const prompt = [
    `Generate a personalized DISC Career Guide report for a user with these self-reflection scores (0–100):`,
    `- Dominance (D): ${scores.D}`,
    `- Influence (I): ${scores.I}`,
    `- Steadiness (S): ${scores.S}`,
    `- Conscientiousness (C): ${scores.C}`,
    `- Blend Label: ${blendLabel}`,
    ``,
    `Requirements:`,
    `1. styleTitle: memorable style headline (e.g., "CD Style: The Analytical Strategist").`,
    `2. summary: 2–3 sentences describing work-style tendencies and explicitly noting that DISC is for self-reflection only, not a scientific diagnostic or hiring tool.`,
    `3. strengths: exactly 3 concise, practical workplace strengths.`,
    `4. growthAreas: 2–3 constructive workplace growth areas.`,
    `5. careerFamilies: include ALL 8 exact families (${CAREER_FAMILIES.join('; ')}) with positive integer matchProbability values that sum to exactly 100.`,
    `6. recommendedJobs: exactly 20 diverse occupations spanning multiple career families, containing at least 12 office roles (isOfficeRole: true) and at least 8 non-office/hands-on roles (isOfficeRole: false), sorted by matchPercentage descending (integers 55–98).`,
    `   Each job must include: title, family, isOfficeRole, matchPercentage, description (1–2 sentences), keySkills (3 concise skills), jobDiscProfile ({ D, I, S, C } integers 0–100), and firstStep (1 concrete actionable sentence).`,
    `7. Never include fabricated salary numbers or fake labor statistics.`,
  ].join('\n');

  try {
    const { result, modelUsed } = await callWithModelFallback(async (model) => {
      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: CAREER_REPORT_SCHEMA,
          temperature: 0.4,
        },
      });

      const rawText = response.text;
      if (!rawText) {
        throw new Error(`Empty response text from Gemini model ${model}`);
      }
      const parsed = JSON.parse(rawText);
      return validateAndNormalizeReport(parsed);
    });

    return {
      report: result,
      isDemoFallback: false,
      modelUsed,
    };
  } catch (err) {
    console.warn(`[Gemini] Falling back to demo career report: ${err.message}`);
    return {
      report: generateDemoCareerReport(scores, blendLabel),
      isDemoFallback: true,
      modelUsed: 'demo-fallback',
    };
  }
};

const buildChatSystemInstruction = (scores) =>
  [
    'You are the DISC Career Guide Coach, a helpful career reflection assistant.',
    `The user's DISC self-reflection scores (0–100 scale) are: D=${scores.D}, I=${scores.I}, S=${scores.S}, C=${scores.C}.`,
    '',
    'Strict Guardrails:',
    '- Stay strictly focused on career exploration, skill development, job/role fit, and workplace communication.',
    '- Politely decline off-topic requests (e.g., medical, legal, political, or unrelated tasks) and steer back to career guidance.',
    '- Always treat DISC as a personal self-reflection framework only—NEVER recommend using DISC for hiring, screening, firing, or clinical diagnosis.',
    '- NEVER invent salary figures, pay ranges, or fake job market statistics; direct users to official sources (e.g., BLS or local labor data) if they ask for pay numbers.',
    '- Keep responses concise, practical, and actionable (typically 1–2 short paragraphs or crisp bullet points).',
  ].join('\n');

/**
 * Generates a guardrailed multi-turn career chat reply via Gemini.
 * Sends at most the last 12 history messages for cost control.
 */
export const generateChatReply = async (history, scores, userMessage) => {
  const client = getGeminiClient();
  if (!client) {
    return {
      reply: generateDemoChatReply(history, scores, userMessage),
      isDemo: true,
      modelUsed: 'demo-fallback',
    };
  }

  const trimmedHistory = Array.isArray(history)
    ? history.slice(-MAX_CHAT_HISTORY_MESSAGES)
    : [];

  const contents = [
    ...trimmedHistory.map((msg) => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: String(msg.content || '') }],
    })),
    {
      role: 'user',
      parts: [{ text: String(userMessage) }],
    },
  ];

  try {
    const { result, modelUsed } = await callWithModelFallback(async (model) => {
      const response = await client.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: buildChatSystemInstruction(scores),
          temperature: 0.6,
        },
      });

      const text = response.text?.trim();
      if (!text) {
        throw new Error(`Empty chat reply from Gemini model ${model}`);
      }
      return text;
    });

    return {
      reply: result,
      isDemo: false,
      modelUsed,
    };
  } catch (err) {
    console.warn(`[Gemini] Falling back to demo chat reply: ${err.message}`);
    return {
      reply: generateDemoChatReply(history, scores, userMessage),
      isDemo: true,
      modelUsed: 'demo-fallback',
    };
  }
};
