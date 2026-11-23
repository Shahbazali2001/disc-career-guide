import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Building2, Compass, Sparkles, Wrench, X } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DISC_META } from '../../data/discQuestions.js';

const TRAITS = ['D', 'I', 'S', 'C'];

export default function JobDetailModal({ job, userScores, assessmentId, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!job) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [job, onClose]);

  const handleAskCoach = () => {
    if (!job) return;
    const params = new URLSearchParams({
      prompt: `Tell me more about becoming a ${job.title}`,
    });
    onClose();
    navigate(`/chat/${assessmentId}?${params.toString()}`);
  };

  return (
    <AnimatePresence>
      {job && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="job-modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2 }}
            className="glass-card relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto border-white/15 bg-slate-900/95 p-6 sm:p-7"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-emerald-500/35 bg-emerald-500/15 px-3 py-0.5 text-xs font-bold text-emerald-300 tabular-nums">
                    {job.matchPercentage}% Match
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-xs font-medium text-slate-300">
                    {job.isOfficeRole ? (
                      <Building2 className="h-3.5 w-3.5 text-indigo-400" />
                    ) : (
                      <Wrench className="h-3.5 w-3.5 text-emerald-400" />
                    )}
                    {job.isOfficeRole ? 'Office Role' : 'Field / Hands-On'}
                  </span>
                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs text-slate-300">
                    {job.family}
                  </span>
                </div>

                <h2
                  id="job-modal-title"
                  className="mt-3 text-xl font-extrabold text-white sm:text-2xl"
                >
                  {job.title}
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close modal"
                onClick={onClose}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-slate-300">{job.description}</p>

            {/* Key Skills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {(job.keySkills || []).map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-indigo-400/20 bg-indigo-500/10 px-2.5 py-1 text-xs font-medium text-indigo-200"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Side-by-Side User DISC vs. Job DISC Comparison */}
            <div className="mt-6 rounded-xl border border-white/10 bg-slate-950/70 p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Side-by-Side DISC Alignment
                </h3>
                <div className="flex items-center gap-4 text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-white" />
                    Your DISC
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-sm bg-indigo-400/70" />
                    Role Profile
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {TRAITS.map((trait) => {
                  const meta = DISC_META[trait];
                  const userVal = Number(userScores?.[trait] ?? 0);
                  const jobVal = Number(job.jobDiscProfile?.[trait] ?? 0);

                  return (
                    <div key={trait}>
                      <div className="mb-1.5 flex items-center justify-between text-xs">
                        <span className="font-semibold text-white">
                          <span style={{ color: meta.hex }}>{trait}</span> · {meta.name}
                        </span>
                        <div className="flex items-center gap-3 tabular-nums">
                          <span className="text-slate-200">
                            You: <strong>{userVal}</strong>
                          </span>
                          <span className="text-slate-400">
                            Role: <strong style={{ color: meta.hex }}>{jobVal}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 sm:gap-3">
                        {/* User bar */}
                        <div className="flex items-center gap-2">
                          <span className="w-8 text-[10px] font-medium text-slate-400">You</span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${userVal}%` }}
                              transition={{ duration: 0.45 }}
                              className="h-full rounded-full bg-white/90"
                            />
                          </div>
                        </div>

                        {/* Job bar */}
                        <div className="flex items-center gap-2">
                          <span className="w-8 text-[10px] font-medium text-slate-400">Role</span>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${jobVal}%` }}
                              transition={{ duration: 0.45, delay: 0.05 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: meta.hex }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actionable First Step */}
            <div className="mt-5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
                <Compass className="h-4 w-4" />
                <span>Actionable First Step</span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-emerald-100/95">
                {job.firstStep}
              </p>
            </div>

            {/* Modal Footer CTA */}
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-white/10 pt-5">
              <button type="button" onClick={onClose} className="btn-ghost">
                Close
              </button>
              <button type="button" onClick={handleAskCoach} className="btn-primary">
                <Bot className="h-4 w-4" />
                <span>Ask AI Coach about this role</span>
                <Sparkles className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
