import mongoose from 'mongoose';

const TRAITS = ['D', 'I', 'S', 'C'];

const scoresSchema = new mongoose.Schema(
  {
    D: { type: Number, required: true, min: 0, max: 100 },
    I: { type: Number, required: true, min: 0, max: 100 },
    S: { type: Number, required: true, min: 0, max: 100 },
    C: { type: Number, required: true, min: 0, max: 100 },
  },
  { _id: false }
);

const aiReportSchema = new mongoose.Schema(
  {
    styleTitle: { type: String, trim: true, default: '' },
    summary: { type: String, trim: true, default: '' },
    strengths: { type: [String], default: [] },
    growthAreas: { type: [String], default: [] },
    careerFamilies: { type: [mongoose.Schema.Types.Mixed], default: [] },
    recommendedJobs: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { _id: false }
);

const assessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    answers: {
      type: [Number],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length === 12,
        message: 'Assessment answers must contain exactly 12 numeric items',
      },
    },
    scores: {
      type: scoresSchema,
      required: true,
    },
    primaryTrait: {
      type: String,
      required: true,
      enum: TRAITS,
    },
    secondaryTrait: {
      type: String,
      required: true,
      enum: TRAITS,
    },
    blendLabel: {
      type: String,
      required: true,
      trim: true,
    },
    aiReport: {
      type: aiReportSchema,
      default: () => ({}),
    },
    isDemoFallback: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Assessment = mongoose.model('Assessment', assessmentSchema);
export default Assessment;
