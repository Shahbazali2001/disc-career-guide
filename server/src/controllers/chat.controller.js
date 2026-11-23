import { AppError } from '../middlewares/errorHandler.js';
import { Assessment } from '../models/Assessment.model.js';
import { ChatSession } from '../models/ChatSession.model.js';
import { generateChatReply } from '../services/gemini.service.js';

const loadOwnedAssessment = async (assessmentId, userId) => {
  const assessment = await Assessment.findById(assessmentId).select('_id userId scores').lean();
  if (!assessment) {
    throw new AppError('Assessment not found.', 404);
  }
  if (assessment.userId.toString() !== userId.toString()) {
    throw new AppError('Forbidden: you do not have access to this assessment.', 403);
  }
  return assessment;
};

export const sendChatMessage = async (req, res, next) => {
  try {
    const { assessmentId, message } = req.body;
    const assessment = await loadOwnedAssessment(assessmentId, req.user._id);

    let session = await ChatSession.findOne({
      userId: req.user._id,
      assessmentId: assessment._id,
    });

    if (!session) {
      session = new ChatSession({
        userId: req.user._id,
        assessmentId: assessment._id,
        messages: [],
      });
    }

    const { reply, isDemo } = await generateChatReply(
      session.messages,
      assessment.scores,
      message
    );

    const now = new Date();
    session.messages.push(
      { role: 'user', content: message, createdAt: now },
      { role: 'model', content: reply, createdAt: new Date() }
    );

    await session.save();

    return res.status(200).json({
      reply,
      sessionId: session._id,
      isDemo,
    });
  } catch (err) {
    return next(err);
  }
};

export const getChatHistory = async (req, res, next) => {
  try {
    const { assessmentId } = req.params;
    const assessment = await loadOwnedAssessment(assessmentId, req.user._id);

    const session = await ChatSession.findOne({
      userId: req.user._id,
      assessmentId: assessment._id,
    }).lean();

    return res.status(200).json({
      assessmentId: assessment._id,
      sessionId: session?._id || null,
      messages: session?.messages || [],
    });
  } catch (err) {
    return next(err);
  }
};
