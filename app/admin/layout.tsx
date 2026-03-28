"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaTachometerAlt, FaUsers, FaMapMarkedAlt, FaSuitcase, FaUserTie, FaComments, FaSignOutAlt, FaCalendarCheck, FaEnvelope, FaBars, FaTimes, FaChevronLeft, FaChevronRight, FaCog, FaChartLine, FaBriefcase, FaFileAlt, FaPaperPlane, FaShieldAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/stats');
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            }
        };

        if (user?.role === 'admin') {
            fetchStats();
            const interval = setInterval(fetchStats, 30000); // Refresh every 30s
            return () => clearInterval(interval);
        }
    }, [user]);

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
        { icon: <FaCalendarCheck />, label: 'Bookings', path: '/admin/bookings', count: stats?.pendingBookingsCount },
        { icon: <FaEnvelope />, label: 'Messages', path: '/admin/messages', count: stats?.unreadMessagesCount },
        { icon: <FaUsers />, label: 'Customers', path: '/admin/customers', count: stats?.newCustomersCount },
        { icon: <FaMapMarkedAlt />, label: 'Destinations', path: '/admin/destinations' },
        { icon: <FaSuitcase />, label: 'Tours', path: '/admin/tours' },
        { icon: <FaBriefcase />, label: 'Jobs', path: '/admin/jobs' },
        { icon: <FaFileAlt />, label: 'Applications', path: '/admin/applications', count: stats?.pendingApplicationsCount },
        { icon: <FaCog />, label: 'Services', path: '/admin/services' },
        { icon: <FaUserTie />, label: 'Team', path: '/admin/team' },
        { icon: <FaComments />, label: 'Feedback', path: '/admin/feedback', count: stats?.recentFeedbackCount },
        { icon: <FaPaperPlane />, label: 'Plan My Trip', path: '/admin/leads', count: stats?.leadsInquiryCount },
        { icon: <FaPaperPlane />, label: 'Newsletter', path: '/admin/newsletter' },
        { icon: <FaShieldAlt />, label: 'Super Admin', path: '/admin/superadmin' },
    ];

    return (
        <div className="flex min-h-screen bg-[#f8fafc]">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-[70] p-3 bg-primary text-white rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all"
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
                        className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    width: isSidebarCollapsed ? '88px' : '280px',
                    x: isMobileMenuOpen ? 0 : typeof window !== 'undefined' && window.innerWidth < 1024 ? -300 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`bg-[#0f172a] text-white h-[calc(100vh-24px)] fixed left-[12px] top-[12px] z-[60] flex flex-col shadow-2xl overflow-hidden border border-white/5 rounded-[12px] ${isMobileMenuOpen ? 'translate-x-0' : 'lg:translate-x-0 -translate-x-full'
                    }`}
            >
                {/* Glassmorphic Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

                {/* Header */}
                <div className={`p-8 flex-shrink-0 border-b border-white/5 relative ${isSidebarCollapsed ? 'px-6' : ''}`}>
                    {isSidebarCollapsed ? (
                        <div className="flex justify-center">
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                className="w-12 h-12 bg-gradient-to-br from-secondary to-orange-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg"
                            >
                                T
                            </motion.div>
                        </div>
                    ) : (
                        <Link href="/admin" className="block group">
                            <motion.h1
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-2xl font-black tracking-tighter"
                            >
                                TRAVEL<span className="text-secondary group-hover:text-orange-400 transition-colors">SANSR</span>
                            </motion.h1>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1 font-bold">Professional Admin</p>
                        </Link>
                    )}
                </div>

                {/* Navigation */}
                <nav className="mt-8 flex-1 overflow-y-auto px-4 custom-scrollbar">
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    className={`group relative flex items-center gap-3 rounded-xl transition-all duration-300 ${isSidebarCollapsed ? 'justify-center py-4' : 'px-4 py-3'} ${isActive
                                        ? 'bg-secondary shadow-lg shadow-secondary/20 text-white'
                                        : 'text-white/50 hover:bg-white/5 hover:text-white'
                                        }`}
                                    title={isSidebarCollapsed ? item.label : undefined}
                                >
                                    <span className={`text-xl flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                        {item.icon}
                                    </span>
                                    {!isSidebarCollapsed && (
                                        <>
                                            <span className="font-semibold text-sm tracking-wide">{item.label}</span>
                                            {/* Badge for expanded sidebar */}
                                            {item.count ? (
                                                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md min-w-[20px] text-center">
                                                    {item.count > 99 ? '99+' : item.count}
                                                </span>
                                            ) : null}
                                        </>
                                    )}

                                    {/* Small dot badge for collapsed sidebar */}
                                    {isSidebarCollapsed && item.count ? (
                                        <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0f172a]" />
                                    ) : null}

                                    {isActive && !isSidebarCollapsed && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                                        />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5">
                        <button
                            onClick={logout}
                            className={`w-full group flex items-center gap-3 rounded-xl transition-all duration-300 ${isSidebarCollapsed ? 'justify-center py-4' : 'px-4 py-3'} text-white/40 hover:bg-red-500/10 hover:text-red-400`}
                            title={isSidebarCollapsed ? 'Logout' : undefined}
                        >
                            <FaSignOutAlt className="text-xl flex-shrink-0 transition-transform group-hover:-translate-x-1" />
                            {!isSidebarCollapsed && <span className="font-semibold text-sm tracking-wide">Sign Out</span>}
                        </button>
                    </div>
                </nav>

                {/* User Profile */}
                {!isSidebarCollapsed && (
                    <div className="p-6 m-4 mt-auto rounded-xl bg-white/5 border border-white/5 backdrop-blur-md flex-shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full border-2 border-secondary/50 p-0.5">
                                    <div className="w-full h-full rounded-full bg-secondary flex items-center justify-center font-bold text-white text-lg shadow-inner">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f172a]" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-bold text-sm tracking-tight truncate">{user.name}</p>
                                <p className="text-[10px] uppercase font-heavy tracking-widest text-secondary">Admin</p>
                            </div>
                        </div>
                    </div>
                )}


                {/* Collapse Toggle Button (Desktop Only) */}
                <button
                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    className="hidden lg:flex absolute -right-3 top-24 w-8 h-8 bg-secondary text-white rounded-xl items-center justify-center hover:bg-orange-600 hover:scale-110 active:scale-90 transition-all shadow-xl z-[70] border-2 border-white/10"
                >
                    {isSidebarCollapsed ? <FaChevronRight size={14} /> : <FaChevronLeft size={14} />}
                </button>
            </motion.aside>

            {/* Main Content */}
            <motion.div
                initial={false}
                animate={{
                    marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 ? (isSidebarCollapsed ? '100px' : '292px') : '0px'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="flex-1 w-full flex flex-col h-screen overflow-hidden"
            >
                {/* Top Glass Header */}
                <header className="flex-shrink-0 mt-[12px] mx-[12px] w-[calc(100%-24px)] px-8 h-20 flex items-center justify-between border border-gray-200 bg-white/70 backdrop-blur-xl rounded-[12px] z-[40]">
                    <div>
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
                            Overview / <span className="text-primary">{pathname.split('/').pop() || 'Dashboard'}</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                            <FaChartLine size={20} />
                        </button>
                        <div className="h-6 w-[1px] bg-gray-200 mx-2" />
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-gray-800">{user.name}</p>
                                <p className="text-[10px] text-gray-500">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 flex flex-col px-[12px] pb-[12px] mt-[12px] overflow-hidden">
                    <div className="flex-1 bg-white/70 backdrop-blur-xl rounded-[12px] border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
                            {children}
                        </div>
                    </div>
                </main>
            </motion.div>
        </div>
    );
}
