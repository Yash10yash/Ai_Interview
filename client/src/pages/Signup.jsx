import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Brain, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const perks = ['Resume-based AI questions', 'Real-time voice interviews', 'Performance analytics', 'PDF report generation'];

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 6) return toast.error('Password must be at least 6 characters');
        setLoading(true);
        try {
            await register(name, email, password);
            toast.success('Account created! Welcome to InterviewAI 🎉');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-16 pb-8">
            <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
                {/* Left panel */}
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
                    className="hidden lg:block">
                    <div className="w-12 h-12 rounded-2xl btn-gradient flex items-center justify-center mb-6">
                        <Brain size={22} color="white" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 mb-4">
                        Start your <span className="gradient-text">interview</span> journey
                    </h2>
                    <p className="text-gray-500 mb-8">Join thousands of professionals who ace interviews with AI-powered practice.</p>
                    <div className="space-y-3">
                        {perks.map(p => (
                            <div key={p} className="flex items-center gap-3 text-sm text-gray-600">
                                <div className="w-6 h-6 rounded-full btn-gradient flex items-center justify-center flex-shrink-0">
                                    <CheckCircle size={12} color="white" />
                                </div>
                                {p}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Form */}
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                    <div className="glass-card pink-shadow rounded-3xl p-8">
                        <div className="text-center mb-8 lg:hidden">
                            <div className="w-12 h-12 rounded-2xl btn-gradient flex items-center justify-center mx-auto mb-4">
                                <Brain size={22} color="white" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-black text-gray-900 mb-1">Create your account</h1>
                        <p className="text-gray-500 text-sm mb-6">Free forever. No credit card required.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="text" placeholder="Full name" value={name} onChange={e => setName(e.target.value)}
                                    className="input-field pl-11" required />
                            </div>
                            <div className="relative">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)}
                                    className="input-field pl-11" required />
                            </div>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type={showPw ? 'text' : 'password'} placeholder="Password (min 6 characters)" value={password} onChange={e => setPassword(e.target.value)}
                                    className="input-field pl-11 pr-11" required />
                                <button type="button" onClick={() => setShowPw(!showPw)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <button type="submit" disabled={loading}
                                className="btn-gradient w-full py-3.5 rounded-2xl text-white font-bold flex items-center justify-center gap-2 disabled:opacity-70">
                                {loading ? (
                                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white" style={{ animation: 'spin 1s linear infinite' }} />
                                ) : (<><span>Create Account</span><ArrowRight size={18} /></>)}
                            </button>
                        </form>

                        <p className="text-xs text-gray-400 text-center mt-4">
                            By signing up, you agree to our{' '}
                            <a href="#" className="text-pink-500 hover:underline">Terms</a> and{' '}
                            <a href="#" className="text-pink-500 hover:underline">Privacy Policy</a>
                        </p>

                        <div className="mt-6 text-center border-t border-pink-50 pt-6">
                            <p className="text-sm text-gray-500">
                                Already have an account?{' '}
                                <Link to="/login" className="text-pink-600 font-semibold hover:underline">Sign in</Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
