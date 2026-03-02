import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle, XCircle, Brain, Download, TrendingUp, Star, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';

const ScoreBadge = ({ score, max = 10 }) => {
    const pct = (score / max) * 100;
    const color = pct >= 70 ? '#16a34a' : pct >= 50 ? '#d97706' : '#dc2626';
    return (
        <div className="flex items-center gap-2">
            <div className="relative w-12 h-12">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#fce7f0" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15" fill="none" stroke={color} strokeWidth="3"
                        strokeDasharray={`${pct * 0.942} 100`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color }}>{score}</div>
            </div>
        </div>
    );
};

function AnswerCard({ answer, index }) {
    const [expanded, setExpanded] = useState(false);
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
            className="glass-card rounded-3xl overflow-hidden border border-pink-100">
            <button onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-4 p-5 text-left hover:bg-pink-50 transition-colors">
                <ScoreBadge score={answer.score} />
                <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-0.5">Q{index + 1} · {answer.questionCategory} · {answer.questionDifficulty}</div>
                    <div className="text-sm font-semibold text-gray-800 line-clamp-1">{answer.questionText}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-400">{answer.score}/{answer.maxScore}</span>
                    {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
            </button>
            {expanded && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-5 pb-5 border-t border-pink-50">
                    {answer.userAnswer && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-2xl text-sm text-gray-600 mb-4">
                            <span className="font-semibold text-gray-400 text-xs block mb-1">YOUR ANSWER:</span>
                            {answer.userAnswer}
                        </div>
                    )}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        {answer.strengths?.length > 0 && (
                            <div>
                                <div className="text-xs font-bold text-green-600 mb-2 flex items-center gap-1"><CheckCircle size={11} /> Strengths</div>
                                {answer.strengths.map((s, i) => <div key={i} className="text-xs text-gray-600 mb-1 pl-3">• {s}</div>)}
                            </div>
                        )}
                        {answer.weaknesses?.length > 0 && (
                            <div>
                                <div className="text-xs font-bold text-red-500 mb-2 flex items-center gap-1"><XCircle size={11} /> Weaknesses</div>
                                {answer.weaknesses.map((w, i) => <div key={i} className="text-xs text-gray-600 mb-1 pl-3">• {w}</div>)}
                            </div>
                        )}
                    </div>
                    {answer.correctExplanation && (
                        <div className="p-3 bg-pink-50 rounded-2xl text-xs text-gray-600">
                            <span className="font-semibold text-pink-600 block mb-1">💡 Ideal Answer:</span>
                            {answer.correctExplanation}
                        </div>
                    )}
                    <div className="flex gap-4 mt-3 text-xs text-gray-500">
                        <span>Confidence: <strong>{answer.confidenceScore}/10</strong></span>
                        <span>Communication: <strong>{answer.communicationScore}/10</strong></span>
                    </div>
                    {answer.professionalToneFeedback && (
                        <div className="mt-2 text-xs text-gray-400 italic">{answer.professionalToneFeedback}</div>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
}

export default function Results() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        api.get(`/interview/${id}`)
            .then(res => setData(res.data))
            .catch(() => toast.error('Failed to load results'))
            .finally(() => setLoading(false));
    }, [id]);

    const downloadPDF = async () => {
        setDownloading(true);
        try {
            const response = await api.get(`/report/${id}/pdf`, { responseType: 'blob' });
            const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
            const a = document.createElement('a'); a.href = url;
            a.download = `InterviewReport-${id}.pdf`; a.click();
            URL.revokeObjectURL(url);
            toast.success('PDF downloaded!');
        } catch { toast.error('Failed to generate PDF'); }
        finally { setDownloading(false); }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><div className="w-10 h-10 rounded-full border-4 border-pink-200 border-t-pink-500" style={{ animation: 'spin 1s linear infinite' }} /></div>;
    if (!data) return <div className="min-h-screen flex items-center justify-center pt-16"><p className="text-gray-500">Results not found.</p></div>;

    const pct = data.percentage || 0;
    const grade = pct >= 85 ? 'Excellent' : pct >= 70 ? 'Good' : pct >= 50 ? 'Average' : 'Needs Improvement';
    const gradeColor = pct >= 85 ? '#16a34a' : pct >= 70 ? '#2563eb' : pct >= 50 ? '#d97706' : '#dc2626';

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
                {/* Score Header */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    className="glass-card pink-shadow-lg rounded-3xl p-8 mb-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 border border-pink-100 text-pink-600 text-sm font-medium mb-4">
                        Interview Completed! 🎉
                    </div>
                    <div className="text-7xl font-black gradient-text mb-2">{pct}%</div>
                    <div className="text-2xl font-bold mb-1" style={{ color: gradeColor }}>{grade}</div>
                    <div className="text-gray-500 text-sm mb-6">{data.mode} Interview · {data.answers?.length} Questions · {data.totalScore}/{data.maxPossibleScore} points</div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {[['Total Score', `${data.totalScore}/${data.maxPossibleScore}`], ['Questions', data.answers?.length], ['Mode', data.mode]].map(([l, v]) => (
                            <div key={l} className="bg-pink-50 rounded-2xl p-3">
                                <div className="font-bold text-gray-900">{v}</div>
                                <div className="text-xs text-gray-500">{l}</div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        <button onClick={downloadPDF} disabled={downloading}
                            className="btn-gradient px-6 py-3 rounded-2xl text-white font-bold flex items-center gap-2">
                            {downloading ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={16} />}
                            Download PDF Report
                        </button>
                        <button onClick={() => navigate(`/improvement/${id}`)}
                            className="px-6 py-3 rounded-2xl border border-pink-200 text-pink-600 font-bold flex items-center gap-2 hover:bg-pink-50 transition-colors">
                            <TrendingUp size={16} /> Improvement Plan
                        </button>
                        <Link to="/interview/setup"
                            className="px-6 py-3 rounded-2xl border border-gray-200 text-gray-600 font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors">
                            <Brain size={16} /> New Interview
                        </Link>
                    </div>
                </motion.div>

                {/* Answers breakdown */}
                <div className="mb-4">
                    <h2 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-4">
                        <Star size={18} className="text-pink-500" /> Question Breakdown
                        <span className="text-sm font-normal text-gray-400">(click to expand)</span>
                    </h2>
                    <div className="space-y-3">
                        {data.answers?.map((ans, i) => <AnswerCard key={i} answer={ans} index={i} />)}
                    </div>
                </div>
            </div>
        </div>
    );
}
