"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    destinationName: string;
}

const BookingModal = ({ isOpen, onClose, title, destinationName }: ModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="bg-secondary p-6 flex justify-between items-center text-white">
                            <h3 className="text-xl font-bold">{title}</h3>
                            <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="p-8">
                            <p className="text-gray-600 mb-6">You are booking a trip to <span className="font-bold text-primary">{destinationName}</span>.</p>

                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none transition" placeholder="John Doe" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                                        <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none transition" placeholder="email@example.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                                        <input type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none transition" placeholder="+977..." />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Travel Date</label>
                                        <input type="date" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Travelers</label>
                                        <input type="number" min="1" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none transition" placeholder="2" />
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition mt-4 shadow-lg">
                                    Confirm Booking Request
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BookingModal;
