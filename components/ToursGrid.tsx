"use client";

import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import TourCard from '@/components/TourCard';
import TourSkeleton from '@/components/TourSkeleton';

const Masonry = dynamic(() => import('react-masonry-css'), {
    loading: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
                <TourSkeleton key={i} featured={i % 5 === 0} />
            ))}
        </div>
    ),
    ssr: false
});

interface ToursGridProps {
    tours: any[];
}

export default function ToursGrid({ tours }: ToursGridProps) {
    const breakpointColumns = {
        default: 3,
        1024: 2,
        640: 1
    };

    if (tours.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-40 bg-white/40 backdrop-blur-md rounded-[30px] border border-white/60"
            >
                <div className="text-8xl mb-8 grayscale group-hover:grayscale-0 transition-all duration-500">🔭</div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 h-font">No Adventures Discovered</h3>
                <p className="text-slate-500 font-bold max-w-sm mx-auto">Venture elsewhere or adjust your pursuit parameters.</p>
            </motion.div>
        );
    }

    return (
        <AnimatePresence mode="popLayout">
            <Masonry
                breakpointCols={breakpointColumns}
                className="flex -ml-8 w-auto h-masonry"
                columnClassName="pl-8 bg-clip-padding"
            >
                {tours.map((tour: any, index: number) => (
                    <motion.div
                        key={tour._id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 100,
                            delay: index * 0.05
                        }}
                        className="mb-8"
                    >
                        <TourCard
                            tour={tour}
                            featured={index % 5 === 0}
                        />
                    </motion.div>
                ))}
            </Masonry>
        </AnimatePresence>
    );
}
