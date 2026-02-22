"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaLock, FaHeart, FaHistory, FaCog, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import Image from 'next/image';
import { getImageUrl } from '@/lib/utils/image';
import { CONFIG } from '@/lib/config';

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        country: '',
        image: ''
    });

    const [bookings, setBookings] = useState([]);

    // 3D Tilt Effect Logic for Header
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                country: user.country || 'Nepal',
                image: user.image || ''
            });
            fetchBookings();
        }
    }, [user, router]);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings/mybookings');
            setBookings(res.data);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                    <p className="text-slate-600 font-bold">Resuming Expedition...</p>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'profile', label: 'Identity', icon: <FaUser /> },
        { id: 'bookings', label: 'History', icon: <FaHistory /> },
        { id: 'favorites', label: 'Wishlist', icon: <FaHeart /> },
        { id: 'security', label: 'Shield', icon: <FaLock /> },
        { id: 'settings', label: 'Control', icon: <FaCog /> },
    ];

    const handleSave = async () => {
        try {
            const res = await api.put('/users/profile', formData);
            if (res.status === 200 || res.status === 201) {
                setIsEditing(false);
                window.location.reload();
            }
        } catch (error: any) {
            console.error('Save error:', error);
            alert(error.response?.data?.message || 'Failed to save profile');
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pt-32 pb-20 px-4 xl:px-20 overflow-hidden font-sans">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-[30%] h-[30%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[10%] right-[5%] w-[30%] h-[30%] bg-purple-400/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Profile Header Card */}
                <motion.div
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="bg-white/70 backdrop-blur-3xl rounded-[48px] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.08)] p-8 lg:p-12 mb-10 border border-white/60 relative overflow-hidden"
                >
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        {/* Profile Picture */}
                        <div className="relative group" style={{ transform: "translateZ(50px)" }}>
                            <div className="w-40 h-40 rounded-[40px] overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-6xl font-black border-8 border-white shadow-2xl transition-transform duration-500 group-hover:scale-105">
                                {(formData.image || user.image) ? (
                                    <img
                                        src={getImageUrl(formData.image || user.image)}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    user.name?.charAt(0).toUpperCase()
                                )}
                            </div>
                            <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all cursor-pointer shadow-xl border-4 border-slate-50 group-hover:scale-110">
                                <FaEdit className="text-xl" />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const uploadFormData = new FormData();
                                        uploadFormData.append('image', file);
                                        try {
                                            const res = await api.post('/upload', uploadFormData, {
                                                headers: { 'Content-Type': 'multipart/form-data' },
                                            });
                                            const imageUrl = res.data.image.path;
                                            setFormData(prev => ({ ...prev, image: imageUrl }));
                                            setIsEditing(true);
                                        } catch (err) { console.error(err); }
                                    }}
                                />
                            </label>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left" style={{ transform: "translateZ(30px)" }}>
                            <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                                Premium Member
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tighter mb-4 leading-none h-font">
                                {user.name}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 font-bold">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-blue-500">
                                        <FaEnvelope />
                                    </div>
                                    {user.email}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-indigo-500">
                                        <FaMapMarkerAlt />
                                    </div>
                                    {formData.country || 'Global Explorer'}
                                </div>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="grid grid-cols-2 gap-4" style={{ transform: "translateZ(40px)" }}>
                            <div className="p-6 bg-white/50 backdrop-blur-md rounded-[32px] border border-white/60 shadow-xl min-w-[140px] text-center group hover:bg-white transition-colors">
                                <div className="text-4xl font-black text-blue-600 mb-1">{bookings.length}</div>
                                <div className="text-xs font-black text-slate-400 uppercase tracking-tighter">Expeditions</div>
                            </div>
                            <div className="p-6 bg-white/50 backdrop-blur-md rounded-[32px] border border-white/60 shadow-xl min-w-[140px] text-center group hover:bg-white transition-colors">
                                <div className="text-4xl font-black text-purple-600 mb-1">12</div>
                                <div className="text-xs font-black text-slate-400 uppercase tracking-tighter">Wishlist</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Area */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Tabs Sidebar */}
                    <div className="w-full lg:w-[280px] shrink-0">
                        <div className="bg-white/70 backdrop-blur-2xl rounded-[40px] p-4 shadow-xl border border-white/60">
                            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-4 px-6 py-4 rounded-3xl font-black transition-all group whitespace-nowrap relative ${activeTab === tab.id
                                            ? 'bg-blue-600 text-white shadow-2xl shadow-blue-500/30'
                                            : 'text-slate-500 hover:bg-white hover:text-blue-600'
                                            }`}
                                    >
                                        <span className={`text-xl transition-transform group-hover:scale-110 ${activeTab === tab.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`}>
                                            {tab.icon}
                                        </span>
                                        <span className="text-sm tracking-tight">{tab.label}</span>
                                        {activeTab === tab.id && (
                                            <motion.div
                                                layoutId="activeTabGlow"
                                                className="absolute inset-0 rounded-3xl border-2 border-white/20 pointer-events-none"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => router.push('/')}
                            className="w-full mt-6 py-4 bg-slate-100 text-slate-500 rounded-[32px] font-black tracking-widest text-xs uppercase hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
                        >
                            Return Home
                            <FaArrowRight className="text-xs" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                logout();
                                router.push('/login');
                            }}
                            className="w-full mt-4 py-4 bg-rose-50 text-rose-600 rounded-[32px] font-black tracking-widest text-xs uppercase hover:bg-rose-100 transition-all flex items-center justify-center gap-3"
                        >
                            Terminate Session
                            <FaLock className="text-xs" />
                        </motion.button>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.4 }}
                                className="bg-white/70 backdrop-blur-3xl rounded-[48px] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.05)] p-10 border border-white/60 min-h-[500px]"
                            >
                                {/* Profile Tab */}
                                {activeTab === 'profile' && (
                                    <div>
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                                            <div>
                                                <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2 h-font">Identity Info</h2>
                                                <p className="text-slate-500 font-bold">Manage your personal traveler details</p>
                                            </div>
                                            {!isEditing ? (
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-3"
                                                >
                                                    <FaEdit /> Customize
                                                </button>
                                            ) : (
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => setIsEditing(false)}
                                                        className="px-6 py-3.5 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all"
                                                    >
                                                        Discard
                                                    </button>
                                                    <button
                                                        onClick={handleSave}
                                                        className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all"
                                                    >
                                                        Deploy Changes
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <InputWrapper icon={<FaUser />} label="Full Name">
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    disabled={!isEditing}
                                                    className="auth-input"
                                                    placeholder="Explorer Name"
                                                />
                                            </InputWrapper>

                                            <InputWrapper icon={<FaEnvelope />} label="Email Address">
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    disabled={!isEditing}
                                                    className="auth-input"
                                                    placeholder="name@domain.com"
                                                />
                                            </InputWrapper>

                                            <InputWrapper icon={<FaPhone />} label="Phone Portal">
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    disabled={!isEditing}
                                                    className="auth-input"
                                                    placeholder="+977-XXXXXXXXXX"
                                                />
                                            </InputWrapper>

                                            <InputWrapper icon={<FaMapMarkerAlt />} label="Current Region">
                                                <input
                                                    type="text"
                                                    value={formData.country}
                                                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                    disabled={!isEditing}
                                                    className="auth-input"
                                                    placeholder="Nation"
                                                />
                                            </InputWrapper>

                                            <div className="md:col-span-2">
                                                <InputWrapper icon={<FaMapMarkerAlt />} label="Specific Address">
                                                    <textarea
                                                        value={formData.address}
                                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                        disabled={!isEditing}
                                                        rows={2}
                                                        className="auth-input pt-2 resize-none"
                                                        placeholder="Where do you reside?"
                                                    />
                                                </InputWrapper>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* History/Bookings Tab */}
                                {activeTab === 'bookings' && (
                                    <div>
                                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-8 h-font">Expedition History</h2>
                                        {bookings.length > 0 ? (
                                            <div className="grid grid-cols-1 gap-6">
                                                {bookings.map((booking: any) => (
                                                    <motion.div
                                                        whileHover={{ y: -5 }}
                                                        key={booking._id}
                                                        className="bg-white/50 border border-slate-100 p-6 rounded-[32px] flex flex-col md:flex-row gap-6 items-center shadow-sm group hover:shadow-2xl transition-all"
                                                    >
                                                        <div className="w-full md:w-36 h-28 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                                                            {(booking.tour?.image || booking.destination?.image) && (
                                                                <img
                                                                    src={getImageUrl(booking.tour?.image || booking.destination?.image)}
                                                                    alt="trip"
                                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 text-center md:text-left">
                                                            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                                                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-600' :
                                                                    booking.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                                                                        'bg-yellow-100 text-yellow-600'
                                                                    }`}>
                                                                    {booking.status}
                                                                </span>
                                                                <span className="text-slate-300 font-bold text-xs">#{booking._id.substring(0, 8)}</span>
                                                            </div>
                                                            <h3 className="font-black text-xl text-slate-800 tracking-tight">
                                                                {booking.tour?.title || booking.destination?.title || booking.destination?.name}
                                                            </h3>
                                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3">
                                                                <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs uppercase tracking-tighter">
                                                                    <FaHistory className="text-blue-500" />
                                                                    {new Date(booking.travelDate).toLocaleDateString()}
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs uppercase tracking-tighter">
                                                                    <FaUser className="text-indigo-500" />
                                                                    {booking.travelers} Persons
                                                                </div>
                                                                <div className="px-3 py-1 bg-slate-50 rounded-lg font-black text-slate-900 border border-slate-100">
                                                                    ${booking.tour?.price || booking.destination?.price || "N/A"}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button className="px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:border-blue-600 hover:text-blue-600 transition-all group/btn shrink-0">
                                                            Manifesto
                                                        </button>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-24 bg-slate-50/50 border-2 border-dashed border-slate-200 rounded-[40px]">
                                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-5xl text-slate-200 mx-auto mb-6 shadow-sm">
                                                    <FaHistory />
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-400">No Expeditions Discovered</h3>
                                                <p className="text-slate-400 font-bold mt-2">Start your journey today by booking a destination.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Other Tabs Placeholder */}
                                {['favorites', 'security', 'settings'].includes(activeTab) && (
                                    <div className="flex flex-col items-center justify-center h-full text-center">
                                        <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center text-4xl text-blue-500 mb-6 border-b-4 border-blue-100">
                                            {tabs.find(t => t.id === activeTab)?.icon}
                                        </div>
                                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 h-font">{tabs.find(t => t.id === activeTab)?.label} Hub</h2>
                                        <p className="text-slate-500 font-bold max-w-sm">This sector of the portal is currently under maintenance. New features coming soon.</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@800;900&display=swap');
                
                body { font-family: 'Plus Jakarta Sans', sans-serif; }
                .h-font { font-family: 'Outfit', sans-serif; }
                .auth-input { @apply w-full bg-transparent outline-none text-slate-800 placeholder:text-slate-400 font-black text-lg; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}

function InputWrapper({ children, icon, label, showToggle, toggleVisible, onToggle }: any) {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <div className="w-full">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-2">
                {label}
            </label>
            <div
                className={`relative flex items-center p-5 rounded-[28px] border-2 transition-all duration-500 ${isFocused
                    ? 'bg-white border-blue-600 shadow-[0_20px_40px_rgba(37,99,235,0.1)]'
                    : 'bg-white/50 border-slate-100 hover:border-slate-200'
                    }`}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            >
                <span className={`mr-4 text-xl transition-colors duration-500 ${isFocused ? 'text-blue-600' : 'text-slate-300'}`}>
                    {icon}
                </span>
                {children}
                {showToggle && (
                    <button
                        type="button"
                        onClick={onToggle}
                        className="text-slate-400 hover:text-blue-500 transition-colors ml-2"
                    >
                        {toggleVisible ? <FaEyeSlash /> : <FaEye />}
                    </button>
                )}
                {isFocused && (
                    <motion.div
                        layoutId="inputIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-600 rounded-r-full"
                    />
                )}
            </div>
        </div>
    );
}
