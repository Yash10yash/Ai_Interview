import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../services/api';
import { Mic, MicOff, Volume2, Send, ChevronRight, Clock, SkipForward, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Voice Wave component
const VoiceWave = ({ active }) => (
    <div className="flex items-center gap-1 h-8">
        {[...Array(8)].map((_, i) => (
            <div key={i} className="wave-bar" style={{
                animationDelay: `${i * 0.1}s`,
                height: active ? undefined : '4px',
                opacity: active ? 1 : 0.3,
            }} />
        ))}
    </div>
);

// Timer circle
const TimerCircle = ({ remaining, total }) => {
    const pct = (remaining / total) * 100;
    const r = 36;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    const color = remaining < 30 ? '#FF0000' : remaining < 60 ? '#FF8C00' : '#FF2E63';

    return (
        <div className={`relative flex items-center justify-center ${remaining < 30 ? 'timer-warning' : ''}`}>
            <svg width="90" height="90" className="transform -rotate-90">
                <circle cx="45" cy="45" r={r} fill="none" stroke="#FFE4EC" strokeWidth="5" />
                <circle cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="5"
                    strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s linear' }} />
            </svg>
            <div className="absolute text-center">
                <div className="font-black text-lg" style={{ color }}>{Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}</div>
            </div>
        </div>
    );
};

export default function InterviewSession() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const questions = location.state?.questions || [];
    const interview = location.state?.interview;

    const [currentIdx, setCurrentIdx] = useState(0);
    const [answer, setAnswer] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120); // 2 min per question
    const [answers, setAnswers] = useState([]);
    const [finished, setFinished] = useState(false);
    const timerRef = useRef(null);
    const recognitionRef = useRef(null);
    const startTimeRef = useRef(Date.now());

    const currentQ = questions[currentIdx];
    const progress = ((currentIdx) / questions.length) * 100;

    // Text-to-Speech
    const speakQuestion = useCallback((text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate = 0.9; utt.pitch = 1; utt.volume = 1;
        utt.onstart = () => setIsSpeaking(true);
        utt.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utt);
    }, []);

    // Timer
    useEffect(() => {
        setTimeLeft(120);
        startTimeRef.current = Date.now();
        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) { clearInterval(timerRef.current); handleSubmitAnswer(true); return 0; }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [currentIdx]);

    // Auto-speak question
    useEffect(() => {
        if (currentQ) {
            setTimeout(() => speakQuestion(currentQ.text), 500);
        }
    }, [currentIdx, currentQ]);

    // Start the interview on mount
    useEffect(() => {
        api.put(`/interview/${id}/start`).catch(() => { });
    }, [id]);

    // Speech Recognition
    const toggleMic = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) { toast.error('Speech recognition not supported. Use Chrome/Edge.'); return; }

        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognitionRef.current = recognition;

        recognition.onresult = (e) => {
            const transcript = Array.from(e.results).map(r => r[0].transcript).join('');
            setAnswer(transcript);
        };
        recognition.onerror = () => { setIsListening(false); toast.error('Mic error. Check permissions.'); };
        recognition.onend = () => setIsListening(false);

        recognition.start();
        setIsListening(true);
    };

    const handleSubmitAnswer = useCallback(async (autoSubmit = false) => {
        clearInterval(timerRef.current);
        if (recognitionRef.current) recognitionRef.current.stop();
        setIsListening(false);
        window.speechSynthesis?.cancel();

        const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);
        const finalAnswer = autoSubmit && !answer.trim() ? '[No answer provided]' : answer.trim();

        setSubmitting(true);
        try {
            const { data: evaluation } = await api.post('/ai/evaluate', {
                question: currentQ?.text,
                answer: finalAnswer,
                category: currentQ?.category,
                difficulty: currentQ?.difficulty,
            });

            await api.post(`/interview/${id}/answer`, {
                questionText: currentQ?.text,
                questionCategory: currentQ?.category,
                questionDifficulty: currentQ?.difficulty,
                userAnswer: finalAnswer,
                evaluation,
                timeTaken,
            });

            setAnswers(prev => [...prev, { ...evaluation, questionText: currentQ?.text }]);

            if (currentIdx < questions.length - 1) {
                setCurrentIdx(i => i + 1);
                setAnswer('');
            } else {
                // Finish interview
                const { data: finishedInterview } = await api.put(`/interview/${id}/finish`, { duration: timeTaken * questions.length });
                toast.success('Interview completed! 🎉');
                navigate(`/results/${id}`);
            }
        } catch (err) {
            toast.error('Failed to submit answer');
        } finally {
            setSubmitting(false);
        }
    }, [answer, currentIdx, currentQ, id, questions, navigate]);

    if (!questions.length) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-16">
                <div className="text-center">
                    <AlertCircle size={48} className="mx-auto mb-4 text-pink-400" />
                    <p className="text-gray-600">No questions loaded. Please start from interview setup.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-10 px-4 relative z-10">
            <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <span>Question {currentIdx + 1} of {questions.length}</span>
                        <span className="capitalize px-2 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-pink-600">
                            {currentQ?.difficulty} · {currentQ?.category}
                        </span>
                    </div>
                    <div className="h-2 bg-pink-50 rounded-full overflow-hidden">
                        <motion.div className="h-full rounded-full" style={{ background: 'linear-gradient(90deg, #FF2E63, #FF0000)' }}
                            animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
                    </div>
                </div>

                {/* Main card */}
                <div className="glass-card pink-shadow rounded-3xl p-8 mb-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <div className="text-xs font-bold uppercase tracking-wider text-pink-400 mb-2">Question {currentIdx + 1}</div>
                            <AnimatePresence mode="wait">
                                <motion.h2 key={currentIdx} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }} className="text-xl font-bold text-gray-900 leading-relaxed">
                                    {currentQ?.text}
                                </motion.h2>
                            </AnimatePresence>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                            <TimerCircle remaining={timeLeft} total={120} />
                        </div>
                    </div>

                    {/* Voice controls */}
                    <div className="flex items-center gap-4 mb-6">
                        <button onClick={() => speakQuestion(currentQ?.text)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-pink-50 text-pink-600 text-xs font-medium hover:bg-pink-100 transition-colors">
                            <Volume2 size={14} /> {isSpeaking ? 'Speaking...' : 'Read Question'}
                        </button>
                        <VoiceWave active={isSpeaking || isListening} />
                    </div>

                    {/* Answer textarea */}
                    <textarea
                        value={answer}
                        onChange={e => setAnswer(e.target.value)}
                        placeholder="Type your answer here, or use the microphone button below..."
                        rows={5}
                        className="input-field resize-none mb-4"
                    />

                    {/* Action buttons */}
                    <div className="flex items-center gap-3">
                        <motion.button
                            onClick={toggleMic}
                            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            className={`relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isListening
                                    ? 'bg-red-500 text-white glow-pulse'
                                    : 'btn-gradient text-white'
                                }`}>
                            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                            {isListening && (
                                <span className="absolute inset-0 rounded-2xl animate-ping bg-red-400 opacity-30" />
                            )}
                        </motion.button>
                        <span className="text-xs text-gray-400">{isListening ? 'Listening... click to stop' : 'Click mic to speak'}</span>
                        <div className="flex-1" />
                        <button onClick={() => handleSubmitAnswer(false)} disabled={submitting || !answer.trim()}
                            className="btn-gradient px-6 py-3 rounded-2xl text-white font-bold flex items-center gap-2 disabled:opacity-50">
                            {submitting ? (
                                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white" style={{ animation: 'spin 1s linear infinite' }} />
                            ) : currentIdx < questions.length - 1 ? (
                                <><Send size={16} /> Submit & Next</>
                            ) : (
                                <><Send size={16} /> Finish Interview</>
                            )}
                        </button>
                        {answer.trim() === '' && currentIdx < questions.length - 1 && (
                            <button onClick={() => handleSubmitAnswer(true)} className="px-4 py-3 rounded-2xl border border-pink-100 text-gray-500 text-sm hover:bg-pink-50 transition-colors flex items-center gap-1">
                                <SkipForward size={14} /> Skip
                            </button>
                        )}
                    </div>
                </div>

                {/* Navigation dots */}
                <div className="flex justify-center gap-2">
                    {questions.map((_, i) => (
                        <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === currentIdx ? 'w-6 bg-pink-500' : i < currentIdx ? 'w-2 bg-pink-300' : 'w-2 bg-pink-100'
                            }`} />
                    ))}
                </div>
            </div>
        </div>
    );
}
