"use client";

import { useState } from 'react';
import { FaCommentAlt, FaTimes, FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

const FeedbackWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/feedback', { name, email, message, rating });
            if (res.status === 201) {
                setSubmitted(true);
                setTimeout(() => {
                    setSubmitted(false);
                    setIsOpen(false);
                    setMessage('');
                    setName('');
                    setEmail('');
                    setRating(5);
                }, 2000);
            }
        } catch (error) {
            console.error('Feedback error:', error);
        }
    };

    return (
        <div className="fixed bottom-6 left-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white p-6 rounded-2xl shadow-2xl w-80 mb-4 border border-gray-100"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800">Your Feedback</h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <FaTimes />
                            </button>
                        </div>

                        {submitted ? (
                            <div className="text-center py-8 text-green-600 font-medium">
                                Thank you for your feedback!
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div className="flex justify-center mb-2 space-x-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className={`text-2xl transition ${star <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
                                        >
                                            <FaStar />
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    required
                                    className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-secondary"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    required
                                    className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-secondary"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <textarea
                                    placeholder="Tell us about your experience..."
                                    required
                                    rows={3}
                                    className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-secondary resize-none"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                                <button type="submit" className="w-full py-2 bg-secondary text-white rounded-lg font-bold hover:bg-orange-600 transition">
                                    Send Feedback
                                </button>
                            </form>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                suppressHydrationWarning
                onClick={() => setIsOpen(!isOpen)}
                className="bg-secondary text-white p-4 rounded-full shadow-xl hover:scale-110 transition duration-300 flex items-center justify-center w-14 h-14"
            >
                {isOpen ? <FaTimes size={24} /> : <FaCommentAlt size={24} />}
            </button>
        </div>
    );
};

export default FeedbackWidget;
