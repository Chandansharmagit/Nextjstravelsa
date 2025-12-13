"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaMountain, FaUmbrellaBeach, FaCity, FaLandmark, FaArrowRight } from 'react-icons/fa';

interface DestinationProps {
    destination: {
        _id: string;
        title: string;
        images: { path?: string; url?: string }[];
        image?: string;
        description: string;
        location?: string;
        category?: string;
        featured?: boolean;
    };
    featured?: boolean;
}

const DestinationCard = ({ destination, featured = false }: DestinationProps) => {
    const imageSrc = destination.images?.[0]?.path || destination.images?.[0]?.url || destination.image || '/placeholder.jpg';

    // Get category icon
    const getCategoryIcon = () => {
        const category = destination.category?.toLowerCase();
        if (category?.includes('mountain')) return <FaMountain className="text-sm" />;
        if (category?.includes('beach')) return <FaUmbrellaBeach className="text-sm" />;
        if (category?.includes('city')) return <FaCity className="text-sm" />;
        if (category?.includes('cultural')) return <FaLandmark className="text-sm" />;
        return <FaMapMarkerAlt className="text-sm" />;
    };

    // Extract first sentence or create tagline
    const getTagline = () => {
        const firstSentence = destination.description?.split('.')[0] || destination.description;
        return firstSentence?.substring(0, 80) + (firstSentence?.length > 80 ? '...' : '');
    };

    return (
        <Link href={`/destination/${destination._id}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer ${featured ? 'h-[500px]' : 'h-[400px]'
                    } shadow-lg hover:shadow-2xl transition-all duration-300`}
            >
                {/* Full Image Background */}
                <div className="absolute inset-0">
                    <Image
                        src={imageSrc}
                        alt={destination.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                </div>

                {/* Gradient Overlay - Always visible, darkens on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Glassmorphism Badge - Top Right */}
                {destination.featured && (
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full">
                        <span className="text-white text-xs font-bold flex items-center gap-1">
                            ⭐ Featured
                        </span>
                    </div>
                )}

                {/* Category Badge - Top Left */}
                {destination.category && (
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-secondary/90 backdrop-blur-sm rounded-full">
                        <span className="text-white text-xs font-bold flex items-center gap-1.5">
                            {getCategoryIcon()}
                            {destination.category}
                        </span>
                    </div>
                )}

                {/* Content - Floats over image */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                    {/* Location - Subtle, above title */}
                    {destination.location && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="flex items-center gap-2 text-white/80 text-sm mb-2"
                        >
                            <FaMapMarkerAlt className="text-secondary" />
                            <span>{destination.location}</span>
                        </motion.div>
                    )}

                    {/* Title - Large and Bold */}
                    <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`text-white font-bold mb-3 ${featured ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'
                            } group-hover:text-secondary transition-colors duration-300`}
                    >
                        {destination.title}
                    </motion.h3>

                    {/* Tagline - Fades in on hover */}
                    <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        className="text-white/90 text-sm md:text-base leading-relaxed mb-4 overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-300"
                        style={{ maxHeight: 0 }}
                    >
                        <span className="group-hover:inline-block group-hover:animate-fadeIn">
                            {getTagline()}
                        </span>
                    </motion.p>

                    {/* Explore Button - Slides in on hover */}
                    <motion.div
                        className="flex items-center gap-2 text-white font-semibold text-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                    >
                        <span>Explore</span>
                        <FaArrowRight className="transform group-hover:translate-x-2 transition-transform duration-300" />
                    </motion.div>
                </div>

                {/* Glassmorphism Info Panel - Bottom (Alternative Style) */}
                {featured && (
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/10 backdrop-blur-md border-t border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center justify-between text-white text-sm">
                            <span className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                Available Now
                            </span>
                            <span className="font-bold">View Details →</span>
                        </div>
                    </div>
                )}
            </motion.div>
        </Link>
    );
};

export default DestinationCard;
