"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import DestinationCard from "@/components/DestinationCard";
import HowItWorks from "@/components/HowItWorks";
import { FaSearch, FaFilter, FaCompass, FaSadTear, FaStar, FaChevronDown } from "react-icons/fa";
import { motion } from "framer-motion";
import api from "@/lib/api";

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("query");

    // Using any for now to bypass strict typing for quick implementation
    const [destinations, setDestinations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!query) return;

        const fetchDestinations = async () => {
            setLoading(true);
            try {
                // Fetch all and filter client side for better experience if API doesn't support search yet
                // Ideally this should be a backend search endpoint like /api/destinations?search=${query}
                const res = await api.get('/destinations');
                const allDests = Array.isArray(res.data) ? res.data : res.data.destinations || [];

                const lowerQuery = query.toLowerCase();

                // Advanced client-side search filtering
                const filtered = allDests.filter((d: any) =>
                    (d.title && d.title.toLowerCase().includes(lowerQuery)) ||
                    (d.name && d.name.toLowerCase().includes(lowerQuery)) ||
                    (d.location && d.location.toLowerCase().includes(lowerQuery)) ||
                    (d.description && d.description.toLowerCase().includes(lowerQuery)) ||
                    (d.thingsToDo && d.thingsToDo.toLowerCase().includes(lowerQuery))
                );
                setDestinations(filtered);
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, [query]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Minimalist Header */}
            <div className="bg-white border-b border-gray-100 sticky top-14 md:top-16 z-30 shadow-sm">
                <div className="max-w-[1440px] mx-auto px-6 xl:px-24 py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <FaCompass className="text-secondary" />
                            <span>Explorer Results</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Results for <span className="text-secondary">"{query}"</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500 font-medium mr-2 hidden md:block">
                            {destinations.length} found
                        </span>
                        <select className="px-4 py-2 border border-gray-200 rounded-full text-sm font-semibold text-gray-600 outline-none hover:bg-gray-50 cursor-pointer bg-white">
                            <option>Sort: Recommended</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Rating: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Main Content with Sidebar */}
            <div className="max-w-[1440px] mx-auto px-6 xl:px-24 py-12 flex flex-col lg:flex-row gap-8">

                {/* Sidebar Filters */}
                <aside className="w-full lg:w-1/4 flex-shrink-0 space-y-8">
                    {/* Filter Group: Price Range */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4 flex justify-between items-center">
                            Price Range <FaChevronDown className="text-xs text-gray-400" />
                        </h3>
                        <div className="space-y-3">
                            {['Under $500', '$500 - $1000', '$1000 - $2000', '$2000+'].map((price, i) => (
                                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-secondary focus:ring-secondary/20" />
                                    <span className="text-gray-600 text-sm group-hover:text-primary transition">{price}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Filter Group: Category */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4 flex justify-between items-center">
                            Category <FaChevronDown className="text-xs text-gray-400" />
                        </h3>
                        <div className="space-y-3">
                            {['Trekking', 'Standard', 'Premium', 'Nature', 'Cultural'].map((cat, i) => (
                                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-secondary focus:ring-secondary/20" />
                                    <span className="text-gray-600 text-sm group-hover:text-primary transition">{cat}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Filter Group: Rating */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4 flex justify-between items-center">
                            Rating <FaChevronDown className="text-xs text-gray-400" />
                        </h3>
                        <div className="space-y-2">
                            {[5, 4, 3].map((star, i) => (
                                <label key={i} className="flex items-center gap-3 cursor-pointer group">
                                    <input type="radio" name="rating" className="w-4 h-4 border-gray-300 text-secondary focus:ring-secondary/20" />
                                    <div className="flex items-center text-yellow-400 text-sm">
                                        {[...Array(5)].map((_, idx) => (
                                            <FaStar key={idx} className={idx < star ? "" : "text-gray-200"} />
                                        ))}
                                        <span className="text-gray-400 ml-2 text-xs font-medium">& Up</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Results Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-secondary mb-4"></div>
                            <p className="text-gray-500 font-medium">Searching for the best spots...</p>
                        </div>
                    ) : (
                        <>
                            {destinations.length > 0 ? (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {destinations.map((dest) => (
                                        <motion.div key={dest._id} variants={itemVariants}>
                                            <DestinationCard destination={dest} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-24 text-center">
                                    <div className="bg-white p-8 rounded-full shadow-lg mb-6 shadow-orange-100">
                                        <FaSadTear className="text-6xl text-orange-300" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-gray-800 mb-4">No destinations found</h3>
                                    <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
                                        We couldn't find matches for <span className="font-semibold text-gray-700">"{query}"</span>.
                                        <br />Try searching for something else!
                                    </p>
                                    <div className="flex gap-4 flex-wrap justify-center">
                                        {['Nepal', 'Kathmandu', 'Trekking', 'Culture'].map(tag => (
                                            <a
                                                key={tag}
                                                href={`/search?query=${tag}`}
                                                className="px-6 py-2 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-secondary hover:text-secondary transition shadow-sm"
                                            >
                                                {tag}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <HowItWorks />
        </main>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading search results...</div>}>
            <SearchContent />
        </Suspense>
    );
}
