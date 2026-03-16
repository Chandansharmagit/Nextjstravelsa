"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCloseCircleOutline } from 'react-icons/io5';
import Link from 'next/link';

const ElectionEvent = () => {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Show modal after a small delay
        const timer = setTimeout(() => {
            const hasSeen = localStorage.getItem('election_seen');
            // If the user hasn't seen it yet, or if we want to show it every refresh during election season
            setShowModal(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                            onClick={() => setShowModal(false)}
                        />

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="relative w-full max-w-7xl h-auto max-h-[90vh] bg-white rounded-[30px] md:rounded-[50px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row shadow-[0_0_80px_rgba(37,99,235,0.1)]"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 md:top-8 md:right-8 text-slate-400 hover:text-slate-900 transition-colors z-[100]"
                            >
                                <IoCloseCircleOutline size={32} className="md:w-12 md:h-12" />
                            </button>

                            {/* Left Side: Awareness & Vision */}
                            <div className="flex-1 p-6 md:p-12 flex flex-col bg-gradient-to-br from-white to-slate-50 relative overflow-hidden min-h-[400px] md:min-h-[auto] overflow-y-auto">
                                <div className="absolute -left-20 -top-20 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl" />

                                <div className="relative z-10 flex flex-col h-full overflow-y-auto custom-scrollbar pr-2">
                                    <div className="flex-1 flex flex-col justify-center py-4">
                                        <div className="flex items-center justify-center md:justify-start gap-3 text-blue-600 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] mb-4">
                                            <span className="w-6 h-px bg-blue-600/30"></span>
                                            Team Travel Sansr for Future
                                            <span className="w-6 h-px bg-blue-600/30"></span>
                                        </div>

                                        <div className="mb-2 inline-block text-center md:text-left">
                                            <motion.div
                                                animate={{
                                                    rotate: [0, 5, -5, 0],
                                                    scale: [1, 1.05, 1],
                                                }}
                                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                                className="text-4xl md:text-8xl"
                                            >
                                                🔔
                                            </motion.div>
                                        </div>

                                        <motion.h2
                                            className="text-4xl md:text-8xl font-black tracking-tighter text-slate-900 mb-2 md:mb-4 h-font leading-[0.8] text-center md:text-left"
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            𝐕𝐨𝐭𝐞 𝐟𝐨𝐫 <br /> 𝐂𝐡𝐚𝐧𝐠𝐞!
                                        </motion.h2>

                                        <motion.div
                                            initial={{ x: -10, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.3 }}
                                            className="space-y-4 text-center md:text-left"
                                        >
                                            <p className="text-slate-500 font-bold text-base md:text-xl p-font italic max-w-xl">
                                                Our nation deserves a digital future, transparency, and youth empowerment.
                                            </p>
                                        </motion.div>
                                    </div>

                                    {/* Action Section */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className="mt-6 bg-blue-50 p-6 md:p-8 rounded-[35px] border border-blue-100 shadow-sm relative overflow-hidden group mb-4"
                                    >
                                        <div className="absolute -right-4 -top-4 text-blue-100 text-6xl md:text-7xl rotate-12 group-hover:rotate-45 transition-transform duration-700">🗳️</div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-4 mb-3">
                                                <div className="px-3 py-1 bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full">Election Awareness</div>
                                                <div className="text-blue-600 font-black text-[10px] uppercase tracking-widest">Digital Nepal</div>
                                            </div>
                                            <h4 className="text-xl md:text-2xl font-black text-slate-900 mb-2 h-font">Shape Our Future</h4>
                                            <p className="text-slate-600 font-bold text-xs md:text-sm mb-4 md:mb-6">Join us in supporting a system that values technology, integrity, and progress.</p>
                                            <Link href="/tours" onClick={() => setShowModal(false)} className="inline-flex items-center gap-3 px-6 py-3 md:px-8 md:py-4 bg-slate-900 text-white rounded-2xl font-black text-xs md:text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 w-full md:w-auto justify-center md:justify-start">
                                                Explore Our Vision
                                                <span className="text-blue-400">🔔</span>
                                            </Link>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Right Side: Political Support */}
                            <div className="flex-1 bg-blue-600 p-8 md:p-16 flex flex-col justify-center text-white relative overflow-hidden overflow-y-auto">
                                <div className="absolute -right-20 -bottom-20 w-[600px] h-[600px] bg-blue-500 rounded-full blur-[120px] opacity-50" />

                                <div className="relative z-10 text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", delay: 0.5 }}
                                        className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-2xl mx-auto mb-10"
                                    >
                                        <span className="text-7xl animate-bounce">🔔</span>
                                    </motion.div>

                                    <h3 className="text-2xl font-black tracking-[0.3em] uppercase opacity-80 h-font">
                                        Vision for the Future
                                    </h3>

                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <p className="text-blue-100 font-black text-xl md:text-3xl uppercase tracking-tighter h-font">
                                                Building a New Nepal
                                            </p>
                                            <h4 className="text-4xl md:text-7xl font-black tracking-tighter h-font leading-tight italic">
                                                Change is <br /> Possible
                                            </h4>

                                            <p className="text-white/60 font-bold text-lg md:text-xl p-font max-w-md mx-auto pt-2">
                                                Join the movement for a prosperous, transparent, and digital nation.
                                            </p>
                                        </div>

                                        <div className="group/btn relative inline-block">
                                            <div className="absolute -inset-1 bg-white rounded-[25px] blur opacity-25 group-hover/btn:opacity-50 transition duration-1000 group-hover/btn:duration-200"></div>
                                            <div className="relative inline-block px-8 py-4 md:px-12 md:py-6 bg-white rounded-[20px] md:rounded-[25px] shadow-[0_20px_50px_rgba(0,0,0,0.2)] transform hover:scale-105 transition-all duration-500">
                                                <p className="text-blue-600 font-black text-xl md:text-4xl tracking-[0.2em] uppercase h-font flex items-center justify-center gap-4">
                                                    RSP - Ghanti
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-blue-100 text-sm md:text-base font-bold uppercase tracking-[0.4em] pt-6 opacity-70">
                                            Empower the Youth • Digital Transformation
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .h-font { font-family: 'Outfit', sans-serif; }
                .p-font { font-family: 'Playfair Display', serif; }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0,0,0,0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0,0,0,0.2);
                }
            `}</style>
        </>
    );
};

export default ElectionEvent;
