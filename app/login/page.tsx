"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
    FaGoogle,
    FaFacebook,
    FaLinkedinIn,
    FaEnvelope,
    FaLock,
    FaUser,
    FaEye,
    FaEyeSlash
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
            // Router redirect is handled by usage of router.push in AuthContext or Context state update
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Authentication failed');
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        console.log(`Social login with ${provider}`);
        // implement real social login if available, otherwise just log
    };

    return (
        <div className="relative w-full min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div
                className={`relative bg-white/80 backdrop-blur-xl rounded-[30px] shadow-2xl overflow-hidden w-full max-w-5xl min-h-[650px] transition-all duration-700 ${isSignUp ? 'right-panel-active' : ''}`}
            >
                {/* MOBILE VIEW */}
                <div className="lg:hidden h-full flex flex-col p-8 z-10 relative bg-gradient-to-br from-white to-blue-50/30">
                    <div className="text-center mb-8">
                        <div className="inline-block p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
                            <FaLock className="text-white text-3xl" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </h2>
                        <p className="text-gray-600 mt-2 text-sm">
                            {isSignUp ? 'Sign up to get started' : 'Sign in to continue'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4 text-sm flex items-center gap-2 animate-shake">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form className="flex flex-col gap-4" onSubmit={(e) => handleSubmit(e, isSignUp ? 'register' : 'login')}>
                        {isSignUp && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 flex items-center border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                                <FaUser className="text-blue-500 mr-3 text-lg" />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="bg-transparent outline-none flex-1 text-gray-700 placeholder-gray-400"
                                    required={isSignUp}
                                />
                            </div>
                        )}
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 flex items-center border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                            <FaEnvelope className="text-blue-500 mr-3 text-lg" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                className="bg-transparent outline-none flex-1 text-gray-700 placeholder-gray-400"
                                required
                            />
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 flex items-center border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                            <FaLock className="text-blue-500 mr-3 text-lg" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="bg-transparent outline-none flex-1 text-gray-700 placeholder-gray-400"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-blue-500 transition-colors ml-2"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {isSignUp && (
                            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 flex items-center border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                                <FaLock className="text-blue-500 mr-3 text-lg" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="bg-transparent outline-none flex-1 text-gray-700 placeholder-gray-400"
                                    required={isSignUp}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="text-gray-400 hover:text-blue-500 transition-colors ml-2"
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl mt-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (isSignUp ? 'Create Account' : 'Sign In')}
                        </button>
                    </form>

                    {!isSignUp && (
                        <div className="text-center mt-4">
                            <button
                                type="button"
                                onClick={() => router.push('/forgot-password')}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                        <span className="text-gray-500 text-sm font-medium">or continue with</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                    </div>

                    <div className="flex gap-3 justify-center">
                        <SocialIcon icon={<FaGoogle />} onClick={() => handleSocialLogin('Google')} color="red" />
                        <SocialIcon icon={<FaFacebook />} onClick={() => handleSocialLogin('Facebook')} color="blue" />
                        <SocialIcon icon={<FaLinkedinIn />} onClick={() => handleSocialLogin('LinkedIn')} color="sky" />
                    </div>

                    <div className="mt-8 text-center text-sm">
                        <p className="text-gray-600">
                            {isSignUp ? "Already have an account?" : "Don't have an account?"}
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError('');
                                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                            }}
                            className="text-blue-600 font-bold mt-2 hover:text-purple-600 transition-colors"
                        >
                            {isSignUp ? "Sign In" : "Sign Up"}
                        </button>
                    </div>
                </div>

                {/* DESKTOP VIEW */}
                <div className="hidden lg:flex form-container sign-up-container absolute top-0 h-full transition-all duration-700 ease-in-out left-0 w-1/2 opacity-0 z-10">
                    <form className="bg-white flex flex-col items-center justify-center px-12 h-full text-center w-full" onSubmit={(e) => handleSubmit(e, 'register')}>
                        {/* <div className="inline-block p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4">
                            <FaUser className="text-white text-4xl" />
                        </div> */}
                        <h1 className="font-bold text-4xl mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Create Account</h1>
                        <p className="text-gray-600 mb-6 text-sm">Sign up to get started</p>

                        {/* <div className="flex gap-3 mb-6">
                            <SocialIcon icon={<FaGoogle />} onClick={() => handleSocialLogin('Google')} color="red" />
                            <SocialIcon icon={<FaFacebook />} onClick={() => handleSocialLogin('Facebook')} color="blue" />
                            <SocialIcon icon={<FaLinkedinIn />} onClick={() => handleSocialLogin('LinkedIn')} color="sky" />
                        </div> */}

                        <div className="flex items-center gap-3 w-full mb-4">
                            <div className="flex-1 h-px bg-gray-300"></div>
                            <span className="text-gray-500 text-xs">or use email</span>
                            <div className="flex-1 h-px bg-gray-300"></div>
                        </div>

                        {error && isSignUp && (
                            <div className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg w-full border-l-4 border-red-500 animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="w-full flex flex-col gap-3">
                            <InputGroup icon={<FaUser />} placeholder="Full Name" name="name" value={formData.name} onChange={handleChange} />
                            <InputGroup icon={<FaEnvelope />} placeholder="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
                            <InputGroup
                                icon={<FaLock />}
                                placeholder="Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                showToggle={true}
                                toggleVisible={showPassword}
                                onToggle={() => setShowPassword(!showPassword)}
                            />
                            <InputGroup
                                icon={<FaLock />}
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                showToggle={true}
                                toggleVisible={showConfirmPassword}
                                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 px-12 rounded-full uppercase tracking-wider hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating...' : 'Sign Up'}
                        </button>
                    </form>
                </div>

                <div className="hidden lg:flex form-container sign-in-container absolute top-0 h-full transition-all duration-700 ease-in-out left-0 w-1/2 z-20">
                    <form className="bg-white flex flex-col items-center justify-center px-12 h-full text-center w-full" onSubmit={(e) => handleSubmit(e, 'login')}>
                        <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mb-4">
                            <FaLock className="text-white text-4xl" />
                        </div>
                        <h1 className="font-bold text-4xl mb-2 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Welcome Back</h1>
                        <p className="text-gray-600 mb-6 text-sm">Sign in to continue</p>

                        {/* <div className="flex gap-3 mb-6">
                            <SocialIcon icon={<FaGoogle />} onClick={() => handleSocialLogin('Google')} color="red" />
                            <SocialIcon icon={<FaFacebook />} onClick={() => handleSocialLogin('Facebook')} color="blue" />
                            <SocialIcon icon={<FaLinkedinIn />} onClick={() => handleSocialLogin('LinkedIn')} color="sky" />
                        </div> */}

                        <div className="flex items-center gap-3 w-full mb-4">
                            <div className="flex-1 h-px bg-gray-300"></div>
                            <span className="text-gray-500 text-xs">or use email</span>
                            <div className="flex-1 h-px bg-gray-300"></div>
                        </div>

                        {error && !isSignUp && (
                            <div className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg w-full border-l-4 border-red-500 animate-shake">
                                {error}
                            </div>
                        )}

                        <div className="w-full flex flex-col gap-3">
                            <InputGroup icon={<FaEnvelope />} placeholder="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
                            <InputGroup
                                icon={<FaLock />}
                                placeholder="Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                showToggle={true}
                                toggleVisible={showPassword}
                                onToggle={() => setShowPassword(!showPassword)}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={() => router.push('/forgot-password')}
                            className="text-sm text-blue-600 hover:text-blue-800 my-4 font-medium"
                        >
                            Forgot your password?
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold py-3 px-12 rounded-full uppercase tracking-wider hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                <div className="hidden lg:block overlay-container absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-50">
                    <div className="overlay bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative -left-full h-full w-[200%] transform transition-transform duration-700 ease-in-out">
                        <div className="overlay-panel overlay-left absolute top-0 flex flex-col items-center justify-center text-center px-10 h-full w-1/2 transform transition-transform duration-700 ease-in-out">
                            <div
                                className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
                                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop')" }}
                            />

                            <div className="relative z-10">
                                <div className="inline-block p-5 bg-white/20 backdrop-blur-sm rounded-3xl mb-6">
                                    <FaLock className="text-white text-5xl" />
                                </div>
                                <h1 className="font-bold text-5xl mb-4 text-white drop-shadow-lg">Welcome Back!</h1>
                                <p className="text-lg font-medium mb-8 text-white/90 leading-relaxed max-w-md">
                                    To keep connected with us please login with your personal info
                                </p>
                                <button
                                    className="bg-white/20 backdrop-blur-sm border-2 border-white text-white font-bold py-3 px-12 rounded-full uppercase tracking-wider hover:bg-white hover:text-purple-600 transition-all shadow-lg transform hover:scale-105"
                                    onClick={() => {
                                        setIsSignUp(false);
                                        setError('');
                                        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                                    }}
                                >
                                    Already have an account?
                                </button>
                            </div>
                        </div>

                        <div className="overlay-panel overlay-right absolute top-0 right-0 flex flex-col items-center justify-center text-center px-10 h-full w-1/2 transform transition-transform duration-700 ease-in-out">
                            <div
                                className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
                                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')" }}
                            />

                            <div className="relative z-10">
                                <div className="inline-block p-5 bg-white/20 backdrop-blur-sm rounded-3xl mb-6">
                                    <FaUser className="text-white text-5xl" />
                                </div>
                                <h1 className="font-bold text-5xl mb-4 text-white drop-shadow-lg">Hello, Friend!</h1>
                                <p className="text-lg font-medium mb-8 text-white/90 leading-relaxed max-w-md">
                                    Enter your personal details and start your journey with us
                                </p>
                                <button
                                    className="bg-white/20 backdrop-blur-sm border-2 border-white text-white font-bold py-3 px-12 rounded-full uppercase tracking-wider hover:bg-white hover:text-pink-600 transition-all shadow-lg transform hover:scale-105"
                                    onClick={() => {
                                        setIsSignUp(true);
                                        setError('');
                                        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                                    }}
                                >
                                    Create Account?
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }

                .animate-blob {
                    animation: blob 7s infinite;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                
                .animate-shake {
                    animation: shake 0.5s;
                }

                .sign-up-container,
                .sign-in-container {
                    left: 0;
                    width: 50%;
                }
                
                .sign-up-container {
                    z-index: 10;
                }
                
                .sign-in-container {
                    z-index: 20;
                }
                
                .right-panel-active .sign-in-container {
                    transform: translateX(100%);
                    opacity: 0;
                }
                
                .right-panel-active .sign-up-container {
                    transform: translateX(100%);
                    opacity: 1;
                    z-index: 50;
                    animation: show 0.7s;
                }

                @keyframes show {
                    0%, 49.99% {
                        opacity: 0;
                        z-index: 10;
                    }
                    50%, 100% {
                        opacity: 1;
                        z-index: 50;
                    }
                }

                .right-panel-active .overlay-container {
                    transform: translateX(-100%);
                    border-radius: 30px 0 0 30px; /* Switch to LEFT borders */
                }
                
                /* Default state of overlay container has rounded-r-30px, rounded-l-none */
                .overlay-container {
                     border-radius: 0 30px 30px 0; /* Default RIGHT borders */
                }

                .right-panel-active .overlay {
                    transform: translateX(50%);
                }

                .overlay-left {
                    transform: translateX(-20%);
                }
                
                .overlay-right {
                    right: 0;
                    transform: translateX(0);
                }

                .right-panel-active .overlay-left {
                    transform: translateX(0);
                }
                
                .right-panel-active .overlay-right {
                    transform: translateX(20%);
                }
            `}</style>
        </div>
    );
}

function SocialIcon({ icon, onClick, color }: any) {
    const colorClasses: any = {
        red: 'hover:bg-red-50 hover:text-red-600 hover:border-red-600',
        blue: 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-600',
        sky: 'hover:bg-sky-50 hover:text-sky-600 hover:border-sky-600'
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-12 h-12 border-2 border-gray-300 rounded-full flex justify-center items-center text-gray-600 transition-all transform hover:scale-110 ${colorClasses[color]}`}
        >
            {icon}
        </button>
    );
}

function InputGroup({ icon, name, type = "text", placeholder, value, onChange, showToggle, toggleVisible, onToggle }: any) {
    return (
        <div className="bg-gray-50 border-2 border-gray-200 flex items-center p-4 rounded-xl w-full transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-md">
            <span className="text-blue-500 mr-3 text-lg">{icon}</span>
            <input
                name={name}
                type={type}
                placeholder={placeholder}
                className="bg-transparent outline-none flex-1 text-gray-700 placeholder-gray-400"
                value={value}
                onChange={onChange}
                required={!showToggle}
            />
            {showToggle && (
                <button
                    type="button"
                    onClick={onToggle}
                    className="text-gray-400 hover:text-blue-500 transition-colors ml-2"
                >
                    {toggleVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
            )}
        </div>
    );
}