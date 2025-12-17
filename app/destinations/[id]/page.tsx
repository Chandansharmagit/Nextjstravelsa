import Image from 'next/image';
import Link from 'next/link';

// Use environment variable for API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backendtsa.travelsansr.com/api';

async function getDestination(id: string) {
    try {
        // Fetch all destinations and find by ID because specific endpoint might not be reliable or needs id lookup
        // Assuming API might not have single item endpoint working perfectly or id is different.
        // Let's try the direct endpoint first if standard REST
        // Let's try the direct endpoint first
        const res = await fetch(`${API_URL}/destinations/${id}`, {
            cache: 'no-store'
        });

        if (res.ok) {
            const data = await res.json();
            // Handle { destination: {} } or {}
            return data.destination || data;
        }

        // Fallback: fetch all and find
        const allRes = await fetch(`${API_URL}/destinations`, { cache: 'no-store' });
        const data = await allRes.json();
        const list = Array.isArray(data) ? data : data.destinations || [];
        return list.find((d: any) => d._id === id);

    } catch (error) {
        console.error('Failed to fetch destination:', error);
        return null;
    }
}

import { Metadata } from 'next';
import SocialShare from '@/components/SocialShare';

// Exporting dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const destination = await getDestination(params.id);

    if (!destination) {
        return {
            title: 'Destination Not Found | Travel Sansar',
        };
    }

    const image0 = destination.images?.[0];
    let imageSrc = (typeof image0 === 'string' ? image0 : image0?.path || image0?.url) || destination.image;

    // Use a relevant placeholder if no image exists, rather than the logo
    if (!imageSrc) {
        // If no image, we might want to return a generic 'travel' placeholder or just undefined
        // But user specifically doesn't want the logo. 
        // Let's use the local placeholder card image if available, or just omit if acceptable, 
        // but for OG we need an image.
        // Let's try to not set a fallback here and see if we can find *any* image in the array
        if (destination.images && destination.images.length > 0) {
            const anyImg = destination.images.find((img: any) => img?.path || img?.url || typeof img === 'string');
            if (anyImg) {
                imageSrc = typeof anyImg === 'string' ? anyImg : anyImg.path || anyImg.url;
            }
        }
    }

    // Ensure absolute URL for Open Graph
    if (imageSrc && !imageSrc.startsWith('http')) {
        const baseUrl = 'https://backendtsa.travelsansr.com';
        const cleanPath = imageSrc.startsWith('/') ? imageSrc : `/${imageSrc}`;
        imageSrc = `${baseUrl}${cleanPath}`;
    }

    const openGraphImages = imageSrc ? [
        {
            url: imageSrc,
            width: 1200,
            height: 630,
            alt: destination.title,
        }
    ] : []; // Don't send logo if no image found

    return {
        title: `${destination.title} - Travel Sansar`,
        description: destination.description?.substring(0, 160) || `Explore ${destination.title} with Travel Sansar.`,
        openGraph: {
            title: destination.title,
            description: destination.description?.substring(0, 160),
            url: `https://www.travelsansar.com/destinations/${params.id}`,
            images: openGraphImages,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: destination.title,
            description: destination.description?.substring(0, 160),
            images: [imageSrc],
        },
    };
}

export default async function DestinationDetails({ params }: { params: { id: string } }) {
    const destination = await getDestination(params.id);

    if (!destination) {
        return <div className="min-h-screen flex justify-center items-center">Destination not found</div>;
    }

    const image0 = destination.images?.[0];
    const imageSrc = (typeof image0 === 'string' ? image0 : image0?.path || image0?.url) || destination.image || '/placeholder.jpg';

    // Construct the public URL for sharing
    const shareUrl = `https://www.travelsansar.com/destinations/${params.id}`;

    return (
        <section className="min-h-screen pt-32 pb-20 px-4 xl:px-20 bg-white">
            <Link href="/destinations" className="text-primary hover:underline mb-8 inline-block">&larr; Back to Destinations</Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="relative h-[400px] lg:h-[600px] rounded-2xl overflow-hidden shadow-card">
                    <Image
                        src={imageSrc}
                        alt={destination.title}
                        fill
                        className="object-cover"
                    />
                </div>

                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">{destination.title}</h1>
                    <div className="prose max-w-none text-gray-700 leading-relaxed">
                        <p className="text-lg whitespace-pre-line">{destination.description}</p>

                        {/* Additional dummy content as API details might be sparse */}
                        <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Highlights</h3>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Experience the local culture and traditions.</li>
                            <li>Breathtaking scenery and natural landscapes.</li>
                            <li>Authentic culinary experiences.</li>
                        </ul>
                    </div>

                    <div className="mt-12">
                        <button className="px-8 py-3 rounded-full bg-secondary text-white font-bold text-lg hover:bg-orange-600 transition shadow-lg w-full md:w-auto">
                            Book a Trip Here
                        </button>
                    </div>

                    <SocialShare
                        url={shareUrl}
                        title={destination.title}
                        description={destination.description}
                    />
                </div>
            </div>
        </section>
    );
}
