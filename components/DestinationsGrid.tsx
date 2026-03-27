"use client";

import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import DestinationCard from '@/components/DestinationCard';
import DestinationSkeleton from '@/components/DestinationSkeleton';

// Dynamically import Masonry to reduce initial bundle size
const Masonry = dynamic(() => import('react-masonry-css'), {
    loading: () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
                <DestinationSkeleton key={i} />
            ))}
        </div>
    ),
    ssr: false
});

interface DestinationsGridProps {
    destinations: any[];
}

export default function DestinationsGrid({ destinations }: DestinationsGridProps) {
    const breakpointColumns = {
        default: 5,
        1600: 4,
        1200: 3,
        700: 2,
        500: 1
    };

    if (destinations.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-64 bg-slate-50/50 rounded-[24px] border border-slate-100"
            >
                <div className="text-[120px] mb-12 grayscale opacity-10">🧭</div>
                <h3 className="text-6xl font-black text-slate-900 tracking-tighter mb-6 h-font uppercase italic">Horizon Empty</h3>
                <p className="text-slate-400 font-bold max-w-sm mx-auto uppercase text-xs tracking-[0.4em] leading-loose">
                    The requested sanctuary has not been archived. <br /> Venture other pursuits.
                </p>
            </motion.div>
        );
    }

    return (
        <AnimatePresence mode="popLayout">
            <Masonry
                breakpointCols={breakpointColumns}
                className="flex -ml-6 w-auto h-masonry"
                columnClassName="pl-6 bg-clip-padding"
            >
                {destinations.map((dest: any, index: number) => (
                    <motion.div
                        key={dest._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                            duration: 0.8, 
                            delay: index * 0.05, 
                            ease: [0.22, 1, 0.36, 1] 
                        }}
                        className="mb-6"
                    >
                        <DestinationCard destination={dest} />
                    </motion.div>
                ))}
            </Masonry>
        </AnimatePresence>
    );
}
