"use client";

import { useState, useEffect, useRef } from 'react';
import DestinationCard from '@/components/DestinationCard';
import { FaSpinner, FaCheckCircle } from 'react-icons/fa';

interface DestinationsGridProps {
    destinations: any[];
}

export default function DestinationsGrid({ destinations }: DestinationsGridProps) {
    const [displayCount, setDisplayCount] = useState(8);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const loadMoreRef = useRef<HTMLDivElement>(null);

    // Reset displayCount when destinations filter changes
    useEffect(() => {
        setDisplayCount(8);
    }, [destinations]);

    // Infinite Scroll IntersectionObserver (YouTube-style auto load)
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting && displayCount < destinations.length && !isLoadingMore) {
                    setIsLoadingMore(true);
                    setTimeout(() => {
                        setDisplayCount((prev) => Math.min(prev + 6, destinations.length));
                        setIsLoadingMore(false);
                    }, 300);
                }
            },
            { rootMargin: '300px' }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
        };
    }, [displayCount, destinations.length, isLoadingMore]);

    const visibleDestinations = destinations.slice(0, displayCount);

    if (destinations.length === 0) {
        return (
            <div className="text-center py-32 bg-slate-50 rounded-3xl border border-slate-200">
                <div className="text-7xl mb-6 grayscale opacity-20">🧭</div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 font-outfit uppercase italic">No Sanctuaries Discovered</h3>
                <p className="text-slate-500 font-bold max-w-sm mx-auto text-xs uppercase tracking-widest leading-loose">
                    Adjust your pursuit parameters or explore other regions.
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Clean Instant CSS Grid without SSR dynamic import delay or opacity fading */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {visibleDestinations.map((dest: any, index: number) => (
                    <div key={dest._id || index} className="w-full">
                        <DestinationCard destination={dest} />
                    </div>
                ))}
            </div>

            {/* Infinite Scroll Sentinel & Loader */}
            <div ref={loadMoreRef} className="py-12 flex items-center justify-center">
                {displayCount < destinations.length ? (
                    <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-widest shadow-2xs">
                        <FaSpinner className="animate-spin text-teal-600" size={14} />
                        <span>Loading More Sanctuaries...</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest pt-4">
                        <FaCheckCircle className="text-teal-600" size={14} />
                        <span>All Sanctuaries Loaded</span>
                    </div>
                )}
            </div>
        </div>
    );
}
