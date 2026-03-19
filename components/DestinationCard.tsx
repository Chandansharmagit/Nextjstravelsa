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
    const [isHoveringImage, setIsHoveringImage] = useState(false);

    const getTagline = () => {
        const firstSentence = destination.description?.split('.')[0] || destination.description;
        return firstSentence?.substring(0, 100) + (firstSentence?.length > 100 ? '...' : '');
    };

    return (
        <Link href={`/destination/${destination._id}`} className="block w-full">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8 }}
                className={`group bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 relative ${className}`}
            >
                {/* Image Section - Controlled Height for Unsplash Feel */}
                <div className="relative overflow-hidden aspect-[3/2]">
                    <img
                        src={imageSrc}
                        alt={destination.title}
                        onMouseEnter={() => setIsHoveringImage(true)}
                        onMouseLeave={() => setIsHoveringImage(false)}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110 cursor-zoom-in"
                    />
                    
                    {/* Floating Status Badge */}
                    <div className="absolute top-2 left-2 z-20">
                        <div className="px-1.5 py-0.5 bg-white/20 backdrop-blur-md rounded-md border border-white/20 flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                            <span className="text-[6px] font-black text-white uppercase tracking-[0.2em]">Live</span>
                        </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                </div>

                {/* Content Section */}
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[7px] font-black uppercase tracking-[0.1em] text-blue-600 font-outfit">{destination.category || 'Destinations'}</span>
                        <div className="w-0.5 h-0.5 rounded-full bg-slate-200" />
                        <span className="text-[7px] font-black uppercase tracking-[0.1em] text-slate-400 font-outfit line-clamp-1">{destination.location}</span>
                    </div>

                    <h3 className="text-sm font-black text-slate-900 tracking-tighter mb-1 font-outfit group-hover:text-blue-600 transition-colors uppercase line-clamp-1">
                        {destination.title}
                    </h3>
                    
                    <p className="text-slate-500 text-[10px] font-medium leading-relaxed mb-3 line-clamp-1 opacity-70">
                        {getTagline()}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                        <div className="flex -space-x-1">
                             {[1,2,3].map(i => (
                                 <div key={i} className="w-5 h-5 rounded-full border border-white bg-slate-100 overflow-hidden">
                                     <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Explorer" className="w-full h-full object-cover" />
                                 </div>
                             ))}
                        </div>
                        <div className="w-6 h-6 rounded-lg bg-slate-50 text-slate-900 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                            <FaArrowRight size={10} />
                        </div>
                    </div>
                </div>

                {/* VISUAL PREVIEW LIGHTBOX - FIXED POSITION */}
                <AnimatePresence>
                    {isHoveringImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[1000] flex items-center justify-center p-6 md:p-20 pointer-events-none"
                        >
                            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-3xl" />
                            <div className="relative w-full max-w-4xl aspect-video rounded-[32px] overflow-hidden shadow-2xl border-4 border-white/10">
                                <img src={imageSrc} alt="" className="w-full h-full object-cover" />
                                <div className="absolute bottom-8 left-8 text-white">
                                    <h4 className="text-3xl font-black font-outfit tracking-tighter italic mb-2">{destination.title}</h4>
                                    <p className="text-sm font-medium opacity-80">{destination.location}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </Link>
    );
};

export default DestinationCard;

