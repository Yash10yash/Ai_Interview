const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: String,
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'] },
    category: { type: String, enum: ['DSA', 'Technical', 'HR', 'Custom'] },
});

const resumeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    filename: { type: String, required: true },
    originalName: { type: String },
    extractedText: { type: String },
    skills: [String],
    questions: [questionSchema],
    uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Resume', resumeSchema);
