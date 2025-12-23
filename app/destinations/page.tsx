"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Masonry from 'react-masonry-css';
import DestinationCard from '@/components/DestinationCard';
import Pagination from '@/components/Pagination';
import { FaSearch, FaFilter, FaCompass } from 'react-icons/fa';
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

    const inputClasses = "w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-md border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium";

    return (
        <main className="bg-[#f8fafc] min-h-screen pb-32 pt-20 overflow-x-hidden relative font-sans">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[5%] right-[5%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[20%] left-[10%] w-[40%] h-[40%] bg-indigo-400/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="container mx-auto px-4 xl:px-20 relative z-10">
                {/* Header Section */}
                <div className="pt-20 pb-16 text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6 h-font"
                    >
                        <FaCompass className="text-xs" />
                        Explore the World
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-none p-font"
                    >
                        Limitless <br /> <span className="text-blue-600">Destinations</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 font-bold text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
                    >
                        Uncover hidden gems and iconic landmarks. Our curated selection of destinations awaits your next great adventure.
                    </motion.p>
                </div>

                {/* Search and Filter Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-16 max-w-5xl mx-auto"
                >
                    <div className="bg-white/70 backdrop-blur-3xl p-4 rounded-[40px] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.08)] border border-white/60">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
                            <div className="relative group lg:col-span-2">
                                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search by destination, city or landmarks..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={inputClasses}
                                />
                            </div>
                            <div className="relative group">
                                <FaFilter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <select
                                    value={selectedFilter}
                                    onChange={(e) => setSelectedFilter(e.target.value)}
                                    className={`${inputClasses} appearance-none pr-10`}
                                >
                                    <option value="all">All Realms</option>
                                    <option value="mountain">Mountains</option>
                                    <option value="beach">Beaches</option>
                                    <option value="city">Urban Hubs</option>
                                    <option value="cultural">Ancestral</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center gap-4">
                        <span className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full h-font">
                            {filteredDestinations.length} Results
                        </span>
                    </div>
                </motion.div>

                {/* Masonry Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className={`${i % 2 === 0 ? 'h-[500px]' : 'h-[400px]'} rounded-[40px] bg-slate-200 animate-pulse`} />
                        ))}
                    </div>
                ) : currentDestinations.length > 0 ? (
                    <AnimatePresence mode="popLayout">
                        <Masonry
                            breakpointCols={breakpointColumns}
                            className="flex -ml-8 w-auto h-masonry"
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
                        className="text-center py-40 bg-white/40 backdrop-blur-md rounded-[48px] border border-white/60"
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
        </main>
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
