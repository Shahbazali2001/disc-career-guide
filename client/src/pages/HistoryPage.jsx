import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  Briefcase,
  Calendar,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { extractApiError } from '../api/axiosClient.js';
import { deleteAssessment, getUserAssessments } from '../api/careerApi.js';
import { DISC_META } from '../data/discQuestions.js';

const TRAITS = ['D', 'I', 'S', 'C'];

const formatDateTime = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export default function HistoryPage() {
  const queryClient = useQueryClient();
  const [confirmTarget, setConfirmTarget] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['assessments'],
    queryFn: getUserAssessments,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAssessment(id),
    onSuccess: (_res, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      queryClient.removeQueries({ queryKey: ['assessment', deletedId] });
      queryClient.removeQueries({ queryKey: ['chatHistory', deletedId] });
      setConfirmTarget(null);
      toast.success('Assessment and linked chat session deleted.');
    },
    onError: (err) => {
      toast.error(extractApiError(err, 'Could not delete assessment.'));
    },
  });

  const assessments = data?.assessments || [];

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              My Assessment History
            </h1>
            {!isLoading && (
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-2.5 py-0.5 text-xs font-bold text-slate-300 tabular-nums">
                {assessments.length}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-400">
            Revisit your past DISC blends, explore matched occupations, or continue coaching chats.
          </p>
        </div>

        <Link to="/test" className="btn-primary self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          <span>New Assessment</span>
        </Link>
      </div>

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid animate-pulse gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="glass-card h-64 p-6" />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="glass-card p-8 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-rose-400" />
          <h2 className="mt-3 text-lg font-bold text-white">Failed to load history</h2>
          <p className="mt-1 text-sm text-slate-400">
            {extractApiError(error, 'Please refresh the page to try again.')}
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && assessments.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card mx-auto max-w-xl p-10 text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/15 text-indigo-300">
            <Sparkles className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-xl font-bold text-white">No saved assessments yet</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Complete the 2-minute 12-question DISC reflection to unlock your personalized blend
            report, 8 career families breakdown, 20 matched jobs, and AI Career Coach.
          </p>
          <Link to="/test" className="btn-primary mt-6">
            <span>Take Your First Assessment</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      )}

      {/* Responsive Bento Grid of Saved Assessments */}
      {!isLoading && !isError && assessments.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {assessments.map((item, idx) => {
            const primaryKey = item.blendLabel?.[0] || 'C';
            const primaryMeta = DISC_META[primaryKey] || DISC_META.C;

            return (
              <motion.article
                key={item._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.3) }}
                className="glass-card group relative flex flex-col justify-between overflow-hidden p-5 transition-all duration-200 hover:border-white/20"
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-15 blur-2xl"
                  style={{ backgroundColor: primaryMeta.hex }}
                />

                <div>
                  {/* Date + Demo Badge + Delete Button */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 tabular-nums">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        {formatDateTime(item.createdAt)}
                      </span>
                      {item.isDemoFallback && (
                        <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                          Demo
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      aria-label={`Delete assessment ${item.aiReport?.styleTitle || item.blendLabel}`}
                      onClick={() => setConfirmTarget(item)}
                      className="rounded-lg border border-transparent p-1.5 text-slate-500 transition hover:border-rose-500/35 hover:bg-rose-500/10 hover:text-rose-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Blend Label & Style Title */}
                  <div className="mt-3">
                    <span
                      className={`inline-block rounded-lg border px-2.5 py-0.5 text-xs font-bold ${primaryMeta.bgClass} ${primaryMeta.borderClass} ${primaryMeta.textClass}`}
                    >
                      {item.blendLabel}
                    </span>
                    <h2 className="mt-2 text-base font-bold leading-snug text-white">
                      {item.aiReport?.styleTitle || `${item.blendLabel} Profile`}
                    </h2>
                  </div>

                  {/* Compact 4-Color D/I/S/C Score Badges */}
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {TRAITS.map((trait) => {
                      const meta = DISC_META[trait];
                      const val = item.scores?.[trait] ?? 0;
                      return (
                        <div
                          key={trait}
                          className="flex flex-col items-center rounded-xl border border-white/10 bg-slate-950/70 py-2"
                        >
                          <span className="text-[10px] font-bold" style={{ color: meta.hex }}>
                            {trait}
                          </span>
                          <span className="mt-0.5 text-sm font-extrabold text-white tabular-nums">
                            {val}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
                  <Link
                    to={`/results/${item._id}`}
                    className="inline-flex items-center justify-center gap-1 rounded-xl border border-indigo-400/30 bg-indigo-500/15 px-2.5 py-2 text-xs font-semibold text-indigo-200 transition hover:bg-indigo-500/25 hover:text-white"
                  >
                    <BarChart3 className="h-3.5 w-3.5" />
                    <span>Results</span>
                  </Link>

                  <Link
                    to={`/jobs/${item._id}`}
                    className="inline-flex items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                  >
                    <Briefcase className="h-3.5 w-3.5" />
                    <span>Jobs</span>
                  </Link>

                  <Link
                    to={`/chat/${item._id}`}
                    className="inline-flex items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2 text-xs font-semibold text-slate-200 transition hover:border-emerald-400/35 hover:bg-emerald-500/10 hover:text-emerald-200"
                  >
                    <Bot className="h-3.5 w-3.5" />
                    <span>Chat</span>
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {confirmTarget && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-confirm-title"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleteMutation.isPending && setConfirmTarget(null)}
              className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="glass-card relative z-10 w-full max-w-md border-white/15 bg-slate-900/95 p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-rose-500/35 bg-rose-500/15 text-rose-400">
                <Trash2 className="h-5 w-5" />
              </div>
              <h2 id="delete-confirm-title" className="mt-4 text-lg font-bold text-white">
                Delete this assessment?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                This will permanently remove{' '}
                <strong className="text-slate-200">
                  {confirmTarget.aiReport?.styleTitle || confirmTarget.blendLabel}
                </strong>{' '}
                and its linked AI Career Coach conversation history.
              </p>

              <div className="mt-6 flex justify-end gap-2.5">
                <button
                  type="button"
                  disabled={deleteMutation.isPending}
                  onClick={() => setConfirmTarget(null)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(confirmTarget._id)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-50"
                >
                  {deleteMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Forever</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
