"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaGift } from "react-icons/fa";
import Link from "next/link";

const PromoPopup = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show after 5 seconds
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
                    />

                    {/* Popup Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Decorative Background */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-secondary/10" />

                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 z-50 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md text-gray-400 hover:text-gray-600 transition"
                        >
                            <FaTimes />
                        </button>

                        <div className="relative z-10 p-8 text-center">
                            <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center shadow-lg mb-6 text-secondary text-4xl border-4 border-secondary/20">
                                <FaGift className="animate-bounce" />
                            </div>

                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                Special Offer for You!
                            </h3>
                            <p className="text-gray-500 mb-6 font-medium">
                                Plan your dream items now and get exclusive discount.
                            </p>

                            <div className="bg-gradient-to-r from-secondary to-orange-500 text-white py-4 px-6 rounded-2xl mb-6 transform -rotate-2 shadow-lg hover:rotate-0 transition duration-300">
                                <p className="text-sm font-medium opacity-90 uppercase tracking-widest">Use Code</p>
                                <p className="text-3xl font-black tracking-wider">TRAVEL20</p>
                                <p className="text-sm font-medium opacity-90 mt-1">For 20% OFF on all tours</p>
                            </div>

                            <div className="space-y-3">
                                <Link
                                    href="/tours"
                                    onClick={handleClose}
                                    className="block w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition shadow-lg transform hover:-translate-y-0.5"
                                >
                                    Explore Tours
                                </Link>
                                <button
                                    onClick={handleClose}
                                    className="block w-full py-3 text-gray-400 hover:text-gray-600 font-medium text-sm"
                                >
                                    No thanks, I'll pay full price
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PromoPopup;
