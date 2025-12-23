"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
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
    const imageSrc = (typeof image0 === 'string' ? image0 : image0?.path || image0?.url) || destination.image || '/placeholder.jpg';

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
                className={`group relative overflow-hidden rounded-[40px] cursor-pointer shadow-2xl hover:shadow-[0_64px_120px_-20px_rgba(0,0,0,0.3)] transition-shadow duration-500 ${className || defaultHeight}`}
            >
                {/* Full Image Background */}
                <div
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                    style={{ transform: "translateZ(-20px)" }}
                >
                    <Image
                        src={imageSrc}
                        alt={destination.title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

                <div className="absolute inset-0 flex flex-col justify-end p-8" style={{ transform: "translateZ(40px)" }}>
                    {/* Tags Container */}
                    <div className="flex items-center gap-2 mb-4">
                        {destination.category && (
                            <div className="px-3 py-1.5 bg-blue-600/90 backdrop-blur-md rounded-full border border-blue-400/30">
                                <span className="text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 h-font">
                                    {getCategoryIcon()}
                                    {destination.category}
                                </span>
                            </div>
                        )}
                        {destination.featured && (
                            <div className="px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                                <span className="text-white text-[10px] font-black uppercase tracking-widest h-font">
                                    ★ Priority
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Title & Info */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            {destination.location && (
                                <div className="flex items-center gap-2 text-white/60 text-[10px] font-black uppercase tracking-widest h-font">
                                    <FaMapMarkerAlt className="text-blue-500" />
                                    {destination.location}
                                </div>
                            )}
                            <h3 className={`text-white font-black tracking-tighter leading-none h-font ${featured ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'} group-hover:text-blue-400 transition-colors duration-500`}>
                                {destination.title}
                            </h3>
                        </div>

                        <p className="text-white/70 text-sm font-bold leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                            {getTagline()}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] h-font">Access Expedition</span>
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-xl">
                                <FaArrowRight />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Border Glow */}
                <div className="absolute inset-0 border border-white/20 rounded-[40px] pointer-events-none" />
            </motion.div>

            <style jsx global>{`
                .h-font { font-family: 'Outfit', sans-serif; }
            `}</style>
        </Link>
    );
};

export default DestinationCard;
