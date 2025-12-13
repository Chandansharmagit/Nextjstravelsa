"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

const Hero = () => {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?query=${encodeURIComponent(query)}`);
        }
    };

    return (
        <div className="relative w-full h-[90vh]">
            {/* Background Image Overlay */}
            <div
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop")' }} // Stunning Hotel/Resort/Relax vibe
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
                <div className="w-full max-w-3xl bg-white rounded-full p-2 pl-6 shadow-2xl flex items-center gap-4 transition-all duration-300 transform hover:scale-[1.01]">
                    <div className="flex-1 flex items-center gap-3 border-r border-gray-200 pr-4">
                        <FaMapMarkerAlt className="text-secondary text-xl" />
                        <div className="flex flex-col items-start w-full">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Location</span>
                            <input
                                type="text"
                                placeholder="Where are you going?"
                                className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e as any)}
                                suppressHydrationWarning
                            />
                        </div>
                    </div>

                    {/* Add Date/Guests inputs in future updates for full functionality, keeping it simple for now as requested */}

                    <button
                        onClick={handleSearch}
                        className="bg-secondary text-white rounded-full p-4 px-8 font-bold text-lg hover:bg-orange-600 transition-all duration-300 shadow-lg flex items-center gap-2"
                    >
                        <FaSearch />
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
