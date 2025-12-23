"use client";

import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import {
    FaGoogle,
    FaFacebook,
    FaLinkedinIn,
    FaEnvelope,
    FaLock,
    FaUser,
    FaEye,
    FaEyeSlash,
    FaArrowRight
} from 'react-icons/fa';

export default function AuthPage() {
    const { login, register } = useAuth();
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // 3D Tilt Effect Logic
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent, type: 'login' | 'register') => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (type === 'register') {
                if (formData.password !== formData.confirmPassword) {
                    setError("Passwords do not match");
                    setIsLoading(false);
                    return;
                }
                if (formData.password.length < 6) {
                    setError("Password must be at least 6 characters");
                    setIsLoading(false);
                    return;
                }
                await register({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                });
            } else {
                await login({ email: formData.email, password: formData.password });
            }
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Authentication failed');
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        console.log(`Social login with ${provider}`);
    };

    return (
        <div className="relative w-full min-h-screen flex items-center justify-center p-4 bg-[#f8fafc] overflow-hidden font-sans">
            {/* 3D Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                    style={{ backgroundImage: "url('/login-bg-3d.png')" }}
                />
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Main Auth Container with Tilt Effect */}
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full max-w-5xl min-h-[680px] bg-white/70 backdrop-blur-3xl rounded-[48px] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col lg:flex-row border border-white/50"
            >
                <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                        key={isSignUp ? 'signup-layout' : 'signin-layout'}
                        initial={{ opacity: 0, x: isSignUp ? 100 : -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: isSignUp ? -100 : 100 }}
                        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                        className={`flex flex-col lg:flex-row w-full ${isSignUp ? 'lg:flex-row-reverse' : ''}`}
                    >
                        {/* Content Side */}
                        <div className="w-full lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center bg-white/40">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="mb-10"
                            >
                                <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter mb-3 leading-none">
                                    {isSignUp ? 'Join the Journey' : 'Travel Sansar'}
                                </h1>
                                <p className="text-slate-500 text-lg font-medium max-w-sm">
                                    {isSignUp ? 'Create your account and start exploring the hidden gems of the world.' : 'Welcome back! Sign in to continue your adventure.'}
                                </p>
                            </motion.div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-red-500/10 border border-red-200 p-4 rounded-2xl mb-8 flex items-center gap-3 text-red-600 text-sm font-bold"
                                >
                                    <span className="text-lg">⚠️</span> {error}
                                </motion.div>
                            )}

                            <form onSubmit={(e) => handleSubmit(e, isSignUp ? 'register' : 'login')} className="space-y-5">
                                <AnimatePresence mode="popLayout">
                                    {isSignUp && (
                                        <motion.div
                                            key="name-field"
                                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                            animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <InputWrapper icon={<FaUser />} label="Full Name">
                                                <input
                                                    type="text"
                                                    name="name"
                                                    placeholder="Example: John Doe"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="auth-input"
                                                    required={isSignUp}
                                                />
                                            </InputWrapper>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <InputWrapper icon={<FaEnvelope />} label="Email Address">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="yourname@domain.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="auth-input"
                                        required
                                    />
                                </InputWrapper>

                                <InputWrapper
                                    icon={<FaLock />}
                                    label="Secret Password"
                                    showToggle
                                    toggleVisible={showPassword}
                                    onToggle={() => setShowPassword(!showPassword)}
                                >
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="••••••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="auth-input"
                                        required
                                    />
                                </InputWrapper>

                                <AnimatePresence mode="popLayout">
                                    {isSignUp && (
                                        <motion.div
                                            key="confirm-password-field"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.4 }}
                                        >
                                            <InputWrapper
                                                icon={<FaLock />}
                                                label="Confirm Password"
                                                showToggle
                                                toggleVisible={showConfirmPassword}
                                                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    name="confirmPassword"
                                                    placeholder="••••••••••••"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    className="auth-input"
                                                    required={isSignUp}
                                                />
                                            </InputWrapper>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {!isSignUp && (
                                    <div className="flex justify-end pt-1">
                                        <button
                                            type="button"
                                            onClick={() => router.push('/forgot-password')}
                                            className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
                                        >
                                            Recovery Password?
                                        </button>
                                    </div>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.01, y: -2 }}
                                    whileTap={{ scale: 0.99, y: 0 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full py-5 rounded-3xl font-extrabold text-white text-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] transition-all flex items-center justify-center gap-3 overflow-hidden group relative mt-4 ${isSignUp
                                            ? 'bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-indigo-500/30'
                                            : 'bg-gradient-to-tr from-blue-600 via-cyan-600 to-blue-500 shadow-blue-500/30'
                                        }`}
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        {isLoading ? (
                                            <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                        ) : isSignUp ? 'Begin Journey' : 'Enter Portal'}
                                        {!isLoading && <FaArrowRight className="text-lg group-hover:translate-x-2 transition-transform duration-300" />}
                                    </span>
                                    <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
                                </motion.button>
                            </form>

                            <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center">
                                <p className="text-slate-400 font-semibold mb-3">
                                    {isSignUp ? "Already have a portal?" : "New to the expedition?"}
                                </p>
                                <button
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    className={`px-10 py-3 rounded-2xl font-black text-sm uppercase tracking-widest border-2 transition-all duration-300 ${isSignUp
                                            ? 'border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white'
                                            : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                                        }`}
                                >
                                    {isSignUp ? "Log In Instead" : "Create Account"}
                                </button>
                            </div>
                        </div>

                        {/* Info Side */}
                        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden group">
                            <motion.div
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 1.5 }}
                                className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-[3000ms]"
                                style={{ backgroundImage: `url(${isSignUp ? 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?q=80&w=2070&auto=format&fit=crop' : 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop'})` }}
                            />
                            <div className={`absolute inset-0 opacity-60 transition-colors duration-1000 ${isSignUp ? 'bg-indigo-900' : 'bg-slate-900'}`} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                            <div className="relative z-10 w-full flex flex-col items-center justify-center text-center p-16 text-white h-full">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3, duration: 0.6 }}
                                    className="mb-8"
                                >
                                    <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[40px] border border-white/20 shadow-2xl mb-8">
                                        {isSignUp ? <FaUser className="text-5xl drop-shadow-lg" /> : <FaLock className="text-5xl drop-shadow-lg" />}
                                    </div>
                                    <h2 className="text-6xl font-black mb-6 tracking-tighter leading-tight drop-shadow-2xl">
                                        {isSignUp ? 'Unfold Your Story' : 'Reconnect With Earth'}
                                    </h2>
                                    <p className="text-xl font-medium text-white/80 leading-relaxed max-w-md mx-auto mb-12 drop-shadow-lg">
                                        {isSignUp
                                            ? "Join a community of 2,000+ explorers discovering the unseen parts of our planet."
                                            : "Your next great story is just a login away. Pick up where you left off."
                                        }
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 text-left">
                                            <div className="text-3xl font-black mb-1">500+</div>
                                            <div className="text-xs font-bold uppercase tracking-tighter text-white/60">Destinations</div>
                                        </div>
                                        <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10 text-left">
                                            <div className="text-3xl font-black mb-1">2k+</div>
                                            <div className="text-xs font-bold uppercase tracking-tighter text-white/60">Global Users</div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Decorative Floating Blobs */}
                            <motion.div
                                animate={{ y: [0, -40, 0], x: [0, 20, 0] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-20 right-20 w-32 h-32 bg-cyan-400/20 rounded-full blur-3xl"
                            />
                            <motion.div
                                animate={{ y: [0, 40, 0], x: [0, -20, 0] }}
                                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute bottom-20 left-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"
                            />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@800;900&display=swap');
                
                body {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }

                h1, h2 {
                    font-family: 'Outfit', sans-serif;
                }

                .auth-input {
                    @apply w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-bold text-lg;
                }
            `}</style>
        </div>
    );
}

function InputWrapper({ children, icon, label, showToggle, toggleVisible, onToggle }: any) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="w-full">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 ml-1">
                {label}
            </label>
            <div
                className={`relative flex items-center p-4 rounded-2xl border-2 transition-all duration-300 ${isFocused
                    ? 'bg-white border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            >
                <span className={`mr-3 text-lg transition-colors ${isFocused ? 'text-blue-500' : 'text-slate-400'}`}>
                    {icon}
                </span>
                {children}
                {showToggle && (
                    <button
                        type="button"
                        onClick={onToggle}
                        className="text-slate-400 hover:text-blue-500 transition-colors ml-2"
                    >
                        {toggleVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                )}
            </div>
        </div>
    );
}

function SocialButton({ icon, color, onClick }: any) {
    return (
        <motion.button
            whileHover={{ y: -4, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`flex-1 h-14 border border-slate-200 rounded-2xl flex items-center justify-center text-xl text-slate-600 transition-all bg-white shadow-sm ${color}`}
        >
            {icon}
        </motion.button>
    );
}
