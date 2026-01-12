"use client";

import { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import Link from 'next/link';
import Pagination from '@/components/Pagination';
import api from '@/lib/api';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';

export default function ToursAdminPage() {
    const [tours, setTours] = useState<any[]>([]);
    const [filteredTours, setFilteredTours] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchTours();
    }, []);

    useEffect(() => {
        const filtered = tours.filter(tour => {
            const title = tour.title?.toLowerCase() || '';
            const dest = typeof tour.destination === 'object'
                ? (tour.destination?.title || tour.destination?.name || '').toLowerCase()
                : (tour.destination?.toLowerCase() || '');

            return title.includes(searchQuery.toLowerCase()) || dest.includes(searchQuery.toLowerCase());
        });
        setFilteredTours(filtered);
        setCurrentPage(1);
    }, [searchQuery, tours]);

    const fetchTours = async () => {
        try {
            const res = await api.get('/tours');
            // Handle different possible response structures
            const tourData = Array.isArray(res.data) ? res.data : (res.data.data || res.data.tours || []);
            setTours(tourData);
            setFilteredTours(tourData);
        } catch (error) {
            console.error('Failed to fetch tours:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await api.delete(`/tours/${itemToDelete}`);
            setTours(tours.filter(t => t._id !== itemToDelete));
        } catch (error) {
            console.error('Failed to delete:', error);
        } finally {
            setItemToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };

    const totalPages = Math.ceil(filteredTours.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTours = filteredTours.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Tours <span className="text-secondary">Packages</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage and refine your tour experiences</p>
                </div>
                <Link
                    href="/admin/tours/create"
                    className="admin-btn-secondary flex items-center gap-3"
                >
                    <FaPlus size={14} /> <span>Add Tour</span>
                </Link>
            </div>

            {/* Search Bar */}
            <div className="admin-card p-8">
                <div className="relative group">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search tours by title or destination..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="admin-input-premium w-full pl-14 pr-6 py-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary/30 focus:bg-white bg-gray-50/50 transition-all duration-300 font-medium"
                    />
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                        Registered Tours: <span className="text-primary">{filteredTours.length}</span>
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 italic font-mono uppercase tracking-tighter">Live Database Access</p>
                </div>
            </div>

            {/* Table Section */}
            <div className="admin-card overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary shadow-lg shadow-primary/20"></div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Loading Fleet...</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="admin-table-header">
                                    <tr>
                                        <th className="px-8 py-6">Tour Identity</th>
                                        <th className="px-8 py-6 text-center">Duration</th>
                                        <th className="px-8 py-6">Pricing</th>
                                        <th className="px-8 py-6 text-right">Portfolio Options</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentTours.map((tour) => (
                                        <tr key={tour._id} className="admin-table-row group">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-black text-gray-900 group-hover:text-primary transition-colors">{tour.title}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                                        {typeof tour.destination === 'object' ? (tour.destination?.title || tour.destination?.name || 'N/A') : (tour.destination || 'N/A')}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-600">
                                                    {tour.duration} Days
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-black text-gray-900 tabular-nums">NRP {tour.price}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Per Person</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-3 text-blue-500 bg-blue-50 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                                                        <FaEye size={14} />
                                                    </button>
                                                    <Link href={`/admin/tours/edit/${tour._id}`}>
                                                        <button className="p-3 text-green-500 bg-green-50 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-sm">
                                                            <FaEdit size={14} />
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteClick(tour._id)}
                                                        className="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="p-6 border-t border-gray-200">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </>
                )}

                {/* Interaction Overhaul: Confirm Delete */}
                <ConfirmModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    title="Delete Tour Package"
                    message="Are you sure you want to remove this tour from the portfolio? This action is permanent."
                    type="danger"
                    confirmText="Archive Tour"
                />
            </div>
        </div>
    );
}
