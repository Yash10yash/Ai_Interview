import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import { Brain, Code2, Users, Settings, ChevronRight, Sliders } from 'lucide-react';
import toast from 'react-hot-toast';

const modes = [
    { id: 'DSA', icon: Code2, label: 'DSA Interview', desc: 'Algorithms, data structures, complexity analysis. Coding-focused questions.', color: '#4F46E5' },
    { id: 'HR', icon: Users, label: 'HR Interview', desc: 'Behavioral questions, confidence scoring, situational scenarios.', color: '#059669' },
    { id: 'Technical', icon: Settings, label: 'Technical Interview', desc: 'Resume-based tech stack questions, system design, architecture.', color: '#D97706' },
    { id: 'Custom', icon: Sliders, label: 'Custom Interview', desc: 'Choose difficulty, category, and number of questions.', color: '#7C3AED' },
];

const difficulties = ['easy', 'medium', 'hard', 'mixed'];
const questionCounts = [5, 10, 15, 20];

export default function InterviewSetup() {
    const [selectedMode, setSelectedMode] = useState('HR');
    const [difficulty, setDifficulty] = useState('mixed');
    const [questionCount, setQuestionCount] = useState(10);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const resumeId = location.state?.resumeId;

    const handleStart = async () => {
        setLoading(true);
        try {
            const { data: interview } = await api.post('/interview/create', {
                mode: selectedMode, difficulty, totalQuestions: questionCount, resumeId,
            });
            const { data: qData } = await api.post('/ai/generate-questions', {
                mode: selectedMode, difficulty, count: questionCount, resumeId,
            });
            navigate(`/interview/${interview._id}`, { state: { questions: qData.questions, interview } });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to start interview');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-10 px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-black text-gray-900 mb-2">Choose Your <span className="gradient-text">Interview Mode</span></h1>
                        <p className="text-gray-500">Select the type of interview you want to practice.</p>
                        {resumeId && (
                            <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-pink-50 border border-pink-100 rounded-full text-sm text-pink-600">
                                <Brain size={14} /> Resume loaded — AI will personalize your questions
                            </div>
                        )}
                    </div>

                    {/* Mode Selection */}
                    <div className="grid md:grid-cols-2 gap-4 mb-8">
                        {modes.map((mode) => (
                            <motion.button key={mode.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedMode(mode.id)}
                                className={`text-left p-6 rounded-3xl border-2 transition-all duration-200 ${selectedMode === mode.id
                                        ? 'border-pink-400 bg-pink-50 pink-shadow'
                                        : 'border-pink-100 glass-card hover:border-pink-200'
                                    }`}>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: `${mode.color}15` }}>
                                        <mode.icon size={18} style={{ color: mode.color }} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                                            {mode.label}
                                            {selectedMode === mode.id && <span className="w-2 h-2 rounded-full bg-pink-500 inline-block" />}
                                        </div>
                                        <div className="text-sm text-gray-500">{mode.desc}</div>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Settings */}
                    <div className="glass-card pink-shadow rounded-3xl p-6 mb-6">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Sliders size={16} className="text-pink-500" /> Interview Settings
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                                <div className="flex gap-2">
                                    {difficulties.map(d => (
                                        <button key={d} onClick={() => setDifficulty(d)}
                                            className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${difficulty === d ? 'btn-gradient text-white' : 'border border-pink-100 text-gray-600 hover:bg-pink-50'
                                                }`}>
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
                                <div className="flex gap-2">
                                    {questionCounts.map(n => (
                                        <button key={n} onClick={() => setQuestionCount(n)}
                                            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${questionCount === n ? 'btn-gradient text-white' : 'border border-pink-100 text-gray-600 hover:bg-pink-50'
                                                }`}>
                                            {n}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="flex items-center justify-between glass-card rounded-2xl p-4 mb-6 border border-pink-100">
                        <div className="text-sm text-gray-600">
                            <span className="font-bold text-gray-900">{questionCount} questions</span> · {selectedMode} mode · {difficulty} difficulty
                        </div>
                        <div className="text-xs text-gray-400">~{questionCount * 2} minutes</div>
                    </div>

                    <button onClick={handleStart} disabled={loading}
                        className="btn-gradient w-full py-4 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-2">
                        {loading ? (
                            <>
                                <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white" style={{ animation: 'spin 1s linear infinite' }} />
                                Preparing Interview...
                            </>
                        ) : (<><Brain size={20} /> Start Interview <ChevronRight size={20} /></>)}
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
