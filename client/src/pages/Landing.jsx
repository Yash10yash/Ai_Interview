import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
    Brain, Play, Upload, CheckCircle, ArrowRight, Zap, Code2, Users, Mic,
    BarChart3, Trophy, Star, FileDown, Shield, Sliders, FileText,
    TrendingUp, Target, Volume2, MessageSquare, Mail, Phone, MapPin,
    Twitter, Linkedin, Github, Quote
} from 'lucide-react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';

/* ─── Reveal wrapper ─────────────────────────── */
function Reveal({ children, delay = 0, direction = 'up', className = '' }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-64px' });
    const variants = {
        hidden: {
            opacity: 0,
            y: direction === 'up' ? 30 : 0,
            x: direction === 'left' ? -30 : direction === 'right' ? 30 : 0,
        },
        visible: { opacity: 1, y: 0, x: 0 },
    };
    return (
        <motion.div ref={ref} className={className}
            variants={variants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            transition={{ duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] }}>
            {children}
        </motion.div>
    );
}

/* ─── Section header helper ──────────────────── */
function SectionHeader({ tag, title, sub, center = true }) {
    return (
        <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 56 }}>
            <span className="section-tag">{tag}</span>
            <h2 className="section-heading">{title}</h2>
            {sub && (
                <p className="section-sub" style={{ margin: center ? '0 auto' : 0 }}>{sub}</p>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════════
   1. HERO SECTION
══════════════════════════════════════════════ */
function HeroSection() {
    return (
        <section
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                paddingTop: 'calc(var(--nav-height) + 40px)',
                paddingBottom: 80,
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(160deg, #ffffff 60%, #fff8fa 100%)',
            }}>
            {/* Subtle decorative glows — very low opacity, pushed to outer edges */}
            <div className="orb" style={{ width: 500, height: 500, background: '#FF2E63', top: '-20%', right: '-18%', opacity: 0.07 }} />
            <div className="orb" style={{ width: 350, height: 350, background: '#FF2E63', bottom: '-15%', left: '-12%', opacity: 0.05 }} />

            <div className="container" style={{ position: 'relative', zIndex: 1 }}>
                <div className="grid-2" style={{ gap: 64 }}>

                    {/* Left */}
                    <Reveal direction="left">
                        <div>
                            <div className="chip" style={{ marginBottom: 24 }}>
                                <Zap size={12} /> Powered by GPT-4 AI
                            </div>

                            <h1 className="display-1" style={{ marginBottom: 24, color: '#111827' }}>
                                Master Your<br />
                                <span className="gradient-text">Interviews</span><br />
                                with AI
                            </h1>

                            <p className="body-lg text-muted" style={{ marginBottom: 36, maxWidth: 480 }}>
                                Resume-aware AI generates your questions. Real-time voice evaluation. Smart feedback that actually gets you hired.
                            </p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 36 }}>
                                <Link to="/interview/setup" className="btn btn-primary btn-lg">
                                    <Play size={18} fill="white" strokeWidth={0} /> Start Interview
                                </Link>
                                <Link to="/resume" className="btn btn-outline btn-lg">
                                    <Upload size={18} /> Upload Resume
                                </Link>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                                {['Free to start', 'No credit card', '60-second setup'].map(t => (
                                    <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.875rem', color: '#6b7280' }}>
                                        <CheckCircle size={14} color="var(--pink)" /> {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Reveal>

                    {/* Right — AI chat mockup */}
                    <Reveal direction="right" delay={0.15}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
                                <div className="hero-card">
                                    {/* Header */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div className="icon-box icon-box-sm">
                                                <Brain size={18} color="white" />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: '#111827' }}>AI Interviewer</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: '#16a34a' }}>
                                                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#16a34a', display: 'inline-block', animation: 'fadeIn 1s ease-out infinite alternate' }} />
                                                    Live Session
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ fontFamily: 'monospace', fontSize: '0.8125rem', background: '#fff0f4', color: 'var(--pink)', padding: '4px 10px', borderRadius: 8, fontWeight: 700 }}>01:24</div>
                                    </div>

                                    {/* Chat bubbles */}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                                        <div style={{ background: '#fff0f4', borderRadius: '16px 16px 16px 4px', padding: '14px 16px', border: '1px solid rgba(255,46,99,0.12)' }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pink)', marginBottom: 4 }}>🤖 InterviewAI</div>
                                            <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.55 }}>
                                                Describe a challenging scaling problem from your last project and how you resolved it.
                                            </p>
                                        </div>
                                        <div style={{ background: '#f9fafb', borderRadius: '16px 16px 4px 16px', padding: '14px 16px', marginLeft: 16, border: '1px solid #e5e7eb' }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6b7280', marginBottom: 4 }}>👤 You</div>
                                            <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.55 }}>
                                                At my startup we handled 50K concurrent WebSocket connections using Redis pub/sub and horizontal scaling…
                                            </p>
                                        </div>
                                    </div>

                                    {/* Voice wave row */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: '10px 14px', background: '#fff8fa', borderRadius: 12 }}>
                                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, animation: 'pulseGlow 2s ease-in-out infinite' }}>
                                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, flex: 1 }}>
                                            {[...Array(12)].map((_, i) => (
                                                <div key={i} className="wave-bar" style={{ flex: 1, height: '20px', animationDelay: `${i * 0.07}s` }} />
                                            ))}
                                        </div>
                                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Listening…</span>
                                    </div>

                                    {/* Score chips */}
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                                        {[['Score', '9.1/10', 'var(--pink)'], ['Confidence', '91%', '#7C3AED'], ['Comm.', '9/10', '#059669']].map(([l, v, c]) => (
                                            <div key={l} style={{ textAlign: 'center', padding: '10px 6px', borderRadius: 12, background: `color-mix(in srgb, ${c} 8%, white)` }}>
                                                <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: c }}>{v}</div>
                                                <div style={{ fontSize: '0.7rem', color: '#9ca3af', marginTop: 2 }}>{l}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════════
   2. STATS BAR
══════════════════════════════════════════════ */
function StatsBar() {
    const stats = [
        { value: '50,000+', label: 'Interviews Completed' },
        { value: '94%', label: 'User Satisfaction' },
        { value: '4 Modes', label: 'Interview Types' },
        { value: '3.2×', label: 'Faster Improvement' },
    ];
    return (
        <section className="bg-pale" style={{ padding: '48px 0' }}>
            <div className="container">
                <div className="grid-4">
                    {stats.map((s, i) => (
                        <Reveal key={s.label} delay={i * 0.08}>
                            <div style={{ textAlign: 'center', padding: '20px 16px' }}>
                                <div className="gradient-text" style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'Poppins', marginBottom: 4 }}>{s.value}</div>
                                <div className="text-muted body-sm">{s.label}</div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════════
   3. FEATURES SECTION (CSS Grid 3→2→1)
══════════════════════════════════════════════ */
const features = [
    { icon: FileText, title: 'Resume AI Analysis', desc: 'AI reads your PDF and crafts hyper-personalized questions targeting your exact stack.', tag: 'Smart', tagColor: '#7C3AED' },
    { icon: Code2, title: 'DSA Interview Mode', desc: 'Arrays, trees, graphs, DP, complexity analysis with follow-up drill questions.', tag: 'Coding', tagColor: '#059669' },
    { icon: Users, title: 'HR Interview Mode', desc: 'Behavioral questions, confidence scoring, STAR method analysis and tone feedback.', tag: 'Soft Skills', tagColor: '#D97706' },
    { icon: Brain, title: 'AI Voice Interviewer', desc: 'Realistic text-to-speech questions — exactly like a real phone screen experience.', tag: 'Voice', tagColor: 'var(--pink)' },
    { icon: Mic, title: 'Speech-to-Text', desc: 'Speak your answers naturally. Browser transcribes in real time, no extra setup.', tag: 'Voice', tagColor: 'var(--pink)' },
    { icon: Zap, title: 'Real-Time Evaluation', desc: 'Every answer gets a 0-10 AI score with strengths, weaknesses, and model answer.', tag: 'AI', tagColor: '#0284C7' },
    { icon: BarChart3, title: 'Performance Analytics', desc: 'Beautiful dashboards with DSA vs HR scores, monthly trends, and weakness heatmap.', tag: 'Analytics', tagColor: '#EC4899' },
    { icon: Trophy, title: 'Global Leaderboard', desc: 'Compete globally or by category. Weekly rankings reset every Sunday.', tag: 'Social', tagColor: '#F59E0B' },
    { icon: FileDown, title: 'AI Report PDF', desc: 'Download a branded PDF with full score breakdown and 7-day improvement plan.', tag: 'Reports', tagColor: '#6366F1' },
];

function FeaturesSection() {
    return (
        <section className="section" id="features">
            <div className="container">
                <Reveal>
                    <SectionHeader
                        tag="✨ 9 Core Features"
                        title={<>Everything You Need to <span className="gradient-text">Succeed</span></>}
                        sub="One platform to simulate, evaluate, and master every type of technical and behavioral interview."
                    />
                </Reveal>

                <div className="feature-grid">
                    {features.map((f, i) => (
                        <Reveal key={f.title} delay={Math.floor(i / 3) * 0.1 + (i % 3) * 0.08}>
                            <div className="card" style={{ height: '100%' }}>
                                <div className="card-body">
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                                        <div className="icon-box">
                                            <f.icon size={22} color="white" />
                                        </div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: 8, background: `color-mix(in srgb, ${f.tagColor} 10%, white)`, color: f.tagColor }}>
                                            {f.tag}
                                        </span>
                                    </div>
                                    <h3 className="heading-3" style={{ marginBottom: 10, color: '#111827' }}>{f.title}</h3>
                                    <p className="body-sm text-muted">{f.desc}</p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════════
   4. SERVICES / AI FEATURES SECTION
══════════════════════════════════════════════ */
const services = [
    { icon: Brain, color: '#FF2E63', title: 'GPT-4 Powered Evaluation', desc: 'Every answer evaluated by GPT-4o for depth, relevance, communication clarity, and confidence — with a score out of 10.' },
    { icon: Volume2, color: '#7C3AED', title: 'Text-to-Speech Questions', desc: 'Hear questions read aloud in a natural interviewer voice, simulating the exact pressure of a phone screen.' },
    { icon: Mic, color: '#059669', title: 'Speech Recognition', desc: 'Answer hands-free using your microphone. The browser transcribes your speech in real time with high accuracy.' },
    { icon: MessageSquare, color: '#0284C7', title: 'Weakness Identification', desc: 'AI identifies patterns across all your answers and surfaces the core topics you need to focus on most.' },
];

function ServicesSection() {
    return (
        <section className="section bg-pale" id="services">
            <div className="container">
                <div className="grid-2" style={{ gap: 72, alignItems: 'start' }}>

                    <Reveal direction="left">
                        <div>
                            <span className="section-tag">🤖 AI Features</span>
                            <h2 className="section-heading">Your Personal AI<br /><span className="gradient-text">Interview Coach</span></h2>
                            <div className="divider" />
                            <p className="body-md text-muted" style={{ marginBottom: 32 }}>
                                Backed by GPT-4, our AI doesn't just ask questions — it listens, understands context, follows up on weak answers, and provides expert-level feedback within seconds.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {['Works 24/7 — practice any time', 'Adapts to your resume and skill level', 'No bias, no judgment — pure skill assessment'].map(t => (
                                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <CheckCircle size={16} color="var(--pink)" />
                                        <span className="body-sm" style={{ color: '#374151', fontWeight: 500 }}>{t}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: 32 }}>
                                <Link to="/signup" className="btn btn-primary btn-md">
                                    Try It Free <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </Reveal>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {services.map((s, i) => (
                            <Reveal key={s.title} direction="right" delay={i * 0.1}>
                                <div className="card">
                                    <div className="card-body" style={{ display: 'flex', gap: 18 }}>
                                        <div className="icon-box" style={{ background: `linear-gradient(135deg, ${s.color}, ${s.color}bb)`, flexShrink: 0 }}>
                                            <s.icon size={22} color="white" />
                                        </div>
                                        <div>
                                            <h3 className="heading-3" style={{ marginBottom: 6, fontSize: '1rem' }}>{s.title}</h3>
                                            <p className="body-sm text-muted">{s.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════════
   5. PERFORMANCE GRAPH SECTION
══════════════════════════════════════════════ */
const graphData = [
    { week: 'Wk 1', score: 48, confidence: 51 },
    { week: 'Wk 2', score: 55, confidence: 57 },
    { week: 'Wk 3', score: 61, confidence: 63 },
    { week: 'Wk 4', score: 67, confidence: 70 },
    { week: 'Wk 5', score: 73, confidence: 76 },
    { week: 'Wk 6', score: 79, confidence: 82 },
    { week: 'Wk 7', score: 85, confidence: 87 },
    { week: 'Wk 8', score: 91, confidence: 94 },
];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="card" style={{ padding: '12px 16px', pointerEvents: 'none' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: 6 }}>{label}</p>
            {payload.map(p => (
                <p key={p.name} style={{ fontSize: '0.8125rem', color: p.color, fontWeight: 600 }}>
                    {p.name}: {p.value}%
                </p>
            ))}
        </div>
    );
};

function PerformanceSection() {
    const skills = [
        { name: 'Technical Depth', pct: 87 }, { name: 'Communication', pct: 91 },
        { name: 'Confidence', pct: 83 }, { name: 'Problem Solving', pct: 89 },
    ];
    return (
        <section className="section" id="performance" style={{ paddingTop: 100, paddingBottom: 100 }}>
            <div className="container">
                <Reveal>
                    <SectionHeader
                        tag="📈 Progress Tracking"
                        title={<>Watch Your Scores <span className="gradient-text">Improve Weekly</span></>}
                        sub="Every session feeds into your analytics. See your exact growth trajectory across all skill dimensions."
                    />
                </Reveal>

                <div className="grid-2" style={{ gap: 48 }}>
                    <Reveal direction="left">
                        <div className="card">
                            <div className="card-body">
                                <h3 className="heading-3" style={{ marginBottom: 20, color: '#111827' }}>8-Week Progress</h3>
                                <ResponsiveContainer width="100%" height={260}>
                                    <AreaChart data={graphData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#FF2E63" stopOpacity={0.18} />
                                                <stop offset="95%" stopColor="#FF2E63" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.14} />
                                                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#fde7ef" vertical={false} />
                                        <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                        <YAxis domain={[40, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area type="monotone" dataKey="score" name="Score" stroke="#FF2E63" strokeWidth={2.5} fill="url(#pinkGrad)" dot={false} activeDot={{ r: 5, fill: '#FF2E63' }} />
                                        <Area type="monotone" dataKey="confidence" name="Confidence" stroke="#7C3AED" strokeWidth={2.5} fill="url(#purpleGrad)" dot={false} activeDot={{ r: 5, fill: '#7C3AED' }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </Reveal>

                    <Reveal direction="right" delay={0.1}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            <div className="card" style={{ marginBottom: 20 }}>
                                <div className="card-body">
                                    <h3 className="heading-3" style={{ marginBottom: 20 }}>Skill Breakdown</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                                        {skills.map(sk => (
                                            <div key={sk.name}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                                    <span className="body-sm" style={{ fontWeight: 600, color: '#374151' }}>{sk.name}</span>
                                                    <span className="body-sm gradient-text" style={{ fontWeight: 700 }}>{sk.pct}%</span>
                                                </div>
                                                <div className="progress-track">
                                                    <motion.div className="progress-fill"
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${sk.pct}%` }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="card" style={{ background: 'linear-gradient(135deg, #FF2E63, #e50000)', border: 'none' }}>
                                <div className="card-body">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                                        <TrendingUp size={28} color="rgba(255,255,255,0.9)" />
                                        <div>
                                            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8125rem' }}>Average Improvement</div>
                                            <div style={{ color: 'white', fontWeight: 900, fontSize: '1.75rem', fontFamily: 'Poppins' }}>+43%</div>
                                        </div>
                                    </div>
                                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', lineHeight: 1.55 }}>
                                        Users who complete 8 sessions average a 43% improvement in overall interview performance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════════
   6. AI REPORT SECTION
══════════════════════════════════════════════ */
function ReportSection() {
    const reportItems = [
        { icon: Target, title: 'Question-by-Question Scores', desc: 'Every answer gets scored 0-10 with a colour-coded performance badge.' },
        { icon: CheckCircle, title: 'Strength & Weakness Analysis', desc: 'Bulleted breakdown of what you did well and exactly where you fell short.' },
        { icon: Brain, title: 'Ideal Answer Explanations', desc: 'GPT-4 shows you how a top candidate would have answered each question.' },
        { icon: FileDown, title: '7-Day AI Study Plan', desc: 'Personalised daily exercises and resource list generated from your weak areas.' },
    ];
    return (
        <section className="section bg-pale" id="report">
            <div className="container">
                <div className="grid-2" style={{ gap: 72 }}>

                    {/* Left — visual report card */}
                    <Reveal direction="left">
                        <div className="card" style={{ overflow: 'hidden' }}>
                            <div className="card-body">
                                {/* Header */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                                    <div>
                                        <div style={{ fontWeight: 700, color: '#111827', marginBottom: 2 }}>Interview Report</div>
                                        <div className="text-muted text-small">Technical Mode · 10 Questions</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div className="gradient-text" style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'Poppins' }}>87%</div>
                                        <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>Good Performance</div>
                                    </div>
                                </div>

                                {/* Progress bars */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                                    {[['System Design', 92], ['Data Structures', 85], ['Algorithms', 81], ['Behavioural', 90]].map(([label, val]) => (
                                        <div key={label}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                                <span style={{ fontSize: '0.8125rem', color: '#374151', fontWeight: 600 }}>{label}</span>
                                                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--pink)' }}>{val}%</span>
                                            </div>
                                            <div className="progress-track">
                                                <motion.div className="progress-fill"
                                                    initial={{ width: 0 }}
                                                    whileInView={{ width: `${val}%` }}
                                                    viewport={{ once: true }}
                                                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Sample question card */}
                                <div style={{ background: '#fff0f4', borderRadius: 14, padding: '14px 16px', borderLeft: '3px solid var(--pink)' }}>
                                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--pink)', marginBottom: 6 }}>Q4 — System Design</div>
                                    <p style={{ fontSize: '0.8125rem', color: '#374151', marginBottom: 8, lineHeight: 1.55 }}>
                                        Design a URL shortener that handles 10M requests/day.
                                    </p>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: 6, background: '#dcfce7', color: '#16a34a', fontWeight: 600 }}>✓ Scalability noted</span>
                                        <span style={{ fontSize: '0.7rem', padding: '3px 8px', borderRadius: 6, background: '#fee2e2', color: '#dc2626', fontWeight: 600 }}>✗ Missed caching</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* Right — text */}
                    <Reveal direction="right" delay={0.1}>
                        <div>
                            <span className="section-tag">📄 AI Final Report</span>
                            <h2 className="section-heading">Your Full Interview<br /><span className="gradient-text">Report Card</span></h2>
                            <div className="divider" />
                            <p className="body-md text-muted" style={{ marginBottom: 32 }}>
                                After every session, download a professional branded PDF with deep analysis across every single question you answered.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                {reportItems.map((item, i) => (
                                    <motion.div key={item.title}
                                        initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1, duration: 0.4 }}
                                        viewport={{ once: true }}
                                        style={{ display: 'flex', gap: 16 }}>
                                        <div className="icon-box icon-box-sm" style={{ flexShrink: 0, marginTop: 2 }}>
                                            <item.icon size={16} color="white" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, color: '#111827', marginBottom: 4, fontSize: '0.9375rem' }}>{item.title}</div>
                                            <p className="body-sm text-muted">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <div style={{ marginTop: 32 }}>
                                <Link to="/signup" className="btn btn-primary btn-md">
                                    <FileDown size={16} /> Get Your Report
                                </Link>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════════
   7. TESTIMONIALS
══════════════════════════════════════════════ */
const testimonials = [
    { name: 'Priya Sharma', role: 'SDE-2 at Amazon', score: 94, mode: 'Technical', letter: 'P', color: '#FF9900', text: 'The resume-based questions were scarily accurate — it asked about every project on my CV. Landed the Amazon offer in 3 weeks.' },
    { name: 'Arjun Mehta', role: 'CS Final Year, IIT Delhi', score: 88, mode: 'DSA', letter: 'A', color: '#4F46E5', text: 'The DSA mode follows up with complexity questions after each answer, just like real FAANG interviews. I finally cracked trees and graphs.' },
    { name: 'Sarah Johnson', role: 'PM at Google', score: 91, mode: 'HR', letter: 'S', color: '#059669', text: 'The confidence scoring feature showed I was being too passive. After 2 weeks the AI said I sounded like a leader. I got the Google offer.' },
    { name: 'Rahul Kumar', role: 'Backend Eng., Flipkart', score: 87, mode: 'Custom', letter: 'R', color: '#7C3AED', text: 'My average went from 55% to 87% in two weeks. The improvement charts make it really motivating to keep going.' },
    { name: 'Meera Patel', role: 'Data Scientist, Microsoft', score: 92, mode: 'Technical', letter: 'M', color: '#0284C7', text: 'Terrified of system design. After 10 mock Technical interviews I felt calm in my Microsoft final round. The AI plan is top-tier.' },
    { name: 'Carlos Rivera', role: 'Frontend Dev, Startup', score: 89, mode: 'HR', letter: 'C', color: '#EC4899', text: 'Voice interview mode is next-level. Hearing AI questions aloud simulates real phone screen anxiety. My communication score improved massively.' },
];

function TestimonialsSection() {
    return (
        <section className="section" id="testimonials">
            <div className="container">
                <Reveal>
                    <SectionHeader
                        tag="⭐ 6,000+ Reviews"
                        title={<>Real Stories, <span className="gradient-text">Real Offers</span></>}
                        sub="Join thousands of candidates who transformed their interview game with AI-powered practice."
                    />
                </Reveal>

                <div className="grid-3">
                    {testimonials.map((t, i) => (
                        <Reveal key={t.name} delay={Math.floor(i / 3) * 0.1 + (i % 3) * 0.08}>
                            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    {/* Stars */}
                                    <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
                                        {[...Array(5)].map((_, j) => <Star key={j} size={13} fill="#FF2E63" color="#FF2E63" />)}
                                    </div>
                                    {/* Quote icon */}
                                    <Quote size={24} style={{ color: '#ffd6e3', marginBottom: 10 }} fill="#ffd6e3" />
                                    {/* Text */}
                                    <p className="body-sm text-muted" style={{ flex: 1, lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>
                                        "{t.text}"
                                    </p>
                                    {/* Footer */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid #fce7f0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{
                                                width: 38, height: 38, borderRadius: '50%',
                                                background: 'linear-gradient(135deg, var(--pink), var(--red))',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'white', fontWeight: 800, fontSize: '0.9rem', flexShrink: 0,
                                            }}>
                                                {t.letter}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#111827' }}>{t.name}</div>
                                                <div className="text-muted text-small">{t.role}</div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div className="gradient-text" style={{ fontWeight: 800, fontSize: '1rem' }}>{t.score}%</div>
                                            <div className="text-muted text-small">{t.mode}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════════
   8. CONTACT SECTION
══════════════════════════════════════════════ */
function ContactSection() {
    const contactInfo = [
        { icon: Mail, label: 'Email', value: 'hello@interviewai.app' },
        { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
        { icon: MapPin, label: 'Location', value: 'Bangalore, India 🇮🇳' },
    ];

    return (
        <section className="section bg-pale" id="contact">
            <div className="container">
                <Reveal>
                    <SectionHeader
                        tag="📬 Get In Touch"
                        title={<>Have Questions? <span className="gradient-text">Let's Talk</span></>}
                        sub="Our team responds within 24 hours. We'd love to hear about your interview goals."
                    />
                </Reveal>

                <div className="grid-2" style={{ gap: 48, alignItems: 'start' }}>

                    {/* Left — contact info */}
                    <Reveal direction="left">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            <div className="card" style={{ marginBottom: 20 }}>
                                <div className="card-body">
                                    <h3 className="heading-3" style={{ marginBottom: 20, color: '#111827' }}>Contact Info</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                        {contactInfo.map(ci => (
                                            <div key={ci.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                                <div className="icon-box icon-box-sm">
                                                    <ci.icon size={16} color="white" />
                                                </div>
                                                <div>
                                                    <div className="text-muted text-small">{ci.label}</div>
                                                    <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.9375rem' }}>{ci.value}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="card" style={{ background: 'linear-gradient(135deg, #FF2E63, #e50000)', border: 'none' }}>
                                <div className="card-body">
                                    <h3 style={{ color: 'white', fontWeight: 800, marginBottom: 10, fontSize: '1.125rem' }}>Ready to Start?</h3>
                                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', marginBottom: 18, lineHeight: 1.6 }}>
                                        Skip the form — just sign up and take your first AI mock interview. It's completely free.
                                    </p>
                                    <Link to="/signup" className="btn" style={{ background: 'white', color: 'var(--pink)', padding: '12px 24px', borderRadius: 14, fontSize: '0.875rem' }}>
                                        Start for Free <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </Reveal>

                    {/* Right — form */}
                    <Reveal direction="right" delay={0.1}>
                        <div className="card">
                            <div className="card-body">
                                <h3 className="heading-3" style={{ marginBottom: 24, color: '#111827' }}>Send us a Message</h3>
                                <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                        <div>
                                            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>First Name</label>
                                            <input className="input-field" placeholder="Priya" type="text" />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Last Name</label>
                                            <input className="input-field" placeholder="Sharma" type="text" />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Email Address</label>
                                        <input className="input-field" placeholder="priya@email.com" type="email" />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Subject</label>
                                        <input className="input-field" placeholder="How do I upgrade to Pro?" type="text" />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Message</label>
                                        <textarea className="input-field" placeholder="Write your message here…" rows={4} />
                                    </div>
                                    <button type="submit" className="btn btn-primary btn-md" style={{ width: '100%' }}>
                                        Send Message <ArrowRight size={16} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════════
   9. FOOTER
══════════════════════════════════════════════ */
function Footer() {
    const cols = [
        {
            heading: 'Product',
            links: [{ label: 'Features', to: '/features' }, { label: 'How It Works', to: '/how-it-works' }, { label: 'Pricing', to: '/pricing' }, { label: 'Leaderboard', to: '/leaderboard' }],
        },
        {
            heading: 'Practice',
            links: [{ label: 'DSA Interview', to: '/interview/setup' }, { label: 'HR Interview', to: '/interview/setup' }, { label: 'Technical Interview', to: '/interview/setup' }, { label: 'Upload Resume', to: '/resume' }],
        },
        {
            heading: 'Company',
            links: [{ label: 'About Us', to: '/' }, { label: 'Testimonials', to: '/testimonials' }, { label: 'Contact', to: '/#contact' }, { label: 'Privacy Policy', to: '/' }],
        },
    ];
    return (
        <footer style={{ background: '#111827', paddingTop: 72, paddingBottom: 36 }}>
            <div className="container">
                {/* Top grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 40, marginBottom: 48 }}>
                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <div className="icon-box icon-box-sm">
                                <Brain size={18} color="white" />
                            </div>
                            <span style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '1.125rem', background: 'linear-gradient(135deg,#FF2E63,#e50000)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                InterviewAI
                            </span>
                        </div>
                        <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 220, marginBottom: 20 }}>
                            The AI-powered interview simulator that actually gets you hired.
                        </p>
                        <div style={{ display: 'flex', gap: 10 }}>
                            {[Twitter, Linkedin, Github].map((Icon, i) => (
                                <a key={i} href="#" style={{ width: 36, height: 36, borderRadius: 10, background: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--pink)'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#1f2937'}>
                                    <Icon size={15} color="#9ca3af" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {cols.map(col => (
                        <div key={col.heading}>
                            <h4 style={{ color: '#f9fafb', fontWeight: 700, fontSize: '0.9375rem', marginBottom: 16 }}>{col.heading}</h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {col.links.map(lnk => (
                                    <li key={lnk.label}>
                                        <Link to={lnk.to} style={{ color: '#9ca3af', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#ff6b9d'}
                                            onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}>
                                            {lnk.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: '#1f2937', marginBottom: 28 }} />

                {/* Bottom */}
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <p style={{ color: '#6b7280', fontSize: '0.8125rem' }}>© 2024 InterviewAI. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: 20 }}>
                        {['Terms of Service', 'Privacy Policy', 'Cookie Policy'].map(t => (
                            <a key={t} href="#" style={{ color: '#6b7280', fontSize: '0.8125rem', textDecoration: 'none' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#ff6b9d'}
                                onMouseLeave={e => e.currentTarget.style.color = '#6b7280'}>{t}</a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

/* ══════════════════════════════════════════════
   PAGE ASSEMBLY
══════════════════════════════════════════════ */
export default function Landing() {
    return (
        <div style={{ minHeight: '100vh', background: '#ffffff' }}>
            <HeroSection />
            <StatsBar />
            <FeaturesSection />
            <ServicesSection />
            <PerformanceSection />
            <ReportSection />
            <TestimonialsSection />
            <ContactSection />
            <Footer />
        </div>
    );
}
