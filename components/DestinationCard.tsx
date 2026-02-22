"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FaMapMarkerAlt, FaMountain, FaUmbrellaBeach, FaCity, FaLandmark, FaArrowRight } from 'react-icons/fa';
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

const DestinationCard = ({ destination, featured = false, className }: DestinationProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const image0 = destination.images?.[0];
    const imagePath = (typeof image0 === 'string' ? image0 : image0?.path || image0?.url) || destination.image;
    const imageSrc = getImageUrl(imagePath);

    const getCategoryIcon = () => {
        const category = destination.category?.toLowerCase();
        if (category?.includes('mountain')) return <FaMountain className="text-sm" />;
        if (category?.includes('beach')) return <FaUmbrellaBeach className="text-sm" />;
        if (category?.includes('city')) return <FaCity className="text-sm" />;
        if (category?.includes('cultural')) return <FaLandmark className="text-sm" />;
        return <FaMapMarkerAlt className="text-sm" />;
    };

    const getTagline = () => {
        const firstSentence = destination.description?.split('.')[0] || destination.description;
        return firstSentence?.substring(0, 80) + (firstSentence?.length > 80 ? '...' : '');
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const defaultHeight = featured ? 'h-[500px]' : 'h-[400px]';

    return (
        <Link href={`/destination/${destination._id}`}>
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`group relative overflow-hidden rounded-[30px] cursor-pointer shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] transition-all duration-700 ${className || defaultHeight}`}
            >
                {/* Full Image Background */}
                <div
                    className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105"
                    style={{ transform: "translateZ(-10px)" }}
                >
                    <Image
                        src={imageSrc}
                        alt={destination.title}
                        fill
                        className="object-cover"
                        priority={featured}
                    />
                </div>

                {/* Cinematic Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/0 transition-colors duration-700" />

                <div className="absolute inset-0 p-8 flex flex-col justify-end" style={{ transform: "translateZ(30px)" }}>
                    {/* Tags Container - top left */}
                    <div className="absolute top-6 left-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-700 transform -translate-y-4 group-hover:translate-y-0">
                        {destination.category && (
                            <div className="px-3 py-1.5 bg-blue-600/90 backdrop-blur-xl rounded-[6px] border border-blue-400/40 shadow-lg">
                                <span className="text-white text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 h-font">
                                    {getCategoryIcon()}
                                    {destination.category}
                                </span>
                            </div>
                        )}
                        {destination.featured && (
                            <div className="px-3 py-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[6px] shadow-lg">
                                <span className="text-white text-[9px] font-black uppercase tracking-[0.2em] h-font">
                                    ★ Curated
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Interactive Content Wrapper */}
                    <div className="relative w-full transition-all duration-700 transform group-hover:-translate-y-[15%]">
                        {/* Title & Location Section - This moves to center-ish on hover */}
                        <div className="space-y-4 transition-all duration-700 group-hover:mb-8">
                            {destination.location && (
                                <div className="flex items-center gap-2 text-blue-400 text-[9px] font-black uppercase tracking-[0.3em] h-font">
                                    <FaMapMarkerAlt />
                                    {destination.location}
                                </div>
                            )}
                            <h3 className={`text-white font-black tracking-tighter leading-[0.9] h-font transition-all duration-700 ${featured ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'} group-hover:scale-110 origin-left`}>
                                {destination.title}
                            </h3>
                        </div>

                        {/* Hidden Content - Revealed on Hover */}
                        <div className="overflow-hidden max-h-0 group-hover:max-h-[300px] transition-all duration-700 ease-in-out">
                            <motion.p
                                initial={false}
                                className="text-white/70 text-base font-bold leading-relaxed line-clamp-3 p-font italic mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100"
                            >
                                {getTagline()}
                            </motion.p>

                            <div className="flex items-center justify-between pt-6 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200">
                                <span className="text-[9px] font-black text-white uppercase tracking-[0.3em] h-font">Discover Experience</span>
                                <div className="w-10 h-10 rounded-[10px] bg-white flex items-center justify-center text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-xl">
                                    <FaArrowRight size={14} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Premium Border Aura */}
                <div className="absolute inset-0 border border-white/10 rounded-[30px] pointer-events-none transition-all duration-700 group-hover:border-white/20 group-hover:inset-1" />
            </motion.div>

            <style jsx global>{`
                .h-font { font-family: 'Outfit', sans-serif; }
            `}</style>
        </Link>
    );
};

export default DestinationCard;
