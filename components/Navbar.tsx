"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaTimes, FaUserCircle, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
    const { user, logout } = useAuth();
    const [nav, setNav] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const toggleNav = () => setNav(!nav);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const links = [
        { id: 1, link: "home", path: "/" },
        {
            id: 2,
            link: "destinations",
            path: "/destinations",
            subLinks: [
                { name: "All Destinations", path: "/destinations" },
                { name: "Nepal", path: "/destinations?search=Nepal" },
                { name: "Bhutan", path: "/destinations?search=Bhutan" },
                { name: "Tibet", path: "/destinations?search=Tibet" },
            ]
        },
        {
            id: 3,
            link: "tours",
            path: "/tours",
            subLinks: [
                { name: "Trekking", path: "/tours?category=Trekking" },
                { name: "Sightseeing", path: "/tours?category=Sightseeing" },
                { name: "Adventure", path: "/tours?category=Adventure" },
                { name: "Jungle Safari", path: "/tours?category=Safari" },
            ]
        },
        {
            id: 4,
            link: "experiences",
            path: "/experiences",
        },
        { id: 5, link: "faq", path: "/faq" },
        { id: 6, link: "contact", path: "/contact" },
    ];

    const [mobileSubMenuOpen, setMobileSubMenuOpen] = useState<number | null>(null);

    const toggleMobileSubMenu = (id: number) => {
        if (mobileSubMenuOpen === id) {
            setMobileSubMenuOpen(null);
        } else {
            setMobileSubMenuOpen(id);
        }
    };

    // Animation variants for mobile menu items
    const menuItemVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: { delay: i * 0.1, duration: 0.3 }
        })
    };

    return (
        <nav
            className={`sticky top-0 w-full z-40 transition-all duration-300 ease-in-out font-sans ${scrolled
                ? "bg-white/90 backdrop-blur-sm shadow-md py-2" // Reduced blur, simpler shadow
                : "bg-white/95 backdrop-blur-sm py-3 shadow-sm border-b border-christmas-gold/20"
                }`}
        >



            <div className="flex justify-between items-center w-full px-6 xl:px-24 max-w-[1440px] mx-auto h-14 md:h-16 relative z-40">
                {/* Logo Section */}
                <Link href="/" className="relative z-50 flex items-center group">
                    {/* Holly Decoration */}
                    <div className="absolute -left-6 top-0 text-2xl transform -rotate-12 opacity-0 group-hover:opacity-100 transition-all duration-500 scale-0 group-hover:scale-110">
                        🌿
                    </div>
                    <div className="relative h-10 w-32 md:h-12 md:w-40 transition-all duration-300 transform group-hover:scale-105">
                        <Image
                            src="/logo-new.png"
                            alt="TravelSansar Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                        {/* Animated Badge */}
                        <div className="absolute -top-3 -right-3 bg-gradient-to-br from-red-500 to-red-700 text-white text-[9px] font-extrabold px-2 py-1 rounded-full animate-bounce shadow-lg border border-white">
                            XMAS 🎄
                        </div>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden lg:flex items-center gap-8">
                    {links.map(({ id, link, path, subLinks }) => (
                        <li key={id} className="relative group">
                            <Link href={path} className="flex items-center gap-1 py-4">
                                <span className="capitalize text-[15px] font-bold tracking-wide text-gray-700 transition-colors duration-300 group-hover:text-christmas-red drop-shadow-sm">
                                    {link}
                                </span>
                                {subLinks && <FaChevronDown className="text-xs text-christmas-gold group-hover:text-christmas-red transition-transform duration-300 group-hover:rotate-180" />}
                                {/* Animated Underline - Gold */}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-gradient-to-r from-christmas-gold to-yellow-300 shadow-[0_0_10px_rgba(255,215,0,0.6)]" />
                            </Link>

                            {/* Dropdown Menu */}
                            {subLinks && (
                                <div className="absolute top-full left-0 w-48 bg-white/90 backdrop-blur-xl shadow-xl rounded-xl overflow-hidden invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 border border-white/50 ring-1 ring-christmas-gold/20">
                                    <ul>
                                        {subLinks.map((subItem, index) => (
                                            <li key={index}>
                                                <Link
                                                    href={subItem.path}
                                                    className="block px-6 py-3 text-sm text-gray-700 font-medium hover:bg-red-50 hover:text-christmas-red transition-colors border-b border-gray-100 last:border-none"
                                                >
                                                    {subItem.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Desktop Auth Section */}
                <div className="hidden lg:flex items-center gap-5">
                    {user ? (
                        <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                            {/* Profile Link with Santa Hat */}
                            <Link href="/profile" className="flex items-center gap-3 group cursor-pointer relative">
                                {/* Santa Hat Decoration */}
                                <div className="absolute -top-4 -left-3 text-2xl transform -rotate-12 filter drop-shadow-md z-50 pointer-events-none">
                                    🎅
                                </div>
                                {user.image ? (
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-christmas-gold group-hover:border-christmas-red transition-colors relative shadow-md">
                                        <Image src={user.image} alt={user.name} fill className="object-cover" />
                                    </div>
                                ) : (
                                    <FaUserCircle className="text-4xl text-gray-300 group-hover:text-christmas-red transition-colors" />

                                )}
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm text-gray-800 leading-tight group-hover:text-christmas-red transition-colors">
                                        {user.name?.split(' ')[0] || "User"}
                                    </span>
                                    <span className="text-[10px] text-christmas-gold font-bold uppercase tracking-wider">My Account</span>
                                </div>
                            </Link>

                            {user.role === 'admin' && (
                                <Link href="/admin">
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-800 text-white rounded uppercase tracking-wider hover:bg-black transition border border-gray-700 shadow-sm">
                                        Admin
                                    </span>
                                </Link>
                            )}

                            <button
                                onClick={logout}
                                className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-wide ml-2 bg-red-50 px-2 py-1 rounded hover:bg-red-100"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/login">
                                <span className="font-bold text-sm text-gray-600 hover:text-christmas-red transition-colors">
                                    Log In
                                </span>
                            </Link>
                            <Link href="/register">
                                {/* Candy Cane Button */}
                                <button suppressHydrationWarning className="px-7 py-2.5 rounded-full text-white text-sm font-extrabold shadow-lg shadow-red-500/30 transform hover:-translate-y-0.5 hover:shadow-red-600/50 border-2 border-white transition-all duration-300 overflow-hidden relative group">
                                    <span className="absolute inset-0 w-full h-full bg-[repeating-linear-gradient(45deg,#D32F2F,#D32F2F_10px,#ff7f7f_10px,#ff7f7f_20px)] animate-candy-stripe group-hover:opacity-100 opacity-90"></span>
                                    <span className="relative z-10 flex items-center gap-2 text-shadow">
                                        BOOK NOW <span className="text-lg">🎁</span>
                                    </span>
                                </button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Icon */}
                <div onClick={toggleNav} className="cursor-pointer z-50 lg:hidden text-christmas-red p-2 -mr-2 rounded-full hover:bg-red-50 transition drop-shadow-sm">
                    {nav ? <FaTimes size={24} /> : <FaBars size={24} />}
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {nav && (
                        <motion.div
                            initial={{ opacity: 0, x: "100%" }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: "100%" }}
                            transition={{ type: "spring", stiffness: 80, damping: 15 }}
                            className="fixed inset-0 w-full h-screen bg-white/95 backdrop-blur-xl z-40 flex flex-col pt-24 px-6 font-sans overflow-y-auto"
                        >
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10 animate-pulse"></div>

                            <div className="flex flex-col h-full pb-10">
                                <ul className="flex flex-col gap-4 w-full">
                                    {links.map(({ id, link, path, subLinks }, i) => (
                                        <motion.li
                                            key={id}
                                            custom={i}
                                            initial="hidden"
                                            animate="visible"
                                            variants={menuItemVariants}
                                            className="border-b border-gray-100 pb-2"
                                        >
                                            <div className="flex flex-col">
                                                <div className="flex justify-between items-center">
                                                    <Link
                                                        onClick={() => !subLinks && setNav(false)}
                                                        href={path}
                                                        className="text-2xl font-bold text-gray-800 active:text-christmas-red transition-colors capitalize py-2 flex-1"
                                                    >
                                                        {link}
                                                    </Link>
                                                    {subLinks && (
                                                        <div
                                                            onClick={(e) => { e.preventDefault(); toggleMobileSubMenu(id); }}
                                                            className="p-3 bg-gray-50 rounded-full cursor-pointer text-christmas-red"
                                                        >
                                                            <FaChevronDown className={`transition-transform duration-300 ${mobileSubMenuOpen === id ? 'rotate-180' : ''}`} />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Mobile Submenu */}
                                                <AnimatePresence>
                                                    {subLinks && mobileSubMenuOpen === id && (
                                                        <motion.ul
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="overflow-hidden bg-red-50/50 rounded-lg mt-2 border border-red-100"
                                                        >
                                                            {subLinks.map((sub, idx) => (
                                                                <li key={idx}>
                                                                    <Link
                                                                        onClick={() => setNav(false)}
                                                                        href={sub.path}
                                                                        className="block px-6 py-3 text-gray-700 font-medium hover:text-christmas-red"
                                                                    >
                                                                        {sub.name}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </motion.ul>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.li>
                                    ))}
                                </ul>

                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    {user ? (
                                        <div className="flex flex-col gap-6">
                                            <div className="flex items-center gap-4">
                                                {user.image ? (
                                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-christmas-gold relative shadow-lg">
                                                        <Image src={user.image} alt={user.name} fill className="object-cover" />
                                                    </div>
                                                ) : (
                                                    <FaUserCircle className="text-5xl text-gray-300" />
                                                )}
                                                <div>
                                                    <div className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                                        {user.name} <span>🎅</span>
                                                    </div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <Link onClick={() => setNav(false)} href="/profile">
                                                    <button className="w-full py-3 rounded-lg border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all">
                                                        Profile
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => { logout(); setNav(false); }}
                                                    className="w-full py-3 rounded-lg border border-red-100 text-red-500 font-bold hover:bg-red-50 transition-all"
                                                >
                                                    Log Out
                                                </button>
                                            </div>

                                            {user.role === 'admin' && (
                                                <Link onClick={() => setNav(false)} href="/admin">
                                                    <button className="w-full py-3 rounded-lg bg-gray-900 text-white font-bold transition-all shadow-lg">
                                                        Admin Dashboard
                                                    </button>
                                                </Link>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            <Link onClick={() => setNav(false)} href="/login" className="w-full">
                                                <button className="w-full py-4 rounded-xl border border-gray-200 text-gray-800 font-bold hover:border-gray-300 transition-all text-lg">
                                                    Log In
                                                </button>
                                            </Link>
                                            <Link onClick={() => setNav(false)} href="/register" className="w-full">
                                                {/* Mobile Candy Cane Button */}
                                                <button suppressHydrationWarning className="w-full py-4 rounded-xl text-white font-bold shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transform hover:-translate-y-1 transition-all text-lg overflow-hidden relative">
                                                    <span className="absolute inset-0 w-full h-full bg-[repeating-linear-gradient(45deg,#D32F2F,#D32F2F_10px,#ff7f7f_10px,#ff7f7f_20px)] animate-candy-stripe opacity-90"></span>
                                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                                        BOOK NOW 🎁
                                                    </span>
                                                </button>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};

export default Navbar;
