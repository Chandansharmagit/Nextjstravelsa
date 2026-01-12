"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaUsers, FaMapMarkedAlt, FaSuitcase, FaStar, FaCalendarCheck, FaArrowUp, FaPaperPlane } from 'react-icons/fa';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import api from '@/lib/api';

interface Stats {
    customers: number;
    destinations: number;
    tours: number;
    reviews: number;
    bookings: number;
    leads: number;
}

interface RecentBooking {
    _id: string;
    user: { name: string };
    destination?: { title: string };
    tour?: { title: string };
    createdAt: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        customers: 0,
        destinations: 0,
        tours: 0,
        reviews: 0,
        bookings: 0,
        leads: 0
    });
    const [loading, setLoading] = useState(true);
    const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
    const [bookingTrends, setBookingTrends] = useState<any[]>([]);
    const [popularDestinations, setPopularDestinations] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch all data in parallel
            const [destRes, toursRes, feedbackRes, usersRes, bookingsRes, leadsRes] = await Promise.all([
                api.get('/destinations'),
                api.get('/tours'),
                api.get('/feedback'),
                api.get('/users'),
                api.get('/bookings'),
                api.get('/leads')
            ]);

            const destinations = Array.isArray(destRes.data) ? destRes.data : destRes.data.destinations || [];
            const tours = Array.isArray(toursRes.data) ? toursRes.data : toursRes.data.tours || [];
            const feedback = Array.isArray(feedbackRes.data) ? feedbackRes.data : feedbackRes.data.data || [];
            const users = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.users || [];
            const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : bookingsRes.data.bookings || [];
            const leads = leadsRes.data.success ? leadsRes.data.data : (Array.isArray(leadsRes.data) ? leadsRes.data : []);

            setStats({
                customers: users.length || 0,
                destinations: destinations.length || 0,
                tours: tours.length || 0,
                reviews: feedback.length || 0,
                bookings: bookings.length || 0,
                leads: leads.length || 0
            });

            // Process recent bookings (latest 5)
            const sortedBookings = [...bookings]
                .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5);
            setRecentBookings(sortedBookings);

            // Calculate booking trends (last 7 days)
            const trends = calculateBookingTrends(bookings);
            setBookingTrends(trends);

            // Calculate popular destinations
            const popular = calculatePopularDestinations(bookings, destinations);
            setPopularDestinations(popular);

        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateBookingTrends = (bookings: any[]) => {
        const last7Days = [...Array(7)].map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toISOString().split('T')[0];
        });

        return last7Days.map(date => {
            const count = bookings.filter((b: any) => {
                const bookingDate = new Date(b.createdAt).toISOString().split('T')[0];
                return bookingDate === date;
            }).length;

            return {
                date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                bookings: count
            };
        });
    };

    const calculatePopularDestinations = (bookings: any[], destinations: any[]) => {
        const destCounts: { [key: string]: { name: string; count: number } } = {};

        bookings.forEach((booking: any) => {
            const destId = booking.destination?._id || booking.destination;
            if (destId) {
                if (!destCounts[destId]) {
                    const dest = destinations.find(d => d._id === destId);
                    destCounts[destId] = {
                        name: dest?.title || dest?.name || 'Unknown',
                        count: 0
                    };
                }
                destCounts[destId].count++;
            }
        });

        return Object.values(destCounts)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    };

    const getTimeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    const statsCards = [
        {
            icon: <FaUsers className="text-4xl" />,
            label: 'Total Customers',
            value: stats.customers,
            color: 'bg-blue-500',
            bgLight: 'bg-blue-50',
            trend: '+12%'
        },
        {
            icon: <FaMapMarkedAlt className="text-4xl" />,
            label: 'Destinations',
            value: stats.destinations,
            color: 'bg-green-500',
            bgLight: 'bg-green-50',
            trend: '+8%'
        },
        {
            icon: <FaCalendarCheck className="text-4xl" />,
            label: 'Total Bookings',
            value: stats.bookings,
            color: 'bg-purple-500',
            bgLight: 'bg-purple-50',
            trend: '+23%'
        },
        {
            icon: <FaStar className="text-4xl" />,
            label: 'Customer Reviews',
            value: stats.reviews,
            color: 'bg-yellow-500',
            bgLight: 'bg-yellow-50',
        },
        {
            icon: <FaPaperPlane className="text-4xl" />,
            label: 'Plan My Trip',
            value: stats.leads,
            color: 'bg-secondary',
            bgLight: 'bg-orange-50',
            trend: '+10%'
        }
    ];

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-black text-gray-900 tracking-tight"
                    >
                        Dashboard <span className="text-primary">Overview</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-500 mt-2 font-medium"
                    >
                        Welcome back, Admin. Here's your business performance today.
                    </motion.p>
                </div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100"
                >
                    <div className="px-4 py-2 bg-primary/5 rounded-xl text-primary font-bold text-sm">
                        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                </motion.div>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {statsCards.map((card, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                                className="relative group cursor-pointer"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-[2rem] shadow-xl shadow-gray-200/50 -z-10 transition-all group-hover:shadow-2xl group-hover:shadow-primary/10" />
                                <div className="p-8 h-full flex flex-col justify-between">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className={`${card.bgLight} ${card.color.replace('bg-', 'text-')} bg-opacity-10 p-4 rounded-2xl transition-transform group-hover:scale-110 duration-300`}>
                                            <div className="text-2xl">{card.icon}</div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] uppercase font-black tracking-widest text-gray-400">Monthly</span>
                                            <span className="text-xs font-bold text-green-500 mt-1 flex items-center gap-1">
                                                <FaArrowUp className="text-[10px]" />
                                                {card.trend}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">{card.label}</p>
                                        <h3 className="text-4xl font-black text-gray-900 tabular-nums tracking-tighter">{card.value}</h3>
                                    </div>
                                    <div className="mt-4 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '70%' }}
                                            transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                                            className={`h-full ${card.color}`}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Booking Trends Chart */}
                    <div className="admin-card p-10">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Booking Trends</h2>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Last 7 Days Performance</p>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={bookingTrends}>
                                <defs>
                                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#9ca3af"
                                    style={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <YAxis
                                    stroke="#9ca3af"
                                    style={{ fontSize: '12px', fontWeight: 'bold' }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="bookings"
                                    stroke="#14b8a6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorBookings)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Charts and Activity Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Popular Destinations Chart */}
                        <div className="admin-card p-10">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Popular Destinations</h2>
                            </div>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={popularDestinations} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis type="number" stroke="#9ca3af" style={{ fontSize: '12px', fontWeight: 'bold' }} />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        stroke="#9ca3af"
                                        style={{ fontSize: '12px', fontWeight: 'bold' }}
                                        width={120}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '12px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Bar dataKey="count" fill="#14b8a6" radius={[0, 8, 8, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-[#0f172a] rounded-[2.5rem] p-10 shadow-2xl text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[80px] -mr-16 -mt-16" />
                            <h2 className="text-2xl font-black mb-8 tracking-tight relative z-10">Recent Bookings</h2>
                            <div className="space-y-6 relative z-10">
                                {recentBookings.length === 0 ? (
                                    <p className="text-white/40 text-sm italic">No recent bookings</p>
                                ) : (
                                    recentBookings.map((booking, i) => (
                                        <div key={booking._id} className="flex gap-4 group">
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 bg-primary rounded-full z-10" />
                                                {i !== recentBookings.length - 1 && <div className="w-[2px] h-full bg-white/10 mt-2" />}
                                            </div>
                                            <div className="-mt-1.5">
                                                <p className="font-bold text-sm text-white group-hover:text-primary transition-colors cursor-default">
                                                    {booking.user?.name || 'Anonymous'} booked {booking.destination?.title || booking.tour?.title || 'a tour'}
                                                </p>
                                                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-1">
                                                    {getTimeAgo(booking.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="admin-card p-10">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Quick Actions</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {[
                                { icon: <FaMapMarkedAlt />, label: 'Manage Destinations', path: '/admin/destinations', color: 'text-blue-500', bg: 'bg-blue-50' },
                                { icon: <FaSuitcase />, label: 'Manage Tours', path: '/admin/tours', color: 'text-orange-500', bg: 'bg-orange-50' },
                                { icon: <FaStar />, label: 'View Feedback', path: '/admin/feedback', color: 'text-yellow-500', bg: 'bg-yellow-50' }
                            ].map((action, i) => (
                                <Link
                                    key={i}
                                    href={action.path}
                                    className="group p-8 rounded-3xl bg-gray-50 hover:bg-white border-2 border-transparent hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 text-center"
                                >
                                    <div className={`w-16 h-16 ${action.bg} ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm`}>
                                        <span className="text-2xl">{action.icon}</span>
                                    </div>
                                    <p className="font-black text-gray-800 text-sm tracking-tight leading-tight">{action.label}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
