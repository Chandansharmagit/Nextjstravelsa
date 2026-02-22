"use client";

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaMapMarkerAlt, FaMountain, FaQuoteLeft, FaCompass, FaShieldAlt, FaCalendarAlt, FaUsers, FaStar } from 'react-icons/fa';
import { useState } from 'react';
import DestinationImageGallery from './DestinationImageGallery';
import SocialShare from './SocialShare';

interface TourViewProps {
    tour: any;
    id: string;
    bookingSection: React.ReactNode;
}

export default function TourView({ tour, id, bookingSection }: TourViewProps) {
    const [activeTab, setActiveTab] = useState('overview');
    const title = tour.title || tour.name || "Untitled Tour";
    const shareUrl = `https://www.travelsansr.com/tours/${id}`;

    const infoCards = [
        { icon: <FaClock />, label: "Duration", value: `${tour.duration} Days` },
        { icon: <FaMountain />, label: "Difficulty", value: tour.difficulty || 'Moderate' },
        { icon: <FaUsers />, label: "Group Size", value: tour.groupSize || 'Flexible' },
        { icon: <FaStar className="text-amber-500" />, label: "Rating", value: "4.8 / 5" },
    ];

    return (
        <main className="bg-[#f8fafc] min-h-screen pb-32 pt-40 relative font-sans">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-400/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-400/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-teal-400/5 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 xl:px-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Content */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* 1. Header & 3D Gallery */}
                        <div className="space-y-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex flex-wrap items-center gap-3"
                            >
                                <span className="px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full h-font shadow-lg shadow-blue-500/20">
                                    {tour.type || 'Exploration'}
                                </span>
                                {tour.location && (
                                    <span className="px-4 py-1.5 bg-white/70 backdrop-blur-md border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full h-font flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-blue-500" />
                                        {tour.location}
                                    </span>
                                )}
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9] p-font"
                            >
                                {title}
                            </motion.h1>

                            {/* Using the 3D gallery component */}
                            <DestinationImageGallery
                                images={tour.images || [{ url: tour.image }]}
                                title={title}
                            />

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {infoCards.map((card, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 + idx * 0.1 }}
                                        className="bg-white/50 backdrop-blur-3xl border border-white/60 p-6 rounded-[32px] shadow-sm hover:shadow-xl hover:bg-white/80 transition-all group"
                                    >
                                        <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            {card.icon}
                                        </div>
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 h-font">{card.label}</div>
                                        <div className="text-lg font-black text-slate-900 tracking-tight h-font">{card.value}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Content Tabs */}
                        <div className="space-y-8">
                            <div className="flex gap-4 border-b border-slate-200 pb-4">
                                {['overview', 'itinerary', 'essential'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest h-font transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute bottom-[-17px] left-0 right-0 h-1 bg-blue-600 rounded-full"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white/70 backdrop-blur-3xl rounded-[40px] border border-white/60 p-8 md:p-12 shadow-sm"
                                >
                                    {activeTab === 'overview' && (
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                                    <FaCompass size={24} />
                                                </div>
                                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter h-font leading-none">Tour Overview</h3>
                                            </div>
                                            <p className="text-slate-600 font-bold text-lg leading-relaxed whitespace-pre-line">
                                                {tour.description}
                                            </p>
                                        </div>
                                    )}

                                    {activeTab === 'itinerary' && (
                                        <div className="space-y-12">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                                    <FaCalendarAlt size={24} />
                                                </div>
                                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter h-font leading-none">The Journey</h3>
                                            </div>
                                            <div className="space-y-0 relative border-l-4 border-slate-100 ml-6">
                                                {tour.itinerary?.map((day: any, idx: number) => (
                                                    <div key={idx} className="relative pl-12 pb-12 last:pb-0">
                                                        <div className="absolute -left-3 top-0 w-6 h-6 bg-white border-4 border-blue-600 rounded-full z-10" />
                                                        <div className="bg-slate-50/50 rounded-3xl p-8 border border-white hover:border-blue-100 transition-colors">
                                                            <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 h-font flex items-center gap-2">
                                                                <span className="w-8 h-[2px] bg-blue-200" />
                                                                Day {day.day || idx + 1}
                                                            </div>
                                                            <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-4 h-font">{day.location || day.title}</h4>
                                                            <p className="text-slate-600 font-bold leading-relaxed">{day.activities || day.description}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'essential' && (
                                        <div className="space-y-12">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                                                    <FaShieldAlt size={24} />
                                                </div>
                                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter h-font leading-none">Essential Intel</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <h5 className="text-emerald-600 font-black text-xs uppercase tracking-[0.2em] h-font">Inclusions</h5>
                                                    <ul className="space-y-3">
                                                        {['Accomodation', 'Meals (B/L/D)', 'Professional Guide', 'Permits'].map((item, id) => (
                                                            <li key={id} className="flex items-center gap-3 text-slate-600 font-bold">
                                                                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px]">✓</div>
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="space-y-4">
                                                    <h5 className="text-rose-600 font-black text-xs uppercase tracking-[0.2em] h-font">Exclusions</h5>
                                                    <ul className="space-y-3">
                                                        {['Insurance', 'Personal Expenses', 'Tips', 'Flights'].map((item, id) => (
                                                            <li key={id} className="flex items-center gap-3 text-slate-600 font-bold">
                                                                <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px]">×</div>
                                                                {item}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Social Share */}
                        <div className="pt-8">
                            <SocialShare
                                url={shareUrl}
                                title={title}
                                description={tour.description}
                            />
                        </div>

                    </div>

                    {/* Right Column: Sticky Sidebar */}
                    <aside className="lg:col-span-4 h-fit sticky top-40">
                        {bookingSection}
                    </aside>
                </div>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Outfit:wght@800;900&display=swap');
                
                .p-font { font-family: 'Playfair Display', serif; }
                .h-font { font-family: 'Outfit', sans-serif; }
            `}</style>
        </main>
    );
}
