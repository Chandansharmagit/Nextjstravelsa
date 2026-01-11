'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSuitcaseRolling } from 'react-icons/fa';
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
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
                    >
                        {/* Header Image/Gradient */}
                        <div className="relative h-32 bg-gradient-to-r from-primary to-teal-600 flex items-center px-8 border-b-4 border-secondary/20">
                            <div className="z-10">
                                <h2 className="text-3xl font-black text-white flex items-center gap-3">
                                    <FaSuitcaseRolling className="text-secondary" />
                                    Plan Your Adventure
                                </h2>
                                <p className="text-white/80 font-medium mt-1">Tell us where you want to go!</p>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/40 transition-all z-20"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>

                        {/* Form Container */}
                        <div className="p-2">
                            {/* We repurpose the LeadCaptureForm here */}
                            {/* The form already has its own styling, so we use a wrapper to match the modal aesthetic if needed */}
                            <div className="scale-[0.98]">
                                <LeadCaptureForm />
                            </div>
                        </div>

                        {/* Footer Info */}
                        <div className="p-6 bg-gray-50 text-center border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                                Powered by <span className="font-bold text-primary">Travel Sansar</span>. Our experts usually respond within 2-4 hours.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LeadCaptureModal;
