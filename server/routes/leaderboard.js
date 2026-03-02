const express = require('express');
const router = express.Router();
const { getGlobalLeaderboard, getDSALeaderboard, getHRLeaderboard, getWeeklyLeaderboard } = require('../controllers/leaderboardController');
const { protect } = require('../middleware/auth');

router.get('/global', protect, getGlobalLeaderboard);
router.get('/dsa', protect, getDSALeaderboard);
router.get('/hr', protect, getHRLeaderboard);
router.get('/weekly', protect, getWeeklyLeaderboard);

module.exports = router;
