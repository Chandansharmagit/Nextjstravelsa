"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Masonry from 'react-masonry-css';
import DestinationCard from '@/components/DestinationCard';
import Pagination from '@/components/Pagination';
import { FaSearch, FaFilter, FaCompass, FaMountain, FaVihara, FaMapSigns } from 'react-icons/fa';
import api from '@/lib/api';

function DestinationsContent() {
    const searchParams = useSearchParams();
    const initialSearch = searchParams.get('search') || '';

    const [destinations, setDestinations] = useState<any[]>([]);
    const [filteredDestinations, setFilteredDestinations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const itemsPerPage = 9;

    useEffect(() => {
        fetchDestinations();
    }, []);

    useEffect(() => {
        filterDestinations();
    }, [destinations, searchQuery, selectedFilter]);

    const fetchDestinations = async () => {
        try {
            const res = await api.get('/destinations');
            setDestinations(Array.isArray(res.data) ? res.data : res.data.destinations || []);
        } catch (error) {
            console.error("Failed to fetch destinations:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterDestinations = () => {
        let filtered = [...destinations];

        if (searchQuery) {
            filtered = filtered.filter(dest =>
                dest.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dest.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                dest.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (selectedFilter !== 'all') {
            filtered = filtered.filter(dest => dest.category === selectedFilter);
        }

        setFilteredDestinations(filtered);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentDestinations = filteredDestinations.slice(startIndex, endIndex);

    const breakpointColumns = {
        default: 3,
        1024: 2,
        640: 1
    };

    const inputClasses = "w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-md border border-slate-200 rounded-[30px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium";

    return (
        <main className="bg-white min-h-screen pb-32 overflow-x-hidden relative font-sans">
            {/* Premium Hero Section with Layered Animation */}
            <div className="relative h-[85vh] min-h-[700px] w-full flex flex-col items-center justify-center overflow-hidden bg-slate-900 group/hero">
                {/* Layer 1: Background Mountains (Deep) */}
                <div className="absolute inset-0 z-0 scale-105">
                    <img
                        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2000"
                        alt="Destinations Hero Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/40 via-transparent to-white" />
                </div>

                {/* Layer 2: Animated Text (Middle) */}
                <div className="relative z-10 w-full max-w-7xl px-4 flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -20, scale: 1.02 }}
                        transition={{
                            duration: 1.2,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                        className="relative cursor-default select-none transition-transform duration-700 ease-out group-hover/hero:-translate-y-10"
                    >
                        <h1 className="text-white text-[12vw] md:text-[10vw] lg:text-[8vw] font-black tracking-tighter uppercase leading-[0.8] drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)] h-font text-center">
                            Explore <br className="hidden md:block" /> More Destinations
                        </h1>

                        {/* Glowing Atmosphere behind text */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[40%] bg-indigo-500/20 blur-[120px] rounded-full -z-10 animate-pulse" />
                    </motion.div>
                </div>

                {/* Layer 3: Foreground Mountains (Over the text) */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                    <img
                        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2000"
                        alt="Destinations Hero Foreground"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                            maskImage: 'linear-gradient(to top, black 35%, transparent 80%)',
                            WebkitMaskImage: 'linear-gradient(to top, black 35%, transparent 80%)',
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
                </div>

                {/* Bottom Fade to 0 Opacity */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent z-40" />

                {/* Result Counter (Positioned at the bottom to avoid header overlap) */}
                <div className="absolute bottom-20 left-0 right-0 z-30 flex justify-center pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="pointer-events-auto"
                    >
                        <div className="px-8 py-2.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
                            <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.4em] h-font">
                                {filteredDestinations.length} Curated Results
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>


            <div className="container mx-auto px-4 xl:px-20 relative z-10">
                {/* Masonry Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-24">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className={`${i % 2 === 0 ? 'h-[500px]' : 'h-[400px]'} rounded-[30px] bg-slate-200 animate-pulse`} />
                        ))}
                    </div>
                ) : currentDestinations.length > 0 ? (
                    <AnimatePresence mode="popLayout">
                        <Masonry
                            breakpointCols={breakpointColumns}
                            className="flex -ml-8 w-auto h-masonry pt-24"
                            columnClassName="pl-8 bg-clip-padding"
                        >
                            {currentDestinations.map((dest: any, index: number) => (
                                <motion.div
                                    key={dest._id}
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
                                    <DestinationCard
                                        destination={dest}
                                        featured={index % 4 === 0}
                                        className={index % 2 === 0 ? 'h-[500px]' : 'h-[420px]'}
                                    />
                                </motion.div>
                            ))}
                        </Masonry>
                    </AnimatePresence>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-40 bg-white/40 backdrop-blur-md rounded-[30px] border border-white/60 pt-24"
                    >
                        <div className="text-8xl mb-8 grayscale group-hover:grayscale-0 transition-all duration-500">🗺️</div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 h-font">No Expeditions Discovered</h3>
                        <p className="text-slate-500 font-bold max-w-sm mx-auto">Venture elsewhere or adjust your pursuit parameters.</p>
                    </motion.div>
                )}

                {totalPages > 1 && (
                    <div className="mt-20">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                )}
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Outfit:wght@800;900&display=swap');
                
                .p-font { font-family: 'Playfair Display', serif; }
                .h-font { font-family: 'Outfit', sans-serif; }
                .h-masonry { align-items: flex-start; }
            `}</style>
        </main >
    );
}

export default function DestinationsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex justify-center items-center bg-[#f8fafc]">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>}>
            <DestinationsContent />
        </Suspense>
    );
}
