import { ShieldAlert } from 'lucide-react';

export default function DisclaimerFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/80 backdrop-blur-xl transition-colors duration-200 dark:border-white/10 dark:bg-[#090D16]/85">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-6 text-xs text-slate-600 dark:text-slate-400 sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <div className="flex items-start gap-2.5 sm:items-center">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500 dark:text-amber-400/80 sm:mt-0" />
          <p className="leading-relaxed">
            <span className="font-semibold text-slate-900 dark:text-slate-200">Self-Reflection Notice:</span>{' '}
            DISC CareerGuide is for career exploration and personal self-reflection only—not a
            psychological diagnostic, clinical instrument, or hiring/selection tool.
          </p>
        </div>
        <span className="shrink-0 text-slate-500">
          © {new Date().getFullYear()} DISC CareerGuide
        </span>
      </div>
    </footer>
  );
}
