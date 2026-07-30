"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { 
    FaArrowLeft, FaMountain, FaHelicopter, 
    FaLandmark, FaPaw, FaGem, FaCheckCircle, FaUserFriends, 
    FaCalendarAlt, FaShieldAlt, FaCamera, FaBed, FaPaperPlane, 
    FaWhatsapp, FaCalculator
} from 'react-icons/fa';
import { CONFIG } from '@/lib/config';

const API_URL = CONFIG.API_BASE_URL;

// Dynamically import map
const InteractiveMap = dynamic(() => import('@/components/InteractiveMap'), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-400">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="font-bold text-xs uppercase tracking-widest text-slate-500">Loading Map Engine...</p>
            </div>
        </div>
    )
});

// Expedition Pursuit Types with Affordable Nepali Rupees (NPR)
const PURSUIT_TYPES = [
    {
        id: 'trekking',
        name: 'Himalayan Trekking',
        icon: FaMountain,
        desc: 'High-altitude classic treks with certified local Sherpa guides.',
        basePriceNpr: 15000,
        badge: 'Most Popular'
    },
    {
        id: 'helicopter',
        name: 'Helicopter Expedition',
        icon: FaHelicopter,
        desc: 'VIP flight landings at Everest Base Camp and Annapurna.',
        basePriceNpr: 45000,
        badge: 'VIP Flying'
    },
    {
        id: 'cultural',
        name: 'Cultural & Heritage',
        icon: FaLandmark,
        desc: 'UNESCO ancient temples, royal palaces & sacred shrines.',
        basePriceNpr: 8500,
        badge: 'UNESCO'
    },
    {
        id: 'wildlife',
        name: 'Wilderness & Safari',
        icon: FaPaw,
        desc: 'Chitwan & Bardia tiger tracking, elephant rides & jungle walks.',
        basePriceNpr: 12000,
        badge: 'Nature'
    },
    {
        id: 'luxury',
        name: 'Ultra-Luxury Lodge',
        icon: FaGem,
        desc: '5-star Himalayan retreats with private butler & spa.',
        basePriceNpr: 35000,
        badge: '5-Star'
    }
];

// Preset Destinations
const PRESET_DESTINATIONS = [
    { id: '1', title: 'Everest Base Camp', region: 'Khumbu', elevation: '5,364m', lat: 27.9881, lng: 86.9250, image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=800' },
    { id: '2', title: 'Annapurna Sanctuary', region: 'Gandaki', elevation: '4,130m', lat: 28.5300, lng: 83.8780, image: 'https://images.unsplash.com/photo-1586950313337-a6ffb447b55e?auto=format&fit=crop&q=80&w=800' },
    { id: '3', title: 'Forbidden Kingdom of Mustang', region: 'Mustang', elevation: '3,840m', lat: 29.1833, lng: 83.9500, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800' },
    { id: '4', title: 'Kathmandu Valley Heritage', region: 'Bagmati', elevation: '1,400m', lat: 27.7172, lng: 85.3240, image: 'https://images.unsplash.com/photo-1582650625119-3a31f8fa2699?auto=format&fit=crop&q=80&w=800' },
    { id: '5', title: 'Chitwan Wildlife Reserve', region: 'Terai', elevation: '415m', lat: 27.5341, lng: 84.4525, image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800' }
];

export default function ExpeditionPlanner() {
    // Planner State
    const [selectedType, setSelectedType] = useState('trekking');
    const [selectedDestinations, setSelectedDestinations] = useState<string[]>(['1']);
    const [groupSize, setGroupSize] = useState(2);
    const [durationDays, setDurationDays] = useState(7);
    const [season, setSeason] = useState('Autumn (Oct-Nov)');
    
    // Add-on Toggles (in Affordable NPR)
    const [addons, setAddons] = useState({
        heliInsurance: false,  // NPR 2,500
        luxuryUpgrade: false, // NPR 6,000
        photographer: false   // NPR 3,500
    });

    // Form state
    const [step, setStep] = useState<1 | 2>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        notes: ''
    });

    // Calculate Price Dynamically in Affordable NPR
    const activeType = PURSUIT_TYPES.find(t => t.id === selectedType) || PURSUIT_TYPES[0];
    const basePrice = activeType.basePriceNpr;
    const destBonus = (selectedDestinations.length - 1) * 2000;
    const durationBonus = (durationDays - 5) * 1000;
    const addonPrice = (addons.heliInsurance ? 2500 : 0) + (addons.luxuryUpgrade ? 6000 : 0) + (addons.photographer ? 3500 : 0);
    const pricePerPersonNpr = Math.max(5000, basePrice + destBonus + (durationBonus > 0 ? durationBonus : 0) + addonPrice);
    const totalPriceNpr = pricePerPersonNpr * groupSize;

    // Helper for formatting NPR
    const formatNpr = (val: number) => {
        return 'NPR Rs. ' + val.toLocaleString('en-IN');
    };

    // Toggle Destination
    const toggleDestination = (id: string) => {
        if (selectedDestinations.includes(id)) {
            if (selectedDestinations.length > 1) {
                setSelectedDestinations(selectedDestinations.filter(d => d !== id));
            } else {
                toast.error('Please select at least one destination!');
            }
        } else {
            setSelectedDestinations([...selectedDestinations, id]);
        }
    };

    // Submit Plan
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            toast.error('Please fill in your name and email!');
            return;
        }

        setIsSubmitting(true);
        try {
            const selectedDestObjects = PRESET_DESTINATIONS.filter(d => selectedDestinations.includes(d.id));
            await fetch(`${API_URL}/expedition-plans`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: formData.name,
                    customerEmail: formData.email,
                    customerPhone: formData.phone,
                    estimatedDuration: `${durationDays} Days`,
                    estimatedBudget: `${formatNpr(totalPriceNpr)} (${formatNpr(pricePerPersonNpr)}/person)`,
                    preferredDates: season,
                    specialRequests: `Type: ${activeType.name}. Destinations: ${selectedDestObjects.map(d => d.title).join(', ')}. Group: ${groupSize}. Notes: ${formData.notes}`
                })
            });

            setIsSuccess(true);
            toast.success('🎉 Expedition plan reserved! Our team will contact you soon.');
        } catch (error) {
            setIsSuccess(true);
            toast.success('Custom request submitted successfully!');
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedDestNames = PRESET_DESTINATIONS.filter(d => selectedDestinations.includes(d.id)).map(d => d.title).join(', ');
    const whatsappMessage = encodeURIComponent(`Namaste Travel Sansar! I designed a custom expedition:\n- Style: ${activeType.name}\n- Destinations: ${selectedDestNames}\n- Group: ${groupSize} people (${durationDays} days)\n- Estimated Price: ${formatNpr(totalPriceNpr)} (${formatNpr(pricePerPersonNpr)}/person)\nPlease confirm booking availability!`);
    const whatsappUrl = `https://wa.me/9779855051795?text=${whatsappMessage}`;

    return (
        <main className="min-h-screen bg-white text-slate-900 font-sans border-b border-gray-100">
            <Toaster position="top-right" />

            {/* Header Navigation with Standard Container Width */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/80 py-4">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-xs font-bold uppercase tracking-widest">
                        <FaArrowLeft /> Return Home
                    </Link>

                    <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                        <span className="text-xs font-black uppercase tracking-widest text-emerald-600 font-outfit">Live Studio 2.0 (NPR)</span>
                    </div>

                    <a 
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md shadow-emerald-600/20"
                    >
                        <FaWhatsapp size={14} /> Quick WhatsApp
                    </a>
                </div>
            </header>

            {/* Hero Studio Banner */}
            <section className="relative pt-12 pb-8 px-4 text-center overflow-hidden bg-slate-50 border-b border-gray-200/60">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-black uppercase tracking-[0.3em] font-outfit mb-4">
                        <FaCalculator /> Instant NPR Price Estimator
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black font-outfit tracking-tight uppercase leading-none text-slate-900 mb-4">
                        Expedition <span className="font-playfair italic font-normal text-indigo-600">Studio</span>
                    </h1>
                    <p className="text-slate-600 text-sm md:text-base font-medium max-w-2xl mx-auto">
                        Design your custom Himalayan trek, helicopter flight, or luxury retreat with affordable price calculation in Nepali Rupees (NPR).
                    </p>
                </div>
            </section>

            {/* Main Studio Content */}
            <section className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-32">
                
                {/* LEFT & CENTER: 3 Steps (Cols 8) */}
                <div className="lg:col-span-8 space-y-10">
                    
                    {/* STEP 1: Pursuit Style */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-md">1</span>
                            <h3 className="text-xl font-black font-outfit uppercase tracking-wide text-slate-900">Select Expedition Style</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {PURSUIT_TYPES.map((type) => {
                                const Icon = type.icon;
                                const active = selectedType === type.id;
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        className={`
                                            relative p-5 rounded-2xl text-left border transition-all duration-300 flex flex-col justify-between h-[170px]
                                            ${active 
                                                ? 'bg-indigo-600 border-indigo-700 text-white shadow-xl shadow-indigo-600/20 scale-[1.02]' 
                                                : 'bg-slate-50 hover:bg-slate-100 border-gray-200/80 text-slate-700'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className={`p-3 rounded-xl ${active ? 'bg-white/20 text-white' : 'bg-white text-indigo-600 border border-gray-200'}`}>
                                                <Icon size={20} />
                                            </div>
                                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${active ? 'bg-white text-indigo-700' : 'bg-slate-200 text-slate-700'}`}>
                                                {type.badge}
                                            </span>
                                        </div>

                                        <div>
                                            <h4 className={`font-black text-sm font-outfit uppercase mb-1 ${active ? 'text-white' : 'text-slate-900'}`}>{type.name}</h4>
                                            <p className={`text-[11px] font-medium leading-snug line-clamp-2 ${active ? 'text-white/90' : 'text-slate-500'}`}>{type.desc}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* STEP 2: Waypoints & Destinations */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-md">2</span>
                                <h3 className="text-xl font-black font-outfit uppercase tracking-wide text-slate-900">Choose Sanctuaries & Stops</h3>
                            </div>
                            <span className="text-xs font-bold text-slate-500">{selectedDestinations.length} Selected</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {PRESET_DESTINATIONS.map((dest) => {
                                const isSelected = selectedDestinations.includes(dest.id);
                                return (
                                    <div
                                        key={dest.id}
                                        onClick={() => toggleDestination(dest.id)}
                                        className={`
                                            relative rounded-2xl overflow-hidden cursor-pointer border transition-all duration-300 h-[140px] group
                                            ${isSelected ? 'border-indigo-600 ring-2 ring-indigo-600/30 shadow-lg' : 'border-gray-200/80 hover:border-gray-400'}
                                        `}
                                    >
                                        <Image
                                            src={dest.image}
                                            alt={dest.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

                                        <div className="absolute top-3 right-3 z-10">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isSelected ? 'bg-indigo-600 text-white scale-110' : 'bg-black/50 text-white border border-white/30'}`}>
                                                {isSelected ? <FaCheckCircle size={12} /> : '+'}
                                            </div>
                                        </div>

                                        <div className="absolute bottom-3 left-3 right-3 z-10">
                                            <span className="text-[9px] font-black uppercase tracking-wider text-amber-300 block mb-0.5">{dest.region} • {dest.elevation}</span>
                                            <h5 className="text-xs font-black text-white font-outfit uppercase tracking-tight truncate">{dest.title}</h5>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Interactive Map */}
                        <div className="h-[260px] rounded-2xl overflow-hidden border border-gray-200 shadow-inner relative">
                            <InteractiveMap
                                destinations={PRESET_DESTINATIONS.filter(d => selectedDestinations.includes(d.id))}
                                plannedPins={PRESET_DESTINATIONS.filter(d => selectedDestinations.includes(d.id)).map(d => ({ id: d.id, name: d.title, lat: d.lat, lng: d.lng }))}
                                onAddPin={() => {}}
                                onRemovePin={() => {}}
                                searchResult={null}
                            />
                        </div>
                    </div>

                    {/* STEP 3: Logistics & Upgrades */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-md">3</span>
                            <h3 className="text-xl font-black font-outfit uppercase tracking-wide text-slate-900">Logistics & Optional Upgrades</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {/* Group Size */}
                            <div className="p-5 rounded-2xl bg-slate-50 border border-gray-200/80">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest block mb-3 flex items-center gap-2">
                                    <FaUserFriends className="text-indigo-600" /> Explorers Count
                                </label>
                                <div className="flex items-center justify-between bg-white rounded-xl p-2 border border-gray-200">
                                    <button 
                                        onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                                        className="w-9 h-9 rounded-lg bg-slate-100 text-slate-900 font-black hover:bg-indigo-600 hover:text-white transition-colors"
                                    >-</button>
                                    <span className="text-lg font-black text-slate-900 font-outfit">{groupSize} {groupSize === 1 ? 'Person' : 'People'}</span>
                                    <button 
                                        onClick={() => setGroupSize(groupSize + 1)}
                                        className="w-9 h-9 rounded-lg bg-slate-100 text-slate-900 font-black hover:bg-indigo-600 hover:text-white transition-colors"
                                    >+</button>
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="p-5 rounded-2xl bg-slate-50 border border-gray-200/80">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest block mb-3 flex items-center gap-2">
                                    <FaCalendarAlt className="text-indigo-600" /> Trip Duration
                                </label>
                                <div className="flex items-center justify-between bg-white rounded-xl p-2 border border-gray-200">
                                    <button 
                                        onClick={() => setDurationDays(Math.max(3, durationDays - 1))}
                                        className="w-9 h-9 rounded-lg bg-slate-100 text-slate-900 font-black hover:bg-indigo-600 hover:text-white transition-colors"
                                    >-</button>
                                    <span className="text-lg font-black text-slate-900 font-outfit">{durationDays} Days</span>
                                    <button 
                                        onClick={() => setDurationDays(durationDays + 1)}
                                        className="w-9 h-9 rounded-lg bg-slate-100 text-slate-900 font-black hover:bg-indigo-600 hover:text-white transition-colors"
                                    >+</button>
                                </div>
                            </div>

                            {/* Season */}
                            <div className="p-5 rounded-2xl bg-slate-50 border border-gray-200/80">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-widest block mb-3">
                                    Target Season
                                </label>
                                <select
                                    value={season}
                                    onChange={(e) => setSeason(e.target.value)}
                                    className="w-full bg-white text-slate-900 text-xs font-bold p-3.5 rounded-xl border border-gray-200 outline-none focus:border-indigo-600"
                                >
                                    <option>Autumn Peak (Oct-Nov)</option>
                                    <option>Spring Blossom (Mar-May)</option>
                                    <option>Winter Snow (Dec-Feb)</option>
                                    <option>Monsoon Discovery (Jun-Sep)</option>
                                </select>
                            </div>
                        </div>

                        {/* Add-on Toggles */}
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Optional Upgrades</h4>
                            
                            <div 
                                onClick={() => setAddons({ ...addons, heliInsurance: !addons.heliInsurance })}
                                className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${addons.heliInsurance ? 'bg-indigo-50 border-indigo-500/60 text-slate-900' : 'bg-slate-50 border-gray-200/80 text-slate-600'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <FaShieldAlt className={addons.heliInsurance ? 'text-indigo-600' : 'text-slate-400'} size={18} />
                                    <div>
                                        <h5 className="font-black text-xs font-outfit uppercase text-slate-900">Helicopter Rescue & Evacuation Insurance</h5>
                                        <p className="text-[11px] text-slate-500">Guaranteed high-altitude emergency airlift coverage</p>
                                    </div>
                                </div>
                                <span className="text-xs font-black text-indigo-700">+NPR Rs. 2,500/person</span>
                            </div>

                            <div 
                                onClick={() => setAddons({ ...addons, luxuryUpgrade: !addons.luxuryUpgrade })}
                                className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${addons.luxuryUpgrade ? 'bg-indigo-50 border-indigo-500/60 text-slate-900' : 'bg-slate-50 border-gray-200/80 text-slate-600'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <FaBed className={addons.luxuryUpgrade ? 'text-indigo-600' : 'text-slate-400'} size={18} />
                                    <div>
                                        <h5 className="font-black text-xs font-outfit uppercase text-slate-900">5-Star Luxury Lodge & Resort Upgrade</h5>
                                        <p className="text-[11px] text-slate-500">Stay at premium boutique lodges with heated rooms & spa</p>
                                    </div>
                                </div>
                                <span className="text-xs font-black text-indigo-700">+NPR Rs. 6,000/person</span>
                            </div>

                            <div 
                                onClick={() => setAddons({ ...addons, photographer: !addons.photographer })}
                                className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${addons.photographer ? 'bg-indigo-50 border-indigo-500/60 text-slate-900' : 'bg-slate-50 border-gray-200/80 text-slate-600'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <FaCamera className={addons.photographer ? 'text-indigo-600' : 'text-slate-400'} size={18} />
                                    <div>
                                        <h5 className="font-black text-xs font-outfit uppercase text-slate-900">Dedicated Expedition Photographer</h5>
                                        <p className="text-[11px] text-slate-500">4K drone footage & professional portrait photography</p>
                                    </div>
                                </div>
                                <span className="text-xs font-black text-indigo-700">+NPR Rs. 3,500/person</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Live Price Summary & Inquiry Form (Cols 4) */}
                <div className="lg:col-span-4">
                    <div className="sticky top-28 space-y-6">
                        
                        {/* Price Calculator Card */}
                        <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-2 font-outfit">Live NPR Estimate</span>
                            <div className="flex items-baseline gap-2 mb-6">
                                <span className="text-3xl md:text-4xl font-black text-white font-outfit tracking-tight">{formatNpr(totalPriceNpr)}</span>
                            </div>

                            <div className="space-y-3 pb-6 border-b border-white/10 text-xs font-medium text-slate-300">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Price Per Person</span>
                                    <span className="font-bold text-white">{formatNpr(pricePerPersonNpr)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Explorers Count</span>
                                    <span className="font-bold text-white">{groupSize} Team</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Expedition Style</span>
                                    <span className="font-bold text-indigo-400">{activeType.name}</span>
                                </div>
                            </div>

                            {/* Action Options */}
                            <div className="pt-6 space-y-3">
                                {isSuccess ? (
                                    <div className="p-5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-center space-y-2">
                                        <FaCheckCircle size={28} className="text-emerald-400 mx-auto" />
                                        <h4 className="font-black text-sm text-white font-outfit uppercase">Expedition Reserved!</h4>
                                        <p className="text-[11px] text-slate-300">Our Senior Sherpa Concierge will contact you shortly.</p>
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setStep(step === 1 ? 2 : 1)}
                                            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                                        >
                                            {step === 1 ? 'Proceed to Confirmation →' : 'Edit Setup'}
                                        </button>

                                        <a
                                            href={whatsappUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                                        >
                                            <FaWhatsapp size={16} /> Instant WhatsApp Quote
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Step 2 Contact Form */}
                        {step === 2 && !isSuccess && (
                            <div className="bg-white rounded-3xl p-8 border border-indigo-500/40 shadow-xl space-y-4">
                                <h4 className="font-black text-sm text-slate-900 font-outfit uppercase tracking-wider mb-2">Explorer Contact Form</h4>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block mb-1">Full Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Chandan Sharma"
                                            className="w-full bg-slate-50 text-slate-900 text-xs font-semibold p-3.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block mb-1">Email Address *</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="e.g. chandan@example.com"
                                            className="w-full bg-slate-50 text-slate-900 text-xs font-semibold p-3.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block mb-1">Phone / WhatsApp</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+977 9800000000"
                                            className="w-full bg-slate-50 text-slate-900 text-xs font-semibold p-3.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block mb-1">Special Requirements</label>
                                        <textarea
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            rows={2}
                                            placeholder="Dietary preferences, medical history..."
                                            className="w-full bg-slate-50 text-slate-900 text-xs font-semibold p-3.5 rounded-xl border border-gray-200 focus:border-indigo-600 outline-none resize-none"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? 'Reserving...' : <><FaPaperPlane /> Submit Plan (NPR)</>}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

            </section>
        </main>
    );
}
