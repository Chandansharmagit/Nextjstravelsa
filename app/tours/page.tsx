"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Masonry from 'react-masonry-css';
import TourCard from '@/components/TourCard';
import Pagination from '@/components/Pagination';
import { FaSearch, FaClock, FaTag, FaCompass, FaChevronDown } from 'react-icons/fa';
import api from '@/lib/api';

function ToursContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category') || 'all';

    const [tours, setTours] = useState<any[]>([]);
    const [filteredTours, setFilteredTours] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [durationFilter, setDurationFilter] = useState('all');
    const [priceFilter, setPriceFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState(initialCategory);
    const itemsPerPage = 9;

    useEffect(() => {
        fetchTours();
    }, []);

    useEffect(() => {
        filterTours();
    }, [tours, searchQuery, durationFilter, priceFilter, categoryFilter]);

    const fetchTours = async () => {
        try {
            const res = await api.get('/tours');
            const data = Array.isArray(res.data) ? res.data : res.data.tours || [];
            setTours(data);
        } catch (error) {
            console.error("Failed to fetch tours:", error);
        } finally {
            setLoading(false);
        }
    };

    const filterTours = () => {
        let filtered = [...tours];

        if (searchQuery) {
            filtered = filtered.filter(tour =>
                tour.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tour.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tour.destination?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(tour =>
                tour.type?.toLowerCase().includes(categoryFilter.toLowerCase()) ||
                tour.title?.toLowerCase().includes(categoryFilter.toLowerCase())
            );
        }

        if (durationFilter !== 'all') {
            filtered = filtered.filter(tour => {
                const duration = parseInt(tour.duration);
                if (durationFilter === 'short') return duration <= 3;
                if (durationFilter === 'medium') return duration > 3 && duration <= 7;
                if (durationFilter === 'long') return duration > 7;
                return true;
            });
        }

        if (priceFilter !== 'all') {
            filtered = filtered.filter(tour => {
                const price = parseFloat(tour.price);
                if (priceFilter === 'budget') return price < 500;
                if (priceFilter === 'moderate') return price >= 500 && price <= 1500;
                if (priceFilter === 'luxury') return price > 1500;
                return true;
            });
        }

        setFilteredTours(filtered);
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(filteredTours.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTours = filteredTours.slice(startIndex, endIndex);

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
                        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000"
                        alt="Tours Hero Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-transparent to-white" />
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
                        <h1 className="text-white text-[15vw] md:text-[12vw] lg:text-[10vw] font-black tracking-tighter uppercase leading-[0.8] drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)] h-font text-center">
                            Epic <br className="hidden md:block" /> Adventures
                        </h1>

                        {/* Glowing Atmosphere behind text */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[40%] bg-blue-500/20 blur-[120px] rounded-full -z-10 animate-pulse" />
                    </motion.div>
                </div>

                {/* Layer 3: Foreground Mountains (Over the text) */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                    <img
                        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000"
                        alt="Tours Hero Foreground"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                            maskImage: 'linear-gradient(to top, black 40%, transparent 85%)',
                            WebkitMaskImage: 'linear-gradient(to top, black 40%, transparent 85%)',
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
                                {filteredTours.length} Experiences Found
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>





            <div className="container mx-auto px-4 xl:px-20 relative z-10 pt-24">

                {/* Tour Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className={`${i % 2 === 0 ? 'h-[500px]' : 'h-[420px]'} rounded-[30px] bg-slate-200 animate-pulse`} />
                        ))}
                    </div>
                ) : currentTours.length > 0 ? (
                    <AnimatePresence mode="popLayout">
                        <Masonry
                            breakpointCols={breakpointColumns}
                            className="flex -ml-8 w-auto h-masonry"
                            columnClassName="pl-8 bg-clip-padding"
                        >
                            {currentTours.map((tour: any, index: number) => (
                                <motion.div
                                    key={tour._id}
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
                                    <TourCard
                                        tour={tour}
                                        featured={index % 5 === 0}
                                    />
                                </motion.div>
                            ))}
                        </Masonry>
                    </AnimatePresence>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-40 bg-white/40 backdrop-blur-md rounded-[30px] border border-white/60"
                    >
                        <div className="text-8xl mb-8 grayscale group-hover:grayscale-0 transition-all duration-500">🔭</div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4 h-font">No Adventures Discovered</h3>
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

export default function ToursPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex justify-center items-center bg-[#f8fafc]">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>}>
            <ToursContent />
        </Suspense>
    );
}
