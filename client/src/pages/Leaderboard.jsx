import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const tabs = [
    { id: 'global', label: 'Global', endpoint: '/leaderboard/global' },
    { id: 'dsa', label: 'DSA', endpoint: '/leaderboard/dsa' },
    { id: 'hr', label: 'HR', endpoint: '/leaderboard/hr' },
    { id: 'weekly', label: 'Weekly', endpoint: '/leaderboard/weekly' },
];

const RankBadge = ({ rank }) => {
    if (rank === 1) return <div className="w-8 h-8 rounded-xl rank-gold flex items-center justify-center"><Crown size={14} color="white" /></div>;
    if (rank === 2) return <div className="w-8 h-8 rounded-xl rank-silver flex items-center justify-center"><Medal size={14} color="white" /></div>;
    if (rank === 3) return <div className="w-8 h-8 rounded-xl rank-bronze flex items-center justify-center"><Trophy size={14} color="white" /></div>;
    return <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 text-sm font-bold">{rank}</div>;
};

export default function Leaderboard() {
    const [activeTab, setActiveTab] = useState('global');
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const fetchLeaderboard = async (tab) => {
        setLoading(true);
        const found = tabs.find(t => t.id === tab);
        try {
            const { data: res } = await api.get(found.endpoint);
            setData(res);
        } catch { toast.error('Failed to load leaderboard'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchLeaderboard(activeTab); }, [activeTab]);

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 relative z-10">
            <div className="max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-2xl btn-gradient flex items-center justify-center">
                            <Trophy size={22} color="white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900"><span className="gradient-text">Leaderboard</span></h1>
                            <p className="text-gray-500 text-sm">Top performers on InterviewAI</p>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-pink-50 p-1 rounded-2xl">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${activeTab === tab.id ? 'bg-white pink-shadow text-pink-600' : 'text-gray-500 hover:text-gray-700'
                                }`}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="w-8 h-8 rounded-full border-4 border-pink-200 border-t-pink-500" style={{ animation: 'spin 1s linear infinite' }} />
                        </div>
                    ) : data.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <Trophy size={48} className="mx-auto mb-3 opacity-20" />
                            <p>No data yet for this category.</p>
                        </div>
                    ) : data.map((entry, i) => {
                        const isMe = entry.email === user?.email;
                        return (
                            <motion.div key={entry.userId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className={`flex items-center gap-4 p-4 rounded-2xl transition-all card-hover ${isMe ? 'border-2 border-pink-300 bg-pink-50' : 'glass-card border border-pink-50'
                                    }`}>
                                <RankBadge rank={i + 1} />
                                <div className="w-9 h-9 rounded-full btn-gradient flex items-center justify-center text-white font-bold flex-shrink-0">
                                    {entry.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                        {entry.name}
                                        {isMe && <span className="text-xs px-2 py-0.5 rounded-full bg-pink-100 text-pink-600">You</span>}
                                    </div>
                                    <div className="text-xs text-gray-400">{entry.totalInterviews} interviews</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-black gradient-text text-lg">{entry.avgScore}%</div>
                                    <div className="text-xs text-gray-400">Best: {entry.bestScore}%</div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
