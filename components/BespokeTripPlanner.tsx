"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSlidersH, FaCalendarAlt, FaUserFriends, FaGem, FaPaperPlane, FaCheck } from 'react-icons/fa';
import Link from 'next/link';

export default function BespokeTripPlanner() {
    const [region, setRegion] = useState('Everest');
    const [duration, setDuration] = useState('10-14 Days');
    const [style, setStyle] = useState('Luxury Lodge');

    const regions = ['Everest Region', 'Annapurna Circuit', 'Mustang Kingdom', 'Langtang & Helambu', 'Wildlife & Chitwan'];
    const durations = ['5-7 Days', '8-12 Days', '14-21 Days', '21+ Days Expeditions'];
    const styles = [
        { name: 'Luxury Lodge', desc: 'Boutique 5-star mountain lodges & private butler' },
        { name: 'Classic Trekking', desc: 'Authentic tea houses & expert local guides' },
        { name: 'Helicopter Safari', desc: 'VIP flight transfers & luxury day hikes' },
    ];

    return (
        <section className="py-24 bg-gradient-to-b from-slate-900 to-teal-950 text-white relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute -top-40 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute -bottom-40 left-10 w-96 h-96 bg-teal-400/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
                <div className="text-center mb-16">
                    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 font-black text-xs uppercase tracking-[0.3em] font-outfit mb-4">
                        <FaSlidersH /> Tailor-Made Expedition Studio
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black font-outfit tracking-tight text-white mb-6">
                        Design Your <span className="font-playfair italic font-normal text-amber-400">Custom Journey</span>
                    </h2>
                    <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto font-medium">
                        Personalize every detail with our master travel designers. Select your preferences below for an instant custom proposal.
                    </p>
                </div>

                <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-white/15 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)]">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                        {/* Step 1: Destination */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm font-outfit">1</span>
                                <h3 className="text-xl font-bold font-outfit text-white">Target Region</h3>
                            </div>
                            <div className="space-y-2">
                                {regions.map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => setRegion(r)}
                                        className={`w-full text-left px-5 py-3.5 rounded-2xl font-outfit font-semibold text-sm transition-all duration-300 flex items-center justify-between border ${
                                            region === r
                                                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/20 font-bold'
                                                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                                        }`}
                                    >
                                        {r}
                                        {region === r && <FaCheck className="text-slate-950 text-xs" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Step 2: Duration */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm font-outfit">2</span>
                                <h3 className="text-xl font-bold font-outfit text-white">Trip Duration</h3>
                            </div>
                            <div className="space-y-2">
                                {durations.map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => setDuration(d)}
                                        className={`w-full text-left px-5 py-3.5 rounded-2xl font-outfit font-semibold text-sm transition-all duration-300 flex items-center justify-between border ${
                                            duration === d
                                                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/20 font-bold'
                                                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                                        }`}
                                    >
                                        {d}
                                        {duration === d && <FaCheck className="text-slate-950 text-xs" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Step 3: Travel Style */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-black flex items-center justify-center text-sm font-outfit">3</span>
                                <h3 className="text-xl font-bold font-outfit text-white">Comfort & Style</h3>
                            </div>
                            <div className="space-y-2">
                                {styles.map((s) => (
                                    <button
                                        key={s.name}
                                        onClick={() => setStyle(s.name)}
                                        className={`w-full text-left p-4 rounded-2xl font-outfit transition-all duration-300 border ${
                                            style === s.name
                                                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg shadow-amber-400/20'
                                                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                                        }`}
                                    >
                                        <div className="font-bold text-sm flex items-center justify-between">
                                            {s.name}
                                            {style === s.name && <FaCheck className="text-slate-950 text-xs" />}
                                        </div>
                                        <div className={`text-xs mt-1 ${style === s.name ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
                                            {s.desc}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Summary CTA Box */}
                    <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 bg-white/5 p-6 md:p-8 rounded-2xl">
                        <div>
                            <div className="text-xs uppercase tracking-widest text-amber-400 font-black font-outfit mb-1">Your Custom Selection</div>
                            <div className="text-xl md:text-2xl font-bold text-white font-outfit">
                                {region} • <span className="text-amber-300">{duration}</span> • {style}
                            </div>
                        </div>

                        <Link
                            href={`/expedition-planner?region=${encodeURIComponent(region)}&duration=${encodeURIComponent(duration)}&style=${encodeURIComponent(style)}`}
                            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider font-outfit shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shrink-0"
                        >
                            Request Tailored Itinerary
                            <FaPaperPlane size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
