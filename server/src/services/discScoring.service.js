export const DISC_TRAITS = ['D', 'I', 'S', 'C'];

export const CAREER_FAMILIES = [
  'Management & Business',
  'Computer, Engineering & Science',
  'Community, Social Service & Legal',
  'Education, Arts & Media',
  'Healthcare',
  'Sales & Office Support',
  'Personal & Protective Services',
  'Trades, Production & Transport',
];

const DIMENSION_SLICES = {
  D: [0, 3],
  I: [3, 6],
  S: [6, 9],
  C: [9, 12],
};

/**
 * Deterministic 12-question DISC scoring engine.
 * Answers must be 12 integers (1–5):
 *   indices 0–2 = D, 3–5 = I, 6–8 = S, 9–11 = C.
 * Each dimension score = Math.round((sum / 15) * 100).
 */
export const scoreDiscAnswers = (answers) => {
  if (!Array.isArray(answers) || answers.length !== 12) {
    throw new Error('DISC scoring requires an array of exactly 12 answers.');
  }

  for (let idx = 0; idx < answers.length; idx += 1) {
    const val = answers[idx];
    if (!Number.isInteger(val) || val < 1 || val > 5) {
      throw new Error(`Answer at index ${idx} must be an integer between 1 and 5.`);
    }
  }

  const scores = {};
  for (const trait of DISC_TRAITS) {
    const [start, end] = DIMENSION_SLICES[trait];
    const sum = answers.slice(start, end).reduce((acc, num) => acc + num, 0);
    scores[trait] = Math.round((sum / 15) * 100);
  }

  const ranked = DISC_TRAITS.map((trait, order) => ({
    trait,
    score: scores[trait],
    order,
  })).sort((a, b) => b.score - a.score || a.order - b.order);

  const primaryTrait = ranked[0].trait;
  const secondaryTrait = ranked[1].trait;
  const blendLabel = `${primaryTrait} / ${secondaryTrait} Blend`;

  return {
    scores,
    primaryTrait,
    secondaryTrait,
    blendLabel,
  };
};

export default scoreDiscAnswers;
