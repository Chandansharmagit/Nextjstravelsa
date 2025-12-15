"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Masonry from 'react-masonry-css';
import TourCard from '@/components/TourCard';
import Pagination from '@/components/Pagination';
import { FaSearch, FaClock, FaDollarSign } from 'react-icons/fa';
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
            // Handle both array and object wrapper formats
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

    // Masonry breakpoints - Pinterest style
    const breakpointColumns = {
        default: 3,
        1024: 2,
        640: 1
    };

    return (
        <>
            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 to-orange-700/90" />

                <div className="relative z-10 text-center text-white px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl md:text-6xl font-bold mb-4"
                    >
                        {categoryFilter !== 'all' ? `${categoryFilter} Tours` : 'Our Tours'}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl md:text-2xl max-w-3xl mx-auto"
                    >
                        {categoryFilter !== 'all'
                            ? `Explore our curated ${categoryFilter} experiences`
                            : 'Curated experiences for every type of traveler'
                        }
                    </motion.p>
                </div>
            </section>

            {/* Main Content - Aligned with Navbar */}
            <section className="py-20 px-4 xl:px-20 bg-light min-h-screen">
                {/* Search and Filter Bar */}
                <div className="mb-12">
                    <div className="bg-white p-6 rounded-2xl shadow-card">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative md:col-span-1">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search tours..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                                />
                            </div>
                            <div className="relative">
                                <FaClock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    value={durationFilter}
                                    onChange={(e) => setDurationFilter(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition appearance-none bg-white"
                                >
                                    <option value="all">All Durations</option>
                                    <option value="short">Short (1-3 days)</option>
                                    <option value="medium">Medium (4-7 days)</option>
                                    <option value="long">Long (8+ days)</option>
                                </select>
                            </div>
                            <div className="relative">
                                <FaDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    value={priceFilter}
                                    onChange={(e) => setPriceFilter(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition appearance-none bg-white"
                                >
                                    <option value="all">All Prices</option>
                                    <option value="budget">Budget (&lt;$500)</option>
                                    <option value="moderate">Moderate ($500-$1500)</option>
                                    <option value="luxury">Luxury (&gt;$1500)</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4 text-gray-600">
                            Showing <span className="font-bold text-secondary">{currentTours.length}</span> of{' '}
                            <span className="font-bold text-secondary">{filteredTours.length}</span> tours
                        </div>
                    </div>
                </div>

                {/* Pinterest-Style Masonry Grid */}
                {loading ? (
                    <Masonry
                        breakpointCols={breakpointColumns}
                        className="flex -ml-6 w-auto"
                        columnClassName="pl-6 bg-clip-padding"
                    >
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="mb-6">
                                <div className={`${i % 3 === 0 ? 'h-[500px]' : 'h-[420px]'} rounded-2xl bg-gray-200 animate-pulse overflow-hidden`}>
                                    <div className="h-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200" style={{
                                        backgroundSize: '200% 200%',
                                        animation: 'shimmer 2s infinite'
                                    }} />
                                </div>
                            </div>
                        ))}
                    </Masonry>
                ) : currentTours.length > 0 ? (
                    <>
                        <Masonry
                            breakpointCols={breakpointColumns}
                            className="flex -ml-6 w-auto"
                            columnClassName="pl-6 bg-clip-padding"
                        >
                            {currentTours.map((tour: any, index: number) => {
                                const isFeatured = index % 3 === 0;
                                return (
                                    <motion.div
                                        key={tour._id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="mb-6"
                                    >
                                        <TourCard tour={tour} featured={isFeatured} />
                                    </motion.div>
                                );
                            })}
                        </Masonry>

                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">No tours found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </div>
                )}
            </section>

            <style jsx global>{`
                @keyframes shimmer {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </>
    );
}

export default function ToursPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex justify-center items-center">Loading...</div>}>
            <ToursContent />
        </Suspense>
    );
}
