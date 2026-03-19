"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCalendarAlt, FaUser, FaEnvelope, FaPhone, FaUsers, FaComment } from 'react-icons/fa';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

interface ServiceBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: any;
}

const ServiceBookingModal = ({ isOpen, onClose, service }: ServiceBookingModalProps) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        travelers: 1,
        travelDate: '',
        specialRequests: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/bookings', {
                ...formData,
                service: service._id
            });
            toast.success('Booking request sent successfully!');
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Booking failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <div className="bg-primary/10 p-6 flex justify-between items-start relative">
                        <div>
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-1">Book Service</h3>
                            <h2 className="text-2xl font-bold text-gray-800">{service.title}</h2>
                            <p className="text-gray-600 text-sm mt-1">Starting from <span className="font-bold text-secondary">{service.price}</span></p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-white rounded-full"
                        >
                            <FaTimes />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="space-y-4">
                            {/* Personal Info */}
                            <div className="grid grid-cols-1 gap-4">
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="relative">
                                    <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Trip Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative">
                                    <FaUsers className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="number"
                                        name="travelers"
                                        min="1"
                                        placeholder="Travelers"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        onChange={handleChange}
                                        value={formData.travelers}
                                    />
                                </div>
                                <div className="relative">
                                    <FaCalendarAlt className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="date"
                                        name="travelDate"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-gray-600"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="relative">
                                <FaComment className="absolute left-3 top-3.5 text-gray-400" />
                                <textarea
                                    name="specialRequests"
                                    placeholder="Special Requests (Optional)"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[100px]"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transform hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? 'Processing...' : 'Confirm Booking'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ServiceBookingModal;
