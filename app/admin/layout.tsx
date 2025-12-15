"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaTachometerAlt, FaUsers, FaMapMarkedAlt, FaSuitcase, FaUserTie, FaComments, FaSignOutAlt, FaCalendarCheck, FaEnvelope, FaBars, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else if (user.role !== 'admin') {
            router.push('/');
        }
    }, [user, router]);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Handle responsive behavior
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarCollapsed(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
                    <p className="text-gray-600">Verifying access...</p>
                </div>
            </div>
        );
    }

    const menuItems = [
        { icon: <FaTachometerAlt />, label: 'Dashboard', path: '/admin' },
        { icon: <FaCalendarCheck />, label: 'Bookings', path: '/admin/bookings' },
        { icon: <FaEnvelope />, label: 'Messages', path: '/admin/messages' },
        { icon: <FaUsers />, label: 'Customers', path: '/admin/customers' },
        { icon: <FaMapMarkedAlt />, label: 'Destinations', path: '/admin/destinations' },
        { icon: <FaSuitcase />, label: 'Tours', path: '/admin/tours' },
        { icon: <FaUserTie />, label: 'Team', path: '/admin/team' },
        { icon: <FaComments />, label: 'Feedback', path: '/admin/feedback' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-[60] p-3 bg-primary text-white rounded-lg shadow-lg"
            >
                {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isSidebarCollapsed ? '80px' : '256px',
                    x: isMobileMenuOpen ? 0 : window.innerWidth < 1024 ? '-100%' : 0
                }}
                transition={{ duration: 0.3 }}
                className={`bg-primary text-white h-screen fixed left-0 top-0 z-50 flex flex-col shadow-xl ${isMobileMenuOpen ? 'translate-x-0' : 'lg:translate-x-0 -translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className={`p-6 flex-shrink-0 border-b border-white/10 ${isSidebarCollapsed ? 'px-4' : ''}`}>
                    {isSidebarCollapsed ? (
                        <div className="flex justify-center">
                            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center font-bold text-lg">
                                T
                            </div>
                        </div>
                    ) : (
                        <Link href="/admin">
                            <h1 className="text-2xl font-bold">
                                TRAVEL<span className="text-secondary">SANSAR</span>
                            </h1>
                            <p className="text-sm text-white/70 mt-1">Admin Panel</p>
                        </Link>
                    )}
                </div>

                {/* Navigation */}
                <nav className="mt-6 flex-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center px-4' : 'px-6'} py-4 transition-all ${isActive
                                        ? 'bg-secondary text-white'
                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                    }`}
                                title={isSidebarCollapsed ? item.label : undefined}
                            >
                                <span className="text-xl flex-shrink-0">{item.icon}</span>
                                {!isSidebarCollapsed && <span className="font-medium">{item.label}</span>}
                            </Link>
                        );
                    })}

                    <button
                        onClick={logout}
                        className={`w-full flex items-center gap-3 ${isSidebarCollapsed ? 'justify-center px-4' : 'px-6'} py-4 text-white/80 hover:bg-white/10 hover:text-white transition-all mt-4`}
                        title={isSidebarCollapsed ? 'Logout' : undefined}
                    >
                        <FaSignOutAlt className="text-xl flex-shrink-0" />
                        {!isSidebarCollapsed && <span className="font-medium">Logout</span>}
                    </button>
                </nav>

                {/* User Profile */}
                {!isSidebarCollapsed && (
                    <div className="p-6 border-t border-white/10 mt-auto flex-shrink-0 bg-primary">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold flex-shrink-0">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-medium text-sm truncate">{user.name}</p>
                                <p className="text-xs text-white/70">Administrator</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Collapse Toggle Button (Desktop Only) */}
                <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-secondary text-white rounded-full items-center justify-center hover:bg-orange-600 transition-colors shadow-lg"
                >
                    {isSidebarCollapsed ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
                </button>
            </motion.aside>

            {/* Main Content */}
            <motion.div
                initial={false}
                animate={{
                    marginLeft: window.innerWidth >= 1024 ? (isSidebarCollapsed ? '80px' : '256px') : '0px'
                }}
                transition={{ duration: 0.3 }}
                className="flex-1 p-4 md:p-8 w-full lg:pt-8 pt-20"
            >
                {children}
            </motion.div>
        </div>
    );
}
