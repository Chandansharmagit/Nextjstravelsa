"use client";

import { motion } from 'framer-motion';

const TourSkeleton = ({ featured = false }: { featured?: boolean }) => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className={`relative overflow-hidden rounded-[20px] ${featured ? 'h-[500px]' : 'h-[420px]'} bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200/80 border border-slate-200/60 shadow-xs`}
        >
            {/* Smooth Continuous Linear Shimmer Wave */}
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                    repeat: Infinity,
                    duration: 1.8,
                    ease: "easeInOut"
                }}
                className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none"
            />

            {/* Top Badges placeholders */}
            <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
                <div className="flex flex-col gap-2">
                    <div className="w-24 h-7 bg-slate-200/80 rounded-full" />
                    <div className="w-28 h-7 bg-slate-200/80 rounded-full" />
                </div>
                <div className="w-16 h-12 bg-slate-300/80 rounded-2xl" />
            </div>

            {/* Bottom Content placeholders */}
            <div className="absolute inset-x-0 bottom-0 p-8 z-20 flex flex-col justify-end gap-3">
                <div className="w-24 h-4 bg-slate-200/70 rounded-full" />
                <div className={`bg-slate-300/80 rounded-xl ${featured ? 'w-64 h-12' : 'w-48 h-10'}`} />
            </div>
        </motion.div>
    );
};

export default TourSkeleton;
