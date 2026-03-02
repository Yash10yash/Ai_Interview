const express = require('express');
const router = express.Router();
const { generateQuestions, evaluateAnswer, generateImprovementPlan } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/generate-questions', protect, generateQuestions);
router.post('/evaluate', protect, evaluateAnswer);
router.post('/improvement-plan', protect, generateImprovementPlan);

module.exports = router;
