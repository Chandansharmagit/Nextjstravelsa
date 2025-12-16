import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import SocialShare from '@/components/SocialShare';
import DestinationImageGallery from '@/components/DestinationImageGallery';
import DestinationClientWrapper from '@/components/DestinationClientWrapper';

// Use environment variable for API URL
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

// Meta generation
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    try {
        const { id } = await params;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/destinations/${id}`);
        const data = await res.json();
        const dest = data.destination || data;

        if (!dest) return { title: 'Destination Not Found' };

        // Handle image logic
        const image0 = dest.images?.[0];
        const imageSrc = (typeof image0 === 'string' ? image0 : image0?.path || image0?.url) || dest.image || '/logo.png';

        return {
            title: `${dest.title} - Travel Sansar`,
            description: dest.description?.substring(0, 160),
            openGraph: {
                images: [imageSrc],
            }
        };
    } catch (e) {
        return { title: 'Travel Sansar' };
    }
}

export default async function DestinationPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const destination = await getDestination(id);

    if (!destination) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Destination Not Found</h2>
                    <Link href="/" className="text-primary hover:underline">Return Home</Link>
                </div>
            </div>
        );
    }

    const shareUrl = `https://www.travelsansar.com/destination/${id}`;

    return (
        <main className="bg-gray-50 min-h-screen pb-20 pt-28">
            <div className="container mx-auto px-4 xl:px-20">

                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link href="/destinations" className="text-secondary hover:underline text-sm font-medium flex items-center gap-1">
                        &larr; Back to Destinations
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Content */}
                    <div className="lg:col-span-2">

                        <div className="flex flex-col gap-4 mb-8">
                            <div className="flex flex-wrap justify-between items-start gap-4">
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-display">
                                    {destination.title}
                                </h1>
                                <div className="mt-2">
                                    <SocialShare
                                        url={shareUrl}
                                        title={destination.title}
                                        description={destination.description}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm">
                                <span className="font-medium text-orange-500">{destination.location || 'Nepal'}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span>Best time: {destination.bestTime || 'Anytime'}</span>
                            </div>
                        </div>

                        {/* Interactive Image Gallery */}
                        <div className="mb-10">
                            <DestinationImageGallery
                                images={destination.images || []}
                                mainImage={destination.image}
                                title={destination.title}
                            />
                        </div>

                        <div className="space-y-8">
                            {/* Section 1: Destination Overview */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">Destination Overview</h2>
                                    <div className="h-1 flex-grow bg-gradient-to-r from-gray-100 to-transparent rounded-full"></div>
                                </div>
                                <ul className="space-y-4">
                                    {destination.description?.split('.').filter((s: string) => s.trim().length > 0).map((sentence: string, index: number) => (
                                        <li key={index} className="flex items-start gap-4 group">
                                            <span className="mt-1.5 w-2 h-2 rounded-full bg-teal-500 group-hover:bg-teal-600 group-hover:scale-125 transition-all duration-300 shadow-[0_0_10px_rgba(20,184,166,0.3)]"></span>
                                            <p className="text-gray-600 leading-relaxed text-lg group-hover:text-gray-800 transition-colors duration-300">
                                                {sentence.trim()}.
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Section 2: Step-Based Itinerary (Vertical Timeline Layout) */}
                            {destination.thingsToDo && destination.thingsToDo.length > 0 && (
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                                    {/* Decorative Background Element */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full -mr-24 -mt-24 opacity-40 blur-3xl pointer-events-none"></div>

                                    <div className="flex items-center gap-3 mb-10 relative z-10">
                                        <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 0 00-2 2v12a2 0 002 2h10a2 0 002-2V7a2 0 00-2-2h-2M9 5a2 0 002 2h2a2 0 002-2M9 5a2 0 012-2h2a2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800">Suggested Itinerary</h2>
                                    </div>

                                    <div className="relative z-10 pl-4">
                                        {/* Vertical Line */}
                                        <div className="absolute left-[27px] top-4 bottom-8 w-0.5 bg-gradient-to-b from-teal-200 to-gray-100 rounded-full"></div>

                                        <div className="space-y-8">
                                            {destination.thingsToDo.map((thing: string, index: number) => {
                                                // Basic parsing to separate Title and Description
                                                // Matches dividers like "-", ":", "|"
                                                let title = thing;
                                                let desc = '';
                                                const separators = ['-', ':', '|', '–'];

                                                for (const sep of separators) {
                                                    if (thing.includes(sep)) {
                                                        const p = thing.split(sep);
                                                        title = p[0].trim();
                                                        desc = p.slice(1).join(sep).trim();
                                                        break;
                                                    }
                                                }

                                                return (
                                                    <div key={index} className="relative flex gap-6 items-start group">
                                                        {/* Number Badge */}
                                                        <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white border-2 border-teal-100 text-teal-600 font-extrabold text-xl flex items-center justify-center shadow-sm z-10 group-hover:border-teal-500 group-hover:bg-teal-500 group-hover:text-white transition-all duration-300">
                                                            {index + 1}
                                                        </div>

                                                        {/* Content Card */}
                                                        <div className="flex-grow bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:bg-white transition-all duration-300 transform hover:-translate-y-1">
                                                            <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-teal-700 transition-colors">
                                                                {title}
                                                            </h3>
                                                            {desc && (
                                                                <p className="text-gray-600 text-sm leading-relaxed">
                                                                    {desc}
                                                                </p>
                                                            )}
                                                            {!desc && (
                                                                <p className="text-gray-500 text-sm italic">
                                                                    Experience this highlight on your trip.
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Right Column: Sticky Sidebar - Client Component */}
                    <DestinationClientWrapper
                        destinationTitle={destination.title}
                        destinationId={destination._id}
                    />
                </div>
            </div>
        </main>
    );
}
