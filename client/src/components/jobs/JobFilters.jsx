import { RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';

export const CAREER_FAMILY_OPTIONS = [
  'Management & Business',
  'Computer, Engineering & Science',
  'Community, Social Service & Legal',
  'Education, Arts & Media',
  'Healthcare',
  'Sales & Office Support',
  'Personal & Protective Services',
  'Trades, Production & Transport',
];

export default function JobFilters({
  searchQuery,
  onSearchChange,
  officeOnly,
  onOfficeOnlyChange,
  selectedFamily,
  onFamilyChange,
  minMatch,
  onMinMatchChange,
  onReset,
  hasActiveFilters,
  resultCount,
  totalCount,
}) {
  return (
    <div className="glass-card p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <SlidersHorizontal className="h-3.5 w-3.5 text-indigo-400" />
          <span>Filter Matched Occupations</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 tabular-nums">
            Showing <strong className="text-white">{resultCount}</strong> of {totalCount} roles
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:border-white/20 hover:text-white"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-12 md:items-end">
        {/* Search Input */}
        <div className="md:col-span-4">
          <label htmlFor="job-search" className="mb-1.5 block text-xs font-medium text-slate-400">
            Search Title, Description, or Skill
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              id="job-search"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="e.g. Analyst, Nurse, SQL, Leadership..."
              className="glass-input py-2.5 pl-10 pr-9"
            />
            {searchQuery && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Career Family Dropdown */}
        <div className="md:col-span-3">
          <label htmlFor="family-select" className="mb-1.5 block text-xs font-medium text-slate-400">
            Career Family
          </label>
          <select
            id="family-select"
            value={selectedFamily}
            onChange={(e) => onFamilyChange(e.target.value)}
            className="glass-input cursor-pointer py-2.5"
          >
            <option value="ALL" className="bg-slate-900 text-slate-100">
              All Families (8)
            </option>
            {CAREER_FAMILY_OPTIONS.map((family) => (
              <option key={family} value={family} className="bg-slate-900 text-slate-100">
                {family}
              </option>
            ))}
          </select>
        </div>

        {/* Minimum Match Slider */}
        <div className="md:col-span-3">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <label htmlFor="min-match-slider" className="font-medium text-slate-400">
              Minimum Match
            </label>
            <span className="font-bold text-indigo-300 tabular-nums">{minMatch}%+</span>
          </div>
          <div className="flex h-[42px] items-center rounded-xl border border-white/10 bg-slate-950/70 px-3.5">
            <input
              id="min-match-slider"
              type="range"
              min={50}
              max={95}
              step={1}
              value={minMatch}
              onChange={(e) => onMinMatchChange(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/15 accent-indigo-500"
            />
          </div>
        </div>

        {/* Office-Type Only Toggle */}
        <div className="md:col-span-2">
          <span className="mb-1.5 block text-xs font-medium text-slate-400">Work Setting</span>
          <button
            type="button"
            role="switch"
            aria-checked={officeOnly}
            onClick={() => onOfficeOnlyChange(!officeOnly)}
            className={`flex h-[42px] w-full items-center justify-between gap-2 rounded-xl border px-3 text-xs font-medium transition-all ${
              officeOnly
                ? 'border-indigo-400/50 bg-indigo-500/15 text-indigo-200'
                : 'border-white/10 bg-slate-950/70 text-slate-300 hover:border-white/20'
            }`}
          >
            <span className="truncate">Office-type only</span>
            <span
              className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                officeOnly ? 'bg-indigo-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  officeOnly ? 'translate-x-4' : 'translate-x-1'
                }`}
              />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
