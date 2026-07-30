"use client";

import { useState } from 'react';
import Modal from '@/components/Modal';
import AskQuestionForm from '@/components/AskQuestionForm';
import BookNowForm from '@/components/BookNowForm';
import { motion } from 'framer-motion';
import { 
    FaCalendarCheck, FaQuestionCircle, FaHeadset, 
    FaWhatsapp, FaShieldAlt, FaStar, FaUserFriends, 
    FaCalendarAlt, FaCheckCircle, FaTag, FaLock 
} from 'react-icons/fa';

interface DestinationClientWrapperProps {
    destination: any;
    shareUrl: string;
    mainImage?: string;
}

const DestinationClientWrapper = ({ destination, shareUrl, mainImage }: DestinationClientWrapperProps) => {
    const [isBookNowOpen, setIsBookNowOpen] = useState(false);
    const [isAskQuestionOpen, setIsAskQuestionOpen] = useState(false);

    // E-commerce Order State
    const [explorersCount, setExplorersCount] = useState(2);
    const [selectedSeason, setSelectedSeason] = useState('Autumn Peak (Oct-Nov)');

    // Build Complete WhatsApp Message with All Destination Details & Image/ID (No Price)
    const destinationId = destination._id || 'N/A';
    const destinationTitle = destination.title || 'Himalayan Expedition';
    const location = destination.location || 'Nepal';
    const bestTime = destination.bestTime || 'Autumn & Spring';
    const photoUrl = mainImage || destination.image || '';

    const whatsappMessageText = `🛍️ *EXPEDITION INQUIRY & CHECKOUT*
----------------------------------------
📌 *Package ID:* ${destinationId}
🏔️ *Expedition:* ${destinationTitle}
📍 *Location:* ${location}
📅 *Best Season:* ${bestTime}
👥 *Group Size:* ${explorersCount} ${explorersCount === 1 ? 'Explorer' : 'Explorers'}
🗓️ *Target Month:* ${selectedSeason}
🖼️ *Photo:* ${photoUrl}
🔗 *Package Link:* ${shareUrl}
----------------------------------------
*Namaste Travel Sansar!* I want to confirm booking availability for this expedition. Please share customized NPR quote and dates!`;

    const whatsappUrl = `https://wa.me/9779855051795?text=${encodeURIComponent(whatsappMessageText)}`;

    return (
        <div className="font-sans space-y-6">
            
            {/* ─── Main E-Commerce Product Purchase Panel ─── */}
            <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-gray-200/80 shadow-xl space-y-6 relative overflow-hidden">
                
                {/* Category & Badge Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 font-black text-[10px] uppercase tracking-wider font-outfit">
                        <FaTag /> Verified Package
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">ID: {destinationId.substring(0, 10)}...</span>
                </div>

                {/* Rating & Title Header */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="flex text-amber-400 text-xs">
                            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                        </div>
                        <span className="text-xs font-black text-slate-900 font-outfit">4.9</span>
                        <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">(128 Explorer Reviews)</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-outfit uppercase tracking-tight leading-[0.95]">
                        {destinationTitle}
                    </h1>
                </div>

                {/* Interactive Selectors */}
                <div className="space-y-4 pt-2">
                    {/* Explorers Counter */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block mb-2 flex items-center gap-1.5">
                            <FaUserFriends className="text-indigo-600" /> Explorers Count
                        </label>
                        <div className="flex items-center justify-between bg-slate-50 rounded-xl p-2 border border-gray-200">
                            <button 
                                onClick={() => setExplorersCount(Math.max(1, explorersCount - 1))}
                                className="w-9 h-9 rounded-lg bg-white text-slate-900 font-black border border-gray-200 hover:bg-indigo-600 hover:text-white transition-colors"
                            >-</button>
                            <span className="text-sm font-black text-slate-900 font-outfit">{explorersCount} {explorersCount === 1 ? 'Explorer' : 'Explorers'}</span>
                            <button 
                                onClick={() => setExplorersCount(explorersCount + 1)}
                                className="w-9 h-9 rounded-lg bg-white text-slate-900 font-black border border-gray-200 hover:bg-indigo-600 hover:text-white transition-colors"
                            >+</button>
                        </div>
                    </div>

                    {/* Season Month Dropdown */}
                    <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block mb-2 flex items-center gap-1.5">
                            <FaCalendarAlt className="text-indigo-600" /> Target Travel Season
                        </label>
                        <select
                            value={selectedSeason}
                            onChange={(e) => setSelectedSeason(e.target.value)}
                            className="w-full bg-slate-50 text-slate-900 text-xs font-bold p-3.5 rounded-xl border border-gray-200 outline-none focus:border-indigo-600"
                        >
                            <option>Autumn Peak (Oct-Nov)</option>
                            <option>Spring Blossom (Mar-May)</option>
                            <option>Winter Snow (Dec-Feb)</option>
                            <option>Monsoon Discovery (Jun-Sep)</option>
                        </select>
                    </div>
                </div>

                {/* ─── E-COMMERCE MAIN PRIORITY: ORDER VIA WHATSAPP ─── */}
                <div className="pt-2 space-y-3">
                    <motion.a
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-3"
                    >
                        <FaWhatsapp size={22} />
                        <span>Checkout via WhatsApp</span>
                    </motion.a>

                    <button
                        onClick={() => setIsBookNowOpen(true)}
                        className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2"
                    >
                        <FaCalendarCheck size={14} />
                        <span>Reserve via Web Form</span>
                    </button>

                    <button
                        onClick={() => setIsAskQuestionOpen(true)}
                        className="w-full py-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-gray-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                    >
                        <FaQuestionCircle size={14} />
                        <span>Custom Requirement Inquiry</span>
                    </button>
                </div>

                {/* Security & Support Guarantees */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1 text-emerald-600"><FaLock /> Instant WhatsApp Receipt</span>
                    <span className="flex items-center gap-1"><FaShieldAlt /> Verified Sherpa Guide</span>
                </div>
            </div>

            {/* ─── 24/7 Sherpa Concierge Hotline Card ─── */}
            <div className="bg-slate-900 text-white p-6 rounded-[28px] shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
                        <FaHeadset size={18} />
                    </div>
                    <div>
                        <h4 className="text-xs font-black uppercase font-outfit text-white">24/7 Sherpa Concierge</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Call or WhatsApp Anytime</p>
                    </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-black font-outfit">
                    <span className="text-slate-400">Direct Hotline</span>
                    <a href="tel:+9779855051795" className="text-indigo-400 hover:text-white transition-colors">+977 9855051795</a>
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={isBookNowOpen}
                onClose={() => setIsBookNowOpen(false)}
                title={`Book ${destinationTitle}`}
            >
                <BookNowForm
                    destinationTitle={destinationTitle}
                    destinationId={destinationId}
                    onSuccess={() => setIsBookNowOpen(false)}
                />
            </Modal>

            <Modal
                isOpen={isAskQuestionOpen}
                onClose={() => setIsAskQuestionOpen(false)}
                title={`Inquire about ${destinationTitle}`}
            >
                <AskQuestionForm
                    destinationTitle={destinationTitle}
                    onSuccess={() => setIsAskQuestionOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default DestinationClientWrapper;
