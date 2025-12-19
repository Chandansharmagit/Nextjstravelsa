"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import Link from "next/link";

const ChristmasPopup = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show popup after 3 seconds
        const timer = setTimeout(() => {
            // Check if already shown in this session to avoid annoyance (optional, removed for now to ensure user sees it)
            // const hasShown = sessionStorage.getItem("christmasPopupShown");
            // if (!hasShown) {
            setIsVisible(true);
            //    sessionStorage.setItem("christmasPopupShown", "true");
            // }
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const closePopup = () => {
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closePopup}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Popup Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5, y: 100 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 100 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden shadow-2xl border-4 border-christmas-gold/30"
                    >
                        {/* Close Button */}
                        <button
                            onClick={closePopup}
                            className="absolute top-4 right-4 z-20 bg-white/20 backdrop-blur-md text-white hover:bg-white/40 p-2 rounded-full transition-colors"
                        >
                            <FaTimes size={20} />
                        </button>

                        <div className="relative aspect-[16/10] w-full">
                            <Image
                                src="/images/christmas_popup_card.png"
                                alt="Merry Christmas"
                                fill
                                className="object-cover"
                                priority
                            />
                            {/* Overlay Content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-center"
                                >
                                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-serif">
                                        Happy Holidays!
                                    </h2>
                                    <p className="text-gray-200 text-lg mb-6 max-w-md mx-auto drop-shadow-md">
                                        Celebrate the season with our exclusive travel packages.
                                    </p>
                                    <Link href="/destinations">
                                        <button
                                            onClick={closePopup}
                                            className="px-8 py-3 bg-christmas-red text-white font-bold rounded-full shadow-lg hover:bg-red-700 hover:shadow-red-600/50 transform hover:-translate-y-1 transition-all border border-white/20"
                                        >
                                            Explore Offers 🎁
                                        </button>
                                    </Link>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ChristmasPopup;
