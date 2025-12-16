"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { FaCalendarCheck, FaBoxOpen, FaSpinner } from "react-icons/fa";

export default function AdminBookings() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get('/bookings');
                setBookings(res.data);
            } catch (error) {
                console.error("Failed to fetch bookings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    if (loading) return <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-4xl text-secondary" /></div>;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Bookings</h1>
                <p className="text-gray-500">Manage all travel bookings.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-bold text-gray-700 uppercase text-xs">User Information</th>
                                <th className="px-6 py-4 font-bold text-gray-700 uppercase text-xs">Booking Item</th>
                                <th className="px-6 py-4 font-bold text-gray-700 uppercase text-xs">Travel Details</th>
                                <th className="px-6 py-4 font-bold text-gray-700 uppercase text-xs">Status</th>
                                <th className="px-6 py-4 font-bold text-gray-700 uppercase text-xs text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 flex flex-col items-center">
                                        <FaBoxOpen size={40} className="mb-3 opacity-20" />
                                        No bookings found.
                                    </td>
                                </tr>
                            ) : (
                                bookings.map((b: any) => (
                                    <tr key={b._id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-800">{b.name || 'N/A'}</div>
                                            <div className="text-xs text-gray-500">{b.email || 'N/A'}</div>
                                            <div className="text-xs text-gray-400">{b.phone || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {b.destination ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                                                    Dest: {b.destination.title}
                                                </span>
                                            ) : b.tour ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold border border-green-100">
                                                    Tour: {b.tour.title}
                                                </span>
                                            ) : b.service ? (
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                                                    Service: {b.service.title}
                                                </span>
                                            ) : <span className="text-gray-400">N/A</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-700">{b.travelDate ? new Date(b.travelDate).toLocaleDateString() : 'Date N/A'}</div>
                                            <div className="text-xs text-gray-500">{b.travelers || '?'} Travelers</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={b.status}
                                                onChange={async (e) => {
                                                    try {
                                                        const newStatus = e.target.value;
                                                        await api.put(`/bookings/${b._id}`, { status: newStatus });
                                                        setBookings(bookings.map((booking: any) => booking._id === b._id ? { ...booking, status: newStatus } : booking));
                                                    } catch (err) {
                                                        alert("Failed to update status");
                                                    }
                                                }}
                                                className={`px-3 py-1 rounded-full text-xs font-bold border-none outline-none cursor-pointer ${b.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                    b.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Confirmed">Confirmed</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={async () => {
                                                    if (confirm("Are you sure you want to delete this booking?")) {
                                                        try {
                                                            await api.delete(`/bookings/${b._id}`);
                                                            setBookings(bookings.filter((booking: any) => booking._id !== b._id));
                                                        } catch (err) {
                                                            alert("Failed to delete booking");
                                                        }
                                                    }
                                                }}
                                                className="text-red-500 hover:text-red-700 font-medium text-xs border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-md transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
