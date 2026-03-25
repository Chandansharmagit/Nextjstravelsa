"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { 
    FaBars, FaTimes, FaFacebookF, FaInstagram, FaUser, FaSignOutAlt, 
    FaSearch, FaArrowRight, FaMapMarkerAlt, FaCompass, FaMountain, FaVihara,
    FaSuitcase, FaTicketAlt, FaShieldAlt
} from "react-icons/fa";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import api from "../lib/api";
import { getImageUrl } from "../lib/utils/image";

const Navbar = () => {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<{destinations: any[], tours: any[], services: any[]}>({ destinations: [], tours: [], services: [] });
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    // Handle Search Modal Shortcuts & Scroll Lock
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setShowSearchDropdown(false);
        };

        if (showSearchDropdown) {
            window.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden";
        } else {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [showSearchDropdown]);

    // Debounced Search Logic
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length > 1) {
                setIsSearching(true);
                try {
                    const res = await api.get(`/search?query=${encodeURIComponent(searchQuery)}`);
                    setSearchResults(res.data);
                    setShowSearchDropdown(true);
                } catch (err) {
                    console.error("Search failed:", err);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setSearchResults({ destinations: [], tours: [], services: [] });
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
            setShowSearchDropdown(false);
        }
    };

    const menuItems = [
        { name: "Destinations", path: "/destinations" },
        { name: "Tours", path: "/tours" },
        { name: "Expedition Planner", path: "/expedition-planner" },
        { name: "Experiences", path: "/experiences" },
        { name: "FAQ", path: "/faq" },
        { name: "Contact", path: "/contact" },
        { name: "About", path: "/about" },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <>
            {/* Fixed Navbar */}
            <header className={`
                fixed ${showSearchDropdown ? 'top-0' : 'top-10'} left-0 right-0 
                ${showSearchDropdown ? 'z-[99999]' : 'z-[2001]'}
                ${showSearchDropdown ? 'bg-transparent' : 'bg-white/95 backdrop-blur-md'}
                border-b border-slate-200/60
                transition-all duration-300
                ${scrolled ? 'shadow-lg py-1' : 'shadow-sm py-2'}
            `}>
                <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
                    {/* Main Flex Container: Logo | Links | Search | Actions */}
                    <div className="flex items-center justify-between h-[70px]">

                        {/* LEFT: Logo */}
                        <div className="flex items-center shrink-0">
                            <Link href="/" className="relative h-[55px] w-36 block">
                                <Image
                                    src="/logo-new.png"
                                    alt="Travel Sansar"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </Link>
                        </div>

                        {/* CENTER: Navigation Links (Desktop) */}
                        <nav className="hidden xl:flex items-center justify-center gap-8 flex-1 px-8 overflow-hidden">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    className={`
                                        relative text-[11px] xl:text-[13px] font-bold uppercase tracking-wider
                                        transition-colors duration-200 whitespace-nowrap
                                        ${isActive(item.path)
                                            ? 'text-blue-600'
                                            : 'text-slate-500 hover:text-slate-900'
                                        }
                                    `}
                                >
                                    <span className="flex items-center gap-1.5">
                                        {item.name}
                                        {item.name === "Expedition Planner" && (
                                            <span className="relative flex h-1.5 w-1.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-600"></span>
                                            </span>
                                        )}
                                    </span>
                                    {isActive(item.path) && (
                                        <motion.div
                                            layoutId="activeNavItem"
                                            className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-blue-600 rounded-full"
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* RIGHT: Search Bar + User Actions */}
                        <div className="flex items-center justify-end gap-3 xl:gap-5 shrink-0 ml-auto min-w-[200px]">
                            {/* Desktop Search Trigger */}
                            <div className="hidden xl:block">
                                <button
                                    onClick={() => setShowSearchDropdown(true)}
                                    className="group flex items-center gap-3 h-11 px-4 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all duration-300 border border-transparent hover:border-slate-200"
                                >
                                    <FaSearch className="text-slate-400 group-hover:text-blue-600 transition-colors" size={16} />
                                    <span className="text-[13px] font-bold text-slate-500 group-hover:text-slate-900 transition-colors pr-8">Search sanctuary...</span>
                                    <kbd className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black text-slate-400 bg-white border border-slate-200 rounded-md shadow-sm">
                                        ESC
                                    </kbd>
                                </button>

                                {/* PREMIUM MODAL SEARCH SYSTEM */}
                                <AnimatePresence>
                                    {showSearchDropdown && (
                                        <>
                                            {/* Deep Blur Backdrop */}
                                            <motion.div 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                onClick={() => setShowSearchDropdown(false)}
                                                className="fixed inset-0 bg-slate-900/40 backdrop-blur-[20px] z-[5000]"
                                            />
                                            
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95, y: "-45%", x: "-50%" }}
                                                animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                                                exit={{ opacity: 0, scale: 0.95, y: "-48%", x: "-50%" }}
                                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                                className="fixed top-1/2 left-1/2 w-[90vw] max-w-[800px] bg-white rounded-[40px] shadow-[0_80px_150px_-30px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden z-[5001]"
                                            >
                                                {/* Search Input Header */}
                                                <div className="relative p-8 border-b border-slate-50">
                                                    <div className="relative flex items-center group">
                                                        <FaSearch className="absolute left-1 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                                                        <input
                                                            autoFocus
                                                            type="text"
                                                            placeholder="Type to search your next sanctuary..."
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                            className="w-full pl-10 pr-12 py-2 text-2xl font-black text-slate-800 placeholder:text-slate-200 focus:outline-none bg-transparent"
                                                        />
                                                        <div className="absolute right-0 flex items-center gap-2">
                                                            {isSearching && (
                                                                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                                            )}
                                                            <button 
                                                                onClick={() => setShowSearchDropdown(false)}
                                                                className="p-2 text-slate-300 hover:text-slate-900 transition-colors"
                                                            >
                                                                <FaTimes size={18} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Categorized Results Content */}
                                                <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                                    <div className="p-4 space-y-8">
                                                        {['destinations', 'tours', 'services'].map((category) => {
                                                            const resultsArr = (searchResults as any)[category] || [];
                                                            if (resultsArr.length === 0) return null;

                                                            return (
                                                                <div key={category}>
                                                                    <div className="flex items-center justify-between mb-4 px-2">
                                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
                                                                            {category === 'destinations' ? 'Top Destinations' : 
                                                                             category === 'tours' ? 'Featured Tours' : 'Services & Visas'}
                                                                        </h4>
                                                                        <span className="text-[10px] font-bold text-slate-400">{resultsArr.length} Matches</span>
                                                                    </div>
                                                                    
                                                                    <div className="space-y-2">
                                                                        {resultsArr.map((item: any) => {
                                                                            const imgObj = item.images?.[0];
                                                                            const path = (typeof imgObj === 'string' ? imgObj : imgObj?.path || imgObj?.url) || item.coverImage || item.image;
                                                                            const displayImage = getImageUrl(path);
                                                                            const href = category === 'destinations' ? `/destination/${item._id}` :
                                                                                         category === 'tours' ? `/tours/${item._id}` : `/services`;

                                                                            return (
                                                                                <Link
                                                                                    key={item._id}
                                                                                    href={href}
                                                                                    onClick={() => setShowSearchDropdown(false)}
                                                                                    className="flex items-center gap-5 p-4 rounded-3xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group/res"
                                                                                >
                                                                                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-slate-50 bg-slate-100">
                                                                                        {displayImage ? (
                                                                                            <Image
                                                                                                src={displayImage}
                                                                                                alt={item.title}
                                                                                                fill
                                                                                                className="object-cover transition-transform duration-500 group-hover/res:scale-110"
                                                                                            />
                                                                                        ) : (
                                                                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                                                {category === 'services' ? <FaVihara size={24} /> : <FaCompass size={24} />}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="flex-1 min-w-0">
                                                                                        <div className="flex items-center gap-2 mb-1">
                                                                                            <h5 className="text-[16px] font-black text-slate-800 line-clamp-1 group-hover/res:text-blue-600 transition-colors leading-none">{item.title}</h5>
                                                                                            {category === 'services' && <span className="px-2 py-0.5 bg-amber-50 text-[8px] font-black uppercase text-amber-600 rounded-md">Essential</span>}
                                                                                        </div>
                                                                                        <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                                                                                            {category === 'destinations' ? (
                                                                                                <>
                                                                                                    <FaMapMarkerAlt size={10} className="text-slate-300" />
                                                                                                    {item.location}
                                                                                                </>
                                                                                            ) : category === 'tours' ? (
                                                                                                <>
                                                                                                    <FaCompass size={10} className="text-slate-300" />
                                                                                                    {item.duration} • {item.price}
                                                                                                </>
                                                                                            ) : (
                                                                                                <>
                                                                                                    <FaVihara size={10} className="text-slate-300" />
                                                                                                    {item.price} • Quick Booking
                                                                                                </>
                                                                                            )}
                                                                                        </p>
                                                                                    </div>
                                                                                    <FaArrowRight size={12} className="text-slate-200 group-hover/res:translate-x-1 group-hover/res:text-blue-600 transition-all" />
                                                                                </Link>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                        {(!searchResults.destinations.length && !searchResults.tours.length && !searchResults.services.length) && (
                                                            <div className="space-y-8">
                                                                {searchQuery.length > 1 ? (
                                                                    <div className="py-12 text-center bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                                                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                                                            <FaSearch size={18} className="text-slate-200" />
                                                                        </div>
                                                                        <p className="text-xs font-bold text-slate-500">No sanctuaries found for "{searchQuery}"</p>
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 px-2">Trending Searches</h4>
                                                                        <div className="grid grid-cols-2 gap-3 pb-4">
                                                                            {['Kathmandu', 'Pokhara', 'Everest', 'Chitwan'].map(city => (
                                                                                <button 
                                                                                    key={city}
                                                                                    onClick={() => setSearchQuery(city)}
                                                                                    className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-blue-50 rounded-2xl transition-all text-left group/sug"
                                                                                >
                                                                                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-slate-400 group-hover/sug:text-blue-600">
                                                                                        <FaCompass size={14} />
                                                                                    </div>
                                                                                    <span className="text-xs font-bold text-slate-600 group-hover/sug:text-blue-700">{city}</span>
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* CATEGORY: INTELLIGENCE / QUICK LINKS */}
                                                        <div>
                                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 px-2">Quick Intelligence</h4>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <Link href="/destinations" className="p-4 rounded-3xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all flex items-center gap-4 group/qi">
                                                                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                                                                        <FaMountain size={18} />
                                                                    </div>
                                                                    <div>
                                                                        <h6 className="text-xs font-black text-slate-800">All Peaks</h6>
                                                                        <p className="text-[10px] font-bold text-slate-400">Explore expeditions</p>
                                                                    </div>
                                                                </Link>
                                                                <Link href="/tours" className="p-4 rounded-3xl border border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all flex items-center gap-4 group/qi">
                                                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                                                                        <FaVihara size={18} />
                                                                    </div>
                                                                    <div>
                                                                        <h6 className="text-xs font-black text-slate-800">Culture Hub</h6>
                                                                        <p className="text-[10px] font-bold text-slate-400">Ancient sanctuaries</p>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Shortcuts Footer */}
                                                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-6 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <kbd className="px-1.5 py-0.5 text-[9px] font-black bg-white border border-slate-200 rounded text-slate-500 shadow-sm">ESC</kbd>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Close</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <kbd className="px-1.5 py-0.5 text-[9px] font-black bg-white border border-slate-200 rounded text-slate-500 shadow-sm">ENTER</kbd>
                                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select</span>
                                                        </div>
                                                    </div>
                                                    <div className="px-4">
                                                        <Link 
                                                            href="/search" 
                                                            onClick={() => setShowSearchDropdown(false)}
                                                            className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-2"
                                                        >
                                                            Advance Search <FaArrowRight size={10} />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="xl:hidden w-11 h-11 flex items-center justify-center text-slate-600 hover:text-slate-900 bg-slate-100/50 rounded-xl transition-colors"
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
                            </button>

                            {/* Social Icons (Desktop) - Adjusted for more compact layout */}
                            <div className="hidden xl:flex items-center gap-1.5 border-l border-slate-100 pl-4 h-8 ml-2">
                                <a
                                    href="#"
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-pink-600 hover:bg-pink-50 transition-all shadow-sm bg-white border border-slate-50"
                                    aria-label="Instagram"
                                >
                                    <FaInstagram size={14} />
                                </a>
                                <a
                                    href="https://www.facebook.com/share/v/1BMuExj5x5/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm bg-white border border-slate-50"
                                    aria-label="Facebook"
                                >
                                    <FaFacebookF size={14} />
                                </a>
                            </div>

                            {/* User Section */}
                            {/* User Section with Premium Hover Popup */}
                            {user ? (
                                <div
                                    className="hidden xl:block relative group z-50"
                                    onMouseEnter={() => setShowProfileMenu(true)}
                                    onMouseLeave={() => setShowProfileMenu(false)}
                                >
                                    {/* User Avatar - Trigger */}
                                    <div className="py-2 cursor-pointer flex items-center gap-2">
                                        {user.role === 'admin' && (
                                            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 rounded-full border border-amber-500/20 mr-2">
                                                Admin
                                            </span>
                                        )}
                                        <div className={`
                                            w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-300
                                            ${showProfileMenu ? 'border-amber-400 shadow-[0_0_0_4px_rgba(251,191,36,0.1)]' : 'border-slate-200 hover:border-slate-300'}
                                        `}>
                                            {user.image ? (
                                                <Image
                                                    src={user.image}
                                                    alt={user.name}
                                                    width={40}
                                                    height={40}
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white font-semibold text-sm">
                                                    {user.name?.charAt(0) || 'U'}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Premium Dropdown Popup */}
                                    <AnimatePresence>
                                        {showProfileMenu && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                                transition={{ duration: 0.2, ease: "backOut" }}
                                                className="absolute top-full right-0 mt-2 w-72 pt-2"
                                            >
                                                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_-5px_rgba(0,0,0,0.1)] border border-slate-100/50 overflow-hidden ring-1 ring-slate-900/5">
                                                    {/* Header with User Info */}
                                                    <div className="relative p-6 bg-slate-900 text-white overflow-hidden">
                                                        {/* Decorative Background Elements */}
                                                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl -ml-10 -mb-10"></div>

                                                        <div className="relative z-10 flex items-start gap-4">
                                                            <div className="w-12 h-12 rounded-full border-2 border-white/20 shadow-lg overflow-hidden shrink-0">
                                                                {user.image ? (
                                                                    <Image src={user.image} alt={user.name} width={48} height={48} className="object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-lg font-bold">
                                                                        {user.name?.charAt(0) || 'U'}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="font-bold text-base bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300 truncate">
                                                                    {user.name}
                                                                </h3>
                                                                <p className="text-xs text-slate-400 font-medium truncate mb-2">{user.email}</p>
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/10">
                                                                    {user.role || 'Explorer'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Menu Items */}
                                                    <div className="p-2 space-y-1 bg-white">
                                                        <Link
                                                            href="/profile"
                                                            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-50 transition-all group"
                                                            onClick={() => setShowProfileMenu(false)}
                                                        >
                                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                                                                <FaUser size={14} />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="group-hover:text-indigo-700 transition-colors font-semibold">My Profile</span>
                                                                <span className="text-[10px] text-slate-400 font-normal">Account settings & details</span>
                                                            </div>
                                                        </Link>

                                                        {user.role === 'admin' && (
                                                            <Link
                                                                href="/admin/destinations"
                                                                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-50 transition-all group"
                                                                onClick={() => setShowProfileMenu(false)}
                                                            >
                                                                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm">
                                                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                                                    </svg>
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <span className="group-hover:text-amber-700 transition-colors font-semibold">Dashboard</span>
                                                                    <span className="text-[10px] text-slate-400 font-normal">Manage platform content</span>
                                                                </div>
                                                            </Link>
                                                        )}
                                                    </div>

                                                    {/* Footer Actions */}
                                                    <div className="p-2 border-t border-slate-100 bg-slate-50">
                                                        <button
                                                            onClick={() => { logout(); setShowProfileMenu(false); }}
                                                            className="flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                        >
                                                            <FaSignOutAlt />
                                                            Sign Out
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="hidden xl:flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    <FaUser size={12} />
                                    <span>Login</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/50 z-40 xl:hidden"
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl z-50 xl:hidden overflow-y-auto"
                        >
                            {/* Menu Header */}
                            <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                <div className="relative h-10 w-36">
                                    <Image
                                        src="/logo-new.png"
                                        alt="Travel Sansar"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            {/* Mobile Search */}
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                                <form onSubmit={handleSearchSubmit} className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search sanctuaries..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                                    />
                                    <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                </form>
                            </div>

                            {/* Menu Content */}
                            <nav className="p-6">
                                <div className="flex flex-col gap-1">
                                    {menuItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.path}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`
                                                px-4 py-3 rounded-lg text-sm font-semibold uppercase tracking-wide
                                                transition-colors
                                                ${isActive(item.path)
                                                    ? 'bg-slate-100 text-slate-900'
                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                }
                                            `}
                                        >
                                            <span className="flex items-center justify-between w-full">
                                                {item.name}
                                                {item.name === "Expedition Planner" && (
                                                    <span className="px-2 py-0.5 bg-secondary text-[8px] text-white rounded-full animate-pulse">NEW</span>
                                                )}
                                            </span>
                                        </Link>
                                    ))}
                                </div>

                                {/* Mobile Social + Login */}
                                <div className="mt-8 pt-6 border-t border-slate-200">
                                    {user ? (
                                        <div className="space-y-3">
                                            <Link
                                                href="/profile"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50"
                                            >
                                                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-200">
                                                    {user.image ? (
                                                        <Image src={user.image} alt={user.name} width={40} height={40} className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white font-semibold">
                                                            {user.name?.charAt(0) || 'U'}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-sm font-semibold text-slate-900">{user.name}</span>
                                            </Link>
                                            {user.role === 'admin' && (
                                                <Link
                                                    href="/admin/destinations"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="block px-4 py-3 bg-slate-900 text-white text-sm font-semibold text-center rounded-lg"
                                                >
                                                    Dashboard
                                                </Link>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            href="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 text-white text-sm font-semibold uppercase tracking-wider rounded-lg"
                                        >
                                            <FaUser size={14} />
                                            Login
                                        </Link>
                                    )}

                                    <div className="flex items-center justify-center gap-4 mt-6">
                                        <a href="#" className="text-slate-400 hover:text-pink-600 transition-colors">
                                            <FaInstagram size={20} />
                                        </a>
                                        <a href="https://www.facebook.com/share/v/1BMuExj5x5/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors">
                                            <FaFacebookF size={20} />
                                        </a>
                                    </div>
                                </div>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
                
                * {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                }
            `}</style>
        </>
    );
};

export default Navbar;