"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaTimes, FaFacebookF, FaInstagram, FaUser, FaSignOutAlt } from "react-icons/fa";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

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
                bg-white/95 backdrop-blur-sm
                border-b border-slate-200
                transition-all duration-300
                ${scrolled ? 'shadow-md' : 'shadow-sm'}
            `}>
                <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
                    {/* Main Flex Container: Logo | Links | Actions */}
                    <div className="flex items-center justify-between h-[75px]">

                        {/* LEFT: Logo */}
                        <div className="flex items-center">
                            <Link href="/" className="relative h-[60px] w-40 block">
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
                        <nav className="hidden lg:flex items-center justify-center gap-8">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    className={`
                                        relative text-sm font-semibold uppercase tracking-wide
                                        transition-colors duration-200
                                        ${isActive(item.path)
                                            ? 'text-slate-900'
                                            : 'text-slate-600 hover:text-slate-900'
                                        }
                                    `}
                                >
                                    <span className="flex items-center gap-2">
                                        {item.name}
                                        {item.name === "Expedition Planner" && (
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
                                            </span>
                                        )}
                                    </span>
                                    {isActive(item.path) && (
                                        <motion.div
                                            layoutId="activeNavItem"
                                            className="absolute -bottom-1 left-0 right-0 h-[2px] bg-slate-900"
                                            transition={{ duration: 0.3 }}
                                        />
                                    )}
                                </Link>
                            ))}
                        </nav>

                        {/* RIGHT: Social Icons + Login/User Profile */}
                        <div className="flex items-center gap-4">
                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="lg:hidden w-10 h-10 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
                                aria-label="Toggle menu"
                            >
                                {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                            </button>

                            {/* Social Icons (Desktop) */}
                            <div className="hidden lg:flex items-center gap-3">
                                <a
                                    href="#"
                                    className="w-9 h-9 flex items-center justify-center rounded-full text-slate-600 hover:text-pink-600 hover:bg-pink-50 transition-all"
                                    aria-label="Instagram"
                                >
                                    <FaInstagram size={16} />
                                </a>
                                <a
                                    href="https://www.facebook.com/share/v/1BMuExj5x5/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 flex items-center justify-center rounded-full text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
                                    aria-label="Facebook"
                                >
                                    <FaFacebookF size={16} />
                                </a>
                            </div>

                            {/* User Section */}
                            {/* User Section with Premium Hover Popup */}
                            {user ? (
                                <div
                                    className="hidden lg:block relative group z-50"
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
                                    className="hidden lg:flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
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
                            className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
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
