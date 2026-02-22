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
            {/* Balloon Themed Hero Section */}
            <div className="relative h-[75vh] min-h-[600px] w-full flex flex-col items-center justify-center overflow-hidden">
                {/* Specific Background Image - direct img tag for max compatibility */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.pexels.com/photos/28082017/pexels-photo-28082017.jpeg"
                        alt="Destinations Hero"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Minimal overlays for a bright, vibrant feel with a strong bottom fade */}
                    <div className="absolute inset-0 bg-black/5" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center px-4 pt-10">
                    <motion.h1
                        initial={{ opacity: 0, y: -60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="text-white text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase mb-8 drop-shadow-[0_20px_60px_rgba(0,0,0,0.6)] h-font leading-[0.85]"
                    >
                        Explore More <br className="hidden md:block" /> Destination
                    </motion.h1>

                    {/* Hero Search & Filter Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="max-w-2xl mx-auto"
                    >
                        {/* Compact Breadcrumb label */}
                        <div className="flex items-center justify-center gap-2 mb-4 text-white/60 font-black text-[10px] tracking-[0.4em] uppercase">
                            <Link href="/" className="hover:text-amber-400 transition-all">Home</Link>
                            <span>/</span>
                            <span className="text-white/90">Destination List</span>
                        </div>

                        {/* Glassmorphic Search Bar */}
                        <div className="flex items-center gap-0 p-1.5 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20 shadow-2xl transition-all focus-within:bg-white/15 focus-within:border-white/30 group">
                            <div className="flex-1 flex items-center pl-6 pr-4">
                                <FaSearch className="text-white/40 group-focus-within:text-white transition-colors duration-500" />
                                <input
                                    type="text"
                                    placeholder="Find your next expedition..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-transparent border-none outline-none pl-4 py-3 text-white placeholder:text-white/30 font-bold text-sm h-font"
                                />
                            </div>

                            <div className="w-px h-8 bg-white/10 mx-2" />

                            <div className="relative flex items-center pl-4 pr-6">
                                <FaFilter className="absolute left-6 pointer-events-none text-white/40 group-focus-within:text-white transition-colors duration-500" />
                                <select
                                    value={selectedFilter}
                                    onChange={(e) => setSelectedFilter(e.target.value)}
                                    className="bg-transparent border-none outline-none pl-8 py-3 text-white font-bold text-sm h-font appearance-none cursor-pointer hover:text-amber-400 transition-all"
                                >
                                    <option value="all" className="text-slate-900">All Realms</option>
                                    <option value="mountain" className="text-slate-900">High Altitudes</option>
                                    <option value="beach" className="text-slate-900">Coastal Escapes</option>
                                    <option value="city" className="text-slate-900">Urban Pulse</option>
                                    <option value="cultural" className="text-slate-900">Ancestral Heritage</option>
                                </select>
                            </div>
                        </div>

                        {/* Result Counter */}
                        <div className="mt-6 flex justify-center">
                            <div className="px-6 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full">
                                <span className="text-white/80 text-[9px] font-black uppercase tracking-[0.3em] h-font">
                                    {filteredDestinations.length} Curated Results
                                </span>
                            </div>
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
