"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FaMapMarkerAlt, FaTimes, FaPaperPlane, FaPlus, FaSearch, FaArrowLeft, FaRoute, FaCompass, FaShieldAlt, FaIdBadge, FaClock, FaCheckCircle, FaStar, FaHandshake, FaGlobeAmericas, FaAward, FaMountain, FaUsers, FaLeaf, FaMapMarkedAlt, FaHistory, FaInfoCircle, FaExternalLinkAlt, FaRocket } from 'react-icons/fa';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { CONFIG } from '@/lib/config';
import { getImageUrl } from '@/lib/utils/image';

const API_URL = CONFIG.API_BASE_URL;

// Dynamically import the map to avoid SSR issues
const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-50 animate-pulse flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400">
            <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
            <p className="font-bold text-xs uppercase tracking-[0.2em]">Synchronizing Himalayan Data...</p>
        </div>
    </div>
});

interface Pin {
    id: string;
    lat: number;
    lng: number;
    name: string;
    isCustom?: boolean;
}

interface Destination {
    _id: string;
    title: string;
    description?: string;
    coordinates?: {
        lat: number;
        lng: number;
    };
    image?: string;
}

interface SearchResultInfo {
    name: string;
    description: string;
    image: string;
    history?: string;
    lat: number;
    lng: number;
    source: 'internal' | 'external';
    url?: string;
}

export default function ExpeditionPlanner() {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [plannedPins, setPlannedPins] = useState<Pin[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState<{ lat: number, lng: number } | null>(null);
    const [selectedPlaceInfo, setSelectedPlaceInfo] = useState<SearchResultInfo | null>(null);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        estimatedDuration: '',
        estimatedBudget: '',
        preferredDates: '',
        specialRequests: ''
    });

    const fetchWikipediaInfo = async (query: string) => {
        try {
            // First search for the exact title
            const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`);
            const searchData = await searchRes.json();

            if (searchData.query.search.length > 0) {
                const title = searchData.query.search[0].title;
                const pageRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&exintro&explaintext&titles=${encodeURIComponent(title)}&pithumbsize=1000&format=json&origin=*`);
                const pageData = await pageRes.json();
                const pages = pageData.query.pages;
                const pageId = Object.keys(pages)[0];
                const page = pages[pageId];

                return {
                    description: page.extract || "Information not available.",
                    image: page.thumbnail?.source || "",
                    url: `https://en.wikipedia.org/wiki/${title.replace(/ /g, '_')}`
                };
            }
        } catch (e) {
            console.error("Wikipedia fetch failed", e);
        }
        return null;
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        setSelectedPlaceInfo(null);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                const cleanLat = parseFloat(lat);
                const cleanLon = parseFloat(lon);
                setSearchResult({ lat: cleanLat, lng: cleanLon });

                // Check internal destinations first
                const matchedDest = destinations.find(d => {
                    if (!d.coordinates) return false;
                    const dLat = d.coordinates.lat;
                    const dLng = d.coordinates.lng;
                    return Math.abs(dLat - cleanLat) < 0.1 && Math.abs(dLng - cleanLon) < 0.1;
                });

                if (matchedDest) {
                    setSelectedPlaceInfo({
                        name: matchedDest.title,
                        description: matchedDest.description || "A verified Travel Sansar destination in the Himalayas.",
                        image: getImageUrl(matchedDest.image),
                        lat: cleanLat,
                        lng: cleanLon,
                        source: 'internal'
                    });
                } else {
                    // Fetch from Wikipedia for "Google Map" feel
                    const wiki = await fetchWikipediaInfo(searchQuery);
                    setSelectedPlaceInfo({
                        name: display_name.split(',')[0],
                        description: wiki?.description?.slice(0, 300) + (wiki?.description?.length > 300 ? '...' : '') || "Explore the geography and culture of this Himalayan region.",
                        history: wiki?.description || "",
                        image: wiki?.image || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1000", // Fallback Nepal image
                        lat: cleanLat,
                        lng: cleanLon,
                        source: 'external',
                        url: wiki?.url
                    });
                }
            }
        } catch (error) {
            console.error("Geocoding failed", error);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const res = await fetch(`${API_URL}/destinations`);
                if (res.ok) {
                    const data = await res.json();
                    const dests = Array.isArray(data) ? data : data.data || data.destinations || [];
                    setDestinations(dests);
                }
            } catch (error) {
                console.error("Failed to fetch destinations", error);
            }
        };
        fetchDestinations();
    }, []);

    const handleAddPin = (pin: Pin) => {
        setPlannedPins(prev => {
            if (!pin.isCustom && prev.some(p => p.id === pin.id)) return prev;
            return [...prev, pin];
        });
    };

    const handleRemovePin = (id: string) => {
        setPlannedPins(prev => prev.filter(p => p.id !== id));
    };

    const handleSubmitPlan = async (e: React.FormEvent) => {
        e.preventDefault();

        if (plannedPins.length === 0) {
            toast.error('Please add at least one destination to your plan');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/expedition-plans`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    pins: plannedPins
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success('🎉 Expedition plan submitted successfully! Our team will contact you soon.');
                setShowSubmitModal(false);
                setFormData({
                    customerName: '',
                    customerEmail: '',
                    customerPhone: '',
                    estimatedDuration: '',
                    estimatedBudget: '',
                    preferredDates: '',
                    specialRequests: ''
                });
                // Optionally clear pins after submission
                // setPlannedPins([]);
            } else {
                toast.error(data.message || 'Failed to submit expedition plan');
            }
        } catch (error) {
            console.error('Failed to submit expedition plan:', error);
            toast.error('Failed to submit expedition plan. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-white transition-all duration-500 flex flex-col">
            <Toaster position="top-right" />
            {/* Command Header */}
            <div className="bg-slate-900 text-white px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-6 z-30 shadow-2xl relative border-t border-slate-800 shrink-0">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group text-sm">
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold uppercase tracking-[0.2em]">Exit</span>
                    </Link>
                    <div className="h-8 w-px bg-slate-800" />
                    <div>
                        <h1 className="text-xl md:text-2xl font-black tracking-tighter flex items-center gap-2 uppercase">
                            <FaCompass className="text-secondary" />
                            Expedition <span className="text-secondary italic underline decoration-slate-700 underline-offset-8">Planner</span>
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <form onSubmit={handleSearch} className="relative flex-1 md:w-[450px] group">
                        <input
                            type="text"
                            placeholder="Search any place (e.g. Everest, Pokhara)..."
                            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-slate-800 border border-slate-700 focus:bg-slate-700 focus:border-secondary transition-all outline-none text-sm font-semibold text-white placeholder:text-slate-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">
                            {isSearching ?
                                <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" /> :
                                <FaSearch className="text-slate-500 group-focus-within:text-secondary transition-colors" />
                            }
                        </div>
                    </form>
                </div>
            </div>

            {/* Main Interactive Section - Massive Tall Layout to remove gaps */}
            <div className="flex flex-col lg:flex-row relative overflow-hidden bg-white h-[600px]">

                {/* Itinerary Sidebar */}
                <div className="w-full lg:w-[380px] bg-white border-r border-slate-100 flex flex-col z-20 shadow-2xl overflow-hidden h-full">
                    <div className="p-8 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Your Journey</h2>
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Himalayan Route Path</p>
                        </div>
                        <div className="bg-slate-900 text-white text-[10px] font-black px-2.5 py-1 rounded-md">
                            {plannedPins.length}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                        <AnimatePresence>
                            {plannedPins.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="h-full flex flex-col items-center justify-center text-center px-4"
                                >
                                    <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner rotate-3">
                                        <FaMapMarkedAlt className="text-4xl text-slate-200" />
                                    </div>
                                    <h3 className="text-sm font-black text-slate-900 uppercase">Interactive Path Map</h3>
                                    <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest leading-relaxed">
                                        Use search to find historical sites or click the map directly. We'll identify every stop with live geodata.
                                    </p>
                                </motion.div>
                            ) : (
                                <div className="space-y-3">
                                    {plannedPins.map((pin, index) => (
                                        <motion.div
                                            key={pin.id}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            className="group relative pl-8"
                                        >
                                            {index !== plannedPins.length - 1 && (
                                                <div className="absolute left-3 top-8 bottom-[-12px] w-[2px] bg-slate-100 border-l border-dashed border-slate-300" />
                                            )}
                                            <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-black z-10 group-hover:bg-secondary group-hover:text-white transition-all transform group-hover:scale-110">
                                                {index + 1}
                                            </div>
                                            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm group-hover:border-secondary/30 transition-all">
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-black text-slate-900 text-[11px] uppercase tracking-tight truncate mb-1">{pin.name}</h4>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className={`w-1.5 h-1.5 rounded-full ${pin.isCustom ? 'bg-orange-500' : 'bg-secondary'}`} />
                                                            <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">
                                                                {pin.isCustom ? 'Location verified' : 'Verified Destination'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => handleRemovePin(pin.id)} className="text-slate-200 hover:text-red-500 transition-colors">
                                                        <FaTimes size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {plannedPins.length > 0 && (
                        <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                            <button
                                onClick={() => setShowSubmitModal(true)}
                                className="w-full bg-secondary text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                            >
                                <FaRocket /> Review Expedition Plan
                            </button>
                        </div>
                    )}
                </div>

                {/* Map Area */}
                <div className="flex-1 relative">
                    <InteractiveMap
                        destinations={destinations}
                        plannedPins={plannedPins}
                        onAddPin={handleAddPin}
                        onRemovePin={handleRemovePin}
                        searchResult={searchResult}
                    />

                    {/* Rich Search Result Card (Floating overlay like Google Maps) */}
                    <AnimatePresence>
                        {selectedPlaceInfo && (
                            <motion.div
                                initial={{ x: 400, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 400, opacity: 0 }}
                                className="absolute right-8 top-8 bottom-8 w-[400px] z-20 hidden xl:flex flex-col"
                            >
                                <div className="bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.2)] border border-white/50 flex flex-col h-full overflow-hidden">
                                    {/* Place Image */}
                                    <div className="h-[250px] relative shrink-0">
                                        <img
                                            src={selectedPlaceInfo.image}
                                            alt={selectedPlaceInfo.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                        <button
                                            onClick={() => setSelectedPlaceInfo(null)}
                                            className="absolute top-6 right-6 w-10 h-10 bg-black/30 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-black/50 transition-all"
                                        >
                                            <FaTimes size={14} />
                                        </button>
                                        <div className="absolute bottom-8 left-8 right-8">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${selectedPlaceInfo.source === 'internal' ? 'bg-secondary text-white' : 'bg-blue-600 text-white'}`}>
                                                    {selectedPlaceInfo.source === 'internal' ? 'Verified TS Hub' : 'Historical Site'}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{selectedPlaceInfo.name}</h3>
                                        </div>
                                    </div>

                                    {/* Place Content */}
                                    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                        <div className="space-y-8">
                                            <div>
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                                    <FaInfoCircle /> About this place
                                                </h4>
                                                <p className="text-slate-600 text-sm leading-relaxed font-medium">
                                                    {selectedPlaceInfo.description}
                                                </p>
                                            </div>

                                            {selectedPlaceInfo.url && (
                                                <a
                                                    href={selectedPlaceInfo.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 font-bold text-xl italic">W</div>
                                                        <div>
                                                            <p className="text-xs font-black text-slate-900 uppercase">Read More</p>
                                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Wikipedia History</p>
                                                        </div>
                                                    </div>
                                                    <FaExternalLinkAlt className="text-slate-300 group-hover:text-secondary transition-colors" size={14} />
                                                </a>
                                            )}

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-slate-50 rounded-2xl">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">LATITUDE</p>
                                                    <p className="text-xs font-bold text-slate-900">{selectedPlaceInfo.lat.toFixed(4)}°</p>
                                                </div>
                                                <div className="p-4 bg-slate-50 rounded-2xl">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">LONGITUDE</p>
                                                    <p className="text-xs font-bold text-slate-900">{selectedPlaceInfo.lng.toFixed(4)}°</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Box */}
                                    <div className="p-8 bg-white border-t border-slate-100">
                                        <button
                                            onClick={() => {
                                                handleAddPin({
                                                    id: `${selectedPlaceInfo.source}-${Date.now()}`,
                                                    lat: selectedPlaceInfo.lat,
                                                    lng: selectedPlaceInfo.lng,
                                                    name: selectedPlaceInfo.name,
                                                    isCustom: true
                                                });
                                                setSelectedPlaceInfo(null);
                                            }}
                                            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-secondary transition-all flex items-center justify-center gap-3 group"
                                        >
                                            <FaPlus className="group-hover:rotate-90 transition-transform" /> Add to Itinerary
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Scrollable Content Section */}
            <div className="bg-white">
                <section className="max-w-[1400px] mx-auto py-32 px-12 border-b border-slate-50 text-center">
                    <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-10 leading-[0.85]">
                        Precision Planning for <br />
                        <span className="text-secondary italic">Himalayan Legends.</span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
                        <div className="p-10 bg-slate-50 rounded-[3rem] text-left">
                            <FaMountain className="text-3xl text-secondary mb-6" />
                            <h4 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Peak Accuracy</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">Integrated topographical data ensures every stop is perfectly positioned for high-altitude success.</p>
                        </div>
                        <div className="p-10 bg-slate-50 rounded-[3rem] text-left">
                            <FaHistory className="text-3xl text-secondary mb-6" />
                            <h4 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Rich Heritage</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">Instantly access historical and cultural data for site you plan to visit across the Himalayan range.</p>
                        </div>
                        <div className="p-10 bg-slate-50 rounded-[3rem] text-left">
                            <FaHandshake className="text-3xl text-secondary mb-6" />
                            <h4 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Verified Hubs</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">Connect directly with Travel Sansar's network of verified teahouses, lodges, and expert local guides.</p>
                        </div>
                    </div>
                </section>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #dfe6ed;
                    border-radius: 10px;
                }
            `}</style>

            {/* Submission Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                    >
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex items-center justify-between rounded-t-3xl z-10">
                            <div>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Submit Your Plan</h2>
                                <p className="text-sm text-gray-500 font-medium mt-1">Tell us about your dream expedition</p>
                            </div>
                            <button
                                onClick={() => setShowSubmitModal(false)}
                                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all"
                            >
                                <FaTimes className="text-gray-600" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitPlan} className="p-8 space-y-6">
                            {/* Your Journey Summary */}
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-6 border border-orange-200">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-secondary" /> Your Journey
                                </h3>
                                <div className="space-y-2">
                                    {plannedPins.map((pin, index) => (
                                        <div key={pin.id} className="flex items-center gap-3 text-sm">
                                            <div className="w-6 h-6 rounded-full bg-secondary text-white flex items-center justify-center text-xs font-bold">
                                                {index + 1}
                                            </div>
                                            <span className="text-gray-700 font-medium">{pin.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Contact Information</h3>

                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.customerName}
                                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.customerEmail}
                                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={formData.customerPhone}
                                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                            </div>

                            {/* Trip Details */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Trip Details</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Estimated Duration</label>
                                        <input
                                            type="text"
                                            value={formData.estimatedDuration}
                                            onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                                            placeholder="7 days"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Estimated Budget</label>
                                        <input
                                            type="text"
                                            value={formData.estimatedBudget}
                                            onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                                            placeholder="$2000 - $3000"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Preferred Dates</label>
                                    <input
                                        type="text"
                                        value={formData.preferredDates}
                                        onChange={(e) => setFormData({ ...formData, preferredDates: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                                        placeholder="June 15 - June 22, 2024"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Special Requests</label>
                                    <textarea
                                        value={formData.specialRequests}
                                        onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all resize-none"
                                        placeholder="Any specific requirements or preferences..."
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowSubmitModal(false)}
                                    className="flex-1 px-8 py-4 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-8 py-4 rounded-xl bg-secondary text-white font-bold hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="animate-spin inline-block">⌛</span>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <FaPaperPlane /> Submit Plan
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </main>
    );
}
