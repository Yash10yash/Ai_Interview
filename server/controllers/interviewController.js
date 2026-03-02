const Interview = require('../models/Interview');

const createInterview = async (req, res) => {
    const { mode, difficulty, totalQuestions, resumeId } = req.body;
    const interview = await Interview.create({
        userId: req.user._id,
        resumeId: resumeId || null,
        mode,
        difficulty: difficulty || 'mixed',
        totalQuestions: totalQuestions || 10,
        status: 'pending',
    });
    res.status(201).json(interview);
};

const startInterview = async (req, res) => {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    if (interview.userId.toString() !== req.user._id.toString())
        return res.status(403).json({ message: 'Not authorized' });
    interview.status = 'in-progress';
    await interview.save();
    res.json(interview);
};

const submitAnswer = async (req, res) => {
    const { questionText, questionCategory, questionDifficulty, userAnswer, evaluation, timeTaken } = req.body;
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: 'Interview not found' });

    const answerDoc = {
        questionText,
        questionCategory,
        questionDifficulty,
        userAnswer,
        timeTaken: timeTaken || 0,
        score: evaluation?.score || 0,
        maxScore: evaluation?.maxScore || 10,
        strengths: evaluation?.strengths || [],
        weaknesses: evaluation?.weaknesses || [],
        correctExplanation: evaluation?.correctExplanation || '',
        confidenceScore: evaluation?.confidenceScore || 0,
        communicationScore: evaluation?.communicationScore || 0,
        professionalToneFeedback: evaluation?.professionalToneFeedback || '',
    };

    interview.answers.push(answerDoc);
    await interview.save();
    res.json({ message: 'Answer submitted', answer: answerDoc });
};

const finishInterview = async (req, res) => {
    const { duration } = req.body;
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ message: 'Interview not found' });

    const totalScore = interview.answers.reduce((sum, a) => sum + a.score, 0);
    const maxPossibleScore = interview.answers.length * 10;
    const percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

    interview.totalScore = totalScore;
    interview.maxPossibleScore = maxPossibleScore;
    interview.percentage = percentage;
    interview.duration = duration || 0;
    interview.status = 'completed';
    interview.completedAt = new Date();
    await interview.save();

    res.json(interview);
};

const getInterviewHistory = async (req, res) => {
    const interviews = await Interview.find({ userId: req.user._id })
        .sort({ createdAt: -1 })
        .limit(20)
        .select('-answers');
    res.json(interviews);
};

const getInterviewById = async (req, res) => {
    const interview = await Interview.findById(req.params.id).populate('resumeId', 'originalName skills');
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    if (interview.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin')
        return res.status(403).json({ message: 'Not authorized' });
    res.json(interview);
};

const deleteInterview = async (req, res) => {
    await Interview.findByIdAndDelete(req.params.id);
    res.json({ message: 'Interview deleted' });
};

module.exports = { createInterview, startInterview, submitAnswer, finishInterview, getInterviewHistory, getInterviewById, deleteInterview };
