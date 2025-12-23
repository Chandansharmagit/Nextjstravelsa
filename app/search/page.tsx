"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import DestinationCard from "@/components/DestinationCard";
import { FaSearch, FaFilter, FaCompass, FaSadTear, FaStar, FaChevronDown, FaArrowRight } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("query");

    const [destinations, setDestinations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [priceRange, setPriceRange] = useState<string | null>(null);

    useEffect(() => {
        if (!query) return;

        const fetchDestinations = async () => {
            setLoading(true);
            try {
                const res = await api.get('/destinations');
                const allDests = Array.isArray(res.data) ? res.data : res.data.destinations || [];
                const lowerQuery = query.toLowerCase();

                const filtered = allDests.filter((d: any) => {
                    const inTitle = d.title?.toLowerCase().includes(lowerQuery);
                    const inLocation = d.location?.toLowerCase().includes(lowerQuery);
                    const inDescription = d.description?.toLowerCase().includes(lowerQuery);
                    return inTitle || inLocation || inDescription;
                });
                setDestinations(filtered);
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, [query]);

    return (
        <main className="min-h-screen bg-[#FDFCFB] pt-32 pb-24 px-6 lg:px-20">
            {/* Creative Studio Search Header */}
            <div className="max-w-[1600px] mx-auto mb-20">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-[#8D7B68]/10 pb-12"
                >
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.4em] mb-6">
                            <span className="w-10 h-[1px] bg-[#D4AF37]" />
                            Discovery Search
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold text-[#4A4036] leading-tight mb-4">
                            Findings for <span className="italic font-normal text-[#8D7B68]">"{query}"</span>
                        </h1>
                        <p className="text-[#8D7B68] text-lg font-medium leading-relaxed">
                            Exploring {destinations.length} curated sanctuaries that match your aesthetic preferences and travel aspirations.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/40 backdrop-blur-xl border border-white/40 p-2 rounded-full shadow-sm">
                        <button className="px-8 py-4 rounded-full bg-[#D4AF37] text-white text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-[#D4AF37]/20 transition-all hover:scale-105 active:scale-95">
                            Sort: Relevant
                        </button>
                        <button className="px-8 py-4 rounded-full text-[#8D7B68] text-[10px] font-bold uppercase tracking-[0.2em] hover:text-[#4A4036] transition-all">
                            Filter
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Content & Sidebar Grid */}
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16">

                {/* Sidebar Filters: Studio Aesthetic */}
                <aside className="hidden lg:block space-y-12 h-fit sticky top-32">
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-[11px] font-bold text-[#4A4036] uppercase tracking-[0.3em] mb-6">By Investment</h3>
                            <div className="flex flex-wrap gap-2">
                                {['$500+', '$1000+', '$2000+', '$5000+'].map(price => (
                                    <button key={price} className="px-5 py-2.5 rounded-full border border-[#8D7B68]/10 text-[10px] font-bold text-[#8D7B68] hover:bg-white hover:border-[#D4AF37]/30 transition-all uppercase tracking-widest">
                                        {price}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[11px] font-bold text-[#4A4036] uppercase tracking-[0.3em] mb-6">By Atmosphere</h3>
                            <div className="space-y-3">
                                {['Serenity', 'Adventure', 'Cultural', 'Standard'].map(tag => (
                                    <div key={tag} className="flex items-center justify-between group cursor-pointer">
                                        <span className="text-sm font-bold text-[#8D7B68] group-hover:text-[#4A4036] transition-colors tracking-tight">{tag}</span>
                                        <div className="w-4 h-4 rounded border border-[#8D7B68]/20 group-hover:border-[#D4AF37] transition-all" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#4A4036] rounded-[32px] p-8 text-[#F5F2ED] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <FaCompass size={80} />
                        </div>
                        <p className="text-[8px] font-bold uppercase tracking-[0.4em] mb-4 text-[#D4AF37]">Expert Help</p>
                        <h4 className="text-lg font-bold mb-4">Can't decide?</h4>
                        <p className="text-xs text-white/50 leading-relaxed mb-6">Our studio consultants are standing by to craft your perfect narrative.</p>
                        <button className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] group/link">
                            Contact Studio <FaArrowRight size={10} className="group-hover/link:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </aside>

                {/* Results Stream */}
                <div className="flex-1">
                    {loading ? (
                        <div className="h-[60vh] flex flex-col items-center justify-center space-y-6">
                            <div className="w-12 h-12 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
                            <p className="text-[10px] font-bold text-[#8D7B68] uppercase tracking-[0.4em]">Reviewing Archive...</p>
                        </div>
                    ) : destinations.length > 0 ? (
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8"
                            >
                                {destinations.map((dest, idx) => (
                                    <motion.div
                                        key={dest._id}
                                        initial={{ y: 30, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: idx * 0.1, duration: 0.8 }}
                                    >
                                        <DestinationCard destination={dest} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    ) : (
                        <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-[#8D7B68]/5 mb-8 text-[#D4AF37]/40">
                                <FaSadTear size={40} />
                            </div>
                            <h3 className="text-3xl font-bold text-[#4A4036] mb-4">No Sanctuaries Found</h3>
                            <p className="text-[#8D7B68] font-medium max-w-sm mb-12">The specific keyword "{query}" yielded no matches in our current collection.</p>
                            <div className="flex flex-wrap justify-center gap-3">
                                {['Nepal', 'Trekking', 'Standard', 'Culture'].map(t => (
                                    <Link key={t} href={`/search?query=${t}`} className="px-6 py-3 rounded-full border border-[#8D7B68]/10 text-[10px] font-bold text-[#8D7B68] uppercase tracking-widest hover:bg-white hover:border-[#D4AF37]/30 transition-all">
                                        {t}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');
                .h-font { font-family: 'Outfit', sans-serif; }
            `}</style>
        </main>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFCFB] space-y-6">
                <div className="w-12 h-12 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin" />
                <p className="text-[10px] font-bold text-[#8D7B68] uppercase tracking-[0.4em]">Synchronizing Explorer Data...</p>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
