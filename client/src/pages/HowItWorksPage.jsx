import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Settings, Brain, Mic, Star, FileDown, ArrowRight, CheckCircle } from 'lucide-react';

const steps = [
    {
        num: '01', icon: Upload, title: 'Upload Your Resume',
        desc: 'Drag and drop your PDF resume. Our AI extracts your skills, experience, and tech stack in seconds.',
        detail: ['PDF parsing with skill extraction', 'Automatic keyword identification', 'Stored securely for future sessions'],
        color: '#7C3AED',
    },
    {
        num: '02', icon: Settings, title: 'Choose Your Mode',
        desc: 'Pick from DSA, HR, Technical, or fully custom interview with your own difficulty and question count.',
        detail: ['4 interview modes available', 'Adjust difficulty: Easy → Hard', 'Choose 5, 10, 15 or 20 questions'],
        color: '#059669',
    },
    {
        num: '03', icon: Brain, title: 'AI Asks Your Questions',
        desc: 'GPT-4 generates resume-aware questions and reads them aloud in a realistic interviewer voice.',
        detail: ['Resume-personalized questions', 'Text-to-speech question delivery', 'Progressive difficulty ramp'],
        color: '#FF2E63',
    },
    {
        num: '04', icon: Mic, title: 'Speak or Type Your Answer',
        desc: 'Answer by speaking (Web Speech API) or typing. A live countdown timer keeps you focused.',
        detail: ['Microphone speech recognition', 'Real-time transcription', '2-minute timer per question'],
        color: '#D97706',
    },
    {
        num: '05', icon: Star, title: 'Receive Smart Feedback',
        desc: 'Every answer gets an AI score 0-10, strength/weakness analysis, and a model answer explanation.',
        detail: ['Score, confidence & communication', 'Strength & weakness bullets', 'Ideal answer explanation'],
        color: '#0284C7',
    },
    {
        num: '06', icon: FileDown, title: 'Download Your AI Report',
        desc: 'Get a branded PDF with full score breakdown, weakness analysis, and a personalized 7-day plan.',
        detail: ['Branded PDF download', 'Full per-question breakdown', '7-day AI improvement plan'],
        color: '#EC4899',
    },
];

function StepCard({ step, index }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    const isEven = index % 2 === 1;

    return (
        <motion.div ref={ref}
            initial={{ opacity: 0, x: isEven ? 60 : -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className={`flex flex-col md:flex-row items-center gap-8 ${isEven ? 'md:flex-row-reverse' : ''}`}>
            {/* Visual side */}
            <div className="flex-1 flex justify-center">
                <div className="relative">
                    <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-[2.5rem] glass-card pink-shadow-lg flex flex-col items-center justify-center p-8 relative overflow-hidden">
                        {/* Big number watermark */}
                        <div className="step-number">{step.num}</div>
                        <div className="w-16 h-16 rounded-2xl btn-gradient flex items-center justify-center mb-3">
                            <step.icon size={28} color="white" />
                        </div>
                        <div className="text-sm font-bold text-gray-700 text-center">{step.title}</div>
                        {/* Glow ring */}
                        <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
                            style={{ boxShadow: `inset 0 0 60px ${step.color}15` }} />
                    </div>
                    {/* Floating dot */}
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: index * 0.4 }}
                        className="absolute -top-3 -right-3 w-6 h-6 rounded-full btn-gradient glow-pulse" />
                </div>
            </div>

            {/* Text side */}
            <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4"
                    style={{ background: `${step.color}12`, color: step.color }}>
                    Step {step.num}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 text-base mb-5 leading-relaxed">{step.desc}</p>
                <div className="space-y-2">
                    {step.detail.map(d => (
                        <div key={d} className="flex items-center gap-2.5 text-sm text-gray-600">
                            <CheckCircle size={14} style={{ color: step.color }} className="flex-shrink-0" />
                            {d}
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Bg orbs */}
            <div className="orb w-[600px] h-[600px] bg-purple-200" style={{ top: '-15%', left: '-10%', opacity: 0.12 }} />
            <div className="orb w-[400px] h-[400px] bg-pink-200" style={{ bottom: '0%', right: '-5%', opacity: 0.12 }} />

            {/* Hero */}
            <div className="section-hero relative z-10 text-center px-4">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <div className="stat-pill mx-auto mb-6">🚀 6 Simple Steps</div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-5 leading-tight">
                        From Resume to<br /><span className="gradient-text">Dream Offer</span>
                    </h1>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10">
                        A guided, end-to-end workflow that takes you from raw PDF to a professional interview report in minutes.
                    </p>
                    <Link to="/signup" className="btn-gradient px-8 py-3.5 rounded-2xl text-white font-bold inline-flex items-center gap-2 text-sm">
                        Start Your Journey <ArrowRight size={16} />
                    </Link>
                </motion.div>
            </div>

            {/* Steps */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 space-y-24">
                {steps.map((step, i) => <StepCard key={step.num} step={step} index={i} />)}
            </div>
        </div>
    );
}
