"use client";

import { motion } from 'framer-motion';

const DestinationSkeleton = () => {
    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative aspect-[4/5] bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200/80 rounded-[20px] overflow-hidden shadow-xs border border-slate-200/60"
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
            <div className="absolute top-5 left-5 z-20">
                <div className="w-24 h-7 bg-slate-200/80 rounded-full" />
            </div>
            <div className="absolute top-5 right-5 z-20">
                <div className="w-16 h-7 bg-slate-200/80 rounded-full" />
            </div>

            {/* Bottom Content placeholders */}
            <div className="absolute inset-x-0 bottom-0 p-6 z-20 flex flex-col justify-end gap-3">
                <div className="w-20 h-3 bg-slate-200/70 rounded-full" />
                <div className="w-48 h-8 bg-slate-300/80 rounded-xl" />
                
                <div className="flex items-center justify-between pt-6 border-t border-slate-200/60">
                    <div className="flex -space-x-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white" />
                        ))}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-slate-300/80" />
                </div>
            </div>
        </motion.div>
    );
};

export default DestinationSkeleton;
