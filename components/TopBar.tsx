"use client";

import Link from 'next/link';
import { FaEnvelope, FaPhoneAlt, FaWhatsapp, FaBullhorn, FaUserCheck, FaChevronRight } from 'react-icons/fa';

const TopBar = () => {
    return (
        <div className="fixed top-0 left-0 right-0 z-[2000] bg-white border-b border-gray-200/80 text-gray-800 text-xs h-10 flex items-center transition-all font-sans">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 w-full">
                <div className="flex items-center justify-between h-10 gap-2">
                    
                    {/* LEFT: Email, Phone & Live Announcement Pill Badges */}
                    <div className="flex items-center gap-2.5 text-[11px] font-semibold">
                        {/* Email Pill */}
                        <a 
                            href="mailto:info@travelsansar.com" 
                            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 text-indigo-700 font-bold text-[11px] transition-all shadow-2xs"
                        >
                            <FaEnvelope className="text-indigo-600" size={11} />
                            <span>info@travelsansar.com</span>
                        </a>

                        {/* Phone Contact Pill */}
                        <a 
                            href="tel:+9779855051795" 
                            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200/80 text-blue-700 font-bold text-[11px] transition-all shadow-2xs"
                        >
                            <FaPhoneAlt className="text-blue-600" size={10} />
                            <span>+977 9855051795</span>
                        </a>

                        {/* 2.0 Live Pill */}
                        <div className="hidden xl:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/80 text-purple-700 font-bold text-[10px] uppercase tracking-wider">
                            <FaBullhorn className="text-purple-600" size={10} />
                            2.0 Live
                        </div>
                    </div>

                    {/* CENTER: Live Announcement */}
                    <div className="hidden lg:flex items-center gap-2 text-gray-700 text-[11px] font-medium">
                        <span className="px-2 py-0.5 rounded bg-indigo-600 text-white font-black text-[9px] tracking-wider uppercase">
                            NEW
                        </span>
                        <span>Instant NPR Price Estimator & Customized Expeditions!</span>
                        <Link 
                            href="/expedition-planner" 
                            className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 underline underline-offset-2 ml-1"
                        >
                            Try Now <FaChevronRight size={8} />
                        </Link>
                    </div>

                    {/* RIGHT: Direct WhatsApp & Meet Travel Expert Pills */}
                    <div className="flex items-center gap-2.5">
                        {/* Direct WhatsApp Button Pill */}
                        <a
                            href="https://wa.me/9779855051795?text=Namaste%20Travel%20Sansar!%20I%20have%20an%20expedition%20inquiry."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all shadow-xs"
                        >
                            <FaWhatsapp size={13} />
                            <span>WhatsApp Us</span>
                        </a>

                        {/* Meet Travel Expert Pill */}
                        <Link
                            href="/contact"
                            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/80 text-slate-800 font-bold text-[11px] transition-all"
                        >
                            <FaUserCheck className="text-indigo-600" size={11} />
                            <span>Meet Expert</span>
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default TopBar;
