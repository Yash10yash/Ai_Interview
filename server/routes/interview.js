const express = require('express');
const router = express.Router();
const {
    createInterview, startInterview, submitAnswer, finishInterview,
    getInterviewHistory, getInterviewById, deleteInterview
} = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

router.post('/create', protect, createInterview);
router.get('/history', protect, getInterviewHistory);
router.get('/:id', protect, getInterviewById);
router.put('/:id/start', protect, startInterview);
router.post('/:id/answer', protect, submitAnswer);
router.put('/:id/finish', protect, finishInterview);
router.delete('/:id', protect, deleteInterview);

module.exports = router;
