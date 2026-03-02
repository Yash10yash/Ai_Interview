const Interview = require('../models/Interview');
const User = require('../models/User');

const getUserStats = async (req, res) => {
    const userId = req.user._id;
    const interviews = await Interview.find({ userId, status: 'completed' });

    const totalInterviews = interviews.length;
    const avgScore = totalInterviews
        ? Math.round(interviews.reduce((sum, i) => sum + i.percentage, 0) / totalInterviews)
        : 0;

    const byMode = {};
    interviews.forEach((i) => {
        if (!byMode[i.mode]) byMode[i.mode] = { count: 0, totalScore: 0 };
        byMode[i.mode].count++;
        byMode[i.mode].totalScore += i.percentage;
    });

    const modeStats = Object.entries(byMode).map(([mode, data]) => ({
        mode,
        count: data.count,
        avgScore: Math.round(data.totalScore / data.count),
    }));

    // Monthly improvement (last 6 months)
    const months = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthName = d.toLocaleString('default', { month: 'short' });
        const monthInterviews = interviews.filter((iv) => {
            const created = new Date(iv.createdAt);
            return created.getMonth() === d.getMonth() && created.getFullYear() === d.getFullYear();
        });
        months.push({
            month: monthName,
            avgScore: monthInterviews.length
                ? Math.round(monthInterviews.reduce((s, iv) => s + iv.percentage, 0) / monthInterviews.length)
                : 0,
            count: monthInterviews.length,
        });
    }

    // Weakness analysis
    const allWeaknesses = interviews.flatMap((i) => i.answers.flatMap((a) => a.weaknesses));
    const weaknessCount = {};
    allWeaknesses.forEach((w) => { weaknessCount[w] = (weaknessCount[w] || 0) + 1; });
    const topWeaknesses = Object.entries(weaknessCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([weakness, count]) => ({ weakness, count }));

    const recentInterviews = await Interview.find({ userId, status: 'completed' })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('mode percentage totalScore createdAt duration');

    res.json({ totalInterviews, avgScore, modeStats, monthlyData: months, topWeaknesses, recentInterviews });
};

const getAdminStats = async (req, res) => {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalInterviews = await Interview.countDocuments({ status: 'completed' });
    const allInterviews = await Interview.find({ status: 'completed' });
    const avgScore = allInterviews.length
        ? Math.round(allInterviews.reduce((s, i) => s + i.percentage, 0) / allInterviews.length)
        : 0;

    const recentUsers = await User.find({ role: 'user' }).sort({ createdAt: -1 }).limit(10).select('name email createdAt');

    const allInterviewsFull = await Interview.find({ status: 'completed' })
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .limit(20)
        .select('mode percentage createdAt userId');

    res.json({ totalUsers, totalInterviews, avgScore, recentUsers, recentInterviews: allInterviewsFull });
};

module.exports = { getUserStats, getAdminStats };
