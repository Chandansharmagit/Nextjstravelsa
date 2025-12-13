"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { FaTachometerAlt, FaUsers, FaMapMarkedAlt, FaSuitcase, FaUserTie, FaComments, FaSignOutAlt, FaCalendarCheck, FaEnvelope } from 'react-icons/fa';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else if (user.role !== 'admin') {
            router.push('/');
        }
    }, [user, router]);

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
            {/* Sidebar */}
            <aside className="w-64 bg-primary text-white h-screen fixed left-0 top-0 z-50 flex flex-col">
                <div className="p-6 flex-shrink-0">
                    <h1 className="text-2xl font-bold">
                        TRAVEL<span className="text-secondary">SANSAR</span>
                    </h1>
                    <p className="text-sm text-white/70 mt-1">Admin Panel</p>
                </div>

                <nav className="mt-6 flex-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-3 px-6 py-4 transition-colors ${isActive
                                    ? 'bg-secondary text-white'
                                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}

                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-6 py-4 text-white/80 hover:bg-white/10 hover:text-white transition-colors mt-4"
                    >
                        <FaSignOutAlt className="text-xl" />
                        <span className="font-medium">Logout</span>
                    </button>
                </nav>

                <div className="p-6 border-t border-white/10 mt-auto flex-shrink-0 bg-primary">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-white/70">Administrator</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 ml-64 p-8 w-full">
                {children}
            </div>
        </div>
    );
}
