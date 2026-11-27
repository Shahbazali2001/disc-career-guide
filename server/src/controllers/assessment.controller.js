import { AppError } from '../middlewares/errorHandler.js';
import { Assessment } from '../models/Assessment.model.js';
import { ChatSession } from '../models/ChatSession.model.js';
import { scoreDiscAnswers } from '../services/discScoring.service.js';
import { generateCareerReport } from '../services/gemini.service.js';

const verifyOwnership = (assessment, userId) => {
  if (!assessment) {
    throw new AppError('Assessment not found.', 404);
  }
  if (assessment.userId.toString() !== userId.toString()) {
    throw new AppError('Forbidden: you do not have access to this assessment.', 403);
  }
};

export const createAssessment = async (req, res, next) => {
  try {
    if (!req.user?.hasCareerProfile || !req.user?.careerProfile) {
      return next(
        new AppError(
          'Please complete your background profile (Education Level, Field of Study, Years of Experience, and Age) before taking an assessment.',
          400
        )
      );
    }

    const { answers } = req.body;
    const careerProfile = {
      educationLevel: req.user.careerProfile.educationLevel,
      fieldOfStudy: req.user.careerProfile.fieldOfStudy,
      yearsOfExperience: req.user.careerProfile.yearsOfExperience,
      age: req.user.careerProfile.age,
    };

    const { scores, primaryTrait, secondaryTrait, blendLabel } = scoreDiscAnswers(answers);

    const { report, isDemoFallback } = await generateCareerReport(
      scores,
      blendLabel,
      careerProfile
    );

    const assessment = await Assessment.create({
      userId: req.user._id,
      answers,
      scores,
      primaryTrait,
      secondaryTrait,
      blendLabel,
      careerProfile,
      aiReport: report,
      isDemoFallback,
    });

    return res.status(201).json({ assessment });
  } catch (err) {
    return next(err);
  }
};

export const listAssessments = async (req, res, next) => {
  try {
    const assessments = await Assessment.find({ userId: req.user._id })
      .select('_id scores blendLabel aiReport.styleTitle isDemoFallback createdAt')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ assessments });
  } catch (err) {
    return next(err);
  }
};

export const getAssessmentById = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id).lean();
    verifyOwnership(assessment, req.user._id);

    return res.status(200).json({ assessment });
  } catch (err) {
    return next(err);
  }
};

export const deleteAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id).select('_id userId').lean();
    verifyOwnership(assessment, req.user._id);

    await Promise.all([
      Assessment.deleteOne({ _id: assessment._id }),
      ChatSession.deleteMany({ assessmentId: assessment._id, userId: req.user._id }),
    ]);

    return res.status(200).json({
      ok: true,
      deletedId: assessment._id,
      message: 'Assessment and linked chat session deleted.',
    });
  } catch (err) {
    return next(err);
  }
};
