const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    questionText: String,
    questionCategory: String,
    questionDifficulty: String,
    userAnswer: String,
    score: { type: Number, default: 0 },
    maxScore: { type: Number, default: 10 },
    strengths: [String],
    weaknesses: [String],
    correctExplanation: String,
    confidenceScore: { type: Number, default: 0 },
    communicationScore: { type: Number, default: 0 },
    professionalToneFeedback: String,
    timeTaken: { type: Number, default: 0 },
});

const interviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' },
    mode: { type: String, enum: ['DSA', 'HR', 'Technical', 'Custom'], required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard', 'mixed'], default: 'mixed' },
    totalQuestions: { type: Number, default: 10 },
    answers: [answerSchema],
    totalScore: { type: Number, default: 0 },
    maxPossibleScore: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    improvementPlan: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
});

module.exports = mongoose.model('Interview', interviewSchema);
