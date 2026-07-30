"use client";

import { useState, useMemo } from 'react';
import { FaSearch } from 'react-icons/fa';
import ToursGrid from '@/components/ToursGrid';

interface ToursCatalogClientProps {
    initialTours: any[];
}

export default function ToursCatalogClient({ initialTours }: ToursCatalogClientProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDuration, setSelectedDuration] = useState('all');

    // Instant client-side filtering without server re-renders or unmounting
    const filteredTours = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        return initialTours.filter((tour: any) => {
            const matchesSearch = !query ||
                tour.title?.toLowerCase().includes(query) ||
                tour.description?.toLowerCase().includes(query) ||
                tour.destination?.toLowerCase().includes(query);
            
            const matchesCategory = selectedCategory === 'all' ||
                tour.type?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
                tour.title?.toLowerCase().includes(selectedCategory.toLowerCase());

            let matchesDuration = true;
            if (selectedDuration !== 'all') {
                const dur = parseInt(tour.duration);
                if (selectedDuration === 'short') matchesDuration = dur <= 3;
                else if (selectedDuration === 'medium') matchesDuration = dur > 3 && dur <= 7;
                else if (selectedDuration === 'long') matchesDuration = dur > 7;
            }

            return matchesSearch && matchesCategory && matchesDuration;
        });
    }, [initialTours, searchQuery, selectedCategory, selectedDuration]);

    return (
        <div>
            {/* Search & Filter Bar */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-[25px] border border-gray-200/80 shadow-xl">
                    <div className="relative group md:col-span-2">
                        <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="SEARCH EXPEDITIONS & ADVENTURES..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-8 py-4 bg-slate-50 rounded-[15px] border border-transparent focus:bg-white focus:border-slate-200 outline-none font-bold text-slate-800 placeholder:text-slate-400 uppercase text-xs tracking-widest"
                        />
                    </div>

                    <div className="flex gap-2">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="flex-1 bg-slate-50 text-slate-800 font-bold text-xs p-4 rounded-[15px] border border-transparent focus:border-slate-200 outline-none uppercase tracking-wider"
                        >
                            <option value="all">All Categories</option>
                            <option value="Trekking">Trekking</option>
                            <option value="Helicopter">Helicopter</option>
                            <option value="Cultural">Cultural</option>
                            <option value="Wildlife">Wildlife</option>
                        </select>

                        <select
                            value={selectedDuration}
                            onChange={(e) => setSelectedDuration(e.target.value)}
                            className="flex-1 bg-slate-50 text-slate-800 font-bold text-xs p-4 rounded-[15px] border border-transparent focus:border-slate-200 outline-none uppercase tracking-wider"
                        >
                            <option value="all">Any Duration</option>
                            <option value="short">1 - 3 Days</option>
                            <option value="medium">4 - 7 Days</option>
                            <option value="long">8+ Days</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Header Result Counter */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 mb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-gray-100 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-1 bg-teal-600 rounded-full" />
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-teal-700 font-outfit">Active Packages</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-outfit tracking-tight">
                            Available Expeditions
                        </h2>
                    </div>
                    <div className="text-left md:text-right">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1">Results Found</span>
                        <span className="text-2xl font-black text-teal-700 font-outfit">{filteredTours.length} Tours</span>
                    </div>
                </div>
            </div>

            {/* Tours Grid */}
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
                <ToursGrid tours={filteredTours} />
            </div>
        </div>
    );
}
