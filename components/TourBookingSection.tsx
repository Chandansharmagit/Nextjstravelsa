"use client";

import { useState } from 'react';
import { FaCheck, FaCalendarAlt, FaUserFriends, FaStar, FaShieldAlt, FaArrowRight, FaBolt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import BookNowForm from './BookNowForm';
import Modal from './Modal';

interface TourBookingSectionProps {
    tour: {
        _id: string;
        title: string;
        price: number;
        duration: string;
        maxTravelers?: number;
        difficulty?: string;
        type?: string;
    };
}

const TourBookingSection = ({ tour }: TourBookingSectionProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const benefits = [
        "Best Price Guarantee",
        "No Hidden Charges",
        "Safe & Secure Booking",
        "Free Cancellation"
    ];

    return (
        <>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/70 backdrop-blur-3xl rounded-[40px] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.15)] border border-white/60 p-8 overflow-hidden"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl -ml-16 -mb-16" />

                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6 h-font">
                        <FaBolt className="text-[8px]" />
                        Instant Confirmation
                    </div>

                    <div className="flex items-baseline gap-2 mb-8">
                        <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter h-font leading-none">
                            <span className="text-sm font-black text-slate-400 uppercase tracking-widest mr-2 align-middle">NRS</span>
                            {tour.price}
                        </span>
                        <span className="text-slate-400 font-bold text-sm">/ person</span>
                    </div>

                    <div className="space-y-3 mb-10">
                        <div className="group flex items-center justify-between p-4 bg-white/50 hover:bg-white rounded-2xl border border-slate-100 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <FaCalendarAlt size={14} />
                                </div>
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest h-font">Duration</span>
                            </div>
                            <span className="text-sm font-black text-slate-900 h-font">{tour.duration} Days</span>
                        </div>

                        <div className="group flex items-center justify-between p-4 bg-white/50 hover:bg-white rounded-2xl border border-slate-100 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                    <FaShieldAlt size={14} />
                                </div>
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest h-font">Difficulty</span>
                            </div>
                            <span className="text-sm font-black text-slate-900 h-font capitalize">{tour.difficulty || 'Moderate'}</span>
                        </div>

                        <div className="group flex items-center justify-between p-4 bg-white/50 hover:bg-white rounded-2xl border border-slate-100 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <FaUserFriends size={14} />
                                </div>
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest h-font">Group Size</span>
                            </div>
                            <span className="text-sm font-black text-slate-900 h-font">Max {tour.maxTravelers || 12}</span>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsModalOpen(true)}
                        className="w-full py-5 bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-[24px] hover:bg-black transition-all shadow-2xl shadow-slate-900/20 group relative overflow-hidden h-font"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            Initiate Expedition
                            <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
                        </span>
                    </motion.button>

                    <div className="mt-8 pt-8 border-t border-slate-100">
                        <div className="grid grid-cols-1 gap-3">
                            {benefits.map((benefit, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest h-font">
                                    <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                        <FaCheck size={8} />
                                    </div>
                                    {benefit}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Secure Your Spot"
            >
                <BookNowForm
                    destinationId={tour._id}
                    destinationTitle={tour.title}
                    onSuccess={() => setIsModalOpen(false)}
                />
            </Modal>
        </>
    );
};

export default TourBookingSection;
