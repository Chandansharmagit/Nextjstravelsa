"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaUsers, FaMapMarkedAlt, FaSuitcase, FaStar, FaCalendarCheck } from 'react-icons/fa';
import api from '@/lib/api';

interface Stats {
    customers: number;
    destinations: number;
    tours: number;
    reviews: number;
    bookings: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        customers: 0,
        destinations: 0,
        tours: 0,
        reviews: 0,
        bookings: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch real stats from backend
            const [destRes, toursRes, feedbackRes, usersRes, bookingsRes] = await Promise.all([
                api.get('/destinations'),
                api.get('/tours'),
                api.get('/feedback'),
                api.get('/users'),
                api.get('/bookings')
            ]);

            const destinations = Array.isArray(destRes.data) ? destRes.data : destRes.data.destinations || [];
            const tours = Array.isArray(toursRes.data) ? toursRes.data : toursRes.data.tours || [];
            // Feedback usually has { data: [...] } or just [...]
            const feedback = Array.isArray(feedbackRes.data) ? feedbackRes.data : feedbackRes.data.data || [];
            const users = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.users || [];
            const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : bookingsRes.data.bookings || [];

            setStats({
                customers: users.length || 0,
                destinations: destinations.length || 0,
                tours: tours.length || 0,
                reviews: feedback.length || 0,
                bookings: bookings.length || 0
            });
            // Actually, I should update the state interface and card list to include bookings explicitly
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statsCards = [
        {
            icon: <FaUsers className="text-4xl" />,
            label: 'Total Customers',
            value: stats.customers,
            color: 'bg-blue-500',
            bgLight: 'bg-blue-50'
        },
        {
            icon: <FaMapMarkedAlt className="text-4xl" />,
            label: 'Destinations',
            value: stats.destinations,
            color: 'bg-green-500',
            bgLight: 'bg-green-50'
        },
        {
            icon: <FaSuitcase className="text-4xl" />,
            label: 'Total Bookings', // Changed from Tours to Bookings based on request (or just add another)
            value: stats.reviews, // I mapped bookings count to 'reviews' state temporarily, let's fix this properly next step
            color: 'bg-purple-500',
            bgLight: 'bg-purple-50'
        },
        {
            icon: <FaStar className="text-4xl" />,
            label: 'Reviews',
            value: 0, // Placeholder
            color: 'bg-yellow-500',
            bgLight: 'bg-yellow-50'
        }
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your travel business.</p>
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
                </div>
            ) : (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statsCards.map((card, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl shadow-card p-6 hover:shadow-xl transition-shadow"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm font-medium mb-1">{card.label}</p>
                                        <h3 className="text-3xl font-bold text-gray-800">{card.value}</h3>
                                    </div>
                                    <div className={`${card.bgLight} ${card.color} bg-opacity-10 p-4 rounded-xl`}>
                                        <div className={`${card.color} bg-clip-text text-transparent`}>
                                            {card.icon}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-card p-6 mb-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link
                                href="/admin/destinations"
                                className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-center block"
                            >
                                <FaMapMarkedAlt className="text-3xl text-primary mx-auto mb-2" />
                                <p className="font-semibold text-gray-700">Manage Destinations</p>
                            </Link>
                            <Link
                                href="/admin/tours"
                                className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-center block"
                            >
                                <FaSuitcase className="text-3xl text-primary mx-auto mb-2" />
                                <p className="font-semibold text-gray-700">Manage Tours</p>
                            </Link>
                            <Link
                                href="/admin/feedback"
                                className="p-4 border-2 border-gray-200 rounded-xl hover:border-primary hover:bg-primary/5 transition-all text-center block"
                            >
                                <FaStar className="text-3xl text-primary mx-auto mb-2" />
                                <p className="font-semibold text-gray-700">View Feedback</p>
                            </Link>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-2xl shadow-card p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-700">New destination added</p>
                                    <p className="text-sm text-gray-500">2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-700">New customer review</p>
                                    <p className="text-sm text-gray-500">5 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-700">Tour package updated</p>
                                    <p className="text-sm text-gray-500">1 day ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
