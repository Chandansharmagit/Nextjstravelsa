"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaMapMarkedAlt, FaSuitcase, FaUsers, FaStar, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function AdminSidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    const links = [
        { name: 'Dashboard', path: '/admin', icon: <FaTachometerAlt /> },
        { name: 'Destinations', path: '/admin/destinations', icon: <FaMapMarkedAlt /> },
        { name: 'Tours', path: '/admin/tours', icon: <FaSuitcase /> },
        { name: 'Team', path: '/admin/team', icon: <FaUsers /> },
        { name: 'Customers', path: '/admin/customers', icon: <FaUsers /> },
        { name: 'Feedback', path: '/admin/feedback', icon: <FaStar /> },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <div className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0 flex flex-col z-50">
            <div className="p-6 border-b border-gray-800 flex-shrink-0">
                <Link href="/admin">
                    <h1 className="text-2xl font-bold tracking-wider">
                        TRAVEL<span className="text-secondary">SANSAR</span>
                    </h1>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Admin Panel</p>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto py-6">
                <ul className="space-y-1">
                    {links.map((link) => (
                        <li key={link.path}>
                            <Link
                                href={link.path}
                                className={`flex items-center gap-3 px-6 py-3 transition-colors ${isActive(link.path)
                                    ? 'bg-primary text-white border-r-4 border-secondary'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <span className="text-xl">{link.icon}</span>
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-6 border-t border-gray-800">
                <Link href="/" className="flex items-center gap-3 text-gray-400 hover:text-white mb-4 px-2">
                    <FaHome />
                    <span>View Website</span>
                </Link>
                <button
                    onClick={logout}
                    className="flex items-center gap-3 text-red-400 hover:text-red-300 w-full px-2"
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
