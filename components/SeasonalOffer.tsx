"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import Link from 'next/link';

const SeasonalOffer = () => {
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Show modal after a small delay
        const timer = setTimeout(() => {
            const hasSeen = localStorage.getItem('seasonal_offer_seen');
            // Show every time for now as per "shown whenever website open or page refresh" logic
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
                            className="relative w-full max-w-6xl h-[680px] bg-white rounded-[30px] md:rounded-[50px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col md:flex-row shadow-[0_0_80px_rgba(20,184,166,0.1)]"
                        >
                            {/* Shared Background Image - Blue Tinted for Better UI */}
                            <div className="absolute inset-0 z-0">
                                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-90" />
                                <div className="absolute inset-0 bg-teal-900/30 mix-blend-multiply" />
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-teal-900/40" />
                            </div>

                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 md:top-6 md:right-6 text-slate-900 hover:text-teal-600 transition-colors z-[100] bg-white/40 backdrop-blur-xl rounded-full p-2 shadow-lg"
                            >
                                <IoCloseCircleOutline size={28} />
                            </button>

                            {/* Left Side: Seasonal Inspiration */}
                            <div className="flex-1 p-6 md:p-10 flex flex-col bg-white/20 md:bg-white/10 backdrop-blur-[2px] relative z-10 overflow-hidden">
                                <div className="flex-1 flex flex-col justify-center">
                                    <div className="flex items-center justify-center md:justify-start gap-3 text-teal-900 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] mb-3">
                                        <span className="w-6 h-px bg-teal-900/50"></span>
                                        Adventure Awaits in Nepal
                                        <span className="w-6 h-px bg-teal-900/50"></span>
                                    </div>

                                    <div className="mb-2 inline-block text-center md:text-left">
                                        <motion.div
                                            animate={{
                                                y: [0, -8, 0],
                                                rotate: [0, 4, -4, 0],
                                            }}
                                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                            className="text-4xl md:text-6xl"
                                        >
                                            🏔️
                                        </motion.div>
                                    </div>

                                    <motion.h2
                                        className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 mb-2 md:mb-3 h-font leading-[0.85] text-center md:text-left"
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        𝐒𝐩𝐫𝐢𝐧𝐠 <br /> 𝐄𝐱𝐩𝐥𝐨𝐫𝐞𝐫
                                    </motion.h2>

                                    <motion.div
                                        initial={{ x: -10, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="space-y-4 text-center md:text-left mb-6"
                                    >
                                        <p className="text-slate-900 font-bold text-base md:text-lg p-font italic max-w-xl drop-shadow-sm">
                                            Experience the blooming rhododendrons, clear Himalayan views, and vibrant cultural festivals this season.
                                        </p>
                                    </motion.div>

                                    {/* Offer Section */}
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className="bg-teal-950/95 text-white p-5 md:p-7 rounded-[35px] shadow-2xl shadow-teal-950/40 relative overflow-hidden group border border-white/20 backdrop-blur-md"
                                    >
                                        <div className="absolute -right-4 -top-4 text-white/5 text-6xl rotate-12 group-hover:rotate-45 transition-transform duration-700">🎒</div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-4 mb-2">
                                                <div className="px-3 py-1 bg-amber-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full">Special Offer</div>
                                                <div className="text-teal-400 font-black text-[9px] uppercase tracking-widest">SPRING30</div>
                                            </div>
                                            <h4 className="text-xl md:text-2xl font-black mb-1 h-font uppercase tracking-tight">30% OFF DISCOUNT</h4>
                                            <p className="text-teal-100/80 font-bold text-xs mb-5">On trekking & tours booked for April - June!</p>
                                            <Link href="/tours" onClick={() => setShowModal(false)} className="inline-flex items-center gap-3 px-6 py-3 bg-white text-teal-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-50 transition-all w-full justify-center shadow-lg">
                                                Avail Discount
                                                <HiOutlineArrowNarrowRight size={18} className="text-teal-600" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Right Side: Featured Experience */}
                            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center text-white relative z-10 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-teal-950/90 via-blue-900/20 to-transparent" />
                                
                                <div className="relative z-10 text-center">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", delay: 0.5 }}
                                        className="w-20 h-20 bg-white/20 backdrop-blur-2xl border border-white/30 rounded-full flex items-center justify-center text-white shadow-2xl mx-auto mb-8"
                                    >
                                        <span className="text-4xl">☀️</span>
                                    </motion.div>

                                    <h3 className="text-lg font-black tracking-[0.3em] uppercase opacity-90 h-font mb-4">
                                        The Himalayas Call
                                    </h3>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <p className="text-white font-black text-xl md:text-2xl uppercase tracking-tighter h-font drop-shadow-md">
                                                Everest & Annapurna
                                            </p>
                                            <h4 className="text-4xl md:text-7xl font-black tracking-tighter h-font leading-tight italic drop-shadow-xl">
                                                Peak <br /> Season
                                            </h4>

                                            <p className="text-white font-bold text-base md:text-xl p-font max-w-md mx-auto pt-3 drop-shadow-md">
                                                Secure your spot in the most sought-after trekking adventure of the year.
                                            </p>
                                        </div>

                                        <div className="group/btn relative inline-block mt-4">
                                            <div className="absolute -inset-1 bg-white rounded-[20px] blur opacity-30 group-hover/btn:opacity-60 transition duration-1000 group-hover/btn:duration-200"></div>
                                            <div className="relative inline-block px-10 py-4 bg-white rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] transform hover:scale-105 transition-all duration-500">
                                                <p className="text-teal-950 font-black text-2xl tracking-[0.2em] uppercase h-font flex items-center justify-center gap-4">
                                                    Fly Now
                                                </p>
                                            </div>
                                        </div>

                                        <p className="text-white/90 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] pt-6 drop-shadow-sm">
                                            Limited Permits Available
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

export default SeasonalOffer;
