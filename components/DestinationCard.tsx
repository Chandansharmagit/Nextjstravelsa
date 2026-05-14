"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight, FaMapMarkerAlt, FaCompass, FaStar } from 'react-icons/fa';
import { getImageUrl } from '@/lib/utils/image';

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
    className?: string;
}

const DestinationCard = ({ destination, className }: DestinationProps) => {
    const image0 = destination.images?.[0];
    const imagePath = (typeof image0 === 'string' ? image0 : image0?.path || image0?.url) || destination.image;
    const imageSrc = getImageUrl(imagePath);

    return (
        <Link href={`/destination/${destination._id}`} className="block w-full">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -10 }}
                className={`group relative aspect-[4/5] bg-slate-100 rounded-[20px] overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] transition-all duration-700 ${className}`}
            >
                {/* Full-Bleed Background Photo */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src={imageSrc}
                        alt={destination.title}
                        fill
                        className="object-cover transition-transform duration-[2.5s] ease-out group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                        quality={85}
                    />
                    {/* Immersive Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-700" />
                </div>

                {/* Glassmorphism Category Badge */}
                <div className="absolute top-5 left-5 z-20">
                    <div className="px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-xl">
                        <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">{destination.category || 'Adventure'}</span>
                    </div>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-5 right-5 z-20">
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10">
                        <FaStar className="text-amber-400" size={12} />
                        <span className="text-[11px] font-black text-white">4.9 <span className="opacity-60 text-[9px] font-medium">(2.4k)</span></span>
                    </div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-6 z-20 flex flex-col justify-end min-h-[50%] transition-transform duration-700 group-hover:translate-y-[-8px]">
                    <div className="flex items-center gap-2 text-blue-400 mb-3 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0">
                        <FaMapMarkerAlt size={12} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">{destination.location}</span>
                    </div>

                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter leading-[0.9] h-font uppercase mb-4 group-hover:mb-6 transition-all duration-700">
                        {destination.title}
                    </h3>

                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                        {/* Avatar Group */}
                        <div className="flex -space-x-3 items-center">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-9 h-9 rounded-full border-2 border-slate-900 bg-slate-800 overflow-hidden shadow-sm shadow-black">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 30}`} alt="Explorer" className="w-full h-full object-cover" />
                                </div>
                            ))}
                            <div className="w-9 h-9 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-black text-white">
                                +12
                            </div>
                        </div>

                        {/* Floating Explore Button */}
                        <div className="w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-[0_15px_30px_rgba(255,255,255,0.2)] transform group-hover:scale-110 group-hover:rotate-[-45deg] transition-all duration-700">
                            <FaArrowRight size={18} />
                        </div>
                    </div>
                </div>

                {/* Subtle Glow Effect on Hover */}
                <div className="absolute -inset-[2px] bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>
        </Link>
    );
};

export default DestinationCard;

