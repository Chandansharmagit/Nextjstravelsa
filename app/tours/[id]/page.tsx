import Image from 'next/image';
import Link from 'next/link';
import { FaClock, FaMapMarkerAlt, FaMountain, FaQuoteLeft } from 'react-icons/fa';
import TourBookingSection from '@/components/TourBookingSection';

async function getTour(id: string) {
    try {
        const res = await fetch(`https://backendtsa.travelsansr.com/api/tours/${id}`, {
            cache: 'no-store'
        });
        if (res.ok) {
            const data = await res.json();
            return data.tour || data;
        }

        // Fallback or retry
        const allRes = await fetch('https://backendtsa.travelsansr.com/api/tours', { cache: 'no-store' });
        if (allRes.ok) {
            const allData = await allRes.json();
            const list = Array.isArray(allData) ? allData : allData.tours || allData.data || [];
            return list.find((t: any) => t._id === id);
        }
        return null;

    } catch (error) {
        return null;
    }
}

export default async function TourDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const tour = await getTour(id);

    if (!tour) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Tour package not found</h2>
                <Link href="/tours" className="px-6 py-2 bg-primary text-white rounded-full">
                    Return to Tours
                </Link>
            </div>
        );
    }

    const title = tour.title || tour.name || "Untitled Tour";
    const imageSrc = tour.images?.[0]?.url || tour.image || '/placeholder.jpg';

    return (
        <main className="bg-white">
            {/* 1. Immersive Hero Section */}
            <section className="relative h-[70vh] min-h-[500px]">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

                <div className="absolute inset-0 flex items-end">
                    <div className="container mx-auto px-4 xl:px-20 pb-16">
                        <div className="max-w-4xl text-white">
                            {tour.type && (
                                <span className="inline-block px-4 py-2 bg-secondary text-white text-sm font-bold rounded-full mb-4 uppercase tracking-wider shadow-lg">
                                    {tour.type}
                                </span>
                            )}
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 drop-shadow-xl">
                                {title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6 text-lg font-medium opacity-90">
                                {tour.location && (
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-secondary" />
                                        <span>{tour.location}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <FaClock className="text-secondary" />
                                    <span>{tour.duration} Days</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaMountain className="text-secondary" />
                                    <span className="capitalize">{tour.difficulty || 'Moderate'} Level</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Main Content Layout */}
            <section className="container mx-auto px-4 xl:px-20 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column: Details (2/3 width) */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Gallery Grid - Moved to Top */}
                        {tour.images && tour.images.length > 1 && (
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                                    <span className="w-2 h-8 bg-secondary rounded-full"></span>
                                    Photo Gallery
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-[400px]">
                                    {tour.images.slice(0, 5).map((img: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className={`relative rounded-2xl overflow-hidden cursor-pointer group ${idx === 0 ? 'col-span-2 row-span-2' : ''}`}
                                        >
                                            <Image
                                                src={img.url}
                                                alt={`Gallery ${idx}`}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Description */}
                        <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                                <span className="w-2 h-8 bg-secondary rounded-full"></span>
                                Overview
                            </h2>
                            <p className="whitespace-pre-line text-lg">{tour.description}</p>
                        </div>

                        {/* Itinerary */}
                        {tour.itinerary && tour.itinerary.length > 0 && (
                            <div>
                                <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                                    <span className="w-2 h-8 bg-secondary rounded-full"></span>
                                    Tour Itinerary
                                </h2>
                                <div className="space-y-0 relative border-l-2 border-gray-200 ml-4 md:ml-6">
                                    {tour.itinerary.map((day: any, index: number) => (
                                        <div key={index} className="relative pl-8 md:pl-12 pb-12 last:pb-0">
                                            {/* Timeline dot */}
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 bg-secondary rounded-full border-4 border-white shadow-md"></div>

                                            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow duration-300 border border-gray-100">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h3 className="text-xl font-bold text-primary">Day {day.day || index + 1}</h3>
                                                </div>
                                                <h4 className="text-lg font-semibold text-gray-800 mb-2">{day.location || day.title}</h4>
                                                <p className="text-gray-600">{day.activities || day.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Right Column: Sticky Booking Card (1/3 width) */}
                    <div className="relative">
                        <TourBookingSection tour={tour} />
                    </div>
                </div>
            </section>
        </main>
    );
}
