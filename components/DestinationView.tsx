"use client";

import Link from 'next/link';
import Image from 'next/image';
import SocialShare from '@/components/SocialShare';
import DestinationImageGallery from '@/components/DestinationImageGallery';
import DestinationClientWrapper from '@/components/DestinationClientWrapper';
import SimilarTrips from '@/components/SimilarTrips';
import { getImageUrl } from '@/lib/utils/image';
import { FaMapMarkerAlt, FaClock, FaArrowLeft, FaCheckCircle, FaWhatsapp, FaCompass, FaShareAlt } from 'react-icons/fa';

export default function DestinationView({ destination, shareUrl }: { destination: any; shareUrl: string }) {
    const cleanDescription = destination.description ? destination.description.replace(/<[^>]*>?/gm, '') : '';
    const mainImageUrl = getImageUrl(destination.images?.[0]?.path || destination.images?.[0]?.url || destination.image);

    const whatsappMessage = encodeURIComponent(
        `Namaste Travel Sansar! I want to book the "${destination.title}" expedition (ID: ${destination._id}).\nPlease confirm availability and details!`
    );
    const whatsappUrl = `https://wa.me/9779855051795?text=${whatsappMessage}`;

    return (
        <main className="bg-white min-h-screen pb-32 text-slate-900 font-sans relative">
            
            {/* Top Navigation & Breadcrumb Header Bar with Social Share */}
            <div className="pt-28 pb-6 border-b border-gray-100 bg-slate-50/50">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Link 
                        href="/destinations" 
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-xs uppercase tracking-widest transition-colors"
                    >
                        <FaArrowLeft size={12} />
                        Back to Sanctuaries
                    </Link>

                    {/* Social Share & Quick WhatsApp */}
                    <div className="flex items-center gap-4">
                        <SocialShare
                            url={shareUrl}
                            title={destination.title}
                            description={cleanDescription}
                        />

                        <div className="hidden sm:block w-px h-5 bg-gray-200" />

                        <a 
                            href={whatsappUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shrink-0"
                        >
                            <FaWhatsapp size={14} /> Instant WhatsApp
                        </a>
                    </div>
                </div>
            </div>

            {/* ─── E-COMMERCE MAIN SECTION: Left Image Gallery & Sticky Right Purchase Panel ─── */}
            <section className="pt-10 pb-16">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                        
                        {/* LEFT COLUMN: E-Commerce Product Image Gallery & Details (7 Cols) */}
                        <div className="lg:col-span-7 space-y-8">
                            <DestinationImageGallery
                                images={destination.images || []}
                                mainImage={destination.image}
                                title={destination.title}
                            />

                            {/* Expedition Overview & Highlights */}
                            <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-lg space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-7 bg-indigo-600 rounded-full" />
                                        <h2 className="text-2xl font-black text-slate-900 font-outfit uppercase tracking-tight">Expedition Highlights</h2>
                                    </div>
                                    
                                    <SocialShare
                                        url={shareUrl}
                                        title={destination.title}
                                        description={cleanDescription}
                                    />
                                </div>

                                <div className="space-y-3.5">
                                    {destination.description?.split('.').filter((s: string) => s.trim().length > 0).map((sentence: string, index: number) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <FaCheckCircle className="text-emerald-500 mt-1 shrink-0" size={16} />
                                            <p className="text-slate-700 font-semibold text-sm sm:text-base leading-relaxed">
                                                {sentence.trim()}.
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Itinerary Flow Section */}
                            {destination.thingsToDo && destination.thingsToDo.length > 0 && (
                                <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-lg space-y-6">
                                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                        <div className="w-2.5 h-7 bg-teal-600 rounded-full" />
                                        <h2 className="text-2xl font-black text-slate-900 font-outfit uppercase tracking-tight">Journey Flow & Waypoints</h2>
                                    </div>

                                    <div className="space-y-4">
                                        {destination.thingsToDo.map((thing: string, index: number) => {
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
                                                <div key={index} className="flex gap-4 items-start p-4 rounded-2xl bg-slate-50 border border-gray-200/80 hover:bg-white hover:border-indigo-500/50 hover:shadow-md transition-all">
                                                    <div className="shrink-0 w-9 h-9 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center font-outfit shadow-sm">
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-black text-slate-900 font-outfit uppercase mb-1">
                                                            {title}
                                                        </h3>
                                                        {desc ? (
                                                            <p className="text-slate-600 font-medium text-xs leading-relaxed">{desc}</p>
                                                        ) : (
                                                            <p className="text-slate-400 font-medium text-xs italic">Key waypoint on this sanctuary trail</p>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: 100% FIXED STICKY E-Commerce Purchase Panel (5 Cols) */}
                        <div className="lg:col-span-5 lg:sticky lg:top-[115px] lg:self-start z-30">
                            <DestinationClientWrapper
                                destination={destination}
                                shareUrl={shareUrl}
                                mainImage={mainImageUrl}
                            />
                        </div>

                    </div>
                </div>
            </section>

            {/* Similar Trips Section */}
            <section className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 pt-8">
                <SimilarTrips
                    currentDestinationId={destination._id}
                    currentLocation={destination.location}
                />
            </section>

            {/* Mobile Fixed Bottom Sticky Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 lg:hidden flex items-center justify-between shadow-2xl">
                <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Target Package</span>
                    <span className="text-sm font-black text-slate-900 font-outfit truncate block max-w-[170px]">{destination.title}</span>
                </div>
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-widest shadow-lg flex items-center gap-2"
                >
                    <FaWhatsapp size={16} /> WhatsApp Order
                </a>
            </div>
        </main>
    );
}
