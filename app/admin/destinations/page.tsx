"use client";

import { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import Link from 'next/link';
import Pagination from '@/components/Pagination';
import Image from 'next/image';
import api from '@/lib/api';
import Modal from '@/components/Modal';
import ConfirmModal from '@/components/ConfirmModal';

export default function DestinationsAdminPage() {
    const [destinations, setDestinations] = useState<any[]>([]);
    const [filteredDestinations, setFilteredDestinations] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchDestinations();
    }, []);

    useEffect(() => {
        const filtered = destinations.filter(dest =>
            dest.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dest.location?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredDestinations(filtered);
        setCurrentPage(1);
    }, [searchQuery, destinations]);

    const fetchDestinations = async () => {
        try {
            const res = await api.get('/destinations');
            const data = Array.isArray(res.data) ? res.data : res.data.destinations || [];
            setDestinations(data);
            setFilteredDestinations(data);
        } catch (error) {
            console.error('Failed to fetch destinations:', error);
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
            await api.delete(`/destinations/${itemToDelete}`);
            setDestinations(destinations.filter(d => d._id !== itemToDelete));
        } catch (error) {
            console.error('Failed to delete:', error);
        } finally {
            setItemToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };

    const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentDestinations = filteredDestinations.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Destinations <span className="text-primary">Management</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Create and oversee your travel locations</p>
                </div>
                <button
                    onClick={() => setIsLimitModalOpen(true)}
                    className="admin-btn-secondary flex items-center gap-3"
                >
                    <FaPlus size={14} /> <span>Add Destination</span>
                </button>
            </div>

            {/* Search Bar */}
            <div className="admin-card p-8">
                <div className="relative group">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search destinations by title or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="admin-input-premium w-full pl-14 pr-6 py-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary/30 focus:bg-white bg-gray-50/50 transition-all duration-300 font-medium"
                    />
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                        Results Found: <span className="text-primary">{filteredDestinations.length}</span>
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 italic">Showing {currentDestinations.length} on this page</p>
                </div>
            </div>

            {/* Table Section */}
            <div className="admin-card overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary shadow-lg shadow-primary/20"></div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Updating Base...</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="admin-table-header">
                                    <tr>
                                        <th className="px-8 py-6">Identity</th>
                                        <th className="px-8 py-6">Details</th>
                                        <th className="px-8 py-6">Status</th>
                                        <th className="px-8 py-6 text-right">Options</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentDestinations.map((dest) => {
                                        const image0 = dest.images?.[0];
                                        const imageSrc = (typeof image0 === 'string' ? image0 : image0?.path || image0?.url) || dest.image || '/placeholder.jpg';
                                        return (
                                            <tr key={dest._id} className="admin-table-row group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 shadow-sm group-hover:scale-105 transition-transform duration-300">
                                                            <Image
                                                                src={imageSrc}
                                                                alt={dest.title}
                                                                fill
                                                                className="object-cover"
                                                                sizes="64px"
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-gray-900 group-hover:text-primary transition-colors">{dest.title}</p>
                                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{dest.location || 'Unknown'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-xs font-bold text-gray-600 flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                            {dest.bestTimeToVisit || 'All Season'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${dest.featured
                                                        ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                                                        : 'bg-gray-100 text-gray-500 border border-gray-200'
                                                        }`}>
                                                        {dest.featured ? 'Featured' : 'Standard'}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-3 text-blue-500 bg-blue-50 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                                                            <FaEye size={14} />
                                                        </button>
                                                        <Link href={`/admin/destinations/edit/${dest._id}`}>
                                                            <button className="p-3 text-green-500 bg-green-50 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-sm">
                                                                <FaEdit size={14} />
                                                            </button>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteClick(dest._id)}
                                                            className="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                        >
                                                            <FaTrash size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
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
                {/* Limit Warning Modal */}
                <Modal
                    isOpen={isLimitModalOpen}
                    onClose={() => setIsLimitModalOpen(false)}
                    title="Storage Limit Exceeded"
                >
                    <div className="text-center py-6">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                            <FaPlus className="text-4xl transform rotate-45" />
                        </div>
                        <p className="text-lg text-gray-700 leading-relaxed mb-8">
                            Your package of Cloudinary image saved exceed limit.
                            Please subscribe to another plan to enable uploading.
                        </p>
                        <button
                            onClick={() => setIsLimitModalOpen(false)}
                            className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-teal-700 transition shadow-lg"
                        >
                            Got it
                        </button>
                    </div>
                </Modal>

                {/* Interaction Overhaul: Confirm Delete */}
                <ConfirmModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    title="Delete Destination"
                    message="Are you sure you want to permanently remove this location? This action cannot be undone."
                    type="danger"
                    confirmText="Archive Location"
                />
            </div>
        </div>
    );
}
