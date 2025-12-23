"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';

interface ImageType {
    path?: string;
    url?: string;
    [key: string]: any;
}

interface DestinationImageGalleryProps {
    images: (ImageType | string)[];
    mainImage?: string;
    title: string;
}

export default function DestinationImageGallery({ images, mainImage, title }: DestinationImageGalleryProps) {
    const allImages = (images || []).map(img => {
        if (!img) return null;
        if (typeof img === 'string') return img;
        return img.path || img.url || null;
    }).filter((img): img is string => !!img);

    let displayImages = allImages.length > 0 ? allImages : (mainImage ? [mainImage] : ['/placeholder.jpg']);

    const [selectedIndex, setSelectedIndex] = useState(0);

    // 3D Tilt Logic
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

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

    const handlePrev = () => {
        setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Main 3D Card */}
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className="relative h-[400px] md:h-[600px] w-full rounded-[48px] overflow-hidden shadow-[0_32px_80px_-16px_rgba(0,0,0,0.12)] bg-slate-100 group border border-white/60"
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedIndex}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={displayImages[selectedIndex]}
                            alt={`${title} - View ${selectedIndex + 1}`}
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Navigation Arrows */}
                {displayImages.length > 1 && (
                    <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ transform: "translateZ(40px)" }}>
                        <button
                            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                            className="w-14 h-14 bg-white/20 backdrop-blur-3xl border border-white/40 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-white hover:text-slate-900 transition-all duration-300 transform hover:scale-110 active:scale-95"
                        >
                            <FaChevronLeft className="text-xl" />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                            className="w-14 h-14 bg-white/20 backdrop-blur-3xl border border-white/40 rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-white hover:text-slate-900 transition-all duration-300 transform hover:scale-110 active:scale-95"
                        >
                            <FaChevronRight className="text-xl" />
                        </button>
                    </div>
                )}
            </motion.div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
                    {displayImages.map((img, idx) => (
                        <motion.button
                            key={idx}
                            whileHover={{ y: -4 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedIndex(idx)}
                            className={`relative w-24 h-24 flex-shrink-0 rounded-3xl overflow-hidden border-4 transition-all duration-500 shadow-lg ${selectedIndex === idx
                                ? 'border-blue-600 scale-110 z-10'
                                : 'border-white/50 opacity-60 hover:opacity-100'
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                fill
                                className="object-cover"
                            />
                        </motion.button>
                    ))}
                </div>
            )}
        </div>
    );
}
