"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCompass, FaHome, FaMapMarkedAlt } from 'react-icons/fa';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="mb-8 relative inline-block">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="text-9xl text-primary/20"
                        >
                            <FaCompass />
                        </motion.div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-6xl font-black text-gray-800">404</span>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                        Off the Map!
                    </h1>

                    <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
                        It looks like you've wandered into uncharted territory. This page doesn't exist on our map.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                        <Link href="/">
                            <button className="px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all flex items-center gap-2">
                                <FaHome /> Return Home
                            </button>
                        </Link>

                        <Link href="/destinations">
                            <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 hover:-translate-y-1 transition-all flex items-center gap-2">
                                <FaMapMarkedAlt /> Explore Destinations
                            </button>
                        </Link>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-16 text-gray-400 text-sm"
                >
                    <p>Travel Sansar - Start your journey with us.</p>
                </motion.div>
            </div>
        </div>
    );
}
