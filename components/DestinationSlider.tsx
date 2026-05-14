"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import DestinationCard from './DestinationCard';
import { TiltCard } from './TiltCard';

interface DestinationSliderProps {
    destinations: any[];
}

export default function DestinationSlider({ destinations }: DestinationSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateItemsPerPage = () => {
            if (window.innerWidth < 768) {
                setItemsPerPage(1);
            } else if (window.innerWidth < 1024) {
                setItemsPerPage(2);
            } else {
                setItemsPerPage(3);
            }
        };

        updateItemsPerPage();
        window.addEventListener('resize', updateItemsPerPage);
        return () => window.removeEventListener('resize', updateItemsPerPage);
    }, []);

    const maxIndex = Math.max(0, destinations.length - itemsPerPage);

    const next = () => {
        setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
    };

    const prev = () => {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
    };

    // Calculate percentage based on itemsPerPage
    const slideWidth = 100 / itemsPerPage;

    return (
        <div className="relative group">
            {/* Slider Container */}
            <div className="overflow-hidden px-2 py-10" ref={containerRef}>
                <motion.div
                    className="flex"
                    animate={{ x: `-${currentIndex * (100 / destinations.length)}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{ 
                        width: `${(destinations.length / itemsPerPage) * 100}%`,
                        paddingLeft: '0.5rem',
                        paddingRight: '0.5rem'
                    }}
                >
                    {destinations.map((dest) => (
                        <div 
                            key={dest._id} 
                            style={{ width: `${100 / destinations.length}%` }}
                            className="px-3"
                        >
                            <TiltCard>
                                <DestinationCard destination={dest} />
                            </TiltCard>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Navigation Buttons */}
            {currentIndex > 0 && (
                <button
                    onClick={prev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 border border-slate-100"
                >
                    <FaChevronLeft />
                </button>
            )}

            {currentIndex < maxIndex && (
                <button
                    onClick={next}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-30 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-300 border border-slate-100"
                >
                    <FaChevronRight />
                </button>
            )}

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-primary w-8' : 'bg-slate-300 hover:bg-slate-400'}`}
                    />
                ))}
            </div>
        </div>
    );
}
