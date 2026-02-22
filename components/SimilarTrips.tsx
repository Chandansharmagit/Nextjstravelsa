"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';

interface Destination {
    _id: string;
    title: string;
    location?: string;
    description?: string;
    image?: string;
    images?: any[];
    price?: number;
}

interface SimilarTripsProps {
    currentDestinationId: string;
    currentLocation?: string;
}

import { CONFIG } from '../lib/config';
import { getImageUrl } from '@/lib/utils/image';

export default function SimilarTrips({ currentDestinationId, currentLocation }: SimilarTripsProps) {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const API_URL = CONFIG.API_BASE_URL;

    useEffect(() => {
        const fetchSimilarDestinations = async () => {
            try {
                const res = await fetch(`${API_URL}/destinations`);
                if (res.ok) {
                    const data = await res.json();
                    const allDestinations = data.destinations || data;

                    // Filter out current destination and get similar ones
                    const similar = allDestinations
                        .filter((dest: Destination) => dest._id !== currentDestinationId)
                        .slice(0, 3); // Show 3 similar destinations

                    setDestinations(similar);
                }
            } catch (error) {
                console.error('Failed to fetch similar destinations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSimilarDestinations();
    }, [currentDestinationId, currentLocation]);

    const getImageUrl = (destination: Destination) => {
        if (destination.images && destination.images.length > 0) {
            const firstImage = destination.images[0];
            if (typeof firstImage === 'string') return firstImage;
            return firstImage?.path || firstImage?.url;
        }
        return destination.image || '/placeholder.jpg';
    };

    if (loading) {
        return (
            <div className="py-20">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter h-font">
                        Similar Expeditions
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white/50 rounded-[32px] h-[400px] animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (destinations.length === 0) return null;

    return (
        <section className="py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-1.5 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full" />
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter h-font">
                        Similar Expeditions
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {destinations.map((destination, index) => (
                        <motion.div
                            key={destination._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Link
                                href={`/destination/${destination._id}`}
                                className="group block relative overflow-hidden bg-white rounded-[32px] shadow-[0_16px_40px_-8px_rgba(0,0,0,0.08)] hover:shadow-[0_32px_80px_-16px_rgba(0,0,0,0.15)] transition-all duration-500 border border-slate-100/50"
                            >
                                {/* Image Container */}
                                <div className="relative h-64 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent z-10" />
                                    <Image
                                        src={getImageUrl(destination)}
                                        alt={destination.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />

                                    {/* Location Badge */}
                                    {destination.location && (
                                        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg">
                                            <FaMapMarkerAlt className="text-blue-600 text-xs" />
                                            <span className="text-slate-900 font-bold text-xs">
                                                {destination.location}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6 relative">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight mb-3 group-hover:text-blue-600 transition-colors duration-300 p-font">
                                        {destination.title}
                                    </h3>

                                    {destination.description && (
                                        <p className="text-slate-500 font-medium text-sm leading-relaxed line-clamp-2 mb-4">
                                            {destination.description}
                                        </p>
                                    )}

                                    {/* Explore Button */}
                                    <div className="flex items-center justify-between">
                                        {destination.price && (
                                            <div className="text-slate-900 font-black text-lg">
                                                ${destination.price}
                                                <span className="text-slate-400 text-xs font-bold ml-1">/person</span>
                                            </div>
                                        )}
                                        <div className="ml-auto flex items-center gap-2 text-blue-600 font-bold text-sm group-hover:gap-3 transition-all">
                                            Explore
                                            <FaArrowRight className="text-xs" />
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Effect Overlay */}
                                <div className="absolute inset-0 border-2 border-blue-600 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* View All Link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    viewport={{ once: true }}
                    className="flex justify-center mt-12"
                >
                    <Link
                        href="/destinations"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                    >
                        Explore All Destinations
                        <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
}
