import TourBookingSection from '@/components/TourBookingSection';
import TourView from '@/components/TourView';
import { Metadata } from 'next';
import Link from 'next/link';

// Use environment variable for API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backendtsa.travelsansr.com/api';

async function getTour(id: string) {
    try {
        const res = await fetch(`${API_URL}/tours/${id}`, {
            cache: 'no-store'
        });
        if (res.ok) {
            const data = await res.json();
            return data.tour || data;
        }

        // Fallback or retry
        const allRes = await fetch(`${API_URL}/tours`, { cache: 'no-store' });
        if (allRes.ok) {
            const allData = await allRes.json();
            const list = Array.isArray(allData) ? allData : allData.tours || allData.data || [];
            return list.find((t: any) => t._id === id);
        }
        return null;

    } catch (error) {
        console.error('Failed to fetch tour:', error);
        return null;
    }
}

const ensureAbsoluteUrl = (url: string | undefined | null) => {
    if (!url) return 'https://travelsansr.com/logo-new.png';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `https://backendtsa.travelsansr.com${url}`;
    return `https://travelsansr.com${url.startsWith('/') ? '' : '/'}${url}`;
};

// Exporting dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    try {
        const { id } = await params;
        const tour = await getTour(id);

        if (!tour) {
            return {
                title: 'Tour Not Found | Travel Sansar',
                openGraph: {
                    images: ['https://travelsansr.com/logo-new.png']
                }
            };
        }

        const rawImage = tour.images?.[0]?.url || tour.images?.[0] || tour.image;
        const imageSrc = ensureAbsoluteUrl(typeof rawImage === 'string' ? rawImage : rawImage?.path || rawImage?.url);
        const title = `${tour.title || tour.name} - Travel Sansar`;
        const description = tour.description?.substring(0, 160) || `Experience ${tour.title || tour.name} with Travel Sansar.`;

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                images: [
                    {
                        url: imageSrc,
                        width: 1200,
                        height: 630,
                        alt: tour.title || tour.name,
                    },
                ],
                type: 'website',
                url: `https://travelsansr.com/tours/${id}`,
                siteName: 'Travel Sansar'
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: [imageSrc],
            },
        };
    } catch (e) {
        return {
            title: 'Travel Sansar',
            description: 'Best Travel Agency in Nepal',
            openGraph: {
                images: ['https://travelsansr.com/logo-new.png']
            }
        };
    }
}

export default async function TourDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const tour = await getTour(id);

    if (!tour) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center gap-8 bg-[#f8fafc]">
                <div className="text-9xl">🏜️</div>
                <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Expedition Not Found</h2>
                <Link href="/tours" className="px-8 py-4 bg-slate-900 text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/20">
                    Return to Hub
                </Link>
            </div>
        );
    }

    return (
        <TourView
            tour={tour}
            id={id}
            bookingSection={<TourBookingSection tour={tour} />}
        />
    );
}
