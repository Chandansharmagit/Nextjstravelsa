'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { 
    FaUser, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, 
    FaCalendarAlt, FaPaperPlane, FaCheckCircle, FaWhatsapp, 
    FaCompass, FaShieldAlt, FaAward 
} from 'react-icons/fa';
import api from '@/lib/api';

interface LeadCaptureFormProps {
    onSuccess?: () => void;
}

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        destination: '',
        travelDate: '',
        budget: '',
        message: ''
    });

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMsg('');

        try {
            await api.post('/leads', formData);
            setStatus('success');
            setFormData({ name: '', email: '', phone: '', destination: '', travelDate: '', budget: '', message: '' });
            if (onSuccess) {
                setTimeout(() => {
                    onSuccess();
                }, 2500);
            }
        } catch (err: any) {
            setStatus('error');
            setErrorMsg(err.response?.data?.message || 'Submission failed. Please try again or contact via WhatsApp.');
        }
    };

    if (status === 'success') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-16 px-8 text-center max-w-lg mx-auto bg-slate-900 border border-emerald-500/40 rounded-3xl text-white shadow-2xl space-y-4"
            >
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg border border-emerald-500/30">
                    <FaCheckCircle size={40} />
                </div>
                <h3 className="text-3xl font-black font-outfit uppercase tracking-tight">Inquiry Dispatched!</h3>
                <p className="text-slate-300 text-sm font-medium leading-relaxed">
                    Thank you! Our Senior Sherpa Concierge has received your itinerary request and will contact you via WhatsApp or Email within 2 hours.
                </p>
            </motion.div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto rounded-[2.5rem] bg-slate-900 border border-white/15 overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.7)] grid grid-cols-1 lg:grid-cols-12 font-sans">
            
            {/* LEFT SIDEBAR: Photo Showcase & Credentials (5 Cols) */}
            <div className="lg:col-span-5 relative min-h-[350px] lg:min-h-full p-8 md:p-10 flex flex-col justify-between overflow-hidden">
                {/* High Quality Mountain Photo */}
                <Image
                    src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1600&auto=format&fit=crop"
                    alt="Himalayan Expedition Concierge"
                    fill
                    className="object-cover transition-transform duration-[10s] ease-out hover:scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/20" />

                {/* Top Badge */}
                <div className="relative z-10">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-amber-300 text-[10px] font-black uppercase tracking-[0.25em] font-outfit">
                        <FaCompass /> Sherpa Master Designers
                    </span>
                </div>

                {/* Center Content & Feature Highlights */}
                <div className="relative z-10 my-auto py-8">
                    <h3 className="text-3xl md:text-4xl font-black text-white font-outfit uppercase tracking-tight leading-[1.05] mb-4">
                        Plan Your <br />
                        <span className="font-playfair italic font-normal text-amber-400">Custom Journey</span>
                    </h3>
                    
                    <ul className="space-y-3 mb-6 text-xs text-slate-200 font-medium">
                        <li className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center text-[10px] shrink-0">✓</span>
                            <span>Tailored NPR Itinerary in under 2 hours</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center text-[10px] shrink-0">✓</span>
                            <span>Certified Local Sherpa Guides & Pilots</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center text-[10px] shrink-0">✓</span>
                            <span>TAAN & NATTA Authorized Agency</span>
                        </li>
                    </ul>

                    {/* Direct WhatsApp Concierge Button */}
                    <a
                        href="https://wa.me/9779855051795?text=Namaste!%20I%20want%20to%20plan%20a%20custom%20Himalayan%20tour."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-600/30"
                    >
                        <FaWhatsapp size={16} /> Direct WhatsApp Concierge
                    </a>
                </div>

                {/* Bottom Accreditation Badges */}
                <div className="relative z-10 flex items-center gap-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest pt-4 border-t border-white/10">
                    <span className="flex items-center gap-1"><FaShieldAlt className="text-indigo-400" /> TAAN Approved</span>
                    <span className="flex items-center gap-1"><FaAward className="text-amber-400" /> NATTA Member</span>
                </div>
            </div>

            {/* RIGHT FORM CONTAINER: Sleek Modern Input Form (7 Cols) */}
            <div className="lg:col-span-7 bg-slate-950 p-8 md:p-12 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-white/10 relative">
                {/* Ambient Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                    <div className="mb-6">
                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.25em] block mb-1 font-outfit">Free Consultation</span>
                        <h4 className="text-2xl font-black text-white uppercase font-outfit tracking-tight">
                            Personalized Proposal Request
                        </h4>
                        <p className="text-slate-400 text-xs font-medium mt-1">
                            Fill out your preferences below and receive a custom estimate in Nepali Rupees (NPR).
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Row 1: Name & Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Full Name *</label>
                                <div className="relative">
                                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Chandan Sharma"
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-400 focus:bg-white/10 outline-none text-xs font-semibold text-white placeholder:text-slate-600 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Email Address *</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="e.g. chandan@example.com"
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-400 focus:bg-white/10 outline-none text-xs font-semibold text-white placeholder:text-slate-600 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Phone & Destination */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Phone / WhatsApp</label>
                                <div className="relative">
                                    <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+977 9855051795"
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-400 focus:bg-white/10 outline-none text-xs font-semibold text-white placeholder:text-slate-600 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Target Destination *</label>
                                <div className="relative">
                                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
                                    <input
                                        type="text"
                                        name="destination"
                                        required
                                        value={formData.destination}
                                        onChange={handleChange}
                                        placeholder="e.g. Everest Base Camp, Mustang"
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-400 focus:bg-white/10 outline-none text-xs font-semibold text-white placeholder:text-slate-600 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Row 3: Travel Season & NPR Budget */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Preferred Travel Season</label>
                                <div className="relative">
                                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
                                    <input
                                        type="text"
                                        name="travelDate"
                                        value={formData.travelDate}
                                        onChange={handleChange}
                                        placeholder="e.g. Autumn 2026, Oct-Nov"
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-400 focus:bg-white/10 outline-none text-xs font-semibold text-white placeholder:text-slate-600 transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Approx. Budget (NPR)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs">Rs.</span>
                                    <input
                                        type="text"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleChange}
                                        placeholder="e.g. NPR 25,000 - 50,000"
                                        className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-amber-400 focus:bg-white/10 outline-none text-xs font-semibold text-white placeholder:text-slate-600 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Special Requirements */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Special Preferences / Requirements</label>
                            <textarea
                                name="message"
                                rows={3}
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell us about group size, helicopter preference, or dietary needs..."
                                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl focus:border-amber-400 focus:bg-white/10 outline-none text-xs font-semibold text-white placeholder:text-slate-600 transition-all resize-none"
                            />
                        </div>

                        {status === 'error' && (
                            <p className="text-red-400 text-xs font-bold">{errorMsg}</p>
                        )}

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                        >
                            {status === 'loading' ? (
                                <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Dispatch Custom Proposal Request</span>
                                    <FaPaperPlane size={12} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default LeadCaptureForm;
