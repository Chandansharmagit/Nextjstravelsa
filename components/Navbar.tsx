"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";
import { FaBars, FaTimes, FaFacebookF, FaInstagram, FaGlobeAmericas } from "react-icons/fa";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    const menuItems = [
        { name: "Destinations", path: "/destinations" },
        { name: "Tours", path: "/tours" },
        { name: "Experiences", path: "/experiences" },
        { name: "FAQ", path: "/faq" },
        { name: "Contact", path: "/contact" },
        { name: "About", path: "/about" },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-700 pointer-events-none px-6 lg:px-12 pt-3 lg:pt-4">
            <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">

                {/* Left Section: Logo Pill */}
                <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className={`
                        flex items-center pointer-events-auto
                        bg-white/40 backdrop-blur-2xl border border-white/40
                        px-6 py-4 rounded-[32px] shadow-[0_15px_35px_-5px_rgba(212,175,55,0.1)]
                        transition-all duration-500 hover:shadow-[0_20px_45px_-5px_rgba(212,175,55,0.15)]
                    `}
                >
                    <Link href="/" className="relative h-7 w-28 shrink-0 active:scale-95 transition-transform">
                        <Image
                            src="/logo-new.png"
                            alt="Travel Sansar"
                            fill
                            className="object-contain"
                            priority
                        />
                    </Link>
                </motion.div>

                {/* Center Section: Navigation Capsule */}
                <motion.nav
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={`
                        hidden lg:flex items-center gap-1 pointer-events-auto
                        bg-white/40 backdrop-blur-2xl border border-white/40
                        px-2 py-2 rounded-full shadow-[0_15px_35px_-5px_rgba(0,0,0,0.05)]
                        transition-all duration-500
                        ${scrolled ? "scale-95 translate-y-[-5%]" : ""}
                    `}
                >
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.path}
                            className={`
                                relative px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 rounded-full h-font
                                ${isActive(item.path)
                                    ? "text-[#4A4036] bg-[#D4AF37]/10"
                                    : "text-[#8D7B68] hover:text-[#4A4036] hover:bg-white/30"
                                }
                            `}
                        >
                            {item.name}
                            {isActive(item.path) && (
                                <motion.div
                                    layoutId="studio_active"
                                    className="absolute inset-0 border border-[#D4AF37]/20 rounded-full"
                                />
                            )}
                        </Link>
                    ))}
                </motion.nav>

                {/* Right Section: Socials & Auth */}
                <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex items-center gap-3 pointer-events-auto"
                >
                    {/* Socials Group */}
                    <div className="hidden sm:flex items-center gap-2 bg-white/40 backdrop-blur-2xl border border-white/40 p-2 rounded-full shadow-lg">
                        <a href="#" className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center text-[#8D7B68] hover:text-white hover:bg-[#D4AF37] transition-all duration-500 shadow-sm">
                            <FaInstagram size={14} />
                        </a>
                        <a href="#" className="w-10 h-10 rounded-full bg-white/40 flex items-center justify-center text-[#8D7B68] hover:text-white hover:bg-[#D4AF37] transition-all duration-500 shadow-sm">
                            <FaFacebookF size={14} />
                        </a>
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden w-12 h-12 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-2xl border border-white/40 text-[#8D7B68] hover:text-[#4A4036] transition-all shadow-lg"
                    >
                        {mobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
                    </button>

                    {/* User Node */}
                    {user ? (
                        <div className="flex items-center gap-2">
                            {user.role === 'admin' && (
                                <Link href="/admin/destinations" className="px-5 py-2.5 rounded-full bg-[#D4AF37] text-white text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-[#B8962E] transition-all shadow-lg shadow-[#D4AF37]/20">
                                    Dashboard
                                </Link>
                            )}
                            <Link href="/profile" className="flex items-center bg-white/40 backdrop-blur-2xl border border-white/40 p-1.5 rounded-full shadow-lg hover:border-[#D4AF37]/30 transition-all">
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-white shadow-inner">
                                    {user.image ? <Image src={user.image} alt={user.name} width={40} height={40} className="object-cover" /> : <div className="w-full h-full bg-[#F5F2ED] flex items-center justify-center text-[#D4AF37]"><FaBars /></div>}
                                </div>
                            </Link>
                        </div>
                    ) : (
                        <Link href="/login" className="px-7 py-3.5 rounded-full bg-[#4A4036] text-[#F5F2ED] text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-[#D4AF37] transition-all duration-500 shadow-xl">
                            Entry
                        </Link>
                    )}
                </motion.div>
            </div>

            {/* Mobile Studio Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute inset-x-6 top-[120px] pointer-events-auto lg:hidden"
                    >
                        <div className="bg-[#F5F2ED]/95 backdrop-blur-3xl border border-white rounded-[40px] p-10 shadow-3xl overflow-hidden relative">
                            {/* Decorative Grain/Mesh */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                            <nav className="flex flex-col gap-3">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`
                                            px-8 py-5 rounded-[24px] text-[15px] font-bold uppercase tracking-[0.4em] transition-all h-font
                                            ${isActive(item.path) ? "bg-[#D4AF37]/10 text-[#4A4036]" : "text-[#8D7B68] hover:text-[#4A4036] hover:bg-white/50"}
                                        `}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>

                            <div className="mt-8 pt-8 border-t border-[#8D7B68]/10 flex justify-between items-center">
                                <div className="flex gap-4">
                                    <FaInstagram className="text-[#8D7B68]/40 hover:text-[#D4AF37] cursor-pointer" />
                                    <FaFacebookF className="text-[#8D7B68]/40 hover:text-[#D4AF37] cursor-pointer" />
                                </div>
                                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8D7B68]/30 font-bold">Studio Travel Sansar</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&display=swap');
                .h-font { font-family: 'Outfit', sans-serif; }
                body { background-color: #FDFCFB !important; } /* Soft neutral studio background base */
            `}</style>
        </header>
    );
};

export default Navbar;
