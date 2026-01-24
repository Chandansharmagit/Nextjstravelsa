import Link from 'next/link';
import { Metadata } from 'next';
import DestinationView from '@/components/DestinationView';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backendtsa.travelsansr.com/api';

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

const ensureAbsoluteUrl = (url: string | undefined | null) => {
    if (!url) return 'https://travelsansr.com/logo-new.png';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/uploads')) return `https://backendtsa.travelsansr.com${url}`;
    return `https://travelsansr.com${url.startsWith('/') ? '' : '/'}${url}`;
};

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    try {
        const { id } = await params;
        const dest = await getDestination(id);

        if (!dest) return { title: 'Destination Not Found' };

        const image0 = dest.images?.[0];
        const rawImage = (typeof image0 === 'string' ? image0 : image0?.path || image0?.url) || dest.image;
        const imageSrc = ensureAbsoluteUrl(rawImage);

        const title = `${dest.title} - Travel Sansar`;
        const description = dest.description?.substring(0, 160) || 'Discover amazing destinations with Travel Sansar.';

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                images: [{
                    url: imageSrc,
                    width: 1200,
                    height: 630,
                    alt: dest.title
                }],
                type: 'website',
                url: `https://travelsansr.com/destination/${id}`,
                siteName: 'Travel Sansar'
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: [imageSrc],
            }
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

    return <DestinationView destination={destination} />;
}
