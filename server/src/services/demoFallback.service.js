import { CAREER_FAMILIES, DISC_TRAITS } from './discScoring.service.js';

const BLEND_TITLES = {
  DI: 'DI Style: The Visionary Catalyst',
  DS: 'DS Style: The Grounded Executor',
  DC: 'DC Style: The Decisive Architect',
  ID: 'ID Style: The Persuasive Energizer',
  IS: 'IS Style: The Empathetic Connector',
  IC: 'IC Style: The Creative Communicator',
  SD: 'SD Style: The Reliable Anchor',
  SI: 'SI Style: The Collaborative Harmonizer',
  SC: 'SC Style: The Steady Craftsperson',
  CD: 'CD Style: The Analytical Strategist',
  CI: 'CI Style: The Insightful Advisor',
  CS: 'CS Style: The Methodical Specialist',
};

const TRAIT_META = {
  D: {
    name: 'Dominance',
    tendency: 'results-oriented decision-making, direct communication, and taking ownership under pressure',
    strengths: [
      'Drives projects forward with decisive action and clear accountability',
      'Thrives when solving high-stakes problems and removing bottlenecks',
    ],
    growthArea: 'Pause to gather input from quieter stakeholders before finalizing major decisions',
  },
  I: {
    name: 'Influence',
    tendency: 'energetic collaboration, relationship building, and rallying people around shared ideas',
    strengths: [
      'Builds rapport quickly and motivates teams through optimistic communication',
      'Translates complex ideas into compelling stories for diverse audiences',
    ],
    growthArea: 'Pair big-picture enthusiasm with structured follow-through and written milestones',
  },
  S: {
    name: 'Steadiness',
    tendency: 'calm consistency, dependable follow-through, and creating supportive team environments',
    strengths: [
      'Maintains composure during uncertainty and sustains reliable day-to-day execution',
      'Listens attentively and fosters long-term trust with colleagues and clients',
    ],
    growthArea: 'Voice priorities and boundaries early when competing requests pile up',
  },
  C: {
    name: 'Conscientiousness',
    tendency: 'analytical rigor, structured planning, and holding work to high quality standards',
    strengths: [
      'Spots subtle edge cases, patterns, and risks before they become costly mistakes',
      'Designs clean, repeatable processes backed by careful research and evidence',
    ],
    growthArea: 'Avoid over-polishing low-impact details when a timely first iteration is enough',
  },
};

const FAMILY_PROFILES = {
  'Management & Business': { D: 85, I: 72, S: 52, C: 70 },
  'Computer, Engineering & Science': { D: 62, I: 42, S: 58, C: 92 },
  'Community, Social Service & Legal': { D: 56, I: 74, S: 82, C: 74 },
  'Education, Arts & Media': { D: 50, I: 88, S: 72, C: 58 },
  Healthcare: { D: 54, I: 64, S: 88, C: 82 },
  'Sales & Office Support': { D: 72, I: 86, S: 62, C: 55 },
  'Personal & Protective Services': { D: 78, I: 60, S: 76, C: 64 },
  'Trades, Production & Transport': { D: 70, I: 40, S: 78, C: 76 },
};

// 20 diverse roles: 12 office roles + 8 non-office roles across all 8 career families
const FALLBACK_JOB_CATALOG = [
  // Office roles (12)
  {
    title: 'Product Operations Manager',
    family: 'Management & Business',
    isOfficeRole: true,
    description:
      'Coordinates cross-functional launches, metrics, and workflows so product and business teams ship smoothly. Balances executive prioritization with repeatable operational rigor.',
    keySkills: ['Cross-functional planning', 'Process optimization', 'Stakeholder alignment'],
    jobDiscProfile: { D: 84, I: 68, S: 56, C: 78 },
    firstStep:
      'Map one recurring team workflow this week and propose a concise checklist or dashboard to remove handoff friction.',
  },
  {
    title: 'Management Consultant',
    family: 'Management & Business',
    isOfficeRole: true,
    description:
      'Diagnoses organizational challenges and crafts actionable strategic roadmaps for leadership teams. Combines structured quantitative analysis with persuasive client presentation.',
    keySkills: ['Strategic analysis', 'Executive storytelling', 'Problem structuring'],
    jobDiscProfile: { D: 88, I: 74, S: 44, C: 82 },
    firstStep:
      'Practice breaking down one real business case study into a 1-page recommendation memo with clear trade-offs.',
  },
  {
    title: 'Systems & Data Analyst',
    family: 'Computer, Engineering & Science',
    isOfficeRole: true,
    description:
      'Transforms operational and product datasets into reliable dashboards, insights, and system specifications. Ideal for people who enjoy precision, logic, and evidence-backed decisions.',
    keySkills: ['SQL & data modeling', 'Root-cause analysis', 'Clear documentation'],
    jobDiscProfile: { D: 58, I: 42, S: 64, C: 94 },
    firstStep:
      'Download a public dataset and publish a short summary highlighting three concrete patterns and data quality caveats.',
  },
  {
    title: 'Full-Stack Software Engineer',
    family: 'Computer, Engineering & Science',
    isOfficeRole: true,
    description:
      'Designs, builds, and maintains end-to-end web applications from database schemas to user interfaces. Rewards systematic debugging, clean architecture, and collaborative code reviews.',
    keySkills: ['Application architecture', 'Automated testing', 'Iterative problem-solving'],
    jobDiscProfile: { D: 66, I: 48, S: 60, C: 90 },
    firstStep:
      'Build and deploy a small end-to-end CRUD project with clean documentation and a brief architecture note.',
  },
  {
    title: 'UX Researcher & Designer',
    family: 'Education, Arts & Media',
    isOfficeRole: true,
    description:
      'Conducts user interviews and synthesizes behavioral insights into intuitive digital interfaces. Blends empathetic listening with structured testing and visual communication.',
    keySkills: ['User interviewing', 'Wireframing & prototyping', 'Insight synthesis'],
    jobDiscProfile: { D: 52, I: 80, S: 74, C: 72 },
    firstStep:
      'Pick an everyday app flow, interview three users about friction points, and sketch an improved wireframe.',
  },
  {
    title: 'Instructional Designer',
    family: 'Education, Arts & Media',
    isOfficeRole: true,
    description:
      'Designs engaging training curricula, workshops, and e-learning experiences for organizations or schools. Combines clear structure with learner-centered empathy.',
    keySkills: ['Curriculum design', 'Clear technical writing', 'Learning assessment'],
    jobDiscProfile: { D: 48, I: 74, S: 80, C: 76 },
    firstStep:
      'Create a 15-minute mini-lesson outline on a skill you know well, complete with learning objectives and a practice exercise.',
  },
  {
    title: 'Compliance & Legal Operations Specialist',
    family: 'Community, Social Service & Legal',
    isOfficeRole: true,
    description:
      'Reviews policies, contracts, and regulatory workflows to keep organizations ethical and audit-ready. Suits methodical thinkers who value clarity, fairness, and accuracy.',
    keySkills: ['Policy interpretation', 'Risk documentation', 'Detail verification'],
    jobDiscProfile: { D: 56, I: 46, S: 70, C: 92 },
    firstStep:
      'Read an industry compliance framework overview and summarize its core controls in plain language.',
  },
  {
    title: 'Customer Success Manager',
    family: 'Sales & Office Support',
    isOfficeRole: true,
    description:
      'Guides clients from onboarding through long-term adoption, ensuring they achieve measurable outcomes. Pairs warm relationship building with proactive account planning.',
    keySkills: ['Consultative listening', 'Account planning', 'Conflict de-escalation'],
    jobDiscProfile: { D: 64, I: 88, S: 76, C: 58 },
    firstStep:
      'Draft a 30-60-90 day customer onboarding plan template tailored to a software or service product you admire.',
  },
  {
    title: 'B2B Account Executive',
    family: 'Sales & Office Support',
    isOfficeRole: true,
    description:
      'Identifies prospective business clients, leads discovery conversations, and negotiates tailored agreements. Energizing for goal-driven communicators who enjoy visible targets.',
    keySkills: ['Discovery questioning', 'Negotiation', 'Pipeline management'],
    jobDiscProfile: { D: 86, I: 90, S: 46, C: 52 },
    firstStep:
      'Practice a 5-minute discovery call script focused on uncovering a buyer’s root problem before pitching a solution.',
  },
  {
    title: 'Operations & Administrative Coordinator',
    family: 'Sales & Office Support',
    isOfficeRole: true,
    description:
      'Keeps schedules, vendor relationships, budgets, and internal communications running reliably behind the scenes. Ideal for organized, steady teammates who create calm order.',
    keySkills: ['Calendar & logistics coordination', 'Record keeping', 'Cross-team communication'],
    jobDiscProfile: { D: 48, I: 64, S: 88, C: 80 },
    firstStep:
      'Build a clean shared operations tracker in a spreadsheet tool to manage recurring tasks and deadlines.',
  },
  {
    title: 'Health Informatics Coordinator',
    family: 'Healthcare',
    isOfficeRole: true,
    description:
      'Improves clinical data systems and reporting workflows so healthcare teams deliver safer, more coordinated care. Connects structured analysis with mission-driven service.',
    keySkills: ['Clinical workflow mapping', 'Data stewardship', 'Cross-disciplinary training'],
    jobDiscProfile: { D: 54, I: 58, S: 78, C: 88 },
    firstStep:
      'Explore introductory resources on electronic health record workflows and data privacy fundamentals.',
  },
  {
    title: 'Content & Brand Strategist',
    family: 'Education, Arts & Media',
    isOfficeRole: true,
    description:
      'Shapes editorial calendars, messaging frameworks, and multi-channel campaigns that resonate with audiences. Suits expressive planners who blend creativity with audience feedback.',
    keySkills: ['Editorial strategy', 'Audience research', 'Persuasive copywriting'],
    jobDiscProfile: { D: 62, I: 90, S: 58, C: 62 },
    firstStep:
      'Audit three brands you respect and write a brief breakdown of their voice, audience, and recurring content themes.',
  },

  // Non-office roles (8)
  {
    title: 'Registered Nurse / Clinical Care Coordinator',
    family: 'Healthcare',
    isOfficeRole: false,
    description:
      'Delivers hands-on patient care while collaborating closely with physicians, families, and allied health staff. Combines steady compassion with crisp clinical accuracy.',
    keySkills: ['Patient advocacy', 'Clinical observation', 'Calm teamwork under pressure'],
    jobDiscProfile: { D: 60, I: 66, S: 90, C: 82 },
    firstStep:
      'Schedule an informational chat with a practicing nurse or volunteer at a local clinic to observe daily floor workflows.',
  },
  {
    title: 'Physical Therapy Assistant',
    family: 'Healthcare',
    isOfficeRole: false,
    description:
      'Works directly with patients on mobility exercises, recovery milestones, and encouraging daily progress. Great fit for supportive, energetic people who prefer active hands-on work.',
    keySkills: ['Hands-on coaching', 'Progress tracking', 'Empathetic motivation'],
    jobDiscProfile: { D: 50, I: 78, S: 90, C: 66 },
    firstStep:
      'Look up accredited physical therapy assistant programs in your area and arrange a clinic observation session.',
  },
  {
    title: 'Community Outreach & Case Specialist',
    family: 'Community, Social Service & Legal',
    isOfficeRole: false,
    description:
      'Connects residents and families in the field with housing, education, and local support programs. Rewards patient relationship-building and practical resource navigation.',
    keySkills: ['Active listening', 'Community resource navigation', 'Case documentation'],
    jobDiscProfile: { D: 54, I: 80, S: 88, C: 62 },
    firstStep:
      'Volunteer with a local community nonprofit for a weekend event to learn how outreach intake and follow-up work.',
  },
  {
    title: 'Emergency Management & Safety Officer',
    family: 'Personal & Protective Services',
    isOfficeRole: false,
    description:
      'Leads on-site safety inspections, incident readiness drills, and rapid field response coordination. Fits decisive, composed individuals who enforce clear safety protocols.',
    keySkills: ['Incident command', 'Risk inspection', 'Clear crisis communication'],
    jobDiscProfile: { D: 86, I: 58, S: 72, C: 78 },
    firstStep:
      'Complete a foundational first-aid or FEMA/community emergency preparedness course to build practical credentials.',
  },
  {
    title: 'Hospitality & Event Operations Supervisor',
    family: 'Personal & Protective Services',
    isOfficeRole: false,
    description:
      'Directs live guest experiences, venue logistics, and on-the-floor staff coordination during busy events. Ideal for upbeat problem-solvers who thrive in active, people-centered spaces.',
    keySkills: ['Live logistics troubleshooting', 'Team leadership', 'Guest service excellence'],
    jobDiscProfile: { D: 76, I: 88, S: 68, C: 54 },
    firstStep:
      'Shadow or assist a local venue or community festival coordinator to experience live run-of-show management.',
  },
  {
    title: 'Field Service & Automation Technician',
    family: 'Trades, Production & Transport',
    isOfficeRole: false,
    description:
      'Installs, calibrates, and troubleshoots mechanical or electrical equipment on-site at client facilities. Rewards methodical hands-on diagnostics and independent reliability.',
    keySkills: ['Electrical & mechanical diagnostics', 'Preventive maintenance', 'Client site communication'],
    jobDiscProfile: { D: 68, I: 46, S: 72, C: 88 },
    firstStep:
      'Explore local technical college certificates or manufacturer apprenticeships in industrial automation or HVAC diagnostics.',
  },
  {
    title: 'Construction Site Project Supervisor',
    family: 'Trades, Production & Transport',
    isOfficeRole: false,
    description:
      'Oversees crews, schedules, materials, and safety compliance across active job sites. Suits action-oriented leaders who enjoy tangible progress and direct coordination.',
    keySkills: ['Crew scheduling', 'Site safety enforcement', 'Blueprint interpretation'],
    jobDiscProfile: { D: 90, I: 60, S: 64, C: 72 },
    firstStep:
      'Speak with a general contractor or trade union training center about pathways from field trade work into site supervision.',
  },
  {
    title: 'Logistics & Fleet Operations Lead',
    family: 'Trades, Production & Transport',
    isOfficeRole: false,
    description:
      'Directs warehouse dispatch, route planning, and timely inventory movement across regional hubs. Combines steady operational discipline with real-time problem-solving.',
    keySkills: ['Dispatch & routing', 'Inventory accuracy', 'Team coordination'],
    jobDiscProfile: { D: 76, I: 54, S: 80, C: 76 },
    firstStep:
      'Tour a local distribution hub or review supply-chain dispatch fundamentals to understand daily fulfillment metrics.',
  },
];

const computeSimilarityScore = (userScores, targetScores) => {
  const distance = Math.sqrt(
    DISC_TRAITS.reduce((sum, trait) => {
      const diff = (userScores[trait] ?? 50) - (targetScores[trait] ?? 50);
      return sum + diff * diff;
    }, 0)
  );
  // Max theoretical distance across 4 dims (0..100) is 200; typical range is 10..110
  const normalized = Math.max(0, 1 - distance / 135);
  return Math.round(55 + normalized * 41); // 55..96
};

const normalizeProbabilitiesTo100 = (entries) => {
  const weights = entries.map((item) => Math.max(1, item.rawWeight));
  const total = weights.reduce((sum, w) => sum + w, 0);

  const exact = weights.map((w) => (w / total) * 100);
  const floors = exact.map((val) => Math.max(1, Math.floor(val)));
  let remainder = 100 - floors.reduce((sum, n) => sum + n, 0);

  const indicesByFraction = exact
    .map((val, idx) => ({ idx, frac: val - Math.floor(val) }))
    .sort((a, b) => b.frac - a.frac);

  let pointer = 0;
  while (remainder > 0) {
    floors[indicesByFraction[pointer % indicesByFraction.length].idx] += 1;
    remainder -= 1;
    pointer += 1;
  }

  while (remainder < 0) {
    const largestIdx = floors.indexOf(Math.max(...floors));
    floors[largestIdx] -= 1;
    remainder += 1;
  }

  return entries.map((entry, idx) => ({
    name: entry.name,
    matchProbability: floors[idx],
  }));
};

const getPrimarySecondary = (scores) => {
  const ranked = DISC_TRAITS.map((trait, order) => ({
    trait,
    score: scores?.[trait] ?? 50,
    order,
  })).sort((a, b) => b.score - a.score || a.order - b.order);

  return {
    primary: ranked[0].trait,
    secondary: ranked[1].trait,
  };
};

export const generateDemoCareerReport = (scores, blendLabel) => {
  const { primary, secondary } = getPrimarySecondary(scores);
  const blendKey = `${primary}${secondary}`;
  const primaryMeta = TRAIT_META[primary];
  const secondaryMeta = TRAIT_META[secondary];

  const styleTitle =
    BLEND_TITLES[blendKey] || `${blendKey} Style: Balanced ${primaryMeta.name} Contributor`;

  const summary =
    `Your ${blendLabel} highlights a preference for ${primaryMeta.tendency}, supported by ${secondaryMeta.tendency}. ` +
    `You likely feel most energized in environments that let you apply your ${primaryMeta.name.toLowerCase()} strengths while collaborating clearly with complementary teammates. ` +
    `Please note that DISC is intended for personal self-reflection and career exploration only—not as a scientific diagnostic or a hiring/selection tool.`;

  const strengths = [
    primaryMeta.strengths[0],
    secondaryMeta.strengths[0],
    primaryMeta.strengths[1],
  ];

  const growthAreas = [
    primaryMeta.growthArea,
    secondaryMeta.growthArea,
    'Adapt your communication pace when partnering with colleagues whose primary DISC tendencies differ from yours',
  ];

  const rawFamilyScores = CAREER_FAMILIES.map((name) => {
    const sim = computeSimilarityScore(scores, FAMILY_PROFILES[name]);
    // Amplify differentiation slightly while keeping all 8 families represented
    const rawWeight = Math.pow(Math.max(1, sim - 45), 1.6);
    return { name, rawWeight };
  });

  const careerFamilies = normalizeProbabilitiesTo100(rawFamilyScores).sort(
    (a, b) => b.matchProbability - a.matchProbability
  );

  const recommendedJobs = FALLBACK_JOB_CATALOG.map((job) => ({
    ...job,
    matchPercentage: Math.min(98, Math.max(55, computeSimilarityScore(scores, job.jobDiscProfile))),
  })).sort((a, b) => b.matchPercentage - a.matchPercentage || a.title.localeCompare(b.title));

  return {
    styleTitle,
    summary,
    strengths,
    growthAreas,
    careerFamilies,
    recommendedJobs,
  };
};

export const generateDemoChatReply = (_history, scores, userMessage) => {
  const { primary, secondary } = getPrimarySecondary(scores);
  const primaryMeta = TRAIT_META[primary];
  const secondaryMeta = TRAIT_META[secondary];
  const lower = String(userMessage || '').toLowerCase();

  if (/\b(hire|hiring|screen candidates|fire|firing|diagnos|clinical|medical advice)\b/.test(lower)) {
    return (
      `Just a quick boundary: DISC is designed strictly for personal self-reflection and career exploration, never for hiring decisions, candidate screening, or clinical assessment. ` +
      `If you'd like, we can explore how your own ${primary}/${secondary} work-style tendencies (D:${scores.D}, I:${scores.I}, S:${scores.S}, C:${scores.C}) translate into day-to-day strengths or communication habits.`
    );
  }

  if (/\b(salary|pay|wage|compensation|how much|statistic|percent of jobs|market rate)\b/.test(lower)) {
    return (
      `I don't invent salary figures or labor statistics, so for reliable pay benchmarks check official sources like the U.S. Bureau of Labor Statistics (BLS) or local industry surveys. ` +
      `What we can do right here is focus on roles that match your ${primary}/${secondary} blend (D:${scores.D}, I:${scores.I}, S:${scores.S}, C:${scores.C}) and identify high-leverage skills to build next.`
    );
  }

  if (/\b(interview|resume|cv|portfolio|cover letter)\b/.test(lower)) {
    return (
      `With your ${primary}/${secondary} blend (D:${scores.D}, I:${scores.I}, S:${scores.S}, C:${scores.C}), highlight concrete examples where ${primaryMeta.tendency} produced a measurable team result. ` +
      `Prepare two STAR stories showing your core strength (${primaryMeta.strengths[0].toLowerCase()}) and one story demonstrating growth (${primaryMeta.growthArea.toLowerCase()}). ` +
      `Which specific role are you tailoring your application for?`
    );
  }

  if (/\b(communicat|conflict|manager|boss|team|coworker|colleague)\b/.test(lower)) {
    return (
      `In workplace communication, your ${primary}/${secondary} tendencies naturally lean toward ${primaryMeta.tendency}. ` +
      `When collaborating with teammates who have different styles, try matching their preferred level of detail and pacing—and keep in mind this growth tip: ${primaryMeta.growthArea}. ` +
      `What workplace interaction are you navigating right now?`
    );
  }

  if (/\b(skill|learn|course|certif|switch|transition|start|first step)\b/.test(lower)) {
    return (
      `A practical way to build momentum with your ${primary}/${secondary} profile (D:${scores.D}, I:${scores.I}, S:${scores.S}, C:${scores.C}) is to pick two roles from your top matches—one office and one hands-on if you're still exploring—and complete one small portfolio or shadowing step over the next 2 weeks. ` +
      `Focus on pairing ${primaryMeta.name.toLowerCase()} strengths with ${secondaryMeta.name.toLowerCase()} habits. Which career family interests you most?`
    );
  }

  return (
    `Based on your ${primary}/${secondary} self-reflection profile (D:${scores.D}, I:${scores.I}, S:${scores.S}, C:${scores.C}), you tend to bring ${primaryMeta.tendency} paired with ${secondaryMeta.tendency}. ` +
    `A great next step is narrowing down 2–3 occupations from your report and testing your interest through an informational chat or a small hands-on project. ` +
    `Would you like help comparing specific roles, planning skills to build, or preparing workplace communication strategies?`
  );
};
