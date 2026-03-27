import { Suspense } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { CONFIG } from '@/lib/config';
import DestinationsGrid from '@/components/DestinationsGrid';
import DestinationsSearch from '@/components/DestinationsSearch';
import DestinationPagination from '@/components/DestinationPagination';
import DestinationSkeleton from '@/components/DestinationSkeleton';

// ─── Metadata & SEO ───
export async function generateMetadata({ searchParams }: { searchParams: Promise<{ search?: string, category?: string }> }): Promise<Metadata> {
    const params = await searchParams;
    const search = params.search;
    const category = params.category;

    let title = 'Travel Destinations - Explore the World | Travel Sansar';
    if (search) title = `Search: "${search}" - Travel Destinations | Travel Sansar`;
    else if (category && category !== 'all') title = `${category} Destinations | Travel Sansar`;

    return {
        title,
        description: 'Discover the world with Travel Sansar. Browse our archive of global pursuits, from mountain adventures to cultural urban explorations.',
        openGraph: {
            title,
            images: ['https://images.unsplash.com/photo-1636513988093-126e51dee32d?q=80&w=1556&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
        }
    };
}

// ─── Data Fetching (ISR) ───
async function getDestinations() {
    try {
        const res = await fetch(`${CONFIG.API_BASE_URL}/destinations`, {
            next: { revalidate: 3600 } // Revalidate every hour
        });
        if (!res.ok) throw new Error('Failed to fetch destinations');
        const data = await res.json();
        return Array.isArray(data) ? data : data.destinations || [];
    } catch (error) {
        console.error('Fetch Error:', error);
        return [];
    }
}

export default async function DestinationsPage({
    searchParams,
}: {
    searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}) {
    const params = await searchParams;
    const allDestinations = await getDestinations();

    // Server-side Filtering
    const search = params.search?.toLowerCase() || '';
    const category = params.category || 'all';
    const currentPage = parseInt(params.page || '1');
    const itemsPerPage = 10; // 2 rows of 5 cards

    let filtered = allDestinations.filter((dest: any) => {
        const matchesSearch = !search ||
            dest.title?.toLowerCase().includes(search) ||
            dest.location?.toLowerCase().includes(search);
        const matchesCategory = category === 'all' || dest.category === category;
        return matchesSearch && matchesCategory;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentDestinations = filtered.slice(startIndex, startIndex + itemsPerPage);

    return (
        <main className="bg-[#FBFCFE] min-h-screen pb-20 font-sans relative overflow-hidden">
            {/* ─── Hero Section (Server Rendered) ─── */}
            <section className="relative h-[65vh] min-h-[500px] max-w-[1600px] mx-6 md:mx-12 lg:mx-20 mt-4 flex items-center justify-center overflow-hidden rounded-[20px]">
                <div className="absolute inset-0 z-0 scale-105">
                    <Image
                        src="https://images.unsplash.com/photo-1586950313337-a6ffb447b55e?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Travel Destinations Hero"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
                </div>

                <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
                    <span className="inline-block px-5 py-2 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 text-white text-[11px] font-bold uppercase tracking-[0.5em] mb-8">
                        The Sanctuary Archive
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.8] tracking-tighter uppercase italic h-font mb-8 drop-shadow-[0_30px_30px_rgba(0,0,0,0.5)]">
                        Global <br />
                        <span className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
                            Pursuits
                        </span>
                    </h1>
                </div>
            </section>

            {/* ─── Client Interaction Layer ─── */}
            <div className="max-w-[1200px] mx-auto px-16 md:px-12 lg:px-30">
                <DestinationsSearch />
            </div>

            {/* ─── Main Content Grid ─── */}
            <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-[3px] bg-slate-900" />
                            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-900">The Catalog</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-none h-font uppercase italic">
                            Archive Library
                        </h2>
                    </div>
                    <div className="hidden lg:block text-right">
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Results</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter italic h-font uppercase">{filtered.length}+ Pursuits</p>
                    </div>
                </div>

                <Suspense fallback={
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                        {[...Array(itemsPerPage)].map((_, i) => <DestinationSkeleton key={i} />)}
                    </div>
                }>
                    <DestinationsGrid destinations={currentDestinations} />
                </Suspense>

                {totalPages > 1 && (
                    <div className="mt-16 flex justify-center">
                        <DestinationPagination currentPage={currentPage} totalPages={totalPages} />
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .h-font { font-family: var(--font-outfit), sans-serif; }
                .serif-font { font-family: var(--font-playfair), serif; }
                .h-masonry { align-items: flex-start; }
            `}} />
        </main>
    );
}
