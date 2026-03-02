const express = require('express');
const router = express.Router();
const { uploadResume, getResume, deleteResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

router.post('/upload', protect, uploadResume);
router.get('/my', protect, getResume);
router.delete('/my', protect, deleteResume);

module.exports = router;
