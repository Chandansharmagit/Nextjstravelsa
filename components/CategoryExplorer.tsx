"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCompass, FaArrowRight, FaMountain, FaLandmark, FaHelicopter, FaPaw, FaHiking, FaSpa } from 'react-icons/fa';

const categories = [
    {
        id: 'trekking',
        title: 'Himalayan Trekking',
        subtitle: 'Everest, Annapurna & Manaslu',
        badge: '18+ Journeys',
        Icon: FaMountain,
        iconColor: 'text-blue-400',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        query: 'trekking',
    },
    {
        id: 'cultural',
        title: 'Heritage & Culture',
        subtitle: 'Ancient Temples & Royal Cities',
        badge: '12+ Journeys',
        Icon: FaLandmark,
        iconColor: 'text-amber-400',
        image: 'https://images.unsplash.com/photo-1611516491426-03025e6043c8?auto=format&fit=crop&w=1200&q=80',
        query: 'cultural',
    },
    {
        id: 'helicopter',
        title: 'Helicopter Charters',
        subtitle: 'Everest & Annapurna Flyovers',
        badge: 'VIP Direct',
        Icon: FaHelicopter,
        iconColor: 'text-teal-400',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80',
        query: 'helicopter',
    },
    {
        id: 'wildlife',
        title: 'Wildlife Safaris',
        subtitle: 'Chitwan & Bardia Tigers',
        badge: '9+ Safaris',
        Icon: FaPaw,
        iconColor: 'text-amber-500',
        image: 'https://images.unsplash.com/photo-1511215579272-6192432f83bc?auto=format&fit=crop&w=1200&q=80',
        query: 'wildlife',
    },
    {
        id: 'expeditions',
        title: 'Peak Expeditions',
        subtitle: 'Mera, Island Peak & Ama Dablam',
        badge: '6,000m+ Summits',
        Icon: FaHiking,
        iconColor: 'text-cyan-400',
        image: 'https://plus.unsplash.com/premium_photo-1771517088930-37cc4fda6447?auto=format&fit=crop&w=1200&q=80',
        query: 'expedition',
    },
    {
        id: 'wellness',
        title: 'Spiritual & Wellness',
        subtitle: 'Himalayan Yoga & Retreats',
        badge: 'Serenity First',
        Icon: FaSpa,
        iconColor: 'text-rose-400',
        image: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1200&q=80',
        query: 'wellness',
    },
];

export default function CategoryExplorer() {
    return (
        <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
            {/* Background Glow Accents */}
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-teal-300 text-xs font-black uppercase tracking-[0.25em] font-outfit mb-4">
                            <FaCompass className="animate-spin-slow" />
                            Curated Travel Styles
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight font-outfit text-white">
                            Choose Your <span className="font-playfair italic font-normal text-amber-400">Adventure</span>
                        </h2>
                    </div>
                    <p className="text-slate-400 max-w-md text-base leading-relaxed font-medium">
                        From high-altitude Himalayan ascents to serene spiritual retreats, discover handcrafted journeys tailored to your passion.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat, idx) => {
                        const IconComponent = cat.Icon;
                        return (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.08 }}
                            >
                                <Link href={`/tours?query=${encodeURIComponent(cat.query)}`}>
                                    <div className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer border border-white/15 shadow-2xl hover:shadow-[0_20px_50px_rgba(247,147,30,0.2)] transition-all duration-500">
                                        {/* High Quality Image (Uncolored, Crisp Photo) */}
                                        <Image
                                            src={cat.image}
                                            alt={cat.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />

                                        {/* Pure Dark Bottom Gradient Only for Readability - NO color tinting over full image */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Badge */}
                                        <div className="absolute top-5 right-5 z-10 px-3.5 py-1.5 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-black uppercase tracking-wider font-outfit shadow-lg">
                                            {cat.badge}
                                        </div>

                                        {/* Content */}
                                        <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                                            <div className={`w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300 ${cat.iconColor}`}>
                                                <IconComponent size={22} />
                                            </div>
                                            <h3 className="text-2xl font-black text-white font-outfit mb-1 tracking-tight group-hover:text-amber-300 transition-colors">
                                                {cat.title}
                                            </h3>
                                            <p className="text-slate-300 text-xs font-medium mb-6">
                                                {cat.subtitle}
                                            </p>

                                            <div className="flex items-center gap-2 text-white text-xs font-black uppercase tracking-widest font-outfit group-hover:translate-x-2 transition-transform duration-300">
                                                Explore Journeys
                                                <FaArrowRight className="text-amber-400 text-xs" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
