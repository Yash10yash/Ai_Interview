const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') cb(null, true);
        else cb(new Error('Only PDF files are allowed'), false);
    },
    limits: { fileSize: 5 * 1024 * 1024 },
}).single('resume');

const uploadResume = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(400).json({ message: err.message });
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        try {
            const dataBuffer = fs.readFileSync(req.file.path);
            const pdfData = await pdfParse(dataBuffer);
            const extractedText = pdfData.text;

            // Extract skills keywords
            const skillKeywords = ['javascript', 'python', 'java', 'react', 'node', 'express', 'mongodb',
                'sql', 'css', 'html', 'c++', 'typescript', 'aws', 'docker', 'kubernetes', 'machine learning',
                'deep learning', 'tensorflow', 'pytorch', 'git', 'linux', 'rest api', 'graphql'];
            const textLower = extractedText.toLowerCase();
            const foundSkills = skillKeywords.filter(skill => textLower.includes(skill));

            // Check if user already has a resume, update or create
            let resume = await Resume.findOne({ userId: req.user._id });
            if (resume) {
                resume.filename = req.file.filename;
                resume.originalName = req.file.originalname;
                resume.extractedText = extractedText;
                resume.skills = foundSkills;
                resume.questions = [];
                resume.uploadedAt = Date.now();
                await resume.save();
            } else {
                resume = await Resume.create({
                    userId: req.user._id,
                    filename: req.file.filename,
                    originalName: req.file.originalname,
                    extractedText,
                    skills: foundSkills,
                });
            }

            res.status(201).json({
                message: 'Resume uploaded and parsed successfully',
                resumeId: resume._id,
                skills: foundSkills,
                textLength: extractedText.length,
            });
        } catch (error) {
            res.status(500).json({ message: 'Failed to parse PDF: ' + error.message });
        }
    });
};

const getResume = async (req, res) => {
    const resume = await Resume.findOne({ userId: req.user._id });
    if (!resume) return res.status(404).json({ message: 'No resume found' });
    res.json(resume);
};

const deleteResume = async (req, res) => {
    await Resume.findOneAndDelete({ userId: req.user._id });
    res.json({ message: 'Resume deleted' });
};

module.exports = { uploadResume, getResume, deleteResume };
