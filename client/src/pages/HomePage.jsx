import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { DISC_META } from '../data/discQuestions.js';

const QUADRANT_ORDER = ['D', 'I', 'S', 'C'];

const HOW_IT_WORKS_CARDS = [
  {
    step: '01',
    title: '12-Statement Reflection',
    description:
      'Answer 12 concise workplace scenarios (3 per DISC dimension) with full keyboard shortcuts in under 2 minutes.',
    icon: ClipboardList,
    accent: '#F43F5E',
    accentBg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    span: 'md:col-span-2',
  },
  {
    step: '02',
    title: 'Deterministic DISC Scoring',
    description:
      'Transparent 0–100 scoring across Dominance, Influence, Steadiness, and Conscientiousness reveals your primary & secondary blend.',
    icon: SlidersHorizontal,
    accent: '#F59E0B',
    accentBg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    span: 'md:col-span-2',
  },
  {
    step: '03',
    title: '8 Career Families & 20 Roles',
    description:
      'Gemini Structured Outputs match your blend across all 8 career families and 20 diverse office & hands-on occupations with actionable first steps.',
    icon: Briefcase,
    accent: '#10B981',
    accentBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    span: 'md:col-span-2',
  },
  {
    step: '04',
    title: 'Guardrailed AI Career Coach',
    description:
      'Chat with a personalized career reflection coach grounded in your DISC scores for interview stories, skill roadmaps, and team communication.',
    icon: Bot,
    accent: '#6366F1',
    accentBg: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    span: 'md:col-span-2',
  },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [activeTrait, setActiveTrait] = useState('C');
  const activeMeta = DISC_META[activeTrait];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14 lg:px-8">
      {/* Asymmetric Hero Section */}
      <section className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Left Copy Column (7 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-7"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3.5 py-1.5 text-xs font-medium text-indigo-300">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>AI-Powered DISC Self-Reflection & Career Mapping</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
            Decode your work style.{' '}
            <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-indigo-400 bg-clip-text text-transparent">
              Map your next career.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Discover your unique Dominance, Influence, Steadiness, and Conscientiousness blend in
            two minutes. Get structured insights across 8 career families, 20 office and hands-on
            occupations, and a guardrailed Gemini career coach.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link to="/test" className="btn-primary px-6 py-3.5 text-base">
              <span>Start Assessment</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            {isAuthenticated ? (
              <Link to="/history" className="btn-ghost px-5 py-3.5 text-sm">
                View My History
              </Link>
            ) : (
              <Link to="/login" className="btn-ghost px-5 py-3.5 text-sm">
                Log In to Saved Reports
              </Link>
            )}
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
            {[
              { value: '12', label: 'Workplace Prompts' },
              { value: '8', label: 'Career Families' },
              { value: '20', label: 'Matched Roles' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-slate-900/50 px-3.5 py-3 backdrop-blur-md"
              >
                <div className="text-2xl font-bold text-white tabular-nums">{stat.value}</div>
                <div className="mt-0.5 text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Interactive 2x2 Glowing DISC Quadrant Preview (5 cols) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-5"
        >
          <div className="glass-card relative overflow-hidden p-5 sm:p-6">
            {/* Ambient radial glow matching active quadrant */}
            <div
              className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full opacity-25 blur-3xl transition-colors duration-500"
              style={{ backgroundColor: activeMeta.hex }}
            />

            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Interactive Preview
                </p>
                <h2 className="text-sm font-semibold text-white">Hover a DISC Quadrant</h2>
              </div>
              <span
                className={`rounded-full border px-2.5 py-1 text-xs font-semibold tabular-nums ${activeMeta.bgClass} ${activeMeta.borderClass} ${activeMeta.textClass}`}
              >
                {activeMeta.key} · {activeMeta.sampleScore}%
              </span>
            </div>

            {/* 2x2 Glowing Quadrant Grid */}
            <div className="grid grid-cols-2 gap-3">
              {QUADRANT_ORDER.map((key) => {
                const trait = DISC_META[key];
                const isActive = activeTrait === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onMouseEnter={() => setActiveTrait(key)}
                    onFocus={() => setActiveTrait(key)}
                    onClick={() => setActiveTrait(key)}
                    style={{
                      boxShadow: isActive ? trait.glowShadow : undefined,
                      borderColor: isActive ? `${trait.hex}88` : undefined,
                    }}
                    className={`group relative flex flex-col items-start rounded-xl border p-4 text-left transition-all duration-300 focus:outline-none ${
                      isActive
                        ? 'scale-[1.02] bg-slate-900/95'
                        : 'border-white/10 bg-slate-950/60 hover:border-white/20 hover:bg-slate-900/80'
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-base font-extrabold text-white shadow-inner"
                        style={{
                          backgroundColor: `${trait.hex}26`,
                          border: `1px solid ${trait.hex}66`,
                          color: trait.hex,
                        }}
                      >
                        {trait.key}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 tabular-nums">
                        {trait.sampleScore}
                      </span>
                    </div>

                    <h3 className="mt-3 text-sm font-bold text-white">{trait.name}</h3>
                    <p className="mt-0.5 text-xs text-slate-400">{trait.shortLabel}</p>

                    {/* Mini animated bar */}
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${trait.sampleScore}%`,
                          backgroundColor: trait.hex,
                          opacity: isActive ? 1 : 0.45,
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Quadrant Detail Strip */}
            <motion.div
              key={activeTrait}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-4 rounded-xl border border-white/10 bg-slate-950/70 p-4"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: activeMeta.hex }}
                />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  {activeMeta.name} Tendencies
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{activeMeta.summary}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {activeMeta.traits.map((pill) => (
                  <span
                    key={pill}
                    className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-slate-300"
                  >
                    <CheckCircle2 className="h-3 w-3" style={{ color: activeMeta.hex }} />
                    {pill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 4-Card Bento "How It Works" Section */}
      <section className="mt-20 sm:mt-24">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
              How It Works
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              From 12 reflections to an actionable career map
            </h2>
          </div>
          <Link
            to="/test"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-300 transition-colors hover:text-indigo-200"
          >
            <span>Take the 2-minute quiz</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {HOW_IT_WORKS_CARDS.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.35, delay: index * 0.06 }}
                className={`glass-card group relative overflow-hidden p-6 transition-all duration-300 hover:border-white/20 ${card.span}`}
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-10 blur-2xl transition-opacity duration-300 group-hover:opacity-25"
                  style={{ backgroundColor: card.accent }}
                />

                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${card.accentBg}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold tracking-widest text-slate-500 tabular-nums">
                    STEP {card.step}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-white">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{card.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
