import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  RotateCcw,
  Sparkles,
  Target,
  Wrench,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { extractApiError } from '../api/axiosClient.js';
import { getAssessment } from '../api/careerApi.js';
import CareerFamilyChart from '../components/results/CareerFamilyChart.jsx';
import DiscRadarChart from '../components/results/DiscRadarChart.jsx';
import DiscScoreCards from '../components/results/DiscScoreCards.jsx';
import { DISC_META } from '../data/discQuestions.js';

function ResultsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-36 rounded bg-white/10" />
          <div className="h-8 w-72 rounded bg-white/10" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-36 rounded-xl bg-white/10" />
          <div className="h-10 w-28 rounded-xl bg-white/10" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="glass-card h-48 p-5" />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="glass-card h-96 lg:col-span-5" />
        <div className="glass-card h-96 lg:col-span-7" />
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="glass-card h-96 lg:col-span-5" />
        <div className="glass-card h-96 lg:col-span-7" />
      </div>
    </div>
  );
}

const formatPlainTextReport = (assessment) => {
  const { scores, blendLabel, aiReport = {}, createdAt } = assessment;
  const topJobs = (aiReport.recommendedJobs || []).slice(0, 5);
  const dateStr = createdAt ? new Date(createdAt).toLocaleString() : '';

  const lines = [
    '====================================================',
    'DISC CAREERGUIDE — PERSONALIZED CAREER REPORT',
    '====================================================',
    dateStr ? `Generated: ${dateStr}` : null,
    `Blend: ${blendLabel}`,
    `Style Profile: ${aiReport.styleTitle || 'DISC Career Blend'}`,
    '',
    'DISC SCORES (0–100)',
    `  D (Dominance):         ${scores?.D ?? 0}`,
    `  I (Influence):         ${scores?.I ?? 0}`,
    `  S (Steadiness):        ${scores?.S ?? 0}`,
    `  C (Conscientiousness): ${scores?.C ?? 0}`,
    '',
    'SUMMARY',
    aiReport.summary || '',
    '',
    'KEY STRENGTHS',
    ...(aiReport.strengths || []).map((s, idx) => `  ${idx + 1}. ${s}`),
    '',
    'WORTH PRACTISING (GROWTH AREAS)',
    ...(aiReport.growthAreas || []).map((g, idx) => `  ${idx + 1}. ${g}`),
    '',
    'TOP 5 RECOMMENDED OCCUPATIONS',
    ...topJobs.map(
      (job, idx) =>
        `  ${idx + 1}. ${job.title} (${job.matchPercentage}% match — ${job.family}, ${
          job.isOfficeRole ? 'Office' : 'Field / Hands-On'
        })\n     First step: ${job.firstStep}`
    ),
    '',
    'Note: DISC CareerGuide is for personal self-reflection and career exploration only—not a scientific diagnostic or hiring tool.',
  ].filter((line) => line !== null);

  return lines.join('\n');
};

export default function ResultsDashboardPage() {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['assessment', id],
    queryFn: () => getAssessment(id),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return <ResultsSkeleton />;
  }

  if (isError || !data?.assessment) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="glass-card p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl font-bold text-white">Unable to load assessment</h1>
          <p className="mt-2 text-sm text-slate-400">
            {extractApiError(error, 'This report could not be found or you do not have access.')}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/history" className="btn-ghost">
              Back to My History
            </Link>
            <Link to="/test" className="btn-primary">
              Take New Test
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const assessment = data.assessment;
  const { scores, primaryTrait, secondaryTrait, blendLabel, aiReport = {}, isDemoFallback } =
    assessment;
  const primaryMeta = DISC_META[primaryTrait] || DISC_META.C;
  const top4Jobs = (aiReport.recommendedJobs || []).slice(0, 4);

  const handleCopyReport = async () => {
    const text = formatPlainTextReport(assessment);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Full report copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback copy via textarea
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      toast.success('Full report copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      {/* Top Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 text-xs font-semibold ${primaryMeta.bgClass} ${primaryMeta.borderClass} ${primaryMeta.textClass}`}
            >
              <Sparkles className="h-3 w-3" />
              {blendLabel}
            </span>
            {isDemoFallback && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/35 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-300">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Demo Mode
              </span>
            )}
            {assessment.createdAt && (
              <span className="text-xs text-slate-500 tabular-nums">
                {new Date(assessment.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Your DISC Career Blueprint
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button type="button" onClick={handleCopyReport} className="btn-ghost">
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Full Report</span>
              </>
            )}
          </button>

          <Link to={`/chat/${id}`} className="btn-ghost border-indigo-400/30 bg-indigo-500/10 text-indigo-200 hover:bg-indigo-500/20">
            <Bot className="h-4 w-4 text-indigo-400" />
            <span>Ask AI Coach</span>
          </Link>

          <Link to="/test" className="btn-primary">
            <RotateCcw className="h-4 w-4" />
            <span>Retake Test</span>
          </Link>
        </div>
      </motion.div>

      {/* Row 1: 4 Animated Circular SVG Progress Ring Cards */}
      <DiscScoreCards
        scores={scores}
        primaryTrait={primaryTrait}
        secondaryTrait={secondaryTrait}
      />

      {/* Row 2 (5/7 split): RadarChart + AI Style Profile Card */}
      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <DiscRadarChart scores={scores} primaryTrait={primaryTrait} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card relative flex flex-col justify-between overflow-hidden p-6 sm:p-7 lg:col-span-7"
        >
          <div
            className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full opacity-15 blur-3xl"
            style={{ backgroundColor: primaryMeta.hex }}
          />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${primaryMeta.bgClass} ${primaryMeta.borderClass} ${primaryMeta.textClass}`}
              >
                {blendLabel}
              </span>
              <span className="text-xs font-medium text-slate-400">AI Style Profile</span>
            </div>

            <h2 className="mt-3 text-xl font-extrabold text-white sm:text-2xl">
              {aiReport.styleTitle || `${blendLabel} Profile`}
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-slate-300">{aiReport.summary}</p>
          </div>

          <div className="mt-6 grid gap-5 border-t border-white/10 pt-5 sm:grid-cols-2">
            {/* Strengths */}
            <div>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Core Strengths</span>
              </h3>
              <ul className="mt-3 space-y-2.5">
                {(aiReport.strengths || []).map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400/90" />
                    <span className="leading-snug">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Worth Practising */}
            <div>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                <Target className="h-4 w-4" />
                <span>Worth Practising</span>
              </h3>
              <ul className="mt-3 space-y-2.5">
                {(aiReport.growthAreas || []).map((area, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
                    <Target className="mt-0.5 h-4 w-4 shrink-0 text-amber-400/90" />
                    <span className="leading-snug">{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Row 3 (5/7 split): Career Family Chart + Top 4 Career Matches */}
      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <CareerFamilyChart careerFamilies={aiReport.careerFamilies} />
        </div>

        <div className="glass-card flex flex-col justify-between p-6 lg:col-span-7">
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Highest Alignment
                </p>
                <h2 className="text-lg font-bold text-white">Top 4 Career Matches</h2>
              </div>
              <span className="text-xs text-slate-400 tabular-nums">
                Showing top 4 of {(aiReport.recommendedJobs || []).length} matched roles
              </span>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2">
              {top4Jobs.map((job, idx) => (
                <Link
                  key={`${job.title}-${idx}`}
                  to={`/jobs/${id}`}
                  className="group flex flex-col justify-between rounded-xl border border-white/10 bg-slate-950/60 p-4 transition-all duration-200 hover:border-indigo-400/40 hover:bg-slate-900/90"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-slate-300">
                        {job.isOfficeRole ? (
                          <Building2 className="h-3 w-3 text-indigo-400" />
                        ) : (
                          <Wrench className="h-3 w-3 text-emerald-400" />
                        )}
                        {job.isOfficeRole ? 'Office' : 'Field'}
                      </span>
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-300 tabular-nums">
                        {job.matchPercentage}% Match
                      </span>
                    </div>

                    <h3 className="mt-2.5 text-sm font-bold text-white transition-colors group-hover:text-indigo-300">
                      {job.title}
                    </h3>
                    <p className="mt-0.5 text-[11px] font-medium text-slate-400">{job.family}</p>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-300">
                      {job.description}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {(job.keySkills || []).slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[10px] font-medium text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
            <p className="text-xs text-slate-400">
              Filter by office vs. hands-on roles, career family, and minimum match score.
            </p>
            <Link to={`/jobs/${id}`} className="btn-primary">
              <span>Explore All 20 Matched Jobs</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
