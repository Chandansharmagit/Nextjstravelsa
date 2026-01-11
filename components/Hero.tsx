"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaMapMarkerAlt, FaMagic } from 'react-icons/fa';
import api from '@/lib/api';

const Hero = () => {
    const [query, setQuery] = useState("");
    const [isAiEnabled, setIsAiEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        if (isAiEnabled) {
            setIsLoading(true);
            try {
                // If using AI, we might want to pre-fetch and pass IDs, 
                // but for simplicity, let's just forward the query to a search page 
                // that handles the AI call, OR do it here and pass results.
                // BETTER UX: Pass the 'smart=true' flag to the search page.
                router.push(`/search?query=${encodeURIComponent(query)}&smart=true`);
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsLoading(false);
            }
        } else {
            router.push(`/search?query=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="relative w-full h-[90vh]">
            {/* Background Image Overlay */}
            <div
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: 'url("/images/winter_wonderland.jpg")' }}
            >
                {/* Gradient Overlay for text readability */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-black/20 to-black/60"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center items-center h-full text-center text-white px-4">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl tracking-tight">
                    Experience the <span className="text-secondary">Extraordinary</span>
                </h1>
                <p className="text-lg md:text-2xl mb-10 max-w-3xl drop-shadow-md font-light text-gray-100">
                    Discover handpicked destinations and luxury tours designed for the modern traveler.
                    Your next adventure begins here.
                </p>

                {/* Search Bar - "Dynamic Island" style inputs */}
                <div className={`w-full max-w-3xl bg-white rounded-full p-2 pl-6 shadow-2xl flex items-center gap-4 transition-all duration-300 transform hover:scale-[1.01] ${isAiEnabled ? 'ring-4 ring-purple-400 ring-opacity-50' : ''}`}>
                    <div className="flex-1 flex items-center gap-3 border-r border-gray-200 pr-4">
                        {isAiEnabled ? <FaMagic className="text-purple-500 text-xl animate-pulse" /> : <FaMapMarkerAlt className="text-secondary text-xl" />}
                        <div className="flex flex-col items-start w-full">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                {isAiEnabled ? 'AI Smart Search' : 'Location'}
                            </span>
                            <input
                                type="text"
                                placeholder={isAiEnabled ? "Describe your dream trip (e.g. 'romantic honeymoon in winter')" : "Where are you going?"}
                                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e as any)}
                                suppressHydrationWarning
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => setIsAiEnabled(!isAiEnabled)}
                        className={`p-3 rounded-full transition-colors ${isAiEnabled ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                        title="Toggle AI Smart Search"
                    >
                        <FaMagic />
                    </button>

                    <button
                        onClick={handleSearch}
                        className={`${isAiEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'bg-secondary hover:bg-orange-600'} text-white rounded-full p-4 px-8 font-bold text-lg transition-all duration-300 shadow-lg flex items-center gap-2`}
                    >
                        {isLoading ? <span className="animate-spin">⌛</span> : <FaSearch />}
                        <span>Search</span>
                    </button>
                </div>

                {/* Popular Tags */}
                <div className="mt-8 flex gap-4 text-sm text-white/80 font-medium">
                    <span>Popular:</span>
                    <button onClick={() => router.push('/search?query=Pokhara')} className="hover:text-secondary underline decoration-secondary decoration-2 underline-offset-4 transition">Pokhara</button>
                    <button onClick={() => router.push('/search?query=Mustang')} className="hover:text-secondary underline decoration-secondary decoration-2 underline-offset-4 transition">Mustang</button>
                    <button onClick={() => router.push('/search?query=Chitwan')} className="hover:text-secondary underline decoration-secondary decoration-2 underline-offset-4 transition">Chitwan</button>
                    <button onClick={() => router.push('/search?query=Bali')} className="hover:text-secondary underline decoration-secondary decoration-2 underline-offset-4 transition">Bali</button>
                </div>
            </div>
        </div>
    );
};

export default Hero;
