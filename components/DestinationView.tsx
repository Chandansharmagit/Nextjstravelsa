"use client";

import Link from 'next/link';
import SocialShare from '@/components/SocialShare';
import DestinationImageGallery from '@/components/DestinationImageGallery';
import DestinationClientWrapper from '@/components/DestinationClientWrapper';
import SimilarTrips from '@/components/SimilarTrips';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaClock, FaArrowLeft, FaCheck } from 'react-icons/fa';

export default function DestinationView({ destination }: { destination: any }) {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/destination/${destination._id}` : '';

    return (
        <main className="bg-[#f8fafc] min-h-screen pb-32 pt-40 relative font-sans">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-indigo-400/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="container mx-auto px-4 xl:px-20 relative z-10">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <Link href="/destinations" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black text-xs uppercase tracking-widest transition-all mb-8 group">
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Explore More
                    </Link>

                    <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-none p-font"
                            >
                                {destination.title}
                            </motion.h1>

                            <div className="flex flex-wrap items-center gap-6">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-100 text-blue-600 font-bold text-sm">
                                    <FaMapMarkerAlt />
                                    {destination.location || 'Nepal'}
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl shadow-sm border border-slate-100 text-indigo-600 font-bold text-sm">
                                    <FaClock />
                                    Best: {destination.bestTime || 'Anytime'}
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0 pt-4">
                            <SocialShare
                                url={shareUrl}
                                title={destination.title}
                                description={destination.description}
                            />
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Content */}
                    <div className="lg:col-span-2 space-y-12">

                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <DestinationImageGallery
                                images={destination.images || []}
                                mainImage={destination.image}
                                title={destination.title}
                            />
                        </motion.div>

                        <div className="space-y-12">
                            {/* Overview Card */}
                            <motion.section
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white/70 backdrop-blur-3xl p-10 rounded-[48px] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.06)] border border-white/60 relative overflow-hidden"
                            >
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter h-font">Expedition Insights</h2>
                                </div>

                                <div className="space-y-6">
                                    {destination.description?.split('.').filter((s: string) => s.trim().length > 0).map((sentence: string, index: number) => (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            viewport={{ once: true }}
                                            key={index}
                                            className="flex items-start gap-4 group"
                                        >
                                            <div className="mt-1.5 shrink-0 w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
                                                <FaCheck className="text-[10px]" />
                                            </div>
                                            <p className="text-slate-600 font-bold leading-relaxed text-lg group-hover:text-slate-900 transition-colors">
                                                {sentence.trim()}.
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.section>

                            {/* Itinerary Section */}
                            {destination.thingsToDo && destination.thingsToDo.length > 0 && (
                                <section className="relative">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-1.5 h-8 bg-indigo-600 rounded-full" />
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter h-font">The Journey Flow</h2>
                                    </div>

                                    <div className="space-y-6 relative pl-4">
                                        <div className="absolute left-[31px] top-6 bottom-6 w-1 bg-gradient-to-b from-blue-100 via-indigo-100 to-transparent rounded-full" />

                                        <AnimatePresence>
                                            {destination.thingsToDo.map((thing: string, index: number) => {
                                                let title = thing;
                                                let desc = '';
                                                const separators = ['-', ':', '|', '–'];
                                                for (const sep of separators) {
                                                    if (thing.includes(sep)) {
                                                        const p = thing.split(sep);
                                                        title = p[0].trim();
                                                        desc = p.slice(1).join(sep).trim();
                                                        break;
                                                    }
                                                }

                                                return (
                                                    <motion.div
                                                        initial={{ opacity: 0, x: -20 }}
                                                        whileInView={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.1 }}
                                                        viewport={{ once: true }}
                                                        key={index}
                                                        className="flex gap-8 items-start group relative"
                                                    >
                                                        <div className="shrink-0 w-16 h-16 rounded-3xl bg-white border-4 border-slate-50 flex items-center justify-center text-slate-900 font-black text-xl shadow-xl z-10 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-500">
                                                            {index + 1}
                                                        </div>

                                                        <div className="flex-1 bg-white/40 backdrop-blur-md p-8 rounded-[32px] border border-white/60 group-hover:bg-white group-hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
                                                            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2 h-font group-hover:text-blue-600 transition-colors">
                                                                {title}
                                                            </h3>
                                                            {desc ? (
                                                                <p className="text-slate-500 font-bold text-sm leading-relaxed">{desc}</p>
                                                            ) : (
                                                                <p className="text-slate-400 font-bold text-xs italic uppercase tracking-widest">A cornerstone of the expedition</p>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </AnimatePresence>
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>

                    <DestinationClientWrapper
                        destinationTitle={destination.title}
                        destinationId={destination._id}
                    />
                </div>

                {/* Similar Trips Section */}
                <SimilarTrips
                    currentDestinationId={destination._id}
                    currentLocation={destination.location}
                />
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Outfit:wght@800;900&display=swap');
                
                .p-font { font-family: 'Playfair Display', serif; }
                .h-font { font-family: 'Outfit', sans-serif; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </main>
    );
}
