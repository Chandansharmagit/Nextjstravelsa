"use client";

import { useState } from 'react';
import { FaCheck, FaTimes, FaCalendarAlt, FaUserFriends, FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import BookNowForm from './BookNowForm';

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

    return (
        <>
            {/* Sticky Booking Card */}
            <div className="bg-white rounded-2xl shadow-card p-6 border border-gray-100 sticky top-32">
                <div className="flex items-end gap-2 mb-6">
                    <span className="text-gray-500 font-medium">From</span>
                    <span className="text-4xl font-bold text-primary">NRS {tour.price}</span>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3 text-gray-700">
                            <FaCalendarAlt className="text-secondary" />
                            <span className="font-medium">Duration</span>
                        </div>
                        <span className="font-bold">{tour.duration} Days</span>
                    </div>

                    {tour.maxTravelers && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3 text-gray-700">
                                <FaUserFriends className="text-secondary" />
                                <span className="font-medium">Group Size</span>
                            </div>
                            <span className="font-bold">Max {tour.maxTravelers}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3 text-gray-700">
                            <FaStar className="text-secondary" />
                            <span className="font-medium">Difficulty</span>
                        </div>
                        <span className="font-bold capitalize">{tour.difficulty || 'Moderate'}</span>
                    </div>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-4 bg-secondary text-white font-bold text-lg rounded-xl hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 mb-4"
                >
                    Book This Tour
                </button>
                {/* 
                <button className="w-full py-4 border-2 border-primary text-primary font-bold text-lg rounded-xl hover:bg-primary hover:text-white transition-all">
                    Ask a Question
                </button> */}

                <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaCheck className="text-green-500" />
                            <span>Best Price Guarantee</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaCheck className="text-green-500" />
                            <span>No Hidden Charges</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaCheck className="text-green-500" />
                            <span>Safe & Secure Booking</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl"
                        >
                            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-10">
                                <h3 className="text-xl font-bold text-gray-800">Book {tour.title}</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition"
                                >
                                    <FaTimes className="text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6">
                                <BookNowForm
                                    destinationId={tour._id}
                                    destinationTitle={tour.title}
                                    onSuccess={() => setIsModalOpen(false)}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default TourBookingSection;
