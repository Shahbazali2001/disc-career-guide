import { motion } from 'framer-motion';

const BAR_COLORS = [
  '#6366F1',
  '#F43F5E',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#06B6D4',
  '#EC4899',
  '#64748B',
];

export default function CareerFamilyChart({ careerFamilies = [] }) {
  const sorted = [...careerFamilies].sort(
    (a, b) => (b.matchProbability ?? 0) - (a.matchProbability ?? 0)
  );
  const topProbability = Math.max(1, sorted[0]?.matchProbability ?? 1);

  return (
    <div className="glass-card flex h-full flex-col p-6">
      <div className="mb-5 flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            8-Family Distribution
          </p>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Career Family Fit</h2>
        </div>
        <span className="rounded-lg border border-slate-200 bg-slate-100/80 px-2.5 py-1 text-[11px] font-medium text-slate-600 tabular-nums dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
          Total: 100%
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between space-y-3.5">
        {sorted.map((family, idx) => {
          const pct = Math.max(0, Number(family.matchProbability ?? 0));
          const visualWidth = Math.max(6, Math.round((pct / topProbability) * 100));
          const barHex = BAR_COLORS[idx % BAR_COLORS.length];

          return (
            <div key={family.name || idx}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                <span className="truncate font-medium text-slate-700 dark:text-slate-200">{family.name}</span>
                <span className="shrink-0 font-bold text-slate-900 tabular-nums dark:text-white">{pct}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/85 dark:bg-white/[0.07]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${visualWidth}%` }}
                  transition={{ duration: 0.7, delay: idx * 0.05, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${barHex}AA 0%, ${barHex} 100%)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
