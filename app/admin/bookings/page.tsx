"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { FaCalendarCheck, FaBoxOpen, FaSpinner } from "react-icons/fa";
import ConfirmModal from "@/components/ConfirmModal";

export default function AdminBookings() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

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

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-24 gap-4 animate-pulse">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary shadow-lg shadow-primary/20"></div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Synchronizing Ledger...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Ledger <span className="text-primary">Bookings</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Monitor and process client reservations</p>
                </div>
                <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                    <div className="px-4 py-2 bg-primary/5 rounded-xl text-primary font-bold text-sm flex items-center gap-2">
                        <FaCalendarCheck />
                        <span>Real-time Status</span>
                    </div>
                </div>
            </div>

            <div className="admin-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="admin-table-header">
                            <tr>
                                <th className="px-8 py-6">Client Profile</th>
                                <th className="px-8 py-6">Vessel/Route</th>
                                <th className="px-8 py-6">Schedule</th>
                                <th className="px-8 py-6">Status Ledger</th>
                                <th className="px-8 py-6 text-right">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-40">
                                            <FaBoxOpen size={48} className="mb-4 text-gray-300" />
                                            <p className="font-bold text-sm uppercase tracking-widest text-gray-400">Vault is Empty</p>
                                            <p className="text-xs text-gray-400 mt-2">No active bookings recorded in this cycle.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                bookings.map((b: any) => (
                                    <tr key={b._id} className="admin-table-row group">
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <p className="font-black text-sm text-gray-900 leading-tight group-hover:text-primary transition-colors">{b.name || 'Anonymous'}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{b.email || 'No email registered'}</p>
                                                <p className="text-[10px] font-bold text-gray-500 mt-1 italic tracking-tighter">{b.phone || 'N/A'}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            {b.destination ? (
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase text-blue-500 tracking-tighter mb-1">Destination</span>
                                                    <span className="text-sm font-bold text-gray-800">{b.destination.title}</span>
                                                </div>
                                            ) : b.tour ? (
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase text-green-500 tracking-tighter mb-1">Tour Package</span>
                                                    <span className="text-sm font-bold text-gray-800">{b.tour.title}</span>
                                                </div>
                                            ) : b.service ? (
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase text-purple-500 tracking-tighter mb-1">Service Order</span>
                                                    <span className="text-sm font-bold text-gray-800">{b.service.title}</span>
                                                </div>
                                            ) : <span className="text-gray-400 italic text-xs">Untracked Asset</span>}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <p className="text-sm font-black text-gray-900 tabular-nums">{b.travelDate ? new Date(b.travelDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Pending Date'}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{b.travelers || '0'} Human Units</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="relative inline-block w-full">
                                                <select
                                                    value={b.status}
                                                    onChange={async (e) => {
                                                        try {
                                                            const newStatus = e.target.value;
                                                            await api.put(`/bookings/${b._id}`, { status: newStatus });
                                                            setBookings(bookings.map((booking: any) => booking._id === b._id ? { ...booking, status: newStatus } : booking));
                                                        } catch (err) {
                                                            console.error("Failed to update status", err);
                                                        }
                                                    }}
                                                    className={`w-full px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] border-none outline-none cursor-pointer appearance-none transition-all shadow-sm ${b.status === 'Confirmed' ? 'bg-green-500/10 text-green-600 border border-green-500/20' :
                                                        b.status === 'Cancelled' ? 'bg-red-500/10 text-red-600 border border-red-500/20' :
                                                            'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20'
                                                        }`}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Confirmed">Confirmed</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-current opacity-40">
                                                    <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                onClick={() => {
                                                    setItemToDelete(b._id);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                className="px-4 py-2 text-red-500 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest border border-red-200/50"
                                            >
                                                Archive
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Interaction Overhaul: Confirm Delete */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={async () => {
                    if (!itemToDelete) return;
                    try {
                        await api.delete(`/bookings/${itemToDelete}`);
                        setBookings(bookings.filter((booking: any) => booking._id !== itemToDelete));
                    } catch (err) {
                        console.error("Failed to delete booking", err);
                    } finally {
                        setItemToDelete(null);
                        setIsDeleteModalOpen(false);
                    }
                }}
                title="Archive Booking"
                message="Are you sure you want to move this booking to the archive? This will remove it from the active ledger."
                type="danger"
                confirmText="Archive Now"
            />
        </div>
    );
}
