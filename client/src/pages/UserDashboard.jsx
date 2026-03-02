import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Brain, Trophy, TrendingUp, Target, Play, Upload, FileText, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = ['#FF2E63', '#FF6B9D', '#FF0000', '#FF8C94', '#FFB3C1'];

const StatCard = ({ icon: Icon, label, value, sub, color = 'pink' }) => (
    <motion.div whileHover={{ y: -4 }} className="glass-card pink-shadow rounded-3xl p-6 card-hover">
        <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-2xl btn-gradient flex items-center justify-center">
                <Icon size={18} color="white" />
            </div>
            {sub && <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">{sub}</span>}
        </div>
        <div className="text-3xl font-black text-gray-900 mb-1">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
    </motion.div>
);

export default function UserDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/dashboard/user')
            .then(res => setStats(res.data))
            .catch(() => toast.error('Failed to load dashboard'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-16">
            <div className="w-10 h-10 rounded-full border-4 border-pink-200 border-t-pink-500" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
    );

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 relative z-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900">
                        Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
                    </h1>
                    <p className="text-gray-500 mt-1">Track your interview performance and improve every day.</p>
                </motion.div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3 mb-8">
                    <Link to="/interview/setup" className="btn-gradient px-5 py-2.5 rounded-2xl text-sm font-bold text-white flex items-center gap-2">
                        <Play size={14} /> Start Interview
                    </Link>
                    <Link to="/resume" className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-gray-700 border border-pink-100 hover:bg-pink-50 flex items-center gap-2 transition-colors">
                        <Upload size={14} /> Upload Resume
                    </Link>
                    <Link to="/leaderboard" className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-gray-700 border border-pink-100 hover:bg-pink-50 flex items-center gap-2 transition-colors">
                        <Trophy size={14} /> Leaderboard
                    </Link>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard icon={Brain} label="Total Interviews" value={stats?.totalInterviews || 0} />
                    <StatCard icon={Target} label="Average Score" value={`${stats?.avgScore || 0}%`} sub="+5% this week" />
                    <StatCard icon={TrendingUp} label="Best Mode" value={stats?.modeStats?.[0]?.mode || 'N/A'} />
                    <StatCard icon={Trophy} label="Top Score" value={`${Math.max(...(stats?.recentInterviews?.map(i => i.percentage) || [0]))}%`} />
                </div>

                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                    {/* Monthly Progress */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="glass-card pink-shadow rounded-3xl p-6">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <TrendingUp size={16} className="text-pink-500" /> Monthly Progress
                        </h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={stats?.monthlyData || []}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#fce7f0" />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} domain={[0, 100]} />
                                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #ffd6e3', boxShadow: '0 4px 20px rgba(255,46,99,0.1)' }} />
                                <Line type="monotone" dataKey="avgScore" stroke="#FF2E63" strokeWidth={2.5} dot={{ fill: '#FF2E63', r: 4 }} name="Avg Score %" />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Mode Breakdown */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="glass-card pink-shadow rounded-3xl p-6">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Brain size={16} className="text-pink-500" /> Performance by Mode
                        </h3>
                        {stats?.modeStats?.length > 0 ? (
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={stats.modeStats}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#fce7f0" />
                                    <XAxis dataKey="mode" tick={{ fontSize: 11, fill: '#9ca3af' }} />
                                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} domain={[0, 100]} />
                                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #ffd6e3' }} />
                                    <Bar dataKey="avgScore" fill="url(#pinkGrad)" radius={[6, 6, 0, 0]} name="Avg Score %" />
                                    <defs>
                                        <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#FF2E63" />
                                            <stop offset="100%" stopColor="#FF0000" />
                                        </linearGradient>
                                    </defs>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                                <div className="text-center">
                                    <Brain size={32} className="mx-auto mb-2 opacity-20" />
                                    <p>No interview data yet</p>
                                    <Link to="/interview/setup" className="text-pink-500 text-xs hover:underline">Start your first interview →</Link>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Top Weaknesses */}
                    {stats?.topWeaknesses?.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                            className="glass-card pink-shadow rounded-3xl p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Target size={16} className="text-pink-500" /> Areas to Improve
                            </h3>
                            <div className="space-y-3">
                                {stats.topWeaknesses.map((w, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 truncate flex-1">{w.weakness}</span>
                                        <div className="flex items-center gap-2 ml-2">
                                            <div className="w-16 h-2 bg-pink-100 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full" style={{ width: `${Math.min(100, w.count * 20)}%`, background: 'linear-gradient(90deg, #FF2E63, #FF0000)' }} />
                                            </div>
                                            <span className="text-xs text-gray-400 w-5">{w.count}x</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Recent Interviews */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        className="glass-card pink-shadow rounded-3xl p-6">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText size={16} className="text-pink-500" /> Recent Interviews
                        </h3>
                        {stats?.recentInterviews?.length > 0 ? (
                            <div className="space-y-3">
                                {stats.recentInterviews.map((iv) => (
                                    <Link key={iv._id} to={`/results/${iv._id}`}
                                        className="flex items-center justify-between p-3 rounded-2xl hover:bg-pink-50 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center">
                                                <Brain size={14} color="white" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-gray-800">{iv.mode} Interview</div>
                                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Clock size={10} /> {new Date(iv.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-sm" style={{ color: iv.percentage >= 70 ? '#16a34a' : iv.percentage >= 50 ? '#d97706' : '#dc2626' }}>
                                                {iv.percentage}%
                                            </div>
                                            <div className="text-xs text-gray-400">{iv.totalScore} pts</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                <Brain size={32} className="mx-auto mb-2 opacity-20" />
                                <p className="text-sm">No interviews yet</p>
                                <Link to="/interview/setup" className="text-pink-500 text-xs hover:underline">Start now →</Link>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
