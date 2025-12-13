"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FaCalendarCheck, FaEnvelope, FaCommentAlt, FaSpinner, FaBoxOpen } from "react-icons/fa";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function AdminDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'bookings' | 'contacts' | 'feedbacks'>('bookings');

    // Data states
    const [bookings, setBookings] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!user || user.role !== 'admin') {
                router.push('/');
            } else {
                fetchData();
            }
        }
    }, [user, loading, activeTab]);

    const fetchData = async () => {
        setIsLoadingData(true);
        try {
            const endpoint =
                activeTab === 'bookings' ? '/bookings' :
                    activeTab === 'contacts' ? '/contact' : '/feedback';

            const res = await api.get(endpoint);

            if (res.status === 200) {
                const data = res.data;
                if (activeTab === 'bookings') setBookings(data);
                else if (activeTab === 'contacts') setContacts(data);
                else setFeedbacks(data);
            }
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setIsLoadingData(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><FaSpinner className="animate-spin text-4xl text-secondary" /></div>;
    if (!user || user.role !== 'admin') return null;

    return (
        <section className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
            <div className="max-w-[1440px] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                        <p className="text-gray-500 text-sm mt-1">Manage all your travel data in one place.</p>
                    </div>

                    <div className="flex bg-white rounded-lg shadow-sm border border-gray-100 p-1">
                        <button
                            onClick={() => setActiveTab('bookings')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-md font-medium transition-all ${activeTab === 'bookings'
                                    ? 'bg-secondary text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <FaCalendarCheck />
                            Booking Form
                        </button>
                        <button
                            onClick={() => setActiveTab('contacts')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-md font-medium transition-all ${activeTab === 'contacts'
                                    ? 'bg-secondary text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <FaEnvelope />
                            Contact
                        </button>
                        <button
                            onClick={() => setActiveTab('feedbacks')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-md font-medium transition-all ${activeTab === 'feedbacks'
                                    ? 'bg-secondary text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <FaCommentAlt />
                            Feedback
                        </button>
                    </div>
                </div>

                {isLoadingData ? (
                    <div className="bg-white p-20 rounded-xl shadow-sm flex flex-col items-center justify-center border border-gray-100">
                        <FaSpinner className="animate-spin text-4xl text-secondary mb-4" />
                        <p className="text-gray-500">Loading data...</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 min-h-[400px]">
                        {activeTab === 'bookings' && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 font-bold text-gray-700 uppercase text-xs tracking-wider">ID</th>
                                            <th className="px-6 py-4 font-bold text-gray-700 uppercase text-xs tracking-wider">User</th>
                                            <th className="px-6 py-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Destination</th>
                                            <th className="px-6 py-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Details</th>
                                            <th className="px-6 py-4 font-bold text-gray-700 uppercase text-xs tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {bookings.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 flex flex-col items-center justify-center w-full">
                                                    <FaBoxOpen size={40} className="mb-3 opacity-20" />
                                                    No bookings found yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            bookings.map((b: any) => (
                                                <tr key={b._id} className="hover:bg-gray-50/50 transition">
                                                    <td className="px-6 py-4 text-xs text-gray-400 font-mono w-24 truncate">{b._id.substring(0, 8)}...</td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-gray-800">{b.name}</div>
                                                        <div className="text-xs text-gray-500">{b.email}</div>
                                                        <div className="text-xs text-gray-400">{b.phone}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {b.destination ? (
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                                                                {b.destination.title}
                                                            </span>
                                                        ) : b.tour ? (
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold border border-green-100">
                                                                {b.tour.title}
                                                            </span>
                                                        ) : <span className="text-gray-400">N/A</span>}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-medium text-gray-700">{b.travelDate ? new Date(b.travelDate).toLocaleDateString() : 'Date N/A'}</div>
                                                        <div className="text-xs text-gray-500">{b.travelers} Travelers</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${b.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                                b.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {b.status || 'Pending'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {activeTab === 'contacts' && (
                            <div className="divide-y divide-gray-100">
                                {contacts.length === 0 ? (
                                    <div className="px-6 py-12 text-center text-gray-400 flex flex-col items-center justify-center">
                                        <FaEnvelope size={40} className="mb-3 opacity-20" />
                                        No contact messages yet.
                                    </div>
                                ) : (
                                    contacts.map((c: any) => (
                                        <div key={c._id} className="p-6 hover:bg-gray-50 transition cursor-pointer group">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold">
                                                        {c.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-gray-800 group-hover:text-secondary transition">{c.subject || "No Subject"}</h3>
                                                        <p className="text-xs text-gray-500">{c.name} &lt;{c.email}&gt;</p>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{new Date(c.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="pl-13 ml-13 mt-3">
                                                <p className="text-gray-600 bg-gray-50 p-4 rounded-xl text-sm border border-gray-100 leading-relaxed group-hover:bg-white group-hover:shadow-sm transition">{c.message}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {activeTab === 'feedbacks' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                                {feedbacks.length === 0 ? (
                                    <div className="col-span-full text-center text-gray-400 py-12 flex flex-col items-center justify-center">
                                        <FaCommentAlt size={40} className="mb-3 opacity-20" />
                                        No customer feedback yet.
                                    </div>
                                ) : (
                                    feedbacks.map((f: any) => (
                                        <div key={f._id} className="border border-gray-100 p-6 rounded-xl shadow-sm bg-white hover:shadow-md transition hover:-translate-y-1">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-1 text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaCommentAlt key={i} className={i < f.rating ? "" : "text-gray-200"} size={12} />
                                                    ))}
                                                    <span className="text-gray-400 text-xs ml-2 font-mono">({f.rating}/5)</span>
                                                </div>
                                                <span className="text-xs text-gray-300">{new Date(f.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-gray-700 italic mb-6 text-sm leading-relaxed">"{f.message}"</p>
                                            <div className="flex items-center gap-3 border-t border-gray-50 pt-4 mt-auto">
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-teal-800 text-white flex items-center justify-center text-xs font-bold">
                                                    {f.name.charAt(0)}
                                                </div>
                                                <div className="text-xs">
                                                    <div className="font-bold text-gray-800">{f.name}</div>
                                                    <div className="text-gray-400">{f.email}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
