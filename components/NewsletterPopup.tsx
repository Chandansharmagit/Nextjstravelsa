'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaTimes, FaEnvelope } from 'react-icons/fa';
import api from '@/lib/api';

export default function NewsletterPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Check if user has already actioned the popup
        const hasActioned = localStorage.getItem('newsletter_popup_closed');

        if (!hasActioned) {
            // Show popup after 5 seconds
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        // Don't show again for this session/device
        localStorage.setItem('newsletter_popup_closed', 'true');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            await api.post('/newsletter', { email });
            setStatus('success');
            setTimeout(() => {
                handleClose();
                setStatus('idle');
                setEmail('');
            }, 2000);
        } catch (error: any) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Something went wrong');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative"
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                        >
                            <FaTimes size={20} />
                        </button>

                        <div className="p-8 text-center relative overflow-hidden">
                            {/* Decorative Background */}
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/10 to-secondary/10 -skew-y-6 transform -translate-y-10" />

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                                    <FaEnvelope size={32} />
                                </div>

                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    Join Our Community
                                </h2>
                                <p className="text-gray-500 mb-8">
                                    Subscribe to our newsletter and get exclusive travel offers, tips, and inspiration delivered to your inbox.
                                </p>

                                {status === 'success' ? (
                                    <div className="bg-green-50 text-green-600 p-4 rounded-xl flex items-center justify-center gap-2">
                                        <FaPaperPlane />
                                        <span>Thanks for subscribing!</span>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your email address"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400"
                                                required
                                            />
                                        </div>

                                        {status === 'error' && (
                                            <p className="text-red-500 text-sm">{message}</p>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {status === 'loading' ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                'Subscribe Now'
                                            )}
                                        </button>
                                    </form>
                                )}

                                <p className="text-xs text-gray-400 mt-6">
                                    No spam, unsubscribe at any time.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
