"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaTimes, FaLock, FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

interface LoginPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginPromptModal = ({ isOpen, onClose }: LoginPromptModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[450px] max-h-[90vh] z-[10001] bg-white rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.25)] border border-slate-100 overflow-y-auto custom-scrollbar"
                    >
                        {/* Header Image Section */}
                        <div className="relative h-48 bg-slate-900 flex items-center justify-center overflow-hidden">
                            <Image 
                                src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000&auto=format&fit=crop"
                                alt="Travel"
                                fill
                                className="object-cover opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            
                            <div className="relative w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl">
                                <FaLock className="text-white text-3xl animate-pulse" />
                            </div>
                            <button 
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full transition-all backdrop-blur-md"
                            >
                                <FaTimes size={14} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 text-center">
                            <h2 className="text-2xl font-black text-slate-800 mb-3">Login Required</h2>
                            <p className="text-slate-500 font-medium leading-relaxed mb-8">
                                Please sign in to your account to explore more sanctuaries and access premium booking features.
                            </p>

                            <div className="space-y-3">
                                <Link 
                                    href="/login" 
                                    onClick={onClose}
                                    className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[20px] font-black uppercase tracking-widest text-[13px] shadow-lg shadow-blue-200 transition-all hover:translate-y-[-2px] active:scale-95 group"
                                >
                                    Sign In <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link 
                                    href="/register" 
                                    onClick={onClose}
                                    className="w-full block py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-[20px] font-black uppercase tracking-widest text-[13px] transition-all"
                                >
                                    Create New Account
                                </Link>
                            </div>

                            <button 
                                onClick={onClose}
                                className="mt-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors"
                            >
                                Continue Browsing
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default LoginPromptModal;
