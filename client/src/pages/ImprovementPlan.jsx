import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Brain, BookOpen, Dumbbell, Calendar, ChevronRight, Lightbulb } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ImprovementPlan() {
    const { id } = useParams();
    const [plan, setPlan] = useState(null);
    const [interview, setInterview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: iv } = await api.get(`/interview/${id}`);
                setInterview(iv);
                const allWeaknesses = iv.answers?.flatMap(a => a.weaknesses || []) || [];
                const avgScore = iv.percentage;
                const { data: planData } = await api.post('/ai/improvement-plan', {
                    weaknesses: [...new Set(allWeaknesses)].slice(0, 5),
                    mode: iv.mode,
                    score: avgScore,
                });
                setPlan(planData);
            } catch { toast.error('Failed to load improvement plan'); }
            finally { setLoading(false); }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><div className="w-10 h-10 rounded-full border-4 border-pink-200 border-t-pink-500" style={{ animation: 'spin 1s linear infinite' }} /></div>;

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-2xl btn-gradient flex items-center justify-center">
                            <Brain size={22} color="white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">AI <span className="gradient-text">Improvement Plan</span></h1>
                            <p className="text-gray-500 text-sm">Personalized 7-day study guide</p>
                        </div>
                    </div>
                </motion.div>

                {plan && (
                    <>
                        {/* Summary */}
                        {plan.summary && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                className="glass-card pink-shadow rounded-3xl p-6 mb-6 border-l-4 border-pink-400">
                                <div className="flex items-start gap-3">
                                    <Lightbulb size={20} className="text-pink-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-gray-700 text-sm leading-relaxed">{plan.summary}</p>
                                </div>
                            </motion.div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            {/* Exercises */}
                            {plan.exercises?.length > 0 && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                    className="glass-card pink-shadow rounded-3xl p-6">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Dumbbell size={16} className="text-pink-500" /> Daily Exercises
                                    </h3>
                                    {plan.exercises.map((ex, i) => (
                                        <div key={i} className="flex items-start gap-3 mb-3">
                                            <div className="w-6 h-6 rounded-full btn-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-white text-xs font-bold">{i + 1}</span>
                                            </div>
                                            <span className="text-sm text-gray-600">{ex}</span>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {/* Resources */}
                            {plan.resources?.length > 0 && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                    className="glass-card pink-shadow rounded-3xl p-6">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <BookOpen size={16} className="text-pink-500" /> Learning Resources
                                    </h3>
                                    {plan.resources.map((r, i) => (
                                        <div key={i} className="flex items-center justify-between py-2 border-b border-pink-50 last:border-0">
                                            <span className="text-sm text-gray-700">{r}</span>
                                            <ChevronRight size={14} className="text-pink-400" />
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </div>

                        {/* 7-Day Plan */}
                        {plan.weeklyPlan?.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                                className="glass-card pink-shadow rounded-3xl p-6 mb-6">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Calendar size={16} className="text-pink-500" /> 7-Day Study Plan
                                </h3>
                                <div className="space-y-4">
                                    {plan.weeklyPlan.map((day, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 rounded-2xl btn-gradient flex items-center justify-center text-white text-sm font-bold">
                                                    {day.day}
                                                </div>
                                            </div>
                                            <div className="flex-1 pb-4 border-b border-pink-50 last:border-0">
                                                <div className="font-semibold text-gray-900 text-sm mb-1">{day.focus}</div>
                                                {day.exercises?.map((ex, j) => (
                                                    <div key={j} className="text-xs text-gray-500 mb-0.5">• {ex}</div>
                                                ))}
                                                {day.resources?.map((r, j) => (
                                                    <span key={j} className="inline-block mt-1 mr-1 px-2 py-0.5 bg-pink-50 text-pink-600 text-xs rounded-full">{r}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        <div className="flex justify-center">
                            <Link to="/dashboard" className="btn-gradient px-8 py-3 rounded-2xl text-white font-bold flex items-center gap-2">
                                Back to Dashboard <ChevronRight size={16} />
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
