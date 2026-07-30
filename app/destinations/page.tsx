import type { Metadata } from 'next';
import Image from 'next/image';
import { CONFIG } from '@/lib/config';
import DestinationsCatalogClient from '@/components/DestinationsCatalogClient';
import { FaGlobeAmericas } from 'react-icons/fa';

// ─── Metadata & SEO ───
export const metadata: Metadata = {
    title: 'Travel Destinations & Regions | Travel Sansar',
    description: 'Discover extraordinary travel destinations with Travel Sansar. Browse mountain Sanctuaries, Everest, Annapurna, Chitwan, and historic cities.',
    openGraph: {
        title: 'Travel Destinations & Regions | Travel Sansar',
        images: ['https://images.unsplash.com/photo-1586950313337-a6ffb447b55e?q=80&w=1332&auto=format&fit=crop'],
    }
};

// ─── Server Data Fetching ───
async function getDestinations() {
    try {
        const res = await fetch(`${CONFIG.API_BASE_URL}/destinations`, {
            next: { revalidate: 3600 }
        });
        if (!res.ok) throw new Error('Failed to fetch destinations');
        const data = await res.json();
        return Array.isArray(data) ? data : data.destinations || [];
    } catch (error) {
        console.error('Fetch Error:', error);
        return [];
    }
}

export default async function DestinationsPage() {
    const allDestinations = await getDestinations();

    return (
        <main className="bg-white min-h-screen pb-24 text-slate-900 font-sans relative overflow-hidden">
            {/* ─── Hero Section ─── */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
                    <div className="relative h-[42vh] min-h-[360px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex items-center justify-center">
                        <Image
                            src="https://images.unsplash.com/photo-1586950313337-a6ffb447b55e?q=80&w=1600&auto=format&fit=crop"
                            alt="Travel Destinations Hero"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-amber-300 text-xs font-black uppercase tracking-[0.3em] font-outfit mb-6">
                                <FaGlobeAmericas /> World-Renowned Sanctuaries
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black text-white font-outfit tracking-tight uppercase leading-[0.9] mb-6">
                                Featured <span className="font-playfair italic font-normal text-amber-400">Destinations</span>
                            </h1>
                            <p className="text-slate-200 text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                                Explore mountain peaks, high-altitude passes, ancient cultural cities, and wildlife conservation zones.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Instant Non-Blinking Client Catalog ─── */}
            <DestinationsCatalogClient initialDestinations={allDestinations} />
        </main>
    );
}
