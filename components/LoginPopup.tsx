"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { FaTimes, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Link from 'next/link';

// Global event bus replaced by Context
// export const triggerLoginPopup = () => {
//     window.dispatchEvent(new Event('trigger-login-popup'));
// };

const LoginPopup = () => {
    const { user, showLoginModal, setShowLoginModal } = useAuth();

    // Auto-close if user logs in
    if (user && showLoginModal) {
        setShowLoginModal(false);
    }

    return (
        <AnimatePresence>
            {!user && showLoginModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={() => setShowLoginModal(false)}
                        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden"
                    >
                        <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <FaTimes size={20} />
                        </button>

                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-orange-100 text-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                <FaSignInAlt />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Please Login First</h2>
                            <p className="text-gray-500 mt-2">You need to be signed in to perform this action.</p>
                        </div>

                        <div className="space-y-3">
                            <Link href="/login" onClick={() => setShowLoginModal(false)} className="block w-full py-3 bg-secondary text-white text-center rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-lg shadow-orange-200">
                                Login Now
                            </Link>
                            <Link href="/register" onClick={() => setShowLoginModal(false)} className="block w-full py-3 bg-white text-secondary border-2 border-secondary text-center rounded-xl font-bold text-lg hover:bg-orange-50 transition">
                                Create Account
                            </Link>
                        </div>

                        <p className="text-center text-xs text-gray-400 mt-6">
                            Join thousands of travelers exploring the world with us.
                        </p>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LoginPopup;
