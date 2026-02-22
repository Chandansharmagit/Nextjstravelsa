import Link from 'next/link';
import { Metadata } from 'next';
import DestinationView from '@/components/DestinationView';
import { getImageUrl } from '@/lib/utils/image';
import { CONFIG } from '@/lib/config';

const API_URL = CONFIG.API_BASE_URL;

async function getDestination(id: string) {
    try {
        const res = await fetch(`${API_URL}/destinations/${id}`, {
            cache: 'no-store'
        });

        if (res.ok) {
            const data = await res.json();
            return data.destination || data;
        }
        return null;
    } catch (error) {
        console.error('Failed to fetch destination:', error);
        return null;
    }
}

const ensureAbsoluteUrl = (url: string | undefined | null) => getImageUrl(url);

const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '');
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    try {
        const { id } = await params;
        const dest = await getDestination(id);

        if (!dest) return { title: 'Destination Not Found' };

        const title = `${dest.title} - Travel Sansar`;
        const cleanDesc = dest.description?.replace(/<[^>]*>?/gm, '') || '';
        const description = cleanDesc.substring(0, 160) || 'Discover amazing destinations with Travel Sansar.';
        const mainImage = getImageUrl(dest.images?.[0]?.path || dest.images?.[0]?.url || dest.image);

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                images: [mainImage],
                type: 'website',
                url: `${CONFIG.SITE_URL}/destination/${id}`,
                siteName: 'Travel Sansar'
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: [mainImage],
            },
        };
    } catch (error) {
        return {
            title: 'Travel Sansar',
            openGraph: {
                images: [CONFIG.LOGO_URL]
            }
        };
    }
}

export default async function DestinationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const destination = await getDestination(id);

    if (!destination) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="text-center">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Expedition Not Found</h2>
                    <Link href="/" className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all">
                        Return to Base
                    </Link>
                </div>
            </div>
        );
    }

    const shareUrl = `${CONFIG.SITE_URL}/destination/${id}`;

    return <DestinationView destination={destination} shareUrl={shareUrl} />;
}
