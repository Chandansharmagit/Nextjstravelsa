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
    const itemsPerPage = 12;

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
        <main className="bg-[#FBFCFE] min-h-screen pb-0 font-sans relative overflow-hidden">
            {/* ─── Immersive Hero Section ─── */}
            <section className="relative h-[75vh] min-h-[650px] flex items-center justify-center overflow-hidden mx-4 mt-4 rounded-[20px]">
                <div className="absolute inset-0 z-0 scale-105">
                    <Image
                        src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2000&q=80"
                        alt="Destinations Hero"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
                </div>

                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span className="inline-block px-5 py-2 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 text-white text-[11px] font-bold uppercase tracking-[0.5em] mb-12">
                            The Sanctuary Archive
                        </span>
                        <h1 className="text-7xl md:text-9xl font-black text-white leading-[0.8] tracking-tighter uppercase italic h-font mb-12 drop-shadow-[0_30px_30px_rgba(0,0,0,0.5)]">
                            Global <br />
                            <span className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">Pursuits</span>
                        </h1>
                        <p className="text-xl md:text-3xl text-white/80 font-medium max-w-3xl mx-auto leading-relaxed italic serif-font">
                            "Explore the world through a lens of wonder and luxury."
                        </p>
                    </motion.div>
                </div>
                
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/40 animate-bounce">
                    <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent" />
                </div>
            </section>

            {/* ─── Minimal Search & Filter ─── */}
            <div className="relative z-20 -mt-12 mb-32 px-6 max-w-[1100px] mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-white/90 backdrop-blur-[50px] p-4 rounded-[20px] shadow-[0_50px_120px_-30px_rgba(0,0,0,0.2)] border border-white flex flex-col md:flex-row items-center gap-4"
                >
                    <div className="relative flex-1 w-full group">
                        <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="SEARCH DESTINATIONS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-slate-50/50 rounded-[15px] border border-transparent focus:bg-white focus:border-slate-100 outline-none font-bold text-slate-800 placeholder:text-slate-300 transition-all uppercase text-xs tracking-widest"
                        />
                    </div>
                    
                    <div className="flex bg-slate-100/50 p-1.5 rounded-[15px] overflow-x-auto no-scrollbar w-full md:w-auto">
                        {['all', 'Adventure', 'Urban', 'Cultural'].map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setSelectedFilter(filter)}
                                className={`px-10 py-5 rounded-[12px] text-[11px] font-black uppercase tracking-[0.2em] transition-all shrink-0 ${
                                    selectedFilter === filter 
                                    ? 'bg-slate-900 text-white shadow-2xl' 
                                    : 'text-slate-400 hover:text-slate-900 hover:bg-white'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* ─── Main Content Grid ─── */}
            <div className="max-w-[1700px] mx-auto px-6 lg:px-20 pb-40">
                {/* Section Header */}
                <div className="flex items-end justify-between mb-24">
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                             <div className="w-12 h-[3px] bg-slate-900" />
                             <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-900">The Catalog</span>
                        </div>
                        <h2 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none h-font uppercase italic">
                            Archive <br />
                            <span className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-400">Library</span>
                        </h2>
                    </div>
                    <div className="hidden lg:block text-right">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Global Findings</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter italic h-font uppercase">{filteredDestinations.length}+ Pursuits</p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="aspect-[4/5] rounded-[20px] bg-slate-100 animate-pulse" />
                        ))}
                    </div>
                ) : currentDestinations.length > 0 ? (
                    <>
                        <AnimatePresence mode="popLayout">
                            <Masonry
                                breakpointCols={{
                                    default: 4,
                                    1600: 3,
                                    1100: 2,
                                    700: 1
                                }}
                                className="flex -ml-10 w-auto h-masonry"
                                columnClassName="pl-10 bg-clip-padding"
                            >
                                {currentDestinations.map((dest: any, index: number) => (
                                    <motion.div
                                        key={dest._id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                        className="mb-10"
                                    >
                                        <DestinationCard destination={dest} />
                                    </motion.div>
                                ))}
                            </Masonry>
                        </AnimatePresence>

                        {totalPages > 1 && (
                            <div className="mt-32 flex justify-center">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-64 bg-slate-50/50 rounded-[24px] border border-slate-100"
                    >
                        <div className="text-[120px] mb-12 grayscale opacity-10">🧭</div>
                        <h3 className="text-6xl font-black text-slate-900 tracking-tighter mb-6 h-font uppercase italic">Horizon Empty</h3>
                        <p className="text-slate-400 font-bold max-w-sm mx-auto uppercase text-xs tracking-[0.4em] leading-loose">The requested sanctuary has not been archived. <br /> Venture other pursuits.</p>
                    </motion.div>
                )}
            </div>

            {/* ─── Immersive Final CTA ─── */}
            <section className="py-24 px-4 mb-32">
                <div className="max-w-[1500px] mx-auto bg-slate-900 rounded-[20px] p-16 md:p-32 text-center text-white relative overflow-hidden group">
                    <div className="absolute inset-0 opacity-40 group-hover:scale-105 transition-transform duration-[4s] pointer-events-none">
                         <Image 
                            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1500" 
                            alt="cta bg" 
                            fill 
                            className="object-cover grayscale"
                         />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/60 to-slate-950" />
                    
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2 }}
                        className="relative z-10"
                    >
                        <span className="text-blue-400 text-[12px] font-black uppercase tracking-[0.6em] mb-10 block">Elite Membership</span>
                        <h2 className="text-6xl md:text-9xl font-black tracking-tighter h-font uppercase mb-16 leading-none italic">
                            Elevate your <br />
                            <span className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-indigo-400">Expedition</span>
                        </h2>
                        
                        <form className="max-w-xl mx-auto relative group">
                            <input
                                type="email"
                                placeholder="ENTER YOUR SANCTUARY ADDRESS..."
                                className="w-full px-10 py-7 rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 text-white placeholder:text-slate-600 outline-none focus:bg-white/10 focus:border-white/20 transition-all font-bold text-xs tracking-widest"
                            />
                            <button className="absolute right-2 top-2 bottom-2 px-12 bg-white text-slate-900 rounded-full font-black text-[11px] uppercase tracking-[0.3em] hover:bg-blue-600 hover:text-white transition-all shadow-2xl">
                                Join Now
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400..900&family=Outfit:wght@800;900&display=swap');
                
                .serif-font { font-family: 'Playfair Display', serif; }
                .h-font { font-family: 'Outfit', sans-serif; }
                .h-masonry { align-items: flex-start; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
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
