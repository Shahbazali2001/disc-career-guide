import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function ThemeToggle({ className = '', showLabel = false }) {
  const { isDark, toggleTheme } = useTheme();
  const nextLabel = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={nextLabel}
      aria-pressed={!isDark}
      title={nextLabel}
      className={`group relative inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200/90 bg-white/80 text-slate-700 shadow-sm transition-all duration-200 hover:border-indigo-300 hover:bg-indigo-50/70 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 active:scale-95 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:shadow-none dark:hover:border-white/20 dark:hover:bg-white/[0.09] dark:hover:text-white ${
        showLabel ? 'px-3 py-2 text-xs font-medium' : 'h-9 w-9'
      } ${className}`}
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="sun"
              initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex items-center justify-center text-amber-400"
            >
              <Sun className="h-4 w-4" />
            </motion.span>
          ) : (
            <motion.span
              key="moon"
              initial={{ opacity: 0, rotate: 60, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: -60, scale: 0.6 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex items-center justify-center text-indigo-600"
            >
              <Moon className="h-4 w-4" />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      {showLabel && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
    </button>
  );
}
