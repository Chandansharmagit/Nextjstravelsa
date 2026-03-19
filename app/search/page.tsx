"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import DestinationCard from "@/components/DestinationCard";
import { FaSearch, FaFilter, FaCompass, FaSadTear, FaStar, FaChevronDown, FaArrowRight, FaMagic } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Masonry from 'react-masonry-css';
import api from "@/lib/api";

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("query");

    const [results, setResults] = useState<{destinations: any[], tours: any[], services: any[]}>({ destinations: [], tours: [], services: [] });
    const [loading, setLoading] = useState(true);
    const [priceRange, setPriceRange] = useState<string | null>(null);

    useEffect(() => {
        if (!query) return;

        const fetchResults = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/search?query=${encodeURIComponent(query)}`);
                setResults(res.data);
            } catch (error) {
                console.error("Error fetching search results:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);
    
    const breakpointColumnsObj = {
        default: 5,
        1600: 4,
        1300: 3,
        900: 2,
        600: 1
    };

    return (
        <main className="min-h-screen bg-[#F8FAFC] relative flex flex-col font-sans">
            {/* Background Decorative Elements */}
            <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-blue-100/20 rounded-full blur-[120px] -mr-96 -mt-96 pointer-events-none z-0" />
            <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-indigo-50/30 rounded-full blur-[100px] -ml-48 -mb-48 pointer-events-none z-0" />

            {/* Cinematic Search Header */}
            <div className="pt-32 pb-12 px-6 lg:px-16 relative z-20">
                <div className="max-w-[1700px] mx-auto">
                    <motion.div
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8"
                    >
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-4 text-[10px] font-black text-blue-600 uppercase tracking-[0.5em] mb-6">
                                <span className="w-12 h-[2px] bg-blue-600" />
                                <FaMagic className="animate-pulse" />
                                Intelligence Archive
                            </div>
                            <h1 className="text-3xl lg:text-5xl font-black text-slate-900 leading-[0.9] mb-6 tracking-tighter font-outfit uppercase italic">
                                {searchParams.get("smart") === 'true' ? 'AI CURATED' : 'FINDINGS'} <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-medium not-italic">"{query}"</span>
                            </h1>
                            <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-xl opacity-80">
                                We've identified {results.destinations.length + results.tours.length + results.services.length} bespoke escapes that harmonize with your unique search criteria.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 bg-white/60 backdrop-blur-3xl border border-white p-2.5 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                            <div className="flex -space-x-2 mr-2">
                                {[1, 2].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i+20}`} alt="Explorer" />
                                    </div>
                                ))}
                            </div>
                            <button className="px-6 py-3 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-blue-600 hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] hover:-translate-y-1">
                                Relevant First
                            </button>
                            <button className="px-6 py-3 rounded-2xl bg-white border border-slate-100 text-slate-900 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-slate-50 transition-all flex items-center gap-3">
                                <FaFilter size={12} className="text-blue-500" /> Filter
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Results Grid Container */}
            <div className="max-w-[1700px] mx-auto w-full px-6 lg:px-16 flex flex-col lg:flex-row gap-12 pb-32 relative z-10">
                
                {/* Sticky Sidebar */}
                <aside className="lg:w-[280px] flex-shrink-0">
                    <div className="lg:sticky lg:top-[120px]">
                        <div className="bg-white/40 backdrop-blur-3xl rounded-[40px] p-8 border border-white/80 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] space-y-10">
                            <div>
                                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                                    Investment
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {['$500+', '$1000+', '$2000+', '$5000+'].map(price => (
                                        <button 
                                            key={price} 
                                            className={`px-3 py-2.5 rounded-xl border text-[9px] font-black transition-all uppercase tracking-widest ${priceRange === price ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/50 border-slate-100 text-slate-500 hover:text-blue-600'}`}
                                            onClick={() => setPriceRange(price === priceRange ? null : price)}
                                        >
                                            {price}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] mb-6 flex items-center gap-3">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                                    Atmosphere
                                </h3>
                                <div className="space-y-3">
                                    {['Serenity', 'Adventure', 'Cultural', 'Standard'].map(tag => (
                                        <label key={tag} className="flex items-center justify-between group cursor-pointer p-3 rounded-xl hover:bg-white/60 transition-all border border-transparent hover:border-white">
                                            <span className="text-[10px] font-black text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-widest">{tag}</span>
                                            <input type="checkbox" className="w-4 h-4 rounded-md border-2 border-slate-200 checked:bg-blue-600 checked:border-blue-600 appearance-none cursor-pointer" />
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-slate-950 rounded-[32px] p-6 text-white relative overflow-hidden group shadow-2xl">
                                <FaCompass className="text-white/5 mb-4 group-hover:rotate-12 transition-transform duration-700" size={40} />
                                <h4 className="text-lg font-black mb-3 tracking-tighter">Bespoke Guidance</h4>
                                <button className="w-full py-3.5 bg-white text-slate-950 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all hover:bg-blue-600 hover:text-white group/btn flex items-center justify-center gap-2">
                                    Consult <FaArrowRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Flexible Results Grid Area */}
                <div className="flex-1 mt-8">
                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-8">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-slate-100 rounded-full" />
                                <div className="absolute top-0 w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">Accessing Collections...</p>
                        </div>
                    ) : (results.destinations.length > 0 || results.tours.length > 0 || results.services.length > 0) ? (
                        <div className="space-y-24">
                            {/* DESTINATIONS - MASONRY GRID */}
                            {results.destinations.length > 0 && (
                                <section>
                                    <div className="flex items-end justify-between mb-8">
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter font-outfit mb-1">Refined Sanctuaries</h3>
                                            <p className="text-slate-400 text-[11px] font-medium">{results.destinations.length} unmatched locations identified</p>
                                        </div>
                                        <div className="h-[1px] flex-1 mx-12 bg-slate-100 hidden md:block" />
                                        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest hidden md:block">01 / Destinations</span>
                                    </div>
                                    
                                    <Masonry
                                        breakpointCols={breakpointColumnsObj}
                                        className="flex -ml-6 w-auto"
                                        columnClassName="pl-6 bg-clip-padding"
                                    >
                                        {results.destinations.map((dest, idx) => (
                                            <div key={dest._id} className="mb-6">
                                                <DestinationCard destination={dest} />
                                            </div>
                                        ))}
                                    </Masonry>
                                </section>
                            )}

                            {/* TOURS - MASONRY GRID */}
                            {results.tours.length > 0 && (
                                <section>
                                    <div className="flex items-end justify-between mb-8">
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter font-outfit mb-1">Curated Expeditions</h3>
                                            <p className="text-slate-400 text-[11px] font-medium">{results.tours.length} journeys available</p>
                                        </div>
                                        <div className="h-[1px] flex-1 mx-12 bg-slate-100 hidden md:block" />
                                        <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hidden md:block">02 / Tours</span>
                                    </div>

                                    <Masonry
                                        breakpointCols={breakpointColumnsObj}
                                        className="flex -ml-6 w-auto"
                                        columnClassName="pl-6 bg-clip-padding"
                                    >
                                        {results.tours.map((tour: any, idx: number) => (
                                            <div key={tour._id} className="mb-6">
                                                <motion.div
                                                    initial={{ y: 20, opacity: 0 }}
                                                    whileInView={{ y: 0, opacity: 1 }}
                                                    viewport={{ once: true }}
                                                    className="group relative bg-white rounded-[24px] overflow-hidden border border-slate-100 hover:border-blue-200 hover:shadow-xl transition-all p-3"
                                                >
                                                    <Link href={`/tours/${tour._id}`} className="block">
                                                        <div className="relative rounded-[18px] overflow-hidden mb-4 aspect-[4/3]">
                                                            <img 
                                                                src={tour.image || tour.coverImage || (tour.images?.[0]?.url) || "/placeholder.jpg"} 
                                                                alt={tour.title}
                                                                className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                                                            />
                                                            <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[8px] font-black text-slate-900 shadow-sm">
                                                                {tour.price}
                                                            </div>
                                                        </div>
                                                        <div className="px-1 pb-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="text-[8px] font-black uppercase tracking-[0.1em] text-blue-600 font-outfit">{tour.duration}</span>
                                                                <div className="w-0.5 h-0.5 rounded-full bg-slate-200" />
                                                                <span className="text-[8px] font-black uppercase tracking-[0.1em] text-slate-400 font-outfit">Featured</span>
                                                            </div>
                                                            <h4 className="text-lg font-black text-slate-950 mb-2 font-outfit tracking-tighter group-hover:text-blue-600 transition-colors uppercase line-clamp-1">{tour.title}</h4>
                                                            <p className="text-slate-500 font-medium line-clamp-2 text-[10px] leading-relaxed opacity-80">{tour.description}</p>
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            </div>
                                        ))}
                                    </Masonry>
                                </section>
                            )}

                            {/* SERVICES - MINIMAL LUXURY */}
                            {results.services.length > 0 && (
                                <section>
                                    <div className="flex items-end justify-between mb-12">
                                        <div>
                                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter font-outfit mb-2">Essential Logistics</h3>
                                            <p className="text-slate-400 text-sm font-medium">{results.services.length} services ready for deployment</p>
                                        </div>
                                        <div className="h-[1px] flex-1 mx-12 bg-slate-100 hidden md:block" />
                                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hidden md:block">03 / Services</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                        {results.services.map((service: any, idx: number) => (
                                            <motion.div
                                                key={service._id}
                                                initial={{ scale: 0.95, opacity: 0 }}
                                                whileInView={{ scale: 1, opacity: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: idx * 0.1, duration: 0.6 }}
                                                className="bg-white rounded-[40px] p-8 border border-slate-100 hover:border-blue-100 hover:shadow-2xl transition-all group relative overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all">
                                                    <FaStar size={100} />
                                                </div>
                                                <Link href="/services" className="block relative z-10">
                                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                                        <FaStar size={20} />
                                                    </div>
                                                    <h4 className="text-2xl font-black text-slate-900 mb-3 font-outfit tracking-tighter group-hover:text-blue-600 transition-colors uppercase">{service.title}</h4>
                                                    <p className="text-sm text-slate-500 font-medium mb-8 line-clamp-2 leading-relaxed">{service.description}</p>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[12px] font-black text-slate-900 tracking-tight">{service.price}</span>
                                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:translate-x-1 transition-all">
                                                            <FaArrowRight size={12} />
                                                        </div>
                                                    </div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-[60px] border border-slate-100 shadow-2xl relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
                            <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-10 text-slate-200">
                                <FaSadTear size={60} />
                            </div>
                            <h3 className="text-5xl font-black text-slate-900 mb-6 tracking-tighter font-outfit">Zero Matches Found</h3>
                            <p className="text-slate-500 text-xl font-medium max-w-lg mb-12 opacity-80 leading-relaxed">Our archive contains no records for <span className="text-blue-600 font-black italic">"{query}"</span>. Let's refine your coordinates.</p>
                            <div className="flex flex-wrap justify-center gap-4">
                                {['Pokhara', 'Everest', 'Annapurna', 'Lumbini'].map(t => (
                                    <Link key={t} href={`/search?query=${t}`} className="px-8 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
                                        {t}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                main { font-family: 'Inter', sans-serif; }
            `}</style>
        </main>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] space-y-8">
                <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.6em] animate-pulse">Synchronizing Intelligence...</p>
            </div>
        }>
            <SearchContent />
        </Suspense>
    );
}
