"use client";

import Link from 'next/link';
import { FaEnvelope, FaPhoneAlt, FaWhatsapp, FaBullhorn, FaUserCheck, FaChevronRight } from 'react-icons/fa';

const TopBar = () => {
    return (
        <div className="fixed top-0 left-0 right-0 z-[2000] bg-slate-950 border-b border-slate-800/80 text-slate-200 text-xs h-10 flex items-center transition-all font-sans">
            <div className="max-w-[1400px] mx-auto px-2.5 sm:px-6 md:px-8 lg:px-12 w-full">
                <div className="flex items-center justify-between h-10 gap-1.5 sm:gap-2">
                    
                    {/* LEFT: Live Status, Email & Phone Pill Badges */}
                    <div className="flex items-center gap-1.5 sm:gap-2.5 text-[11px] font-semibold">
                        {/* Live Online Dot Pill */}
                        <div className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-bold text-[10px] uppercase tracking-wide">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="hidden sm:inline">24/7 Experts Online</span>
                            <span className="sm:hidden">Online</span>
                        </div>

                        {/* Email Pill */}
                        <a 
                            href="mailto:info@travelsansr.com" 
                            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-indigo-300 font-bold text-[11px] transition-all"
                        >
                            <FaEnvelope className="text-indigo-400" size={11} />
                            <span>info@travelsansr.com</span>
                        </a>

                        {/* Phone Contact Pill */}
                        <a 
                            href="tel:+9779855051795" 
                            className="inline-flex items-center gap-1.5 px-2 sm:px-3.5 py-1 rounded-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 font-bold text-[10px] sm:text-[11px] transition-all"
                        >
                            <FaPhoneAlt className="text-blue-400" size={10} />
                            <span className="hidden xs:inline">+977 9855051795</span>
                            <span className="xs:hidden">Call</span>
                        </a>

                        {/* 2.0 Live Pill */}
                        <div className="hidden xl:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold text-[10px] uppercase tracking-wider">
                            <FaBullhorn className="text-purple-400" size={10} />
                            2.0 Live
                        </div>
                    </div>

                    {/* CENTER: Live Announcement */}
                    <div className="hidden lg:flex items-center gap-2 text-slate-300 text-[11px] font-medium">
                        <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-black text-[9px] tracking-wider uppercase shadow-xs">
                            NEW
                        </span>
                        <span>Instant NPR Price Estimator & Customized Expeditions!</span>
                        <Link 
                            href="/expedition-planner" 
                            className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 underline underline-offset-2 ml-1"
                        >
                            Try Now <FaChevronRight size={8} />
                        </Link>
                    </div>

                    {/* RIGHT: Direct WhatsApp & Meet Travel Expert Pills */}
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* Direct WhatsApp Button Pill */}
                        <a
                            href="https://wa.me/9779855051795?text=Namaste%20Travel%20Sansar!%20I%20have%20an%20expedition%20inquiry."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] sm:text-[11px] transition-all shadow-md shadow-emerald-950/50"
                        >
                            <FaWhatsapp size={12} />
                            <span>WhatsApp</span>
                        </a>

                        {/* Meet Travel Expert Pill */}
                        <Link
                            href="/contact"
                            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 font-bold text-[11px] transition-all"
                        >
                            <FaUserCheck className="text-amber-400" size={11} />
                            <span>Meet Expert</span>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TopBar;
