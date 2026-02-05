"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FaMapMarkerAlt, FaTimes, FaPaperPlane, FaPlus, FaSearch, FaExternalLinkAlt, FaInfoCircle, FaRoute } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Dynamically import the actual Map component to avoid SSR issues with Leaflet
const InteractiveMap = dynamic(() => import('./InteractiveMap'), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-gray-100 animate-pulse flex items-center justify-center">Loading Interactive Map...</div>
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

const MapSection = () => {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [plannedPins, setPlannedPins] = useState<Pin[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState<{ lat: number, lng: number } | null>(null);
    const [selectedPlaceInfo, setSelectedPlaceInfo] = useState<SearchResultInfo | null>(null);

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
                        image: matchedDest.image ? (matchedDest.image.startsWith('http') ? matchedDest.image : `https://backendtsa.travelsansr.com${matchedDest.image}`) : "",
                        lat: cleanLat,
                        lng: cleanLon,
                        source: 'internal'
                    });
                } else {
                    // Fetch from Wikipedia for rich info
                    const wiki = await fetchWikipediaInfo(searchQuery);
                    setSelectedPlaceInfo({
                        name: display_name.split(',')[0],
                        description: wiki?.description?.slice(0, 300) + (wiki?.description?.length > 300 ? '...' : '') || "Explore the geography and culture of this location.",
                        history: wiki?.description || "",
                        image: wiki?.image || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=1000",
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
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://backendtsa.travelsansr.com/api'}/destinations`);
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

    return (
        <section id="map-section" className="py-20 px-4 xl:px-20 bg-white overflow-hidden relative z-0">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div className="max-w-2xl text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter">
                            Plan Your <span className="text-secondary">Expedition</span>
                        </h2>
                        <p className="text-lg text-gray-600">
                            Explore our curated destinations, search for any place, or click anywhere on the map to pin your own stops.
                        </p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        {/* Map Search Bar */}
                        <form onSubmit={handleSearch} className="relative flex-1 md:w-80">
                            <input
                                type="text"
                                placeholder="Search any place (e.g. 'Everest Base Camp')"
                                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-secondary transition-all outline-none text-sm shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                {isSearching ? <span className="animate-spin inline-block">⌛</span> : <FaSearch className="text-sm" />}
                            </div>
                        </form>
                        {plannedPins.length > 0 && (
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setPlannedPins([])}
                                    className="px-6 py-3 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-all flex items-center gap-2"
                                >
                                    <FaTimes /> Clear Plan
                                </button>
                                <button className="px-8 py-3 rounded-2xl bg-secondary text-white font-bold shadow-xl shadow-orange-200 hover:bg-orange-600 transition-all flex items-center gap-2 transform hover:-translate-y-1">
                                    <FaPaperPlane /> Send Plan as Inquiry
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                    <div className="h-[600px] w-full z-0 relative">
                        <InteractiveMap
                            destinations={destinations}
                            plannedPins={plannedPins}
                            onAddPin={handleAddPin}
                            onRemovePin={handleRemovePin}
                            searchResult={searchResult}
                        />
                    </div>

                    {/* Rich Search Result Card - Google Maps Style */}
                    <AnimatePresence>
                        {selectedPlaceInfo && (
                            <motion.div
                                initial={{ x: 400, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 400, opacity: 0 }}
                                className="absolute right-4 top-4 bottom-4 w-[350px] z-20 hidden lg:flex flex-col"
                            >
                                <div className="bg-white rounded-3xl shadow-2xl border border-white/50 flex flex-col h-full overflow-hidden">
                                    {/* Place Image */}
                                    <div className="h-[200px] relative shrink-0">
                                        <img
                                            src={selectedPlaceInfo.image}
                                            alt={selectedPlaceInfo.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                        <button
                                            onClick={() => setSelectedPlaceInfo(null)}
                                            className="absolute top-4 right-4 w-10 h-10 bg-black/30 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-black/50 transition-all"
                                        >
                                            <FaTimes size={14} />
                                        </button>
                                        <div className="absolute bottom-6 left-6 right-6">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${selectedPlaceInfo.source === 'internal' ? 'bg-secondary text-white' : 'bg-blue-600 text-white'}`}>
                                                    {selectedPlaceInfo.source === 'internal' ? 'Verified Hub' : 'Explore'}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{selectedPlaceInfo.name}</h3>
                                        </div>
                                    </div>

                                    {/* Place Content */}
                                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                        <div className="space-y-6">
                                            <div>
                                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                                    <FaInfoCircle /> About this place
                                                </h4>
                                                <p className="text-gray-600 text-sm leading-relaxed font-medium">
                                                    {selectedPlaceInfo.description}
                                                </p>
                                            </div>

                                            {selectedPlaceInfo.url && (
                                                <a
                                                    href={selectedPlaceInfo.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all group"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 font-bold text-xl italic">W</div>
                                                        <div>
                                                            <p className="text-xs font-black text-gray-900 uppercase">Read More</p>
                                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Wikipedia</p>
                                                        </div>
                                                    </div>
                                                    <FaExternalLinkAlt className="text-gray-300 group-hover:text-secondary transition-colors" size={14} />
                                                </a>
                                            )}

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 bg-gray-50 rounded-2xl">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">LATITUDE</p>
                                                    <p className="text-xs font-bold text-gray-900">{selectedPlaceInfo.lat.toFixed(4)}°</p>
                                                </div>
                                                <div className="p-4 bg-gray-50 rounded-2xl">
                                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">LONGITUDE</p>
                                                    <p className="text-xs font-bold text-gray-900">{selectedPlaceInfo.lng.toFixed(4)}°</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Box */}
                                    <div className="p-6 bg-white border-t border-gray-100">
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
                                            className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-secondary transition-all flex items-center justify-center gap-3 group"
                                        >
                                            <FaPlus className="group-hover:rotate-90 transition-transform" /> Add to Plan
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Planning Sidebar - Overlaid on Map */}
                    {plannedPins.length > 0 && (
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-xl w-64 max-h-[500px] overflow-y-auto z-[20] border border-white/20">
                            <h4 className="font-black text-gray-900 mb-4 flex items-center justify-between">
                                Your Journey
                                <span className="bg-secondary text-white text-xs px-2 py-1 rounded-full">{plannedPins.length}</span>
                            </h4>
                            <div className="space-y-3">
                                {plannedPins.map((pin, index) => (
                                    <div key={pin.id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-orange-100 text-secondary flex items-center justify-center text-[10px] font-bold">
                                                {index + 1}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 truncate w-32">{pin.name}</span>
                                        </div>
                                        <button
                                            onClick={() => handleRemovePin(pin.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <FaTimes size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <Link href="/expedition-planner">
                                    <button className="w-full bg-secondary text-white py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                                        <FaRoute /> Open Full Planner
                                    </button>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Benefits */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: 'Pin Your Interest', desc: 'Click any place on the map to add it to your travel wishlist.', icon: <FaMapMarkerAlt className="text-secondary" /> },
                        { title: 'Interactive Route', desc: 'Visualize your entire journey across Nepal or beyond.', icon: <FaPlus className="text-purple-500" /> },
                        { title: 'Instant Inquiry', desc: 'Send your custom itinerary to our experts with one click.', icon: <FaPaperPlane className="text-blue-500" /> }
                    ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4 p-6 rounded-3xl bg-gray-50 border border-gray-100 hover:border-secondary/20 transition-all group">
                            <div className="p-3 rounded-2xl bg-white shadow-sm group-hover:shadow-md transition-all">
                                {item.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                                <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
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
        </section>
    );
};

export default MapSection;
