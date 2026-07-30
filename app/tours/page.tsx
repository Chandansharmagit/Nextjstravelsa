import type { Metadata } from 'next';
import Image from 'next/image';
import { CONFIG } from '@/lib/config';
import ToursCatalogClient from '@/components/ToursCatalogClient';
import { FaCalendarCheck } from 'react-icons/fa';

// ─── Metadata & SEO ───
export const metadata: Metadata = {
    title: 'Epic Adventures & Tours | Travel Sansar',
    description: 'Explore epic adventures with Travel Sansar. From trekking the Himalayas to luxury helicopter tours, find your next journey here.',
    openGraph: {
        title: 'Epic Adventures & Tours | Travel Sansar',
        images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200'],
    }
};

// ─── Server Data Fetching ───
async function getTours() {
    try {
        const res = await fetch(`${CONFIG.API_BASE_URL}/tours`, {
            next: { revalidate: 3600 }
        });
        if (!res.ok) throw new Error('Failed to fetch tours');
        const data = await res.json();
        return Array.isArray(data) ? data : data.tours || [];
    } catch (error) {
        console.error('Fetch Error:', error);
        return [];
    }
}

export default async function ToursPage() {
    const allTours = await getTours();

    return (
        <main className="bg-white min-h-screen pb-32 text-slate-900 font-sans relative overflow-hidden">
            {/* ─── Hero Section ─── */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
                    <div className="relative h-[42vh] min-h-[360px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex items-center justify-center">
                        <Image
                            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1600"
                            alt="Tours Hero"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-amber-300 text-xs font-black uppercase tracking-[0.3em] font-outfit mb-6">
                                <FaCalendarCheck /> Bestselling Travel Packages
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black text-white font-outfit tracking-tight uppercase leading-[0.9] mb-6">
                                Epic <span className="font-playfair italic font-normal text-amber-400">Adventures</span>
                            </h1>
                            <p className="text-slate-200 text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                                Handcrafted itineraries featuring certified local Sherpa guides, high-pass treks, and luxury lodges.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Instant Non-Blinking Client Catalog ─── */}
            <ToursCatalogClient initialTours={allTours} />
        </main>
    );
}
