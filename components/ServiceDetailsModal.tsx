"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaConciergeBell } from 'react-icons/fa';
import Image from 'next/image';

interface ServiceDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    service: any;
}

const ServiceDetailsModal = ({ isOpen, onClose, service }: ServiceDetailsModalProps) => {
    if (!isOpen || !service) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur p-2 rounded-full text-gray-800 hover:text-red-500 hover:bg-white transition-all shadow-sm"
                    >
                        <FaTimes size={20} />
                    </button>

                    {/* Image Header */}
                    <div className="relative w-full h-64 md:h-80 bg-gray-100 flex-shrink-0">
                        {service.image ? (
                            <Image
                                src={service.image}
                                alt={service.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <FaConciergeBell className="text-6xl" />
                            </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
                            <h2 className="text-3xl font-bold text-white mb-2">{service.title}</h2>
                            <span className="inline-block px-4 py-1.5 bg-primary text-white font-bold rounded-full text-sm shadow-lg">
                                {service.price}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                        <div className="prose max-w-none text-gray-600 leading-relaxed">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Service Details</h3>
                            <p className="whitespace-pre-line">{service.description}</p>
                        </div>
                    </div>

                    <div className="p-6 pt-0 mt-auto">
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ServiceDetailsModal;
