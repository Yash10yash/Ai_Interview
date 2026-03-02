import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';
import { Users, Brain, Trophy, TrendingUp, Trash2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value }) => (
    <motion.div whileHover={{ y: -4 }} className="glass-card pink-shadow rounded-3xl p-6">
        <div className="w-10 h-10 rounded-2xl btn-gradient flex items-center justify-center mb-3">
            <Icon size={18} color="white" />
        </div>
        <div className="text-3xl font-black text-gray-900 mb-1">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
    </motion.div>
);

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/dashboard/admin')
            .then(res => setStats(res.data))
            .catch(() => toast.error('Failed to load admin data'))
            .finally(() => setLoading(false));
    }, []);

    const deleteInterview = async (id) => {
        if (!confirm('Delete this interview?')) return;
        try {
            await api.delete(`/interview/${id}`);
            toast.success('Interview deleted');
            setStats(prev => ({
                ...prev,
                recentInterviews: prev.recentInterviews.filter(i => i._id !== id),
            }));
        } catch { toast.error('Delete failed'); }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center pt-16">
            <div className="w-10 h-10 rounded-full border-4 border-pink-200 border-t-pink-500" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
    );

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 relative z-10">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-2xl btn-gradient flex items-center justify-center">
                            <Shield size={18} color="white" />
                        </div>
                        <h1 className="text-3xl font-black text-gray-900">Admin <span className="gradient-text">Dashboard</span></h1>
                    </div>
                    <p className="text-gray-500">Platform overview and analytics.</p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard icon={Users} label="Total Users" value={stats?.totalUsers || 0} />
                    <StatCard icon={Brain} label="Total Interviews" value={stats?.totalInterviews || 0} />
                    <StatCard icon={TrendingUp} label="Platform Avg Score" value={`${stats?.avgScore || 0}%`} />
                    <StatCard icon={Trophy} label="Active Today" value={stats?.recentInterviews?.length || 0} />
                </div>

                <div className="grid lg:grid-cols-2 gap-6 mb-6">
                    {/* Recent Users */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="glass-card pink-shadow rounded-3xl p-6">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Users size={16} className="text-pink-500" /> Recent Users</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {stats?.recentUsers?.map((u, i) => (
                                <div key={u._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-pink-50 transition-colors">
                                    <div className="w-8 h-8 rounded-full btn-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                        {u.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold text-gray-800 truncate">{u.name}</div>
                                        <div className="text-xs text-gray-400 truncate">{u.email}</div>
                                    </div>
                                    <div className="text-xs text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Recent Interviews */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="glass-card pink-shadow rounded-3xl p-6">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Brain size={16} className="text-pink-500" /> Recent Interviews</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {stats?.recentInterviews?.map((iv) => (
                                <div key={iv._id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-pink-50 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-semibold text-gray-800">{iv.userId?.name || 'User'}</div>
                                        <div className="text-xs text-gray-400">{iv.mode} · {new Date(iv.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className="font-bold text-sm mr-2" style={{ color: iv.percentage >= 70 ? '#16a34a' : '#dc2626' }}>{iv.percentage}%</div>
                                    <button onClick={() => deleteInterview(iv._id)} className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
