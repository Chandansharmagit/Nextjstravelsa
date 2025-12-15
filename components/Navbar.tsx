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
            subLinks: [
                { name: "Luxury Tours", path: "/experiences?type=Luxury" },
                { name: "Wellness & Yoga", path: "/experiences?type=Wellness" },
                { name: "Family Holidays", path: "/experiences?type=Family" },
                { name: "Honeymoon", path: "/experiences?type=Honeymoon" },
            ]
        },
        { id: 5, link: "contact", path: "/contact" },
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
            className={`sticky top-0 w-full z-40 transition-all duration-300 ease-in-out font-sans border-b border-gray-100 ${scrolled
                ? "bg-white/95 backdrop-blur-md shadow-md py-1"
                : "bg-white py-2 shadow-sm"
                }`}
        >
            <div className="flex justify-between items-center w-full px-6 xl:px-24 max-w-[1440px] mx-auto h-14 md:h-16">
                {/* Logo Section */}
                <Link href="/" className="relative z-50 flex items-center">
                    <div className="relative h-10 w-32 md:h-12 md:w-40 transition-all duration-300 transform hover:scale-105">
                        <Image
                            src="/logo-new.png"
                            alt="TravelSansar Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </Link>

                {/* Desktop Menu */}
                <ul className="hidden lg:flex items-center gap-8">
                    {links.map(({ id, link, path, subLinks }) => (
                        <li key={id} className="relative group">
                            <Link href={path} className="flex items-center gap-1 py-4">
                                <span className="capitalize text-[15px] font-medium tracking-wide text-gray-700 transition-colors duration-300 group-hover:text-primary">
                                    {link}
                                </span>
                                {subLinks && <FaChevronDown className="text-xs text-gray-500 group-hover:text-primary transition-transform duration-300 group-hover:rotate-180" />}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full bg-primary" />
                            </Link>

                            {/* Dropdown Menu */}
                            {subLinks && (
                                <div className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-xl overflow-hidden invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 border border-gray-100">
                                    <ul>
                                        {subLinks.map((subItem, index) => (
                                            <li key={index}>
                                                <Link
                                                    href={subItem.path}
                                                    className="block px-6 py-3 text-sm text-gray-600 hover:bg-orange-50 hover:text-primary transition-colors border-b border-gray-50 last:border-none"
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
                            {/* Profile Link */}
                            <Link href="/profile" className="flex items-center gap-3 group cursor-pointer">
                                {user.image ? (
                                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-primary transition-colors relative">
                                        <Image src={user.image} alt={user.name} fill className="object-cover" />
                                    </div>
                                ) : (
                                    <FaUserCircle className="text-3xl text-gray-400 group-hover:text-primary transition-colors" />

                                )}
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm text-gray-800 leading-tight group-hover:text-primary transition-colors">
                                        {user.name?.split(' ')[0] || "User"}
                                    </span>
                                    <span className="text-[10px] text-gray-500 font-medium">My Account</span>
                                </div>
                            </Link>

                            {user.role === 'admin' && (
                                <Link href="/admin">
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-gray-800 text-white rounded uppercase tracking-wider hover:bg-black transition">
                                        Admin
                                    </span>
                                </Link>
                            )}

                            <button
                                onClick={logout}
                                className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wide ml-2"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link href="/login">
                                <span className="font-semibold text-sm text-gray-600 hover:text-primary transition-colors">
                                    Log In
                                </span>
                            </Link>
                            <Link href="/register">
                                <button suppressHydrationWarning className="px-6 py-2.5 rounded-full bg-primary text-white text-sm font-bold hover:bg-orange-600 transition duration-300 shadow-lg shadow-orange-500/20 transform hover:-translate-y-0.5 hover:shadow-orange-500/40">
                                    Book Now
                                </button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Icon */}
                <div onClick={toggleNav} className="cursor-pointer z-50 lg:hidden text-gray-700 p-2 -mr-2 rounded-full hover:bg-gray-100 transition">
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
                            className="fixed inset-0 w-full h-screen bg-white z-40 flex flex-col pt-24 px-6 font-sans overflow-y-auto"
                        >
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10"></div>

                            <div className="flex flex-col h-full pb-10">
                                <ul className="flex flex-col gap-4 w-full">
                                    {links.map(({ id, link, path, subLinks }, i) => (
                                        <motion.li
                                            key={id}
                                            custom={i}
                                            initial="hidden"
                                            animate="visible"
                                            variants={menuItemVariants}
                                            className="border-b border-gray-50 pb-2"
                                        >
                                            <div className="flex flex-col">
                                                <div className="flex justify-between items-center">
                                                    <Link
                                                        onClick={() => !subLinks && setNav(false)}
                                                        href={path}
                                                        className="text-2xl font-bold text-gray-800 active:text-primary transition-colors capitalize py-2 flex-1"
                                                    >
                                                        {link}
                                                    </Link>
                                                    {subLinks && (
                                                        <div
                                                            onClick={(e) => { e.preventDefault(); toggleMobileSubMenu(id); }}
                                                            className="p-3 bg-gray-50 rounded-full cursor-pointer"
                                                        >
                                                            <FaChevronDown className={`text-gray-500 transition-transform duration-300 ${mobileSubMenuOpen === id ? 'rotate-180' : ''}`} />
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
                                                            className="overflow-hidden bg-gray-50 rounded-lg mt-2"
                                                        >
                                                            {subLinks.map((sub, idx) => (
                                                                <li key={idx}>
                                                                    <Link
                                                                        onClick={() => setNav(false)}
                                                                        href={sub.path}
                                                                        className="block px-6 py-3 text-gray-600 font-medium hover:text-primary"
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
                                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary relative">
                                                        <Image src={user.image} alt={user.name} fill className="object-cover" />
                                                    </div>
                                                ) : (
                                                    <FaUserCircle className="text-5xl text-gray-300" />
                                                )}
                                                <div>
                                                    <div className="text-xl font-bold text-gray-800">{user.name}</div>
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
                                                    <button className="w-full py-3 rounded-lg bg-gray-900 text-white font-bold transition-all">
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
                                                <button suppressHydrationWarning className="w-full py-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transform hover:-translate-y-1 transition-all text-lg">
                                                    Book Now
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
