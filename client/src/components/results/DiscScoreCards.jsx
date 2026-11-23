import { motion } from 'framer-motion';
import { DISC_META } from '../../data/discQuestions.js';

const TRAIT_KEYS = ['D', 'I', 'S', 'C'];
const RING_RADIUS = 38;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export default function DiscScoreCards({ scores, primaryTrait, secondaryTrait }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {TRAIT_KEYS.map((key, idx) => {
        const meta = DISC_META[key];
        const score = Math.min(100, Math.max(0, Number(scores?.[key] ?? 0)));
        const strokeOffset = RING_CIRCUMFERENCE * (1 - score / 100);
        const isPrimary = primaryTrait === key;
        const isSecondary = secondaryTrait === key;

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.06 }}
            style={{
              borderColor: isPrimary ? `${meta.hex}66` : undefined,
              boxShadow: isPrimary ? meta.glowShadow : undefined,
            }}
            className="glass-card relative overflow-hidden p-5 transition-all duration-300 hover:border-white/20"
          >
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl"
              style={{ backgroundColor: meta.hex }}
            />

            <div className="flex items-start justify-between gap-2">
              <div>
                <span
                  className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-extrabold"
                  style={{
                    backgroundColor: `${meta.hex}22`,
                    border: `1px solid ${meta.hex}55`,
                    color: meta.hex,
                  }}
                >
                  {meta.key}
                </span>
                <h3 className="mt-2.5 text-sm font-bold text-white">{meta.name}</h3>
                <p className="text-[11px] text-slate-400">{meta.shortLabel}</p>
              </div>

              {(isPrimary || isSecondary) && (
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${meta.bgClass} ${meta.borderClass} ${meta.textClass}`}
                >
                  {isPrimary ? 'Primary' : 'Secondary'}
                </span>
              )}
            </div>

            {/* Animated Circular SVG Progress Ring */}
            <div className="mt-4 flex items-center justify-center">
              <div className="relative flex h-24 w-24 items-center justify-center">
                <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96" aria-hidden="true">
                  <circle
                    cx="48"
                    cy="48"
                    r={RING_RADIUS}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="7"
                  />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r={RING_RADIUS}
                    fill="none"
                    stroke={meta.hex}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={RING_CIRCUMFERENCE}
                    initial={{ strokeDashoffset: RING_CIRCUMFERENCE }}
                    animate={{ strokeDashoffset: strokeOffset }}
                    transition={{ duration: 0.9, delay: 0.12 + idx * 0.08, ease: 'easeOut' }}
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-white tabular-nums">{score}</span>
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                    / 100
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
