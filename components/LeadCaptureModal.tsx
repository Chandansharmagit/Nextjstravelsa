'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCompass, FaPhoneAlt, FaWhatsapp, FaShieldAlt } from 'react-icons/fa';
import LeadCaptureForm from './LeadCaptureForm';

interface LeadCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ isOpen, onClose }) => {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 font-sans">
                    {/* Backdrop with Blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-slate-200/80 z-10"
                    >
                        {/* Hero Header */}
                        <div className="relative py-8 px-8 bg-slate-900 text-white shrink-0 overflow-hidden border-b border-slate-800">
                            {/* Ambient Glows */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/15 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16" />

                            <div className="relative z-10 flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-bold text-[10px] uppercase tracking-widest">
                                            <FaCompass className="text-indigo-400" />
                                            24/7 Sherpa Concierge
                                        </span>
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight font-outfit">
                                        Plan Your <span className="font-playfair italic font-normal text-amber-400">Himalayan Journey</span>
                                    </h2>
                                    <p className="text-slate-300 text-xs sm:text-sm font-medium mt-1">
                                        Share your travel vision & receive a custom NPR itinerary within 2 hours.
                                    </p>
                                </div>

                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white hover:text-slate-900 transition-all shadow-md shrink-0"
                                    aria-label="Close modal"
                                >
                                    <FaTimes size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Form Content Wrapper */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 bg-white">
                            <LeadCaptureForm onSuccess={onClose} />
                        </div>

                        {/* Footer Bar */}
                        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium shrink-0">
                            <div className="flex items-center gap-2">
                                <FaShieldAlt className="text-indigo-600" size={14} />
                                <span>TAAN & NATTA Certified Local Experts</span>
                            </div>

                            <a
                                href="https://wa.me/9779855051795?text=Namaste!%20I%20want%20to%20plan%20a%20Himalayan%20tour."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                            >
                                <FaWhatsapp size={14} /> Direct WhatsApp: +977 9855051795
                            </a>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LeadCaptureModal;
