const express = require('express');
const router = express.Router();
const { getUserStats, getAdminStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roleCheck');

router.get('/user', protect, getUserStats);
router.get('/admin', protect, adminOnly, getAdminStats);

module.exports = router;
