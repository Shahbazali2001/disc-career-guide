import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  Bot,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Loader2,
  Send,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { extractApiError } from '../api/axiosClient.js';
import { getAssessment, getChatHistory, sendChat } from '../api/careerApi.js';
import { DISC_META } from '../data/discQuestions.js';

const MAX_CHARS = 1500;
const TRAITS = ['D', 'I', 'S', 'C'];

const STARTER_PROMPTS = [
  'Which office roles best fit my blend?',
  'How can I improve my workplace communication?',
  'What hands-on or non-office roles fit my DISC scores?',
  'Help me prepare a STAR interview example for my top strength.',
];

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-indigo-400/30 bg-indigo-500/15 text-indigo-300">
        <Bot className="h-4 w-4" />
      </div>
      <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-slate-950/80 px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className="h-2 w-2 rounded-full bg-indigo-400"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: dot * 0.18,
                ease: 'easeInOut',
              }}
            />
          ))}
          <span className="ml-2 text-xs text-slate-400">Coach is thinking...</span>
        </div>
      </div>
    </div>
  );
}

export default function AiCoachPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const [input, setInput] = useState(() => (searchParams.get('prompt') || '').slice(0, MAX_CHARS));
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [pendingUserMessage, setPendingUserMessage] = useState(null);
  const [lastWasDemo, setLastWasDemo] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Sync ?prompt= parameter into input when arriving from JobDetailModal
  useEffect(() => {
    const promptParam = searchParams.get('prompt');
    if (promptParam) {
      setInput(promptParam.slice(0, MAX_CHARS));
      textareaRef.current?.focus();
    }
  }, [searchParams]);

  const {
    data: assessmentData,
    isLoading: loadingAssessment,
    isError: isAssessmentError,
    error: assessmentError,
  } = useQuery({
    queryKey: ['assessment', id],
    queryFn: () => getAssessment(id),
    enabled: Boolean(id),
  });

  const { data: chatData, isLoading: loadingChat } = useQuery({
    queryKey: ['chatHistory', id],
    queryFn: () => getChatHistory(id),
    enabled: Boolean(id) && !isAssessmentError,
  });

  const assessment = assessmentData?.assessment;
  const recordedMessages = chatData?.messages || [];

  const chatMutation = useMutation({
    mutationFn: ({ assessmentId, message }) => sendChat({ assessmentId, message }),
    onSuccess: (data, variables) => {
      setLastWasDemo(Boolean(data?.isDemo));
      setPendingUserMessage(null);

      queryClient.setQueryData(['chatHistory', id], (old) => {
        const existing = old?.messages || [];
        const now = new Date().toISOString();
        return {
          ...(old || {}),
          assessmentId: id,
          sessionId: data?.sessionId || old?.sessionId,
          messages: [
            ...existing,
            { role: 'user', content: variables.message, createdAt: now },
            { role: 'model', content: data.reply, createdAt: now },
          ],
        };
      });

      if (searchParams.has('prompt')) {
        setSearchParams({}, { replace: true });
      }
    },
    onError: (err, variables) => {
      setPendingUserMessage(null);
      setInput(variables.message);
      toast.error(extractApiError(err, 'Failed to send message. Please try again.'));
    },
  });

  const displayMessages = pendingUserMessage
    ? [...recordedMessages, pendingUserMessage]
    : recordedMessages;

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [displayMessages.length, chatMutation.isPending]);

  const handleSend = (rawText) => {
    const trimmed = String(rawText ?? input).trim();
    if (!trimmed || chatMutation.isPending) return;
    if (trimmed.length > MAX_CHARS) {
      toast.error(`Messages must be ${MAX_CHARS} characters or fewer.`);
      return;
    }

    setInput('');
    setPendingUserMessage({
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString(),
    });
    chatMutation.mutate({ assessmentId: id, message: trimmed });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loadingAssessment) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="glass-card h-72 lg:col-span-4" />
          <div className="glass-card h-[560px] lg:col-span-8" />
        </div>
      </div>
    );
  }

  if (isAssessmentError || !assessment) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="glass-card p-8 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-rose-400" />
          <h1 className="mt-4 text-xl font-bold text-white">Unable to open AI Coach</h1>
          <p className="mt-2 text-sm text-slate-400">
            {extractApiError(assessmentError, 'Assessment not found or you do not have access.')}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/history" className="btn-ghost">
              Back to My History
            </Link>
            <Link to="/test" className="btn-primary">
              Take New Test
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const primaryMeta = DISC_META[assessment.primaryTrait] || DISC_META.C;
  const charCount = input.length;
  const showDemoTag = lastWasDemo || assessment.isDemoFallback;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      {/* Top Breadcrumb Bar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to={`/results/${id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Results</span>
          </Link>
          <Link
            to={`/jobs/${id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
          >
            <Briefcase className="h-3.5 w-3.5" />
            <span>20 Jobs</span>
          </Link>
        </div>

        {/* Mobile Context Sidebar Toggle */}
        <button
          type="button"
          onClick={() => setSidebarOpenMobile((prev) => !prev)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-slate-200 lg:hidden"
        >
          <span>DISC Context ({assessment.blendLabel})</span>
          {sidebarOpenMobile ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Responsive Two-Column Layout */}
      <div className="grid gap-5 lg:grid-cols-12">
        {/* Left Context Sidebar */}
        <aside
          className={`lg:col-span-4 ${sidebarOpenMobile ? 'block' : 'hidden lg:block'}`}
        >
          <div className="glass-card sticky top-24 space-y-5 p-5 sm:p-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${primaryMeta.bgClass} ${primaryMeta.borderClass} ${primaryMeta.textClass}`}
                >
                  <Sparkles className="h-3 w-3" />
                  {assessment.blendLabel}
                </span>
                {showDemoTag && (
                  <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                    Demo Coach
                  </span>
                )}
              </div>

              <h1 className="mt-3 text-lg font-extrabold text-white">
                {assessment.aiReport?.styleTitle || 'Your Career Blend'}
              </h1>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">
                The coach automatically references your DISC profile so every suggestion stays
                tailored to your work style.
              </p>
            </div>

            {/* 4 DISC Score Pills */}
            <div className="grid grid-cols-2 gap-2.5">
              {TRAITS.map((trait) => {
                const meta = DISC_META[trait];
                const score = assessment.scores?.[trait] ?? 0;
                return (
                  <div
                    key={trait}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/70 px-3 py-2.5"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-extrabold"
                        style={{
                          backgroundColor: `${meta.hex}22`,
                          color: meta.hex,
                          border: `1px solid ${meta.hex}44`,
                        }}
                      >
                        {trait}
                      </span>
                      <span className="text-xs font-medium text-slate-300">{meta.name}</span>
                    </div>
                    <span className="text-sm font-bold text-white tabular-nums">{score}</span>
                  </div>
                );
              })}
            </div>

            {/* Guardrails Note */}
            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3.5 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Coaching Guardrails</span>
              </div>
              <p className="mt-1.5 leading-relaxed">
                Focused strictly on career exploration, skill planning, and workplace
                communication. Never invents salary stats or evaluates candidates for hiring.
              </p>
            </div>
          </div>
        </aside>

        {/* Right Chat Window */}
        <section className="lg:col-span-8">
          <div className="glass-card flex h-[calc(100vh-14.5rem)] min-h-[540px] flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-slate-950/40 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-400/35 bg-indigo-500/15 text-indigo-300">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">DISC AI Career Coach</h2>
                  <p className="text-xs text-slate-400">
                    Grounded in your {assessment.blendLabel} · Session history saved automatically
                  </p>
                </div>
              </div>
              <span className="hidden rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-slate-400 tabular-nums sm:inline-block">
                {displayMessages.length} {displayMessages.length === 1 ? 'message' : 'messages'}
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
              {loadingChat ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-indigo-400" />
                  <span>Loading conversation history...</span>
                </div>
              ) : displayMessages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/15 text-indigo-300">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-white">
                    Start a conversation with your Career Coach
                  </h3>
                  <p className="mt-1.5 max-w-md text-xs leading-relaxed text-slate-400">
                    Ask about roles from your report, workplace communication tips, interview
                    preparation, or next skills to build.
                  </p>

                  {/* Starter Prompt Chips */}
                  <div className="mt-6 flex max-w-xl flex-wrap justify-center gap-2">
                    {STARTER_PROMPTS.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => handleSend(chip)}
                        className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-left text-xs font-medium text-slate-200 transition hover:border-indigo-400/45 hover:bg-indigo-500/15 hover:text-white"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {displayMessages.map((msg, idx) => {
                    const isUser = msg.role === 'user';
                    return (
                      <motion.div
                        key={`${msg.role}-${idx}-${msg.createdAt || idx}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.18 }}
                        className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${
                            isUser
                              ? 'border-rose-400/35 bg-rose-500/15 text-rose-300'
                              : 'border-indigo-400/35 bg-indigo-500/15 text-indigo-300'
                          }`}
                        >
                          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>

                        <div
                          className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                            isUser
                              ? 'rounded-tr-sm border border-indigo-400/30 bg-indigo-500/20 text-white'
                              : 'rounded-tl-sm border border-white/10 bg-slate-950/80 text-slate-200'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </motion.div>
                    );
                  })}

                  {chatMutation.isPending && <TypingIndicator />}
                </>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Compact Starter Chips Bar when messages exist */}
            {displayMessages.length > 0 && (
              <div className="flex gap-2 overflow-x-auto border-t border-white/5 bg-slate-950/30 px-4 py-2.5 sm:px-5">
                {STARTER_PROMPTS.slice(0, 3).map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    disabled={chatMutation.isPending}
                    onClick={() => handleSend(chip)}
                    className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-slate-300 transition hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-white disabled:opacity-50"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            {/* Message Input Area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="border-t border-white/10 bg-slate-950/60 p-4"
            >
              <div className="flex items-end gap-2.5">
                <div className="relative flex-1">
                  <textarea
                    ref={textareaRef}
                    rows={2}
                    maxLength={MAX_CHARS}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about a career role, interview tips, or communication strategies..."
                    className="glass-input resize-none py-2.5 pr-4 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!input.trim() || chatMutation.isPending}
                  aria-label="Send message"
                  className="btn-primary h-[52px] px-4 sm:px-5"
                >
                  {chatMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span className="hidden sm:inline">Send</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>Press Enter to send · Shift+Enter for a new line</span>
                <span
                  className={`font-medium tabular-nums ${
                    charCount > MAX_CHARS * 0.9 ? 'text-amber-400' : 'text-slate-400'
                  }`}
                >
                  {charCount} / {MAX_CHARS}
                </span>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}
