"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { 
    FaBars, FaTimes, FaFacebookF, FaInstagram, FaUser, FaSignOutAlt, 
    FaSearch, FaArrowRight, FaMapMarkerAlt, FaCompass, FaMountain, FaVihara,
    FaSuitcase, FaTicketAlt, FaShieldAlt, FaPhoneAlt, FaWhatsapp, FaChevronRight
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
                fixed top-10 left-0 right-0 z-[2001]
                bg-white/95 backdrop-blur-md border-b border-slate-200/60
                transition-all duration-300
                ${scrolled ? 'shadow-lg py-1' : 'shadow-sm py-2'}
            `}>
                <div className="max-w-[1400px] mx-auto px-3 sm:px-6 md:px-8 lg:px-12">
                    {/* Main Flex Container: Logo | Links | Search | Actions */}
                    <div className="flex items-center justify-between h-[60px] sm:h-[70px] gap-2">

                        {/* LEFT: Logo */}
                        <div className="flex items-center shrink-0">
                            <Link href="/" className="relative h-[42px] sm:h-[55px] w-28 sm:w-36 block shrink-0">
                                <Image
                                    src="/logo-new.png"
                                    alt="Travel Sansar"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </Link>
                        </div>

                        {/* CENTER: Navigation Links Bar (Desktop Pill Container) */}
                        <div className="hidden xl:flex items-center justify-center flex-1 px-4">
                            <nav className="inline-flex items-center bg-slate-100/80 border border-slate-200/80 rounded-full p-1.5 shadow-xs font-sans">
                                {menuItems.map((item) => {
                                    const active = isActive(item.path);
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.path}
                                            className={`
                                                relative text-[12px] font-bold tracking-wide transition-all duration-200 whitespace-nowrap rounded-full px-5 py-2
                                                ${active
                                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                                                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
                                                }
                                            `}
                                        >
                                            <span className="flex items-center gap-1.5">
                                                {item.name}
                                                {item.name === "Expedition Planner" && !active && (
                                                    <span className="relative flex h-1.5 w-1.5">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-600"></span>
                                                    </span>
                                                )}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* RIGHT: Search Bar + Desktop User Action Pills */}
                        <div className="hidden xl:flex items-center justify-end gap-2.5 shrink-0 ml-auto font-sans">
                            {/* Desktop Search Trigger */}
                            <button
                                onClick={() => setShowSearchDropdown(true)}
                                className="group flex items-center gap-2.5 h-10 px-4 bg-slate-100 hover:bg-slate-200/80 rounded-full transition-all duration-300 border border-slate-200/60"
                            >
                                <FaSearch className="text-slate-400 group-hover:text-indigo-600 transition-colors" size={13} />
                                <span className="text-[12px] font-bold text-slate-500 group-hover:text-slate-900 transition-colors">Search...</span>
                                <kbd className="hidden xl:inline-flex items-center px-1.5 py-0.5 text-[9px] font-black text-slate-400 bg-white border border-slate-200 rounded-md shadow-2xs">
                                    ⌘ K
                                </kbd>
                            </button>

                            {/* Desktop User Dropdown */}
                            {user ? (
                                <div
                                    className="relative group z-50"
                                    onMouseEnter={() => setShowProfileMenu(true)}
                                    onMouseLeave={() => setShowProfileMenu(false)}
                                >
                                    {/* User Avatar */}
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

                                    {/* Profile Dropdown Popup */}
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
                                                    <div className="relative p-6 bg-slate-900 text-white overflow-hidden">
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
                                <div className="flex items-center gap-2">
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-full transition-all border border-slate-200/80 shadow-2xs"
                                    >
                                        <FaUser size={12} className="text-slate-600" />
                                        <span>Sign In</span>
                                    </Link>

                                    <Link
                                        href="/expedition-planner"
                                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-full transition-all shadow-md shadow-indigo-500/25 hover:scale-105 active:scale-95"
                                    >
                                        <span>Client Portal</span>
                                        <FaArrowRight size={11} />
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Header Actions (Clean Non-Colliding Layout) */}
                        <div className="flex xl:hidden items-center gap-1.5 sm:gap-2 shrink-0 ml-auto font-sans">
                            <button
                                onClick={() => setShowSearchDropdown(true)}
                                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors border border-slate-200/80 shadow-2xs shrink-0"
                                aria-label="Open search"
                            >
                                <FaSearch size={13} />
                            </button>
                            <Link
                                href="/expedition-planner"
                                className="hidden xs:inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] sm:text-[11px] font-black rounded-full transition-all shadow-sm shrink-0 whitespace-nowrap"
                            >
                                <span>Plan Trip</span>
                            </Link>
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors border border-slate-200/80 shrink-0"
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* ROOT LEVEL SEARCH MODAL SYSTEM (Works effortlessly on Mobile & Desktop) */}
            <AnimatePresence>
                {showSearchDropdown && (
                    <>
                        {/* Deep Blur Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowSearchDropdown(false)}
                            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xl z-[99998]"
                        />
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.94, y: 10 }}
                            transition={{ type: "spring", damping: 25, stiffness: 280 }}
                            className="fixed inset-x-3 top-4 bottom-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 w-auto sm:w-[92vw] sm:max-w-[800px] max-h-[92vh] bg-white rounded-3xl sm:rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden flex flex-col z-[99999]"
                        >
                            {/* Search Input Header */}
                            <div className="relative p-4 sm:p-8 border-b border-slate-100 bg-slate-50/50">
                                <form onSubmit={handleSearchSubmit} className="relative flex items-center group">
                                    <FaSearch className="absolute left-3 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Search destinations, treks..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-20 py-2.5 text-base sm:text-2xl font-bold sm:font-black text-slate-800 placeholder:text-slate-300 focus:outline-none bg-transparent"
                                    />
                                    <div className="absolute right-0 flex items-center gap-2">
                                        {isSearching && (
                                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                        )}
                                        <button 
                                            type="button"
                                            onClick={() => setShowSearchDropdown(false)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-600 transition-colors"
                                            aria-label="Close search"
                                        >
                                            <FaTimes size={15} />
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Categorized Results Content */}
                            <div className="p-3 sm:p-6 overflow-y-auto custom-scrollbar flex-1">
                                <div className="space-y-6 sm:space-y-8">
                                    {['destinations', 'tours', 'services'].map((category) => {
                                        const resultsArr = (searchResults as any)[category] || [];
                                        if (resultsArr.length === 0) return null;

                                        return (
                                            <div key={category}>
                                                <div className="flex items-center justify-between mb-3 px-2">
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">
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
                                                                className="flex items-center gap-3 sm:gap-5 p-3 sm:p-4 rounded-2xl sm:rounded-3xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group/res"
                                                            >
                                                                <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 shadow-sm border border-slate-50 bg-slate-100">
                                                                    {displayImage ? (
                                                                        <Image
                                                                            src={displayImage}
                                                                            alt={item.title}
                                                                            fill
                                                                            className="object-cover transition-transform duration-500 group-hover/res:scale-110"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                            {category === 'services' ? <FaVihara size={20} /> : <FaCompass size={20} />}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                                                                        <h5 className="text-sm sm:text-base font-bold sm:font-black text-slate-800 line-clamp-1 group-hover/res:text-indigo-600 transition-colors leading-none">{item.title}</h5>
                                                                        {category === 'services' && <span className="px-2 py-0.5 bg-amber-50 text-[8px] font-black uppercase text-amber-600 rounded-md">Essential</span>}
                                                                    </div>
                                                                    <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
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
                                                                <FaArrowRight size={12} className="text-slate-300 group-hover/res:translate-x-1 group-hover/res:text-indigo-600 transition-all shrink-0" />
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {(!searchResults.destinations.length && !searchResults.tours.length && !searchResults.services.length) && (
                                        <div className="space-y-6">
                                            {searchQuery.length > 1 ? (
                                                <div className="py-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                                                        <FaSearch size={16} className="text-slate-300" />
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-500">No sanctuaries found for "{searchQuery}"</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 px-2">Trending Searches</h4>
                                                    <div className="grid grid-cols-2 gap-2.5 pb-2">
                                                        {['Kathmandu', 'Pokhara', 'Everest', 'Chitwan'].map(city => (
                                                            <button 
                                                                key={city}
                                                                onClick={() => setSearchQuery(city)}
                                                                className="flex items-center gap-3 p-3.5 bg-slate-50 hover:bg-indigo-50/50 rounded-2xl transition-all text-left group/sug border border-slate-100"
                                                            >
                                                                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shadow-sm text-slate-400 group-hover/sug:text-indigo-600">
                                                                    <FaCompass size={13} />
                                                                </div>
                                                                <span className="text-xs font-bold text-slate-600 group-hover/sug:text-indigo-700">{city}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* CATEGORY: QUICK INTELLIGENCE */}
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3 px-2">Quick Intelligence</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            <Link href="/destinations" onClick={() => setShowSearchDropdown(false)} className="p-3.5 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all flex items-center gap-3.5 group/qi">
                                                <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                                                    <FaMountain size={16} />
                                                </div>
                                                <div>
                                                    <h6 className="text-xs font-black text-slate-800">All Peaks</h6>
                                                    <p className="text-[10px] font-bold text-slate-400">Explore expeditions</p>
                                                </div>
                                            </Link>
                                            <Link href="/tours" onClick={() => setShowSearchDropdown(false)} className="p-3.5 rounded-2xl border border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all flex items-center gap-3.5 group/qi">
                                                <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
                                                    <FaVihara size={16} />
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

                            {/* Shortcuts / Advance Search Footer */}
                            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
                                <button
                                    onClick={() => setShowSearchDropdown(false)}
                                    className="text-[11px] font-bold text-slate-400 hover:text-slate-700 transition-colors uppercase tracking-wider"
                                >
                                    Close Window
                                </button>
                                <Link 
                                    href="/search" 
                                    onClick={() => setShowSearchDropdown(false)}
                                    className="text-[10px] sm:text-[11px] font-black text-indigo-600 uppercase tracking-widest hover:translate-x-1 transition-transform flex items-center gap-1.5"
                                >
                                    Advance Search <FaArrowRight size={10} />
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Mobile Menu Drawer Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[99990] xl:hidden"
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 260 }}
                            className="fixed top-0 right-0 bottom-0 w-[310px] sm:w-[360px] bg-slate-900 text-white shadow-2xl z-[99991] xl:hidden flex flex-col justify-between overflow-y-auto no-scrollbar border-l border-slate-800"
                        >
                            <div>
                                {/* Menu Header */}
                                <div className="flex items-center justify-between p-5 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-10 w-32">
                                            <Image
                                                src="/logo-new.png"
                                                alt="Travel Sansar"
                                                fill
                                                className="object-contain brightness-125"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                                        aria-label="Close menu"
                                    >
                                        <FaTimes size={16} />
                                    </button>
                                </div>

                                {/* Mobile Search Box inside Drawer */}
                                <div className="p-4 border-b border-slate-800/60 bg-slate-950/30">
                                    <form onSubmit={handleSearchSubmit} className="relative">
                                        <input
                                            type="text"
                                            placeholder="Search destinations, treks..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700/80 rounded-2xl text-xs font-bold text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400 outline-none transition-all"
                                        />
                                        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                                    </form>
                                </div>

                                {/* Navigation Links with Icons */}
                                <nav className="p-4 space-y-1">
                                    {menuItems.map((item) => {
                                        const active = isActive(item.path);
                                        const getIcon = (name: string) => {
                                            switch (name) {
                                                case "Destinations": return <FaMountain className={active ? "text-amber-400" : "text-slate-400"} size={14} />;
                                                case "Tours": return <FaCompass className={active ? "text-amber-400" : "text-slate-400"} size={14} />;
                                                case "Expedition Planner": return <FaTicketAlt className={active ? "text-amber-400" : "text-slate-400"} size={14} />;
                                                case "Experiences": return <FaSuitcase className={active ? "text-amber-400" : "text-slate-400"} size={14} />;
                                                case "FAQ": return <FaShieldAlt className={active ? "text-amber-400" : "text-slate-400"} size={14} />;
                                                case "Contact": return <FaPhoneAlt className={active ? "text-amber-400" : "text-slate-400"} size={14} />;
                                                case "About": return <FaUser className={active ? "text-amber-400" : "text-slate-400"} size={14} />;
                                                default: return <FaCompass className="text-slate-400" size={14} />;
                                            }
                                        };

                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.path}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={`
                                                    flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all
                                                    ${active
                                                        ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
                                                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                                                    }
                                                `}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${active ? 'bg-amber-400/20' : 'bg-slate-800'}`}>
                                                        {getIcon(item.name)}
                                                    </div>
                                                    <span>{item.name}</span>
                                                </div>
                                                {item.name === "Expedition Planner" && (
                                                    <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider rounded-full animate-pulse">
                                                        HOT
                                                    </span>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </nav>

                                {/* Trending Sanctuaries Quick Chips */}
                                <div className="px-4 py-3 border-t border-slate-800/60">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2.5 block">
                                        Popular Sanctuaries
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {['Everest', 'Pokhara', 'Annapurna', 'Chitwan'].map((place) => (
                                            <button
                                                key={place}
                                                onClick={() => {
                                                    setSearchQuery(place);
                                                    router.push(`/search?query=${encodeURIComponent(place)}`);
                                                    setMobileMenuOpen(false);
                                                }}
                                                className="px-3 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-all border border-slate-700/60"
                                            >
                                                {place}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* User & Direct Contact Footer */}
                            <div className="p-4 border-t border-slate-800/80 bg-slate-950/80">
                                {user ? (
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-amber-400/40 shrink-0">
                                                {user.image ? (
                                                    <Image src={user.image} alt={user.name} width={40} height={40} className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                                        {user.name?.charAt(0) || 'U'}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-xs font-bold text-white truncate">{user.name}</h4>
                                                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-2">
                                            <Link
                                                href="/profile"
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="py-2.5 text-center text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all"
                                            >
                                                My Profile
                                            </Link>
                                            <button
                                                onClick={() => { logout(); setMobileMenuOpen(false); }}
                                                className="py-2.5 text-center text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl border border-rose-500/20 transition-all"
                                            >
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                        <Link
                                            href="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-2xl border border-slate-700 transition-all"
                                        >
                                            <FaUser size={12} className="text-amber-400" />
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/expedition-planner"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black rounded-2xl shadow-md shadow-indigo-600/30 transition-all"
                                        >
                                            <span>Client Portal</span>
                                            <FaChevronRight size={9} />
                                        </Link>
                                    </div>
                                )}

                                {/* WhatsApp & Social Bar */}
                                <div className="flex items-center justify-between pt-2">
                                    <a
                                        href="https://wa.me/9779855051795?text=Namaste%20Travel%20Sansar!%20I%20have%20an%20expedition%20inquiry."
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold"
                                    >
                                        <FaWhatsapp size={14} />
                                        <span>WhatsApp Support</span>
                                    </a>
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <a href="#" className="hover:text-pink-400 transition-colors">
                                            <FaInstagram size={16} />
                                        </a>
                                        <a href="https://www.facebook.com/share/v/1BMuExj5x5/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                                            <FaFacebookF size={16} />
                                        </a>
                                    </div>
                                </div>
                            </div>
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