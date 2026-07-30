"use client";

import Link from "next/link";
import { useState } from "react";
import { 
    FaFacebook, FaTwitter, FaInstagram, FaLinkedin, 
    FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane, 
    FaWhatsapp, FaArrowUp, FaShieldAlt, FaAward, FaCheckCircle 
} from "react-icons/fa";
import api from '@/lib/api';
import { toast } from "react-hot-toast";

const Footer = () => {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        const nameParts = fullName.trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        setLoading(true);
        try {
            await api.post('/newsletter', { 
                email,
                firstName,
                lastName
            });
            toast.success("Welcome to Travel Sansar VIP Dispatch!");
            setEmail('');
            setFullName('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Subscription failed");
        } finally {
            setLoading(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-slate-950 text-white pt-24 pb-0 relative overflow-hidden font-sans">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20 relative z-10">
                
                {/* COL 1: Brand & Accreditation */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-3xl font-black tracking-tight font-outfit uppercase">
                            TRAVEL<span className="text-indigo-500">SANSAR</span>
                        </h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] mt-1 text-teal-400">
                            Elite Himalayan Pursuits
                        </p>
                    </div>

                    <p className="text-slate-400 text-sm leading-relaxed font-medium">
                        Crafting handcrafted luxury treks, high-altitude expeditions, and VIP helicopter charters across the Himalayas.
                    </p>

                    {/* Government & Tourism Credentials */}
                    <div className="flex items-center gap-3 pt-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                            <FaShieldAlt className="text-indigo-400" /> TAAN Approved
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                            <FaAward className="text-amber-400" /> NATTA Member
                        </span>
                    </div>

                    {/* Direct Social Links */}
                    <div className="flex items-center gap-3 pt-4">
                        <a 
                            href="https://wa.me/9779855051795" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all shadow-lg"
                        >
                            <FaWhatsapp size={16} />
                        </a>
                        <a 
                            href="https://www.facebook.com/share/v/1BMuExj5x5/" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-lg"
                        >
                            <FaFacebook size={16} />
                        </a>
                        <a 
                            href="#" 
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:text-white transition-all shadow-lg"
                        >
                            <FaInstagram size={16} />
                        </a>
                        <a 
                            href="#" 
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all shadow-lg"
                        >
                            <FaLinkedin size={16} />
                        </a>
                    </div>
                </div>

                {/* COL 2: Popular Pursuits & Archives */}
                <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-6 font-outfit">Himalayan Archives</h3>
                    <ul className="space-y-3.5">
                        {[
                            { name: 'Everest Base Camp Trek', path: '/tours' },
                            { name: 'Annapurna Sanctuary', path: '/tours' },
                            { name: 'Mustang Helicopter Safari', path: '/tours' },
                            { name: 'Kathmandu Cultural Hub', path: '/destinations' },
                            { name: 'Chitwan Wildlife Safari', path: '/destinations' },
                            { name: 'Expedition Studio 2.0', path: '/expedition-planner' }
                        ].map((link) => (
                            <li key={link.name}>
                                <Link 
                                    href={link.path} 
                                    className="text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 group"
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-indigo-500 transition-colors" />
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* COL 3: Direct Concierge Contact */}
                <div>
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-6 font-outfit">24/7 Sherpa Concierge</h3>
                    
                    <div className="space-y-4">
                        <a 
                            href="tel:+9779855051795" 
                            className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                                <FaPhoneAlt size={14} />
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Direct Hotline</span>
                                <span className="text-xs font-black text-white font-outfit">+977 9855051795 / 056-516888</span>
                            </div>
                        </a>

                        <a 
                            href="mailto:info@travelsansar.com" 
                            className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0">
                                <FaEnvelope size={14} />
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Official Inquiry</span>
                                <span className="text-xs font-black text-white font-outfit">info@travelsansar.com</span>
                            </div>
                        </a>

                        <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/10">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                                <FaMapMarkerAlt size={14} />
                            </div>
                            <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Headquarters</span>
                                <span className="text-xs font-bold text-slate-300">Shahid Chowk, Narayangarh, Chitwan</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* COL 4: VIP Dispatch & WhatsApp Quick Booking */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400 mb-2 font-outfit">VIP Expedition Dispatch</h3>
                        <p className="text-slate-400 text-xs font-medium mb-4">Receive priority seasonal permits & high-altitude forecasts.</p>
                        
                        <form onSubmit={handleSubmit} className="space-y-2.5">
                            <input 
                                type="text" 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Your Name" 
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-white placeholder:text-slate-500" 
                                required
                            />
                            <div className="relative">
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Your Email Address" 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-indigo-500 text-white placeholder:text-slate-500 pr-12" 
                                    required
                                />
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="absolute right-1.5 top-1.5 bottom-1.5 bg-indigo-600 hover:bg-indigo-500 px-3 rounded-lg font-black text-[10px] uppercase tracking-widest text-white transition-all shadow-md flex items-center justify-center"
                                >
                                    {loading ? '...' : <FaPaperPlane />}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Quick WhatsApp Inquiry CTA Button */}
                    <a
                        href="https://wa.me/9779855051795?text=Namaste!%20I%20want%20to%20inquire%20about%20a%20Himalayan%20tour."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                    >
                        <FaWhatsapp size={16} /> Instant WhatsApp Inquiry
                    </a>
                </div>
            </div>

            {/* Giant Background Watermark */}
            <div className="relative w-full overflow-hidden leading-none pointer-events-none select-none py-6">
                <h1 className="text-[18vw] font-black text-white/[0.03] tracking-tight whitespace-nowrap uppercase italic font-outfit text-center">
                    TRAVEL SANSAR
                </h1>
            </div>

            {/* Bottom Credit & Copyright Bar */}
            <div className="border-t border-white/10 py-8 bg-black/40 backdrop-blur-md relative z-10">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider font-outfit">
                        &copy; {new Date().getFullYear()} TRAVEL SANSAR / ELITE HIMALAYAN ADVENTURES. ALL RIGHTS RESERVED.
                    </p>
                    
                    <div className="flex items-center gap-6">
                        <span className="text-slate-500 text-xs font-semibold">
                            Curated By <span className="text-indigo-400 font-bold">Chandan Sharma</span>
                        </span>
                        
                        <button
                            onClick={scrollToTop}
                            className="w-9 h-9 rounded-full bg-white/10 hover:bg-indigo-600 text-white flex items-center justify-center transition-all shadow-md"
                            aria-label="Scroll to top"
                        >
                            <FaArrowUp size={12} />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
