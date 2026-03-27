import { Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { CONFIG } from '@/lib/config';
import ToursGrid from '@/components/ToursGrid';
import ToursSearch from '@/components/ToursSearch';
import TourPagination from '@/components/TourPagination';
import TourSkeleton from '@/components/TourSkeleton';

// ─── Metadata & SEO ───
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ search?: string, category?: string }> }): Promise<Metadata> {
    const params = await searchParams;
    const search = params.search;
    const category = params.category;
    
    let title = 'Epic Adventures & Tours | Travel Sansar';
    if (search) title = `Search: "${search}" - Tours | Travel Sansar`;
    else if (category && category !== 'all') title = `${category} Tours | Travel Sansar`;

    return {
        title,
        description: 'Explore epic adventures with Travel Sansar. From trekking the Himalayas to cultural heritage tours, find your next journey here.',
        openGraph: {
            title,
            images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1200'],
        }
    };
}

// ─── Data Fetching (ISR) ───
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

export default async function ToursPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; category?: string; duration?: string; price?: string; page?: string }>;
}) {
    const params = await searchParams;
    const allTours = await getTours();
    
    // Server-side Filtering Logic
    const search = params.search?.toLowerCase() || '';
    const category = params.category || 'all';
    const durationFilter = params.duration || 'all';
    const priceFilter = params.price || 'all';
    const currentPage = parseInt(params.page || '1');
    const itemsPerPage = 9;

    let filtered = allTours.filter((tour: any) => {
        // Search Match
        const matchesSearch = !search || 
            tour.title?.toLowerCase().includes(search) || 
            tour.description?.toLowerCase().includes(search) ||
            tour.destination?.toLowerCase().includes(search);
        
        // Category Match
        const matchesCategory = category === 'all' || 
            tour.type?.toLowerCase().includes(category.toLowerCase()) ||
            tour.title?.toLowerCase().includes(category.toLowerCase());

        // Duration Match
        let matchesDuration = true;
        if (durationFilter !== 'all') {
            const duration = parseInt(tour.duration);
            if (durationFilter === 'short') matchesDuration = duration <= 3;
            else if (durationFilter === 'medium') matchesDuration = duration > 3 && duration <= 7;
            else if (durationFilter === 'long') matchesDuration = duration > 7;
        }

        // Price Match
        let matchesPrice = true;
        if (priceFilter !== 'all') {
            const price = parseFloat(tour.price);
            if (priceFilter === 'budget') matchesPrice = price < 500;
            else if (priceFilter === 'moderate') matchesPrice = price >= 500 && price <= 1500;
            else if (priceFilter === 'luxury') matchesPrice = price > 1500;
        }

        return matchesSearch && matchesCategory && matchesDuration && matchesPrice;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTours = filtered.slice(startIndex, startIndex + itemsPerPage);

    return (
        <main className="bg-white min-h-screen pb-32 overflow-x-hidden relative font-sans">
            {/* ─── Premium Hero Section (Optimized) ─── */}
            <div className="relative h-[85vh] min-h-[600px] w-full flex flex-col items-center justify-center overflow-hidden bg-slate-900">
                {/* Background Layer */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000"
                        alt="Tours Hero"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-900/40 via-transparent to-white" />
                </div>

                {/* Content Layer */}
                <div className="relative z-10 w-full max-w-7xl px-4 flex flex-col items-center text-center">
                    <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.6em] mb-6 h-font">
                        Curated Experiences
                    </span>
                    <h1 className="text-white text-[12vw] md:text-[8vw] font-black tracking-tighter uppercase leading-[0.85] drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)] h-font">
                        Epic <br className="hidden md:block" /> Adventures
                    </h1>
                </div>

                {/* Bottom Fade */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent z-20" />
            </div>

            {/* ─── Filter Section ─── */}
            <div className="relative z-30 -mt-24">
                <ToursSearch />
            </div>

            {/* ─── Main Grid Section ─── */}
            <div className="container mx-auto px-4 xl:px-20 relative z-10 pt-12">
                <div className="flex items-center justify-between mb-12 px-2">
                    <div className="px-8 py-2.5 bg-slate-950/5 backdrop-blur-xl border border-slate-950/10 rounded-full">
                        <span className="text-slate-900/60 text-[10px] font-black uppercase tracking-[0.4em] h-font">
                            {filtered.length} Successes archived
                        </span>
                    </div>
                </div>

                <Suspense fallback={
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => <TourSkeleton key={i} featured={i % 5 === 0} />)}
                    </div>
                }>
                    <ToursGrid tours={currentTours} />
                </Suspense>

                {totalPages > 1 && (
                    <div className="mt-20 flex justify-center">
                        <TourPagination currentPage={currentPage} totalPages={totalPages} />
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .h-font { font-family: var(--font-outfit), sans-serif; }
                .p-font { font-family: var(--font-playfair), serif; }
                .h-masonry { align-items: flex-start; }
            `}} />
        </main>
    );
}
