import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Zap, Crown, ArrowRight, Sparkles } from 'lucide-react';

const plans = [
    {
        id: 'free', name: 'Free', price: '0', period: 'forever',
        tagline: 'Perfect to get started',
        color: '#6B7280',
        features: [
            '5 interviews per month',
            'HR & DSA modes',
            'Basic AI feedback (heuristic)',
            'Performance charts',
            'Community leaderboard',
            'PDF report (basic)',
        ],
        missing: ['GPT-4 evaluation', 'Resume AI analysis', 'Custom mode', '7-day AI study plan'],
        cta: 'Start Free', href: '/signup', outline: true,
    },
    {
        id: 'pro', name: 'Pro', price: '19', period: '/month',
        tagline: 'Most popular — best results',
        color: '#FF2E63',
        badge: '🔥 Most Popular',
        features: [
            'Unlimited interviews',
            'All 4 interview modes',
            'GPT-4 real-time evaluation',
            'Resume AI question generation',
            'Custom mode (any difficulty)',
            '7-day AI improvement plan',
            'Priority leaderboard badge',
            'Branded PDF reports',
            'Voice interview mode',
            'Admin dashboard access',
        ],
        cta: 'Start Pro Trial', href: '/signup', outline: false,
    },
    {
        id: 'team', name: 'Team', price: '49', period: '/month',
        tagline: 'For bootcamps & companies',
        color: '#7C3AED',
        features: [
            'Everything in Pro',
            'Up to 10 team members',
            'Team analytics dashboard',
            'Custom question bank',
            'Priority support',
            'SSO / OAuth login',
        ],
        missing: ['On-premise option'],
        cta: 'Contact Sales', href: '/signup', outline: true,
    },
];

const faqs = [
    { q: 'Does the Free plan use real AI?', a: 'The Free plan uses intelligent heuristic scoring. Upgrade to Pro for GPT-4 powered evaluation.' },
    { q: 'Can I cancel anytime?', a: 'Absolutely. Cancel from your account settings any time — no questions asked.' },
    { q: 'Do I need an OpenAI key?', a: 'No — we handle all AI infrastructure server-side. Just sign up and start interviewing.' },
    { q: 'Is my resume data private?', a: 'Yes. Your resume is encrypted and only used to generate your interview questions.' },
];

function PlanCard({ plan, index }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-60px' });
    const isPro = plan.id === 'pro';

    return (
        <motion.div ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: index * 0.12, ease: 'easeOut' }}
            whileHover={{ y: -8 }}
            className={`relative rounded-3xl p-7 flex flex-col transition-all duration-300 ${isPro
                    ? 'text-white overflow-hidden'
                    : 'glass-card pink-shadow border border-pink-50'
                }`}
            style={isPro ? { background: 'linear-gradient(145deg, #FF2E63 0%, #c8003f 100%)', boxShadow: '0 24px 80px rgba(255,46,99,0.45)' } : {}}>

            {isPro && (
                <>
                    <div className="absolute inset-0 rounded-3xl" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.12) 0%, transparent 60%)' }} />
                    <div className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white">{plan.badge}</div>
                </>
            )}

            <div className="mb-6 relative z-10">
                <div className="flex items-center gap-2 mb-1">
                    {isPro && <Crown size={16} className="text-yellow-300" />}
                    <h3 className={`text-xl font-black ${isPro ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                </div>
                <p className={`text-xs mb-4 ${isPro ? 'text-pink-100' : 'text-gray-500'}`}>{plan.tagline}</p>
                <div className="flex items-end gap-1">
                    <span className={`text-5xl font-black ${isPro ? 'text-white' : 'gradient-text'}`}>${plan.price}</span>
                    <span className={`text-sm mb-2 ${isPro ? 'text-pink-100' : 'text-gray-400'}`}>{plan.period}</span>
                </div>
            </div>

            <div className="flex-1 space-y-2.5 mb-7 relative z-10">
                {plan.features.map(f => (
                    <div key={f} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle size={14} className={`flex-shrink-0 mt-0.5 ${isPro ? 'text-pink-200' : 'text-pink-500'}`} />
                        <span className={isPro ? 'text-pink-50' : 'text-gray-600'}>{f}</span>
                    </div>
                ))}
                {plan.missing?.map(f => (
                    <div key={f} className="flex items-start gap-2.5 text-sm opacity-40">
                        <div className="w-3.5 h-0.5 rounded-full bg-gray-300 flex-shrink-0 mt-2" />
                        <span className="text-gray-400 line-through">{f}</span>
                    </div>
                ))}
            </div>

            <Link to={plan.href} className={`relative z-10 block text-center py-3.5 rounded-2xl font-bold text-sm transition-all ${isPro
                    ? 'bg-white text-pink-600 hover:bg-pink-50'
                    : plan.outline
                        ? 'btn-outline'
                        : 'btn-gradient text-white'
                }`}>
                {plan.cta} {!plan.outline && <ArrowRight size={14} className="inline ml-1" />}
            </Link>
        </motion.div>
    );
}

export default function PricingPage() {
    const faqRef = useRef(null);
    const faqInView = useInView(faqRef, { once: true, margin: '-60px' });

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Orbs */}
            <div className="orb w-[600px] h-[600px] bg-pink-200" style={{ top: '-10%', right: '-12%', opacity: 0.15 }} />
            <div className="orb w-[400px] h-[400px] bg-purple-200" style={{ bottom: '5%', left: '-8%', opacity: 0.12 }} />

            {/* Hero */}
            <div className="section-hero relative z-10 text-center px-4">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <div className="stat-pill mx-auto mb-6"><Sparkles size={12} /> Simple, Honest Pricing</div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 mb-5 leading-tight">
                        Start Free,<br /><span className="gradient-text">Scale When Ready</span>
                    </h1>
                    <p className="text-gray-500 text-lg max-w-xl mx-auto mb-4">
                        No hidden fees. Cancel anytime. Upgrade when you're serious.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-green-600 font-medium mb-10">
                        <CheckCircle size={14} /> No credit card required to start
                    </div>
                </motion.div>
            </div>

            {/* Cards */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="grid md:grid-cols-3 gap-6 items-start">
                    {plans.map((plan, i) => <PlanCard key={plan.id} plan={plan} index={i} />)}
                </div>

                {/* Compare row */}
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    className="mt-12 glass-card pink-shadow rounded-3xl p-6 overflow-x-auto">
                    <h3 className="font-black text-gray-900 text-lg mb-4 flex items-center gap-2">
                        <Zap size={16} className="text-pink-500" /> Quick Feature Comparison
                    </h3>
                    <table className="w-full text-sm min-w-[480px]">
                        <thead>
                            <tr>
                                <th className="text-left text-gray-500 font-medium py-2 pr-4">Feature</th>
                                {['Free', 'Pro', 'Team'].map(p => (
                                    <th key={p} className="text-center font-bold text-gray-800 py-2 px-3">
                                        {p === 'Pro' ? <span className="gradient-text">{p}</span> : p}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-pink-50">
                            {[
                                ['AI question generation', '✗', '✓', '✓'],
                                ['Unlimited interviews', '✗', '✓', '✓'],
                                ['GPT-4 evaluation', '✗', '✓', '✓'],
                                ['Voice interview', '✗', '✓', '✓'],
                                ['PDF reports', 'Basic', 'Full', 'Full'],
                                ['Team analytics', '✗', '✗', '✓'],
                            ].map(([feat, ...vals]) => (
                                <tr key={feat} className="hover:bg-pink-50 transition-colors">
                                    <td className="py-2.5 pr-4 text-gray-600">{feat}</td>
                                    {vals.map((v, i) => (
                                        <td key={i} className="text-center py-2.5 px-3 font-medium"
                                            style={{ color: v === '✓' ? '#16a34a' : v === '✗' ? '#9ca3af' : '#FF2E63' }}>{v}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>

                {/* FAQ */}
                <motion.div ref={faqRef} initial={{ opacity: 0, y: 30 }} animate={faqInView ? { opacity: 1, y: 0 } : {}}
                    className="mt-12">
                    <h2 className="text-2xl font-black text-gray-900 text-center mb-8">Frequently Asked <span className="gradient-text">Questions</span></h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {faqs.map(faq => (
                            <div key={faq.q} className="glass-card pink-shadow rounded-2xl p-5">
                                <h4 className="font-bold text-gray-900 text-sm mb-2">{faq.q}</h4>
                                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
