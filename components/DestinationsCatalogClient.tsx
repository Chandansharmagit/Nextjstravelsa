"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import DestinationsGrid from '@/components/DestinationsGrid';

interface DestinationsCatalogClientProps {
    initialDestinations: any[];
}

const CATEGORIES = ['all', 'Adventure', 'Urban', 'Cultural', 'Himalayas', 'Safari'];

export default function DestinationsCatalogClient({ initialDestinations }: DestinationsCatalogClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Instant, silky-smooth client-side filtering (0ms latency, zero re-mounting/blinking)
    const filteredDestinations = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return initialDestinations.filter((dest: any) => {
            const matchesSearch = !query ||
                dest.title?.toLowerCase().includes(query) ||
                dest.location?.toLowerCase().includes(query) ||
                dest.description?.toLowerCase().includes(query);
            
            const matchesCategory = selectedCategory === 'all' || 
                dest.category?.toLowerCase() === selectedCategory.toLowerCase();

            return matchesSearch && matchesCategory;
        });
    }, [initialDestinations, searchQuery, selectedCategory]);

    return (
        <div>
            {/* ─── Search & Filter Controls ─── */}
            <div className="relative z-20 -mt-12 mb-12 max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
                <div className="bg-white p-4 rounded-[20px] shadow-xl border border-gray-200/80 flex flex-col md:flex-row items-center gap-4">
                    {/* Search Bar Input */}
                    <div className="relative flex-1 w-full group">
                        <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="SEARCH DESTINATIONS & REGIONS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-slate-50 rounded-[15px] border border-transparent focus:bg-white focus:border-slate-200 outline-none font-bold text-slate-800 placeholder:text-slate-400 transition-all uppercase text-xs tracking-widest"
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery('')}
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-bold"
                            >
                                CLEAR
                            </button>
                        )}
                    </div>
                    
                    {/* Category Filter Pills */}
                    <div className="flex bg-slate-100 p-1.5 rounded-[15px] overflow-x-auto no-scrollbar w-full md:w-auto gap-1">
                        {CATEGORIES.map((cat) => {
                            const active = selectedCategory.toLowerCase() === cat.toLowerCase();
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-6 py-4 rounded-[12px] text-[11px] font-black uppercase tracking-[0.15em] transition-all shrink-0 ${
                                        active 
                                        ? 'bg-slate-900 text-white shadow-md' 
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-white/80'
                                    }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ─── Header Result Stats ─── */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 mb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-gray-100 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-1 bg-teal-600 rounded-full" />
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-teal-700 font-outfit">Exploration Catalog</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-outfit tracking-tight">
                            Archived Sanctuaries
                        </h2>
                    </div>
                    <div className="text-left md:text-right">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Showing</span>
                        <span className="text-2xl font-black text-teal-700 font-outfit">{filteredDestinations.length} Destinations</span>
                    </div>
                </div>
            </div>

            {/* ─── Smooth Client Destinations Grid ─── */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
                <DestinationsGrid destinations={filteredDestinations} />
            </div>
        </div>
    );
}
