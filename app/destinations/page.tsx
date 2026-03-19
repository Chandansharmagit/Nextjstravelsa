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
        <main className="bg-[#FBFCFE] min-h-screen pb-32 font-sans relative">
            {/* Minimalist Grid Header */}
            <div className="pt-24 pb-16 px-6 lg:px-20 max-w-[1700px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end gap-10">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-4">
                            <span className="w-8 h-[1px] bg-blue-600" />
                            Global Archive
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-slate-900 leading-none tracking-tighter h-font uppercase italic">
                            Destinations <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 not-italic">Catalog</span>
                        </h1>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full sm:w-[350px] group">
                            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={16} />
                            <input
                                type="text"
                                placeholder="Search archives..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none font-bold text-slate-700 placeholder:text-slate-400 transition-all uppercase text-[10px] tracking-widest"
                            />
                        </div>
                        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                            {['all', 'Mountain', 'City'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setSelectedFilter(filter)}
                                    className={`px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                        selectedFilter === filter 
                                        ? 'bg-slate-900 text-white shadow-lg' 
                                        : 'text-slate-400 hover:text-slate-900'
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-[1700px] mx-auto px-6 lg:px-20">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-[4/5] rounded-[32px] bg-slate-100 animate-pulse" />
                        ))}
                    </div>
                ) : currentDestinations.length > 0 ? (
                    <AnimatePresence mode="popLayout">
                        <Masonry
                            breakpointCols={{
                                default: 4,
                                1400: 3,
                                1000: 2,
                                600: 1
                            }}
                            className="flex -ml-8 w-auto h-masonry"
                            columnClassName="pl-8 bg-clip-padding"
                        >
                            {currentDestinations.map((dest: any, index: number) => (
                                <motion.div
                                    key={dest._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                    className="mb-8"
                                >
                                    <DestinationCard destination={dest} />
                                </motion.div>
                            ))}
                        </Masonry>
                    </AnimatePresence>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-40 bg-white/40 backdrop-blur-md rounded-[40px] border border-white/60"
                    >
                        <div className="text-8xl mb-8">🔍</div>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 h-font">Archive Entry Not Found</h3>
                        <p className="text-slate-500 font-bold max-w-sm mx-auto">Venture elsewhere or refine your pursuit parameters.</p>
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
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400..900&family=Outfit:wght@800;900&display=swap');
                
                .serif-font { font-family: 'Playfair Display', serif; }
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
