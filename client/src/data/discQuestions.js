export const DISC_META = {
  D: {
    key: 'D',
    name: 'Dominance',
    shortLabel: 'Drive & Results',
    hex: '#F43F5E',
    textClass: 'text-rose-700 dark:text-rose-400',
    bgClass: 'bg-rose-500/10 dark:bg-rose-500/15',
    borderClass: 'border-rose-500/30 dark:border-rose-500/35',
    ringClass: 'ring-rose-500/40',
    glowShadow: '0 0 40px -10px rgba(244, 63, 94, 0.45)',
    summary: 'Direct, decisive, and energized by ownership, momentum, and tangible outcomes.',
    traits: ['Decisive action', 'High accountability', 'Goal focus'],
    sampleScore: 84,
  },
  I: {
    key: 'I',
    name: 'Influence',
    shortLabel: 'People & Momentum',
    hex: '#F59E0B',
    textClass: 'text-amber-700 dark:text-amber-400',
    bgClass: 'bg-amber-500/10 dark:bg-amber-500/15',
    borderClass: 'border-amber-500/30 dark:border-amber-500/35',
    ringClass: 'ring-amber-500/40',
    glowShadow: '0 0 40px -10px rgba(245, 158, 11, 0.45)',
    summary: 'Collaborative, expressive, and skilled at building rapport and rallying teams.',
    traits: ['Persuasive voice', 'Optimistic energy', 'Relationship building'],
    sampleScore: 76,
  },
  S: {
    key: 'S',
    name: 'Steadiness',
    shortLabel: 'Calm & Reliability',
    hex: '#10B981',
    textClass: 'text-emerald-700 dark:text-emerald-400',
    bgClass: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    borderClass: 'border-emerald-500/30 dark:border-emerald-500/35',
    ringClass: 'ring-emerald-500/40',
    glowShadow: '0 0 40px -10px rgba(16, 185, 129, 0.45)',
    summary: 'Patient, dependable, and focused on trust, consistency, and sustainable teamwork.',
    traits: ['Steady execution', 'Active listening', 'Team harmony'],
    sampleScore: 68,
  },
  C: {
    key: 'C',
    name: 'Conscientiousness',
    shortLabel: 'Precision & Systems',
    hex: '#6366F1',
    textClass: 'text-indigo-700 dark:text-indigo-400',
    bgClass: 'bg-indigo-500/10 dark:bg-indigo-500/15',
    borderClass: 'border-indigo-500/30 dark:border-indigo-500/35',
    ringClass: 'ring-indigo-500/40',
    glowShadow: '0 0 40px -10px rgba(99, 102, 241, 0.45)',
    summary: 'Analytical, structured, and committed to high standards, clarity, and evidence.',
    traits: ['Systems thinking', 'Quality rigor', 'Careful analysis'],
    sampleScore: 91,
  },
};

export const LIKERT_OPTIONS = [
  { value: 1, label: 'Strongly Disagree', shortLabel: 'Strongly Disagree' },
  { value: 2, label: 'Disagree', shortLabel: 'Disagree' },
  { value: 3, label: 'Neutral', shortLabel: 'Neutral' },
  { value: 4, label: 'Agree', shortLabel: 'Agree' },
  { value: 5, label: 'Strongly Agree', shortLabel: 'Strongly Agree' },
];

// Order strictly matches backend discScoring.service.js:
// 0–2 = D, 3–5 = I, 6–8 = S, 9–11 = C
export const DISC_QUESTIONS = [
  // D — Dominance (0–2)
  {
    id: 1,
    trait: 'D',
    statement: 'When a project stalls, I naturally step forward to make a tough call and restore momentum.',
    context: 'Decision-making under ambiguity',
  },
  {
    id: 2,
    trait: 'D',
    statement: 'I prefer direct, bottom-line conversations over long discussions that delay action.',
    context: 'Communication & pace',
  },
  {
    id: 3,
    trait: 'D',
    statement: 'I feel energized by ambitious targets, measurable ownership, and solving high-stakes bottlenecks.',
    context: 'Motivation & challenge',
  },
  // I — Influence (3–5)
  {
    id: 4,
    trait: 'I',
    statement: 'I gain energy from brainstorming out loud, networking, and sparking enthusiasm in a group.',
    context: 'Collaboration & energy',
  },
  {
    id: 5,
    trait: 'I',
    statement: 'I enjoy translating ideas into engaging stories that win buy-in from teammates or clients.',
    context: 'Persuasion & visibility',
  },
  {
    id: 6,
    trait: 'I',
    statement: 'Building warm relationships and keeping team morale high is central to how I do my best work.',
    context: 'Workplace culture',
  },
  // S — Steadiness (6–8)
  {
    id: 7,
    trait: 'S',
    statement: 'I do my strongest work in predictable environments where expectations and priorities are steady.',
    context: 'Work rhythm & stability',
  },
  {
    id: 8,
    trait: 'S',
    statement: 'Colleagues often come to me because I listen patiently and help smooth over friction.',
    context: 'Support & empathy',
  },
  {
    id: 9,
    trait: 'S',
    statement: 'I take pride in consistent, dependable follow-through rather than chasing constant disruption.',
    context: 'Execution & reliability',
  },
  // C — Conscientiousness (9–11)
  {
    id: 10,
    trait: 'C',
    statement: 'Before committing to a plan, I want clear data, well-defined criteria, and a check for edge cases.',
    context: 'Analytical rigor',
  },
  {
    id: 11,
    trait: 'C',
    statement: 'I notice subtle inconsistencies and prefer taking extra time to ensure work meets high quality standards.',
    context: 'Precision & craft',
  },
  {
    id: 12,
    trait: 'C',
    statement: 'I thrive when designing structured processes, documentation, or logical frameworks others can rely on.',
    context: 'Systems & structure',
  },
];
