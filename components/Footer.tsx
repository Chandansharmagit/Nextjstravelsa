"use client";

import Link from "next/link";
import { useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane } from "react-icons/fa";
import api from '@/lib/api';
import { toast } from "react-hot-toast";

const Footer = () => {
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        // Split fullName into first and last
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
            toast.success("Subscribed successfully!");
            setEmail('');
            setFullName('');
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Subscription failed");
        } finally {
            setLoading(false);
        }
    };
    return (
        <footer className="bg-slate-950 text-white pt-24 pb-0 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -ml-64 -mt-64" />
            <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] -mr-48" />

            <div className="max-w-[1800px] mx-auto px-6 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24 relative z-10">
                {/* Brand */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-4xl font-black tracking-tight mb-2 font-outfit uppercase">
                            TRAVEL<span className="text-blue-500">SANSR</span>
                        </h2>
                        <div className="h-1 w-12 bg-blue-600 rounded-full" />
                    </div>
                    <p className="text-slate-400 text-lg leading-relaxed font-medium">
                        Crafting transcendent journeys across the Himalayas. Your sanctuary in the peaks.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4 group cursor-default">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                <FaMapMarkerAlt size={16} />
                            </div>
                            <span className="text-slate-400 text-sm font-medium leading-relaxed pt-2">Bharatpur-1, Shahid Chowk, Narayahgarh <br/>(Krishnaman Plaza)</span>
                        </div>
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                <FaPhone size={14} />
                            </div>
                            <span className="text-slate-400 text-sm font-bold group-hover:text-white transition-colors tracking-wide font-outfit">056-516888 / 9855051795</span>
                        </div>
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                                <FaEnvelope size={14} />
                            </div>
                            <span className="text-slate-400 text-sm font-bold group-hover:text-white transition-colors tracking-wide font-outfit">info@travelsansr.com</span>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-500 mb-10 font-outfit">Quick Archive</h3>
                    <ul className="space-y-5">
                        {['Home', 'Destinations', 'Tours', 'Experiences', 'Contact', 'Career'].map((link) => (
                            <li key={link}>
                                <Link 
                                    href={link === 'Home' ? '/' : `/${link.toLowerCase()}`} 
                                    className="text-slate-400 text-[13px] font-black uppercase tracking-widest hover:text-white hover:translate-x-2 transition-all inline-block font-outfit"
                                >
                                    {link}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-500 mb-10 font-outfit">Assistance</h3>
                    <ul className="space-y-5">
                        {['FAQ', 'Privacy Policy', 'Terms & Conditions', 'Customer Service'].map((link) => (
                            <li key={link}>
                                <Link 
                                    href="#" 
                                    className="text-slate-400 text-[13px] font-black uppercase tracking-widest hover:text-white hover:translate-x-2 transition-all inline-block font-outfit"
                                >
                                    {link}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Newsletter & Social */}
                <div className="space-y-12">
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-500 mb-10 font-outfit">Pulse Sanctuary</h3>
                        <p className="text-slate-400 text-sm font-medium mb-6">Stay attuned to our latest discoveries.</p>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative group">
                                <input 
                                    suppressHydrationWarning 
                                    type="text" 
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Your Full Name..." 
                                    className="w-full bg-white/5 border border-white/10 rounded-[18px] px-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/20 focus:border-blue-600/50 transition-all placeholder:text-slate-600 outline-none text-white" 
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <input 
                                    suppressHydrationWarning 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter sanctuary email..." 
                                    className="w-full bg-white/5 border border-white/10 rounded-[18px] px-6 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-600/20 focus:border-blue-600/50 transition-all placeholder:text-slate-600 outline-none pr-16 text-white" 
                                    required
                                />
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    suppressHydrationWarning 
                                    className="absolute right-2 top-2 bottom-2 bg-blue-600 px-4 rounded-[14px] font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        "GO"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                         <a href="https://www.facebook.com/share/v/1BMuExj5x5/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:scale-110 transition-all duration-500 shadow-xl">
                            <FaFacebook size={18} />
                        </a>
                        {['Instagram', 'Linkedin', 'Twitter'].map((social) => (
                            <div key={social} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-900 hover:scale-110 transition-all duration-500 shadow-xl">
                                {social === 'Instagram' && <FaInstagram size={18} />}
                                {social === 'Linkedin' && <FaLinkedin size={18} />}
                                {social === 'Twitter' && <FaTwitter size={18} />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Large Footer Typography */}
            <div className="relative w-full overflow-hidden leading-none pointer-events-none select-none py-12">
                <h1 className="text-[20vw] font-black text-white/[0.03] tracking-[-0.05em] whitespace-nowrap uppercase italic font-outfit text-center translate-y-12">
                    SANSAR
                </h1>
            </div>

            <div className="border-t border-white/5 py-12 bg-white/[0.02] backdrop-blur-xl relative z-10">
                <div className="max-w-[1800px] mx-auto px-6 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.3em] font-outfit">
                        &copy; {new Date().getFullYear()} TRAVEL SANSAR / ELITE ADVENTURES
                    </p>
                    
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-4 group">
                            <span className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] font-outfit">Curated By</span>
                            <div className="flex items-center gap-2">
                                <span className="text-blue-500 font-black text-xs uppercase tracking-widest font-outfit hover:text-white transition-colors cursor-pointer">Chandan Sharma</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            </div>
                        </div>
                        <div className="h-4 w-px bg-white/10" />
                        <div className="flex items-center gap-4">
                            <a href="https://wa.me/9779845427041" target="_blank" rel="noopener noreferrer" className="p-2 bg-green-500/10 rounded-lg text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-lg shadow-green-500/10">
                                <FaPhone size={12} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
