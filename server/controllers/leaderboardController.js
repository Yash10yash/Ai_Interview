const Interview = require('../models/Interview');
const User = require('../models/User');

const buildLeaderboard = async (filter = {}, limit = 50) => {
    const pipeline = [
        { $match: { status: 'completed', ...filter } },
        {
            $group: {
                _id: '$userId',
                avgScore: { $avg: '$percentage' },
                totalInterviews: { $sum: 1 },
                bestScore: { $max: '$percentage' },
            },
        },
        { $sort: { avgScore: -1 } },
        { $limit: limit },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'user',
            },
        },
        { $unwind: '$user' },
        {
            $project: {
                _id: 0,
                userId: '$_id',
                name: '$user.name',
                email: '$user.email',
                avgScore: { $round: ['$avgScore', 1] },
                totalInterviews: 1,
                bestScore: { $round: ['$bestScore', 1] },
            },
        },
    ];
    return Interview.aggregate(pipeline);
};

const getGlobalLeaderboard = async (req, res) => {
    const data = await buildLeaderboard();
    res.json(data);
};

const getDSALeaderboard = async (req, res) => {
    const data = await buildLeaderboard({ mode: 'DSA' });
    res.json(data);
};

const getHRLeaderboard = async (req, res) => {
    const data = await buildLeaderboard({ mode: 'HR' });
    res.json(data);
};

const getWeeklyLeaderboard = async (req, res) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const data = await buildLeaderboard({ createdAt: { $gte: weekAgo } });
    res.json(data);
};

module.exports = { getGlobalLeaderboard, getDSALeaderboard, getHRLeaderboard, getWeeklyLeaderboard };
