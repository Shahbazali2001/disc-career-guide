import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { useTheme } from '../../context/ThemeContext.jsx';
import { DISC_META } from '../../data/discQuestions.js';

function CustomRadarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  const meta = DISC_META[item.trait];

  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 px-3.5 py-2.5 text-xs shadow-xl backdrop-blur-xl dark:border-white/15 dark:bg-slate-950/95 dark:shadow-2xl">
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: meta.hex }} />
        <span className="font-semibold text-slate-900 dark:text-white">
          {meta.key} — {meta.name}
        </span>
      </div>
      <p className="mt-1 font-bold text-slate-700 tabular-nums dark:text-slate-200">Score: {item.score} / 100</p>
      <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{meta.shortLabel}</p>
    </div>
  );
}

export default function DiscRadarChart({ scores, primaryTrait }) {
  const { isDark } = useTheme();
  const accentHex = DISC_META[primaryTrait]?.hex || '#6366F1';

  const chartData = [
    { trait: 'D', label: 'D · Dominance', score: scores?.D ?? 0 },
    { trait: 'I', label: 'I · Influence', score: scores?.I ?? 0 },
    { trait: 'S', label: 'S · Steadiness', score: scores?.S ?? 0 },
    { trait: 'C', label: 'C · Conscientious', score: scores?.C ?? 0 },
  ];

  const gridStroke = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.14)';
  const angleTickFill = isDark ? '#CBD5E1' : '#334155';
  const radiusTickFill = isDark ? '#64748B' : '#94A3B8';
  const dotStroke = isDark ? '#090D16' : '#FFFFFF';
  const activeDotFill = isDark ? '#FFFFFF' : '#0F172A';

  return (
    <div className="glass-card flex h-full flex-col p-6">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Visual Balance
          </p>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">DISC Radar Profile</h2>
        </div>
        <span className="rounded-lg border border-slate-200 bg-slate-100/80 px-2.5 py-1 text-[11px] font-medium text-slate-600 tabular-nums dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
          0–100 Scale
        </span>
      </div>

      <div className="mt-2 h-[290px] w-full flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={chartData}>
            <PolarGrid stroke={gridStroke} strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="label"
              tick={{ fill: angleTickFill, fontSize: 12, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={45}
              domain={[0, 100]}
              tickCount={5}
              tick={{ fill: radiusTickFill, fontSize: 10 }}
              axisLine={false}
            />
            <Tooltip content={<CustomRadarTooltip />} />
            <Radar
              name="DISC Score"
              dataKey="score"
              stroke={accentHex}
              strokeWidth={2.5}
              fill={accentHex}
              fillOpacity={isDark ? 0.28 : 0.22}
              dot={{ r: 4.5, fill: accentHex, stroke: dotStroke, strokeWidth: 2 }}
              activeDot={{ r: 6.5, fill: activeDotFill, stroke: accentHex, strokeWidth: 2.5 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Color Legend */}
      <div className="mt-2 grid grid-cols-4 gap-2 border-t border-slate-200 pt-3 dark:border-white/10">
        {['D', 'I', 'S', 'C'].map((k) => (
          <div key={k} className="flex items-center justify-center gap-1.5 text-xs">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: DISC_META[k].hex }}
            />
            <span className="font-semibold text-slate-700 dark:text-slate-300">{k}</span>
            <span className="text-slate-500 tabular-nums dark:text-slate-400">{scores?.[k] ?? 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
