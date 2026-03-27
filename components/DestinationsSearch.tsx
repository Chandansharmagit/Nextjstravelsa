"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { useDebounce } from '@/hooks/useDebounce';

const categories = ['all', 'Adventure', 'Urban', 'Cultural'];

export default function DestinationsSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const selectedFilter = searchParams.get('category') || 'all';
    
    const debouncedSearch = useDebounce(searchQuery, 500);

    useEffect(() => {
        const currentSearch = searchParams.get('search') || '';
        if (debouncedSearch !== currentSearch) {
            const params = new URLSearchParams(searchParams.toString());
            if (debouncedSearch) {
                params.set('search', debouncedSearch);
            } else {
                params.delete('search');
            }
            params.delete('page');
            router.replace(`?${params.toString()}`, { scroll: false });
        }
    }, [debouncedSearch, router]);

    const handleFilterChange = (filter: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (filter !== 'all') {
            params.set('category', filter);
        } else {
            params.delete('category');
        }
        params.delete('page');
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="relative z-20 -mt-12 mb-20">
            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
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
                    {categories.map((filter) => (
                        <button
                            key={filter}
                            onClick={() => handleFilterChange(filter)}
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
    );
}
