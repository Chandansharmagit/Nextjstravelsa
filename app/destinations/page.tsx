"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Masonry from 'react-masonry-css';
import DestinationCard from '@/components/DestinationCard';
import Pagination from '@/components/Pagination';
import { FaSearch, FaFilter } from 'react-icons/fa';
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
            // Handle both array (local) and object (legacy) formats for safety
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
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2035&auto=format&fit=crop')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-teal-800/90" />

                <div className="relative z-10 text-center text-white px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl md:text-6xl font-bold mb-4"
                    >
                        Explore Destinations
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl md:text-2xl max-w-3xl mx-auto"
                    >
                        Discover your next adventure from our handpicked destinations
                    </motion.p>
                </div>
            </section>

            {/* Main Content - Aligned with Navbar */}
            <section className="py-20 px-4 xl:px-20 bg-light min-h-screen">
                {/* Search and Filter Bar */}
                <div className="mb-12">
                    <div className="bg-white p-6 rounded-2xl shadow-card">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search destinations..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                                />
                            </div>
                            <div className="relative">
                                <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    value={selectedFilter}
                                    onChange={(e) => setSelectedFilter(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition appearance-none bg-white"
                                >
                                    <option value="all">All Destinations</option>
                                    <option value="mountain">Mountains</option>
                                    <option value="beach">Beaches</option>
                                    <option value="city">Cities</option>
                                    <option value="cultural">Cultural</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4 text-gray-600">
                            Showing <span className="font-bold text-primary">{currentDestinations.length}</span> of{' '}
                            <span className="font-bold text-primary">{filteredDestinations.length}</span> destinations
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
                                <div className={`${i % 3 === 0 ? 'h-[500px]' : 'h-[400px]'} rounded-2xl bg-gray-200 animate-pulse overflow-hidden`}>
                                    <div className="h-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200" style={{
                                        backgroundSize: '200% 200%',
                                        animation: 'shimmer 2s infinite'
                                    }} />
                                </div>
                            </div>
                        ))}
                    </Masonry>
                ) : currentDestinations.length > 0 ? (
                    <>
                        <Masonry
                            breakpointCols={breakpointColumns}
                            className="flex -ml-6 w-auto"
                            columnClassName="pl-6 bg-clip-padding"
                        >
                            {currentDestinations.map((dest: any, index: number) => {
                                const isFeatured = index % 3 === 0;
                                return (
                                    <motion.div
                                        key={dest._id}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="mb-6"
                                    >
                                        <DestinationCard destination={dest} featured={isFeatured} />
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
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">No destinations found</h3>
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

export default function DestinationsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex justify-center items-center">Loading...</div>}>
            <DestinationsContent />
        </Suspense>
    );
}
