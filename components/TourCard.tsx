"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { FaClock, FaUsers, FaStar, FaArrowRight, FaHiking, FaUmbrellaBeach, FaLandmark, FaShieldAlt } from 'react-icons/fa';

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
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const title = tour.title || tour.name || "Untitled Tour";
    const imageSrc = tour.images?.[0]?.url || tour.image || '/placeholder.jpg';

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

    const getTourIcon = () => {
        const type = tour.type?.toLowerCase();
        if (type?.includes('trek') || type?.includes('hik')) return <FaHiking />;
        if (type?.includes('beach') || type?.includes('island')) return <FaUmbrellaBeach />;
        if (type?.includes('cultural') || type?.includes('heritage')) return <FaLandmark />;
        return <FaStar />;
    };

    const getDifficultyStyles = () => {
        const difficulty = tour.difficulty?.toLowerCase();
        if (difficulty?.includes('easy')) return 'bg-emerald-500/90 text-white';
        if (difficulty?.includes('moderate')) return 'bg-amber-500/90 text-white';
        if (difficulty?.includes('hard')) return 'bg-rose-500/90 text-white';
        return 'bg-blue-500/90 text-white';
    };

    return (
        <Link href={`/tours/${tour._id}`}>
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
                className={`group relative overflow-hidden rounded-[20px] cursor-pointer ${featured ? 'h-[500px]' : 'h-[420px]'} shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] transition-all duration-700 border border-slate-200/50`}
            >
                {/* Background Image */}
                <div
                    className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110"
                    style={{ transform: "translateZ(-20px)" }}
                >
                    <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Top Badges */}
                <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20" style={{ transform: "translateZ(30px)" }}>
                    <div className="flex flex-col gap-2">
                        {tour.difficulty && (
                            <div className={`px-4 py-1.5 ${getDifficultyStyles()} backdrop-blur-xl rounded-full border border-white/20 shadow-lg`}>
                                <span className="text-[9px] font-black uppercase tracking-[0.2em] font-outfit flex items-center gap-2">
                                    <FaShieldAlt className="opacity-70" />
                                    {tour.difficulty}
                                </span>
                            </div>
                        )}
                        {tour.type && (
                            <div className="px-4 py-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-lg">
                                <span className="text-white text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-2 font-outfit">
                                    {getTourIcon()}
                                    {tour.type}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="px-5 py-2.5 bg-blue-600/90 backdrop-blur-xl border border-blue-400/30 rounded-[18px] shadow-xl shadow-blue-500/20">
                        <div className="text-[9px] font-black text-blue-100/60 uppercase tracking-widest font-outfit mb-0.5 text-center">Value</div>
                        <div className="text-xl font-black text-white tracking-tighter leading-none font-outfit">
                            <span className="text-xs mr-0.5 opacity-60">NRS</span>{tour.price}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end" style={{ transform: "translateZ(30px)" }}>
                    {/* Interactive Content Wrapper */}
                    <div className="relative w-full transition-all duration-700 transform group-hover:-translate-y-4">
                        {/* Title Section */}
                        <div className="space-y-3 transition-all duration-700">
                            {tour.destination && (
                                <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] font-outfit">
                                    <span className="w-2 h-0.5 bg-blue-500 rounded-full" />
                                    {typeof tour.destination === 'string' ? tour.destination : tour.destination.title || 'Nepal'}
                                </div>
                            )}
                            <h3 className={`text-white font-black tracking-tighter leading-[0.95] font-outfit transition-all duration-700 ${featured ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'} group-hover:text-white group-hover:scale-[1.02] origin-left`}>
                                {title}
                            </h3>
                        </div>

                        {/* Revealed on Hover */}
                        <div className="overflow-hidden max-h-0 group-hover:max-h-[300px] transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100 pt-0 group-hover:pt-6">
                            <div className="flex flex-wrap gap-2 mb-6">
                                <div className="px-3 py-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center gap-2 text-white text-[9px] font-black uppercase tracking-[0.15em] font-outfit">
                                    <FaClock className="text-blue-400 opacity-70" />
                                    {tour.duration}
                                </div>
                                {tour.groupSize && (
                                    <div className="px-3 py-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center gap-2 text-white text-[9px] font-black uppercase tracking-[0.15em] font-outfit">
                                        <FaUsers className="text-blue-400 opacity-70" />
                                        {tour.groupSize}
                                    </div>
                                )}
                                <div className="px-3 py-1.5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center gap-2 text-white text-[9px] font-black uppercase tracking-[0.15em] font-outfit text-amber-400">
                                    <FaStar />
                                    4.8
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-white/10">
                                <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] font-outfit">Examine Journey</span>
                                <div className="w-10 h-10 rounded-[14px] bg-white flex items-center justify-center text-slate-950 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-xl group-hover:rotate-[360deg]">
                                    <FaArrowRight size={12} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Border Glow */}
                <div className="absolute inset-0 border border-white/10 rounded-[20px] pointer-events-none group-hover:border-white/20 transition-colors" />
            </motion.div>

            <style jsx global>{`
                .h-font { font-family: 'Outfit', sans-serif; }
            `}</style>
        </Link>
    );
};

export default TourCard;
