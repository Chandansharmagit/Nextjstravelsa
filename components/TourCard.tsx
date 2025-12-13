"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaClock, FaUsers, FaStar, FaDollarSign, FaArrowRight, FaHiking, FaUmbrellaBeach, FaLandmark } from 'react-icons/fa';

interface TourProps {
    tour: {
        _id: string;
        title?: string;
        name?: string;
        images?: { url: string }[];
        image?: string;
        price: number;
        duration: string;
        destination: any;
        groupSize?: string;
        difficulty?: string;
        type?: string;
    };
    featured?: boolean;
}

const TourCard = ({ tour, featured = false }: TourProps) => {
    const title = tour.title || tour.name || "Untitled Tour";
    const imageSrc = tour.images?.[0]?.url || tour.image || '/placeholder.jpg';

    // Get tour type icon
    const getTourIcon = () => {
        const type = tour.type?.toLowerCase();
        if (type?.includes('trek') || type?.includes('hik')) return <FaHiking />;
        if (type?.includes('beach') || type?.includes('island')) return <FaUmbrellaBeach />;
        if (type?.includes('cultural') || type?.includes('heritage')) return <FaLandmark />;
        return <FaStar />;
    };

    // Get difficulty badge color
    const getDifficultyColor = () => {
        const difficulty = tour.difficulty?.toLowerCase();
        if (difficulty?.includes('easy')) return 'bg-green-500';
        if (difficulty?.includes('moderate')) return 'bg-yellow-500';
        if (difficulty?.includes('hard')) return 'bg-red-500';
        return 'bg-blue-500';
    };

    return (
        <Link href={`/tours/${tour._id}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer ${featured ? 'h-[500px]' : 'h-[420px]'
                    } shadow-lg hover:shadow-2xl transition-all duration-300`}
            >
                {/* Full Image Background */}
                <div className="absolute inset-0">
                    <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Price Badge - Top Right with Glassmorphism */}
                <div className="absolute top-4 right-4 px-4 py-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-full">
                    <div className="flex items-center gap-1.5 text-white font-bold">
                        <span className="text-lg">NRS {tour.price}</span>
                    </div>
                </div>

                {/* Difficulty Badge - Top Left */}
                {tour.difficulty && (
                    <div className={`absolute top-4 left-4 px-3 py-1.5 ${getDifficultyColor()} rounded-full`}>
                        <span className="text-white text-xs font-bold">
                            {tour.difficulty}
                        </span>
                    </div>
                )}

                {/* Tour Type Badge - Below difficulty */}
                {tour.type && (
                    <div className="absolute top-16 left-4 px-3 py-1.5 bg-primary/90 backdrop-blur-sm rounded-full">
                        <span className="text-white text-xs font-bold flex items-center gap-1.5">
                            {getTourIcon()}
                            {tour.type}
                        </span>
                    </div>
                )}

                {/* Content - Floats over image */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                    {/* Info Pills - Above title */}
                    <div className="flex flex-wrap gap-2 mb-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        {/* Duration */}
                        <div className="px-3 py-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full">
                            <div className="flex items-center gap-1.5 text-white text-xs font-semibold">
                                <FaClock className="text-secondary" />
                                <span>{tour.duration}</span>
                            </div>
                        </div>

                        {/* Group Size */}
                        {tour.groupSize && (
                            <div className="px-3 py-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full">
                                <div className="flex items-center gap-1.5 text-white text-xs font-semibold">
                                    <FaUsers className="text-secondary" />
                                    <span>{tour.groupSize}</span>
                                </div>
                            </div>
                        )}

                        {/* Rating */}
                        <div className="px-3 py-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full">
                            <div className="flex items-center gap-1.5 text-white text-xs font-semibold">
                                <FaStar className="text-yellow-400" />
                                <span>4.8</span>
                            </div>
                        </div>
                    </div>

                    {/* Title - Large and Bold */}
                    <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`text-white font-bold mb-3 line-clamp-2 ${featured ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'
                            } group-hover:text-secondary transition-colors duration-300`}
                    >
                        {title}
                    </motion.h3>

                    {/* Destination - Subtle */}
                    {tour.destination && (
                        <motion.p
                            className="text-white/80 text-sm mb-4"
                        >
                            📍 {typeof tour.destination === 'string' ? tour.destination : tour.destination.title || 'Nepal'}
                        </motion.p>
                    )}

                    {/* Explore Button - Slides in on hover */}
                    <motion.div
                        className="flex items-center gap-2 text-white font-semibold text-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                    >
                        <span>View Tour</span>
                        <FaArrowRight className="transform group-hover:translate-x-2 transition-transform duration-300" />
                    </motion.div>
                </div>

                {/* Bottom Glassmorphism Panel - Shows on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/10 backdrop-blur-md border-t border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center justify-between text-white text-sm">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            Booking Available
                        </span>
                        <span className="font-bold flex items-center gap-1">
                            Book Now
                            <FaArrowRight className="text-xs" />
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default TourCard;
