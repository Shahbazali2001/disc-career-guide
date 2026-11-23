import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Keyboard,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { extractApiError } from '../api/axiosClient.js';
import { createAssessment } from '../api/careerApi.js';
import { DISC_META, DISC_QUESTIONS, LIKERT_OPTIONS } from '../data/discQuestions.js';

const LOADING_STEPS = [
  'Calculating DISC scores...',
  'Analyzing blend with Gemini...',
  'Matching 8 career families & 20 roles...',
];

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 44 : -44,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -44 : 44,
    opacity: 0,
  }),
};

export default function AssessmentPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState(() => Array(DISC_QUESTIONS.length).fill(null));
  const [loadingStage, setLoadingStage] = useState(0);

  const currentQuestion = DISC_QUESTIONS[currentIndex];
  const currentMeta = DISC_META[currentQuestion.trait];
  const selectedValue = answers[currentIndex];
  const answeredCount = answers.filter((v) => v !== null).length;
  const progressPct = Math.round(((currentIndex + 1) / DISC_QUESTIONS.length) * 100);
  const isLastQuestion = currentIndex === DISC_QUESTIONS.length - 1;
  const allAnswered = answeredCount === DISC_QUESTIONS.length;

  const mutation = useMutation({
    mutationFn: (finalAnswers) => createAssessment(finalAnswers),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['assessments'] });
      const id = data?.assessment?._id;
      toast.success('Your DISC career report is ready!');
      if (id) {
        navigate(`/results/${id}`, { replace: true });
      } else {
        navigate('/history', { replace: true });
      }
    },
    onError: (err) => {
      const msg = extractApiError(err, 'Failed to generate your career report. Please try again.');
      toast.error(msg);
    },
  });

  // Cycle animated loading messages while generating report
  useEffect(() => {
    if (!mutation.isPending) {
      setLoadingStage(0);
      return undefined;
    }

    const t1 = setTimeout(() => setLoadingStage(1), 900);
    const t2 = setTimeout(() => setLoadingStage(2), 2100);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [mutation.isPending]);

  const handleSelect = useCallback((value) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = value;
      return next;
    });
  }, [currentIndex]);

  const handleBack = useCallback(() => {
    if (currentIndex === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => prev - 1);
  }, [currentIndex]);

  const handleNextOrSubmit = useCallback(() => {
    if (answers[currentIndex] === null) {
      toast('Select an option (1–5) to continue.', { icon: '👆' });
      return;
    }

    if (!isLastQuestion) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    if (!allAnswered) {
      const firstUnanswered = answers.findIndex((v) => v === null);
      if (firstUnanswered >= 0) {
        setDirection(firstUnanswered > currentIndex ? 1 : -1);
        setCurrentIndex(firstUnanswered);
      }
      return;
    }

    mutation.mutate(answers);
  }, [allAnswered, answers, currentIndex, isLastQuestion, mutation]);

  // Keyboard shortcuts: 1-5 to select, Enter / ArrowRight for next, ArrowLeft for back
  useEffect(() => {
    if (mutation.isPending) return undefined;

    const onKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const tag = e.target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        handleSelect(Number(e.key));
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        handleNextOrSubmit();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleBack, handleNextOrSubmit, handleSelect, mutation.isPending]);

  if (mutation.isPending) {
    return (
      <div className="flex min-h-[calc(100vh-10rem)] items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card relative w-full max-w-lg overflow-hidden p-8 text-center"
        >
          <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-rose-500/20 blur-3xl" />

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/15">
            <Sparkles className="h-7 w-7 animate-pulse text-indigo-300" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-white">Building Your Career Blueprint</h2>
          <p className="mt-1.5 text-sm text-slate-400">
            Personalizing your DISC blend report and matching roles...
          </p>

          <div className="mt-7 space-y-3 text-left">
            {LOADING_STEPS.map((label, idx) => {
              const isDone = idx < loadingStage;
              const isActive = idx === loadingStage;
              return (
                <div
                  key={label}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all duration-300 ${
                    isActive
                      ? 'border-indigo-400/40 bg-indigo-500/15 text-white'
                      : isDone
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                        : 'border-white/5 bg-slate-950/40 text-slate-500'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  ) : isActive ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin text-indigo-400" />
                  ) : (
                    <span className="h-4 w-4 shrink-0 rounded-full border border-slate-700" />
                  )}
                  <span className="font-medium">{label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-medium text-slate-400">
          <span className="tabular-nums">
            Question <strong className="text-white">{currentIndex + 1}</strong> of{' '}
            {DISC_QUESTIONS.length}
          </span>
          <span className="tabular-nums">
            {answeredCount}/{DISC_QUESTIONS.length} answered ({progressPct}%)
          </span>
        </div>

        <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: currentMeta.hex }}
            initial={false}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>

        {/* Clickable Step Indicators */}
        <div className="mt-3 flex items-center gap-1.5">
          {DISC_QUESTIONS.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = answers[idx] !== null;
            const qMeta = DISC_META[q.trait];
            return (
              <button
                key={q.id}
                type="button"
                aria-label={`Go to question ${idx + 1}`}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                style={{
                  backgroundColor: isCurrent
                    ? qMeta.hex
                    : isAnswered
                      ? `${qMeta.hex}77`
                      : undefined,
                }}
                className={`h-1.5 flex-1 rounded-full transition-all duration-200 ${
                  !isCurrent && !isAnswered ? 'bg-white/10 hover:bg-white/20' : ''
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Animated Question Card */}
      <div className="glass-card relative overflow-hidden p-6 sm:p-8">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full opacity-20 blur-3xl transition-colors duration-500"
          style={{ backgroundColor: currentMeta.hex }}
        />

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestion.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.24, ease: 'easeOut' }}
          >
            {/* Trait Badge & Context */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${currentMeta.bgClass} ${currentMeta.borderClass} ${currentMeta.textClass}`}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: currentMeta.hex }}
                />
                {currentMeta.key} · {currentMeta.name}
              </span>
              <span className="text-xs text-slate-400">{currentQuestion.context}</span>
            </div>

            {/* Statement */}
            <h1 className="mt-5 text-xl font-bold leading-snug text-white sm:text-2xl">
              &ldquo;{currentQuestion.statement}&rdquo;
            </h1>

            {/* 1-5 Likert Options */}
            <div className="mt-7 space-y-2.5" role="radiogroup" aria-label="Agreement scale">
              {LIKERT_OPTIONS.map((option) => {
                const isSelected = selectedValue === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleSelect(option.value)}
                    style={{
                      borderColor: isSelected ? currentMeta.hex : undefined,
                      backgroundColor: isSelected ? `${currentMeta.hex}20` : undefined,
                      boxShadow: isSelected ? `0 0 24px -10px ${currentMeta.hex}` : undefined,
                    }}
                    className={`group flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all duration-150 ${
                      isSelected
                        ? 'text-white'
                        : 'border-white/10 bg-slate-950/60 text-slate-300 hover:border-white/25 hover:bg-slate-900/90 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border text-xs font-bold tabular-nums transition-colors ${
                          isSelected
                            ? 'border-white/30 bg-white/15 text-white'
                            : 'border-white/10 bg-white/[0.04] text-slate-400 group-hover:text-slate-200'
                        }`}
                      >
                        {option.value}
                      </span>
                      <span className="text-sm font-medium">{option.label}</span>
                    </div>

                    {isSelected && (
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-full text-white"
                        style={{ backgroundColor: currentMeta.hex }}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer Controls */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentIndex === 0}
            className="btn-ghost disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={handleNextOrSubmit}
            disabled={selectedValue === null}
            className="btn-primary px-6"
          >
            {isLastQuestion ? (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Career Report</span>
              </>
            ) : (
              <>
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {/* Keyboard Shortcut Hints */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Keyboard className="h-3.5 w-3.5 text-slate-400" />
            Shortcuts:
          </span>
          <span>
            <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-slate-300">
              1–5
            </kbd>{' '}
            Select
          </span>
          <span>
            <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-slate-300">
              Enter
            </kbd>{' '}
            /{' '}
            <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-slate-300">
              →
            </kbd>{' '}
            Next
          </span>
          <span>
            <kbd className="rounded border border-white/15 bg-white/5 px-1.5 py-0.5 font-mono text-slate-300">
              ←
            </kbd>{' '}
            Back
          </span>
        </div>
      </div>
    </div>
  );
}
