import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Quote, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
    {
        name: 'Priya Sharma', role: 'SDE-2 at Amazon', avatar: 'P',
        text: 'InterviewAI was a game-changer for my Amazon prep. The resume-based questions were scarily accurate — it asked about every project on my CV. Landed the offer in 3 weeks.',
        rating: 5, mode: 'Technical', score: 94,
        color: '#FF9900',
    },
    {
        name: 'Arjun Mehta', role: 'CS Final Year, IIT Delhi', avatar: 'A',
        text: 'The DSA mode is incredible. It follows up with complexity questions after each answer, just like real FAANG interviews. I went from struggling with trees to acing them.',
        rating: 5, mode: 'DSA', score: 88,
        color: '#4F46E5',
    },
    {
        name: 'Sarah Johnson', role: 'Product Manager, Google', avatar: 'S',
        text: 'The HR mode completely transformed how I answer behavioral questions. The confidence scoring feature made me realize I was being too passive. Now I sound like a leader.',
        rating: 5, mode: 'HR', score: 91,
        color: '#059669',
    },
    {
        name: 'Rahul Kumar', role: 'Backend Engineer, Flipkart', avatar: 'R',
        text: 'The PDF reports are professional-grade. I track every session and the improvement charts show real progress. My average score jumped from 55% to 87% in two weeks.',
        rating: 5, mode: 'Custom', score: 87,
        color: '#7C3AED',
    },
    {
        name: 'Meera Patel', role: 'Data Scientist, Microsoft', avatar: 'M',
        text: 'I was terrified of system design questions. After 10 mock Technical interviews, I approached my Microsoft final round feeling calm. The AI improvement plan is top-tier.',
        rating: 5, mode: 'Technical', score: 92,
        color: '#0284C7',
    },
    {
        name: 'Carlos Rivera', role: 'Frontend Dev, Startup', avatar: 'C',
        text: 'Voice interview mode is next-level. Hearing AI questions read aloud simulates the real anxiety of a phone screen. Nothing else does this. My communication score improved massively.',
        rating: 5, mode: 'HR', score: 89,
        color: '#EC4899',
    },
];

function StarRating({ count = 5 }) {
    return (
        <div className="flex gap-0.5">
            {[...Array(count)].map((_, i) => <Star key={i} size={13} fill="#FF2E63" color="#FF2E63" />)}
        </div>
    );
}

function TestimonialCard({ t, index }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-40px' });
    return (
        <motion.div ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: (index % 3) * 0.1, ease: 'easeOut' }}
            className="glass-card card-hover pink-shadow rounded-3xl p-6 flex flex-col relative overflow-hidden group">
            {/* Quote icon */}
            <Quote size={32} className="absolute top-4 right-4 text-pink-100 group-hover:text-pink-200 transition-colors" fill="currentColor" />
            <StarRating />
            <p className="text-gray-700 text-sm mt-3 mb-4 leading-relaxed flex-1 italic">"{t.text}"</p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-pink-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full btn-gradient flex items-center justify-center text-white font-black flex-shrink-0">
                        {t.avatar}
                    </div>
                    <div>
                        <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                        <div className="text-xs text-gray-400">{t.role}</div>
                    </div>
                </div>
                <div className="text-right flex-shrink-0">
                    <div className="text-sm font-black gradient-text">{t.score}%</div>
                    <div className="text-xs text-gray-400">{t.mode}</div>
                </div>
            </div>
        </motion.div>
    );
}

const stats = [
    { value: '12,000+', label: 'Interviews Completed' },
    { value: '94%', label: 'Satisfaction Rate' },
    { value: '3.2×', label: 'Faster Improvement' },
    { value: '500+', label: 'Job Offers Landed' },
];

export default function TestimonialsPage() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Orbs */}
            <div className="orb w-[500px] h-[500px] bg-yellow-200" style={{ top: '-5%', right: '-8%', opacity: 0.12 }} />
            <div className="orb w-[400px] h-[400px] bg-pink-200" style={{ bottom: '5%', left: '-6%', opacity: 0.12 }} />

            {/* Hero */}
            <div className="section-hero relative z-10 text-center px-4">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <div className="stat-pill mx-auto mb-6">⭐ Loved by Thousands</div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-5 leading-tight">
                        Real Stories,<br /><span className="gradient-text">Real Results</span>
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-10">
                        Join thousands of candidates who transformed their interview game with AI-powered practice.
                    </p>
                </motion.div>

                {/* Stats row */}
                <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-4 mb-8">
                    {stats.map((s, i) => (
                        <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                            className="glass-card pink-shadow rounded-2xl p-4 text-center card-hover">
                            <div className="text-2xl font-black gradient-text mb-1">{s.value}</div>
                            <div className="text-xs text-gray-500">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Cards */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {testimonials.map((t, i) => <TestimonialCard key={t.name} t={t} index={i} />)}
                </div>

                {/* CTA */}
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="mt-16 text-center glass-card pink-shadow-lg rounded-3xl p-10">
                    <h2 className="text-3xl font-black text-gray-900 mb-3">Your Story Starts <span className="gradient-text">Today</span></h2>
                    <p className="text-gray-500 mb-6">Be the next success story. It's free to begin.</p>
                    <Link to="/signup" className="btn-gradient px-10 py-4 rounded-2xl text-white font-bold inline-flex items-center gap-2">
                        Start for Free <ArrowRight size={18} />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
