"use client";

import { motion } from 'framer-motion';

const DestinationSkeleton = () => {
    return (
        <div className="relative aspect-[3/4] bg-slate-100 rounded-[20px] overflow-hidden shadow-sm border border-slate-200/50">
            {/* Shimmer overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />
            </div>

            {/* Top Badges placeholders */}
            <div className="absolute top-4 left-4 z-20">
                <div className="w-20 h-7 bg-slate-200/60 rounded-full" />
            </div>
            <div className="absolute top-4 right-4 z-20">
                <div className="w-14 h-7 bg-slate-200/60 rounded-full" />
            </div>

            {/* Bottom Content placeholders */}
            <div className="absolute inset-x-0 bottom-0 p-6 z-20 flex flex-col justify-end gap-3">
                <div className="w-16 h-3 bg-slate-200/60 rounded-full ml-1" />
                <div className="w-40 h-8 bg-slate-200/80 rounded-lg" />
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-200/40">
                    <div className="flex -space-x-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-9 h-9 rounded-full bg-slate-200/60 border-2 border-slate-100" />
                        ))}
                    </div>
                    <div className="w-14 h-14 rounded-full bg-slate-200/80" />
                </div>
            </div>
        </div>
    );
};

export default DestinationSkeleton;
