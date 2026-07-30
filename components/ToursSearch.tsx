"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSearch, FaClock, FaTag, FaCompass } from 'react-icons/fa';
import { useDebounce } from '@/hooks/useDebounce';

const durations = [
    { label: 'All Durations', value: 'all' },
    { label: 'Short (1-3 Days)', value: 'short' },
    { label: 'Medium (4-7 Days)', value: 'medium' },
    { label: 'Long (7+ Days)', value: 'long' },
];

const prices = [
    { label: 'All Prices', value: 'all' },
    { label: 'Budget (< NRS 500)', value: 'budget' },
    { label: 'Moderate (500-1500)', value: 'moderate' },
    { label: 'Luxury (> 1500)', value: 'luxury' },
];

export default function ToursSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const debouncedSearch = useDebounce(searchQuery, 500);

    const updateParams = (updates: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(([key, value]) => {
            if (value === 'all' || !value) {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        params.delete('page');
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    useEffect(() => {
        const currentSearch = searchParams.get('search') || '';
        if (debouncedSearch !== currentSearch) {
            updateParams({ search: debouncedSearch });
        }
    }, [debouncedSearch]);

    return (
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 mb-12">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-white rounded-[30px] border border-gray-200/80 shadow-xl"
            >
                {/* Search Input */}
                <div className="relative group">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search adventures..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50/50 rounded-2xl border border-transparent focus:bg-white focus:border-blue-200 outline-none font-bold text-slate-700 transition-all text-sm h-font"
                    />
                </div>

                {/* Duration Filter */}
                <div className="relative group">
                    <FaClock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <select
                        value={searchParams.get('duration') || 'all'}
                        onChange={(e) => updateParams({ duration: e.target.value })}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50/50 rounded-2xl border border-transparent focus:bg-white focus:border-blue-200 outline-none font-bold text-slate-700 appearance-none transition-all text-sm h-font cursor-pointer"
                    >
                        {durations.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                </div>

                {/* Price Filter */}
                <div className="relative group">
                    <FaTag className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <select
                        value={searchParams.get('price') || 'all'}
                        onChange={(e) => updateParams({ price: e.target.value })}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50/50 rounded-2xl border border-transparent focus:bg-white focus:border-blue-200 outline-none font-bold text-slate-700 appearance-none transition-all text-sm h-font cursor-pointer"
                    >
                        {prices.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                </div>

                {/* Category Filter */}
                <div className="relative group">
                    <FaCompass className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <select
                        value={searchParams.get('category') || 'all'}
                        onChange={(e) => updateParams({ category: e.target.value })}
                        className="w-full pl-14 pr-6 py-4 bg-slate-50/50 rounded-2xl border border-transparent focus:bg-white focus:border-blue-200 outline-none font-bold text-slate-700 appearance-none transition-all text-sm h-font cursor-pointer"
                    >
                        <option value="all">All Categories</option>
                        <option value="trekking">Trekking</option>
                        <option value="hiking">Hiking</option>
                        <option value="cultural">Cultural</option>
                    </select>
                </div>
            </motion.div>
        </div>
    );
}
