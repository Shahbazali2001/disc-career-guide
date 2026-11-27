import { motion } from 'framer-motion';
import { ArrowUpRight, Building2, Wrench } from 'lucide-react';
import { DISC_META } from '../../data/discQuestions.js';

const TRAITS = ['D', 'I', 'S', 'C'];

export default function JobCard({ job, index = 0, onSelect }) {
  const match = Number(job.matchPercentage ?? 0);
  const badgeStyle =
    match >= 85
      ? 'border-emerald-500/35 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
      : match >= 70
        ? 'border-indigo-500/35 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300'
        : 'border-amber-500/35 bg-amber-500/15 text-amber-700 dark:text-amber-300';

  const profile = job.jobDiscProfile || { D: 50, I: 50, S: 50, C: 50 };
  const totalDisc = Math.max(
    1,
    TRAITS.reduce((sum, t) => sum + Number(profile[t] ?? 0), 0)
  );

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.35) }}
      onClick={() => onSelect(job)}
      className="glass-card group flex h-full flex-col justify-between p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-400/60 hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:hover:border-indigo-400/40 dark:hover:bg-slate-900/90"
    >
      <div>
        {/* Top Row: Role Type + Match Badge */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-0.5 text-[11px] font-medium ${
              job.isOfficeRole
                ? 'border-indigo-500/25 bg-indigo-500/10 text-indigo-700 dark:border-indigo-400/25 dark:text-indigo-300'
                : 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/25 dark:text-emerald-300'
            }`}
          >
            {job.isOfficeRole ? (
              <Building2 className="h-3 w-3" />
            ) : (
              <Wrench className="h-3 w-3" />
            )}
            <span>{job.isOfficeRole ? 'Office Role' : 'Field / Hands-On'}</span>
          </span>

          <span
            className={`rounded-full border px-2.5 py-0.5 text-xs font-bold tabular-nums ${badgeStyle}`}
          >
            {match}% Match
          </span>
        </div>

        {/* Title & Family Pill */}
        <div className="mt-3 flex items-start justify-between gap-2">
          <h3 className="text-base font-bold leading-snug text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
            {job.title}
          </h3>
          <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-indigo-600 dark:text-slate-500 dark:group-hover:text-indigo-300" />
        </div>

        <span className="mt-1.5 inline-block rounded-md border border-slate-200 bg-slate-100/80 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
          {job.family}
        </span>

        {/* Short Description */}
        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
          {job.description}
        </p>

        {/* 3 Key Skill Chips */}
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {(job.keySkills || []).slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-md border border-slate-200/80 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:border-white/5 dark:bg-slate-950/70 dark:text-slate-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Compact 4-Color Mini DISC Bar */}
      <div className="mt-5 border-t border-slate-200 pt-3.5 dark:border-white/10">
        <div className="mb-1.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <span>Role DISC Profile</span>
          <div className="flex items-center gap-2 tabular-nums">
            {TRAITS.map((t) => (
              <span key={t} style={{ color: DISC_META[t].hex }}>
                {t}:{profile[t] ?? 0}
              </span>
            ))}
          </div>
        </div>
        <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          {TRAITS.map((t) => {
            const pct = (Number(profile[t] ?? 0) / totalDisc) * 100;
            return (
              <div
                key={t}
                style={{ width: `${pct}%`, backgroundColor: DISC_META[t].hex }}
                title={`${DISC_META[t].name}: ${profile[t] ?? 0}`}
                className="h-full first:rounded-l-full last:rounded-r-full"
              />
            );
          })}
        </div>
      </div>
    </motion.button>
  );
}
