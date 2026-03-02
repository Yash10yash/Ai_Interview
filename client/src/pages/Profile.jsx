import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { User, Mail, Calendar, Brain, Trophy, FileText, Play } from 'lucide-react';

export default function Profile() {
    const { user } = useAuth();
    const [resume, setResume] = useState(null);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        api.get('/resume/my').then(r => setResume(r.data)).catch(() => { });
        api.get('/dashboard/user').then(r => setStats(r.data)).catch(() => { });
    }, []);

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 relative z-10">
            <div className="max-w-3xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Profile Header */}
                    <div className="glass-card pink-shadow-lg rounded-3xl p-8 mb-6 text-center">
                        <div className="w-20 h-20 rounded-full btn-gradient flex items-center justify-center text-white text-3xl font-black mx-auto mb-4">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 mb-1">{user?.name}</h1>
                        <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-4">
                            <Mail size={14} /> {user?.email}
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-pink-100 text-pink-700'}`}>
                            {user?.role === 'admin' ? '👑 Admin' : '🎯 Interview Candidate'}
                        </span>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {[
                            { icon: Brain, label: 'Total Interviews', value: stats?.totalInterviews || 0 },
                            { icon: Trophy, label: 'Avg Score', value: `${stats?.avgScore || 0}%` },
                            { icon: FileText, label: 'Resume', value: resume ? 'Uploaded' : 'None' },
                        ].map(card => (
                            <div key={card.label} className="glass-card pink-shadow rounded-3xl p-4 text-center card-hover">
                                <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center mx-auto mb-2">
                                    <card.icon size={16} color="white" />
                                </div>
                                <div className="font-black text-gray-900">{card.value}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{card.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Resume info */}
                    <div className="glass-card pink-shadow rounded-3xl p-6 mb-6">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText size={16} className="text-pink-500" /> Resume
                        </h3>
                        {resume ? (
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center">
                                        <FileText size={16} color="white" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-gray-800 text-sm">{resume.originalName}</div>
                                        <div className="text-xs text-gray-400">Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                {resume.skills?.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {resume.skills.map(s => (
                                            <span key={s} className="px-3 py-1 bg-pink-50 border border-pink-100 rounded-full text-xs font-medium text-pink-600 capitalize">{s}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-4">
                                <p className="text-gray-400 text-sm mb-3">No resume uploaded yet</p>
                                <Link to="/resume" className="btn-gradient px-5 py-2 rounded-2xl text-white text-sm font-bold inline-flex items-center gap-2">
                                    <FileText size={14} /> Upload Resume
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Quick actions */}
                    <div className="flex flex-wrap gap-3">
                        <Link to="/interview/setup" className="btn-gradient px-6 py-3 rounded-2xl text-white font-bold flex items-center gap-2">
                            <Play size={14} /> Start Interview
                        </Link>
                        <Link to="/dashboard" className="px-6 py-3 rounded-2xl border border-pink-100 text-gray-600 font-bold flex items-center gap-2 hover:bg-pink-50 transition-colors">
                            <Brain size={14} /> Dashboard
                        </Link>
                        <Link to="/leaderboard" className="px-6 py-3 rounded-2xl border border-pink-100 text-gray-600 font-bold flex items-center gap-2 hover:bg-pink-50 transition-colors">
                            <Trophy size={14} /> Leaderboard
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
