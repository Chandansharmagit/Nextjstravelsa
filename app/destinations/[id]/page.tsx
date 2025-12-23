import Image from 'next/image';
import Link from 'next/link';

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

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const destination = await getDestination(params.id);

    if (!destination) {
        return { title: 'Destination Not Found | Travel Sansar' };
    }

    const image0 = destination.images?.[0];
    let imageSrc = (typeof image0 === 'string' ? image0 : image0?.path || image0?.url) || destination.image;

    if (!imageSrc && destination.images?.[0]) {
        const anyImg = destination.images.find((img: any) => img?.path || img?.url || typeof img === 'string');
        if (anyImg) {
            imageSrc = typeof anyImg === 'string' ? anyImg : anyImg.path || anyImg.url;
        }
    }

    if (imageSrc && !imageSrc.startsWith('http')) {
        const baseUrl = 'https://backendtsa.travelsansr.com';
        const cleanPath = imageSrc.startsWith('/') ? imageSrc : `/${imageSrc}`;
        imageSrc = `${baseUrl}${cleanPath}`;
    }

    return {
        title: `${destination.title} - Travel Sansar`,
        description: destination.description?.substring(0, 160) || `Explore ${destination.title} with Travel Sansar.`,
        openGraph: {
            title: destination.title,
            description: destination.description?.substring(0, 160),
            url: `https://www.travelsansr.com/destinations/${params.id}`,
            images: imageSrc ? [{ url: imageSrc, width: 1200, height: 630, alt: destination.title }] : [],
            type: 'website',
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
    const shareUrl = `https://www.travelsansr.com/destinations/${params.id}`;

    return (
        <section className="min-h-screen pt-32 pb-20 px-4 xl:px-20 bg-[#FDFCFB]">
            <Link href="/destinations" className="text-[#8D7B68] hover:text-[#4A4036] mb-12 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest transition-colors">
                <span className="text-lg">←</span> Back to Destinations
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-16 items-start">

                {/* Left Column: Immersive Content */}
                <div className="space-y-12">
                    <div className="relative h-[500px] lg:h-[700px] rounded-[40px] overflow-hidden shadow-[0_30px_100px_-20px_rgba(0,0,0,0.2)]">
                        <Image
                            src={imageSrc}
                            alt={destination.title}
                            fill
                            className="object-cover transition-transform duration-1000 hover:scale-105"
                            priority
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-10 left-10 text-white">
                            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-4">{destination.title}</h1>
                            <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-[0.3em] opacity-80">
                                <span className="w-12 h-[1px] bg-white" />
                                <span>Discover Nepal</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/50 backdrop-blur-xl rounded-[40px] p-12 border border-white/40 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl -mr-32 -mt-32" />
                        <h2 className="text-3xl font-bold text-[#4A4036] mb-8 flex items-center gap-4">
                            <span className="w-8 h-8 rounded-xl bg-[#D4AF37] flex items-center justify-center text-white text-sm">01</span>
                            The Narrative
                        </h2>
                        <div className="prose prose-lg max-w-none text-[#4A4036]/80 leading-relaxed font-medium">
                            <p className="whitespace-pre-line mb-8">{destination.description}</p>
                        </div>

                        <h2 className="text-3xl font-bold text-[#4A4036] mt-16 mb-8 flex items-center gap-4">
                            <span className="w-8 h-8 rounded-xl bg-[#4A4036] flex items-center justify-center text-white text-sm">02</span>
                            Trip Highlights
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { title: "Cultural Immersion", desc: "Deep dive into local traditions and historic heritage sites." },
                                { title: "Scenic Mastery", desc: "Witness the majestic landscapes of the Himalayas from unique vistas." },
                                { title: "Gastronomy", desc: "Sample authentic regional flavors crafted by master local chefs." },
                                { title: "Expedition Guard", desc: "Led by certified experts with deep territorial knowledge." }
                            ].map((h, i) => (
                                <div key={i} className="bg-white p-6 rounded-[24px] border border-[#8D7B68]/5 hover:border-[#D4AF37]/20 transition-all group">
                                    <div className="text-[#D4AF37] mb-3 font-bold text-xs uppercase tracking-widest">{h.title}</div>
                                    <p className="text-sm text-[#8D7B68] leading-relaxed group-hover:text-[#4A4036] transition-colors">{h.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Sticky Studio Booking Section */}
                <div className="lg:sticky lg:top-32 space-y-8">
                    <div className="bg-white border border-white rounded-[40px] p-10 shadow-[0_40px_100px_-30px_rgba(141,123,104,0.15)] relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#D4AF37] to-[#4A4036] opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="mb-8">
                            <p className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.4em] mb-4">Investment</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-[#4A4036]">$999</span>
                                <span className="text-[#8D7B68] text-sm font-bold italic">/ person</span>
                            </div>
                        </div>

                        <div className="space-y-6 mb-10">
                            <h3 className="text-xl font-bold text-[#4A4036]">Secure Your Expedition</h3>
                            <p className="text-sm text-[#8D7B68] leading-relaxed">
                                Join our exclusive circle of explorers. Our master planners will coordinate every detail of your journey.
                            </p>
                        </div>

                        <button className="w-full py-6 rounded-[24px] bg-[#4A4036] text-[#F5F2ED] font-bold text-xs uppercase tracking-[0.3em] hover:bg-[#D4AF37] transition-all duration-700 shadow-2xl shadow-[#4A4036]/20 mb-4 group/btn overflow-hidden relative">
                            <span className="relative z-10">Initialize Booking</span>
                            <div className="absolute inset-0 bg-white translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 opacity-10" />
                        </button>

                        <button className="w-full py-5 rounded-[24px] bg-[#FDFCFB] text-[#4A4036] border border-[#8D7B68]/10 font-bold text-xs uppercase tracking-[0.3em] hover:bg-white hover:border-[#D4AF37]/30 transition-all">
                            Request Custom Itinerary
                        </button>

                        <div className="mt-10 pt-10 border-t border-[#8D7B68]/10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-[#8D7B68] uppercase tracking-widest">Master Concierge</p>
                                    <p className="text-sm font-bold text-[#4A4036]">056-516888</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#4A4036] rounded-[40px] p-8 text-[#F5F2ED] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <svg width="100" height="100" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                        </div>
                        <h4 className="font-bold text-lg mb-2">Share this discovery</h4>
                        <p className="text-white/40 text-xs mb-6 leading-relaxed">Let your inner circle explore this sanctuary with you.</p>
                        <SocialShare url={shareUrl} title={destination.title} description={destination.description} />
                    </div>
                </div>
            </div>
        </section>
    );
}
