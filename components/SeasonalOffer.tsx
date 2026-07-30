"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCompass, FaWhatsapp, FaPercent, FaPaperPlane, FaUser, FaPhoneAlt, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const SeasonalOffer = () => {
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [destination, setDestination] = useState('Everest Base Camp');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowModal(true);
        }, 800);

        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone) {
            toast.error('Please enter your name and phone number!');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/leads', {
                name,
                phone,
                destination,
                message: `Claiming 30% OFF SPRING30 Offer for ${destination}`
            });
            setSubmitted(true);
            toast.success('Discount claimed! Our Lead Sherpa will contact you.');
            setTimeout(() => {
                setShowModal(false);
            }, 3000);
        } catch (error) {
            setSubmitted(true);
            toast.success('Discount claim received!');
            setTimeout(() => {
                setShowModal(false);
            }, 3000);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {showModal && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 font-sans">
                    {/* Glassmorphic Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowModal(false)}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                    />

                    {/* Main Popup Modal Card */}
                    <motion.div
                        initial={{ scale: 0.92, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.92, opacity: 0, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 220 }}
                        className="relative w-full max-w-5xl bg-slate-900 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row border border-white/15 z-10"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-5 right-5 z-30 w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-slate-900 flex items-center justify-center transition-all shadow-xl backdrop-blur-md"
                            aria-label="Close modal"
                        >
                            <FaTimes size={16} />
                        </button>

                        {/* LEFT SIDE: Visual Himalayan Showcase */}
                        <div className="flex-1 relative min-h-[320px] md:min-h-[540px] flex flex-col justify-between p-8 md:p-12 overflow-hidden">
                            {/* Background Image */}
                            <Image
                                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1600&auto=format&fit=crop"
                                alt="Himalayas Spring Explorer"
                                fill
                                className="object-cover transition-transform duration-[10s] ease-out scale-105 hover:scale-110"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                            {/* Top Badge */}
                            <div className="relative z-10">
                                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-amber-300 text-[10px] font-black uppercase tracking-[0.3em] font-outfit">
                                    <FaCompass /> Spring Expedition Dispatch 2026
                                </span>
                            </div>

                            {/* Center Content */}
                            <div className="relative z-10 my-auto py-6">
                                <h2 className="text-4xl md:text-6xl font-black text-white font-outfit uppercase tracking-tight leading-[0.9] mb-3">
                                    Spring <br />
                                    <span className="font-playfair italic font-normal text-amber-400">Explorer</span>
                                </h2>
                                <p className="text-slate-200 text-xs md:text-sm font-medium max-w-md leading-relaxed mb-6">
                                    Experience blooming rhododendron forests, crystal clear high-pass visibility, and peak trekking season across Nepal.
                                </p>

                                {/* Offer Highlight Pill */}
                                <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                                    <div className="w-12 h-12 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg">
                                        <FaPercent size={20} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">Promo Code: SPRING30</span>
                                        <h4 className="text-lg font-black text-white font-outfit uppercase">30% OFF ALL TREKS</h4>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Note */}
                            <div className="relative z-10 flex items-center justify-between text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                                <span>Limited High-Pass Permits</span>
                                <Link 
                                    href="/tours" 
                                    onClick={() => setShowModal(false)}
                                    className="text-amber-400 hover:text-white underline underline-offset-4 transition-colors"
                                >
                                    Browse Packages →
                                </Link>
                            </div>
                        </div>

                        {/* RIGHT SIDE: Interactive Discount Claim Form */}
                        <div className="w-full md:w-[420px] bg-slate-950 p-8 md:p-10 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/10 relative">
                            {/* Ambient Glow */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

                            <div className="relative z-10">
                                <div className="mb-6">
                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.25em] block mb-1 font-outfit">Exclusive Pass</span>
                                    <h3 className="text-2xl font-black text-white uppercase font-outfit tracking-tight">
                                        Claim 30% Discount
                                    </h3>
                                    <p className="text-slate-400 text-xs font-medium mt-1">
                                        Reserve your spot before high-season slots fill up!
                                    </p>
                                </div>

                                {submitted ? (
                                    <div className="p-6 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-center space-y-3">
                                        <FaCheckCircle size={36} className="text-emerald-400 mx-auto" />
                                        <h4 className="font-black text-base text-white font-outfit uppercase">Discount Locked!</h4>
                                        <p className="text-xs text-slate-300 font-medium">
                                            Our Senior Sherpa Concierge will contact you shortly on WhatsApp.
                                        </p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Full Name *</label>
                                            <div className="relative">
                                                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
                                                <input
                                                    type="text"
                                                    required
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="e.g. Chandan Sharma"
                                                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 outline-none text-xs font-semibold text-white placeholder:text-slate-600 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Phone / WhatsApp *</label>
                                            <div className="relative">
                                                <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
                                                <input
                                                    type="tel"
                                                    required
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    placeholder="+977 9855051795"
                                                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-indigo-500 outline-none text-xs font-semibold text-white placeholder:text-slate-600 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Preferred Expedition</label>
                                            <div className="relative">
                                                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
                                                <select
                                                    value={destination}
                                                    onChange={(e) => setDestination(e.target.value)}
                                                    className="w-full pl-11 pr-4 py-3 bg-slate-900 text-white text-xs font-semibold rounded-xl border border-white/10 focus:border-indigo-500 outline-none"
                                                >
                                                    <option value="Everest Base Camp">Everest Base Camp Trek</option>
                                                    <option value="Annapurna Sanctuary">Annapurna Circuit & Base Camp</option>
                                                    <option value="Mustang Helicopter">Mustang VIP Helicopter</option>
                                                    <option value="Chitwan Wildlife">Chitwan Wildlife Safari</option>
                                                </select>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                                        >
                                            {submitting ? 'Claiming...' : <><FaPaperPlane size={12} /> Claim 30% Discount Now</>}
                                        </button>

                                        <a
                                            href="https://wa.me/9779855051795?text=Namaste!%20I%20want%20to%20claim%20the%2030%25%20SPRING30%20discount."
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                                        >
                                            <FaWhatsapp size={15} /> Instant WhatsApp Claim
                                        </a>
                                    </form>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SeasonalOffer;
