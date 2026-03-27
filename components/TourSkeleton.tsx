"use client";

const TourSkeleton = ({ featured = false }: { featured?: boolean }) => {
    return (
        <div className={`relative overflow-hidden rounded-[20px] ${featured ? 'h-[500px]' : 'h-[420px]'} bg-slate-100 border border-slate-200/50 shadow-sm`}>
            {/* Shimmer overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-shimmer" />
            </div>

            {/* Top Badges placeholders */}
            <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
                <div className="flex flex-col gap-2">
                    <div className="w-24 h-7 bg-slate-200/60 rounded-full" />
                    <div className="w-28 h-7 bg-slate-200/60 rounded-full" />
                </div>
                <div className="w-16 h-12 bg-slate-200/80 rounded-2xl" />
            </div>

            {/* Bottom Content placeholders */}
            <div className="absolute inset-x-0 bottom-0 p-8 z-20 flex flex-col justify-end gap-3">
                <div className="w-24 h-4 bg-slate-200/60 rounded-full" />
                <div className={`bg-slate-200/80 rounded-xl ${featured ? 'w-64 h-12' : 'w-48 h-10'}`} />
                
                <div className="pt-6 border-t border-slate-200/40 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Placeholder for revealed on hover info if needed, but keeping it simple for skeleton */}
                </div>
            </div>
        </div>
    );
};

export default TourSkeleton;
