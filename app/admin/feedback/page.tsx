"use client";

import { useState, useEffect } from 'react';
import { FaSearch, FaTrash, FaStar, FaCheckCircle } from 'react-icons/fa';
import Pagination from '@/components/Pagination';
import api from '@/lib/api';
import ConfirmModal from '@/components/ConfirmModal';

export default function FeedbackAdminPage() {
    const [feedback, setFeedback] = useState<any[]>([]);
    const [filteredFeedback, setFilteredFeedback] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchFeedback();
    }, []);

    useEffect(() => {
        const filtered = feedback.filter(item =>
            item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.message?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredFeedback(filtered);
        setCurrentPage(1);
    }, [searchQuery, feedback]);

    const fetchFeedback = async () => {
        try {
            const res = await api.get('/feedback');
            if (res.status === 200) {
                const data = res.data;
                // Handle different response structures if needed, but assuming array or data property
                const items = Array.isArray(data) ? data : data.data || [];
                setFeedback(items);
                setFilteredFeedback(items);
            }
        } catch (error) {
            console.error('Failed to fetch feedback:', error);
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
            await api.delete(`/feedback/${itemToDelete}`);
            setFeedback(feedback.filter(f => f._id !== itemToDelete));
        } catch (error) {
            console.error('Failed to delete:', error);
        } finally {
            setItemToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                    <FaStar
                        key={i}
                        className={`${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        );
    };

    const totalPages = Math.ceil(filteredFeedback.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentFeedback = filteredFeedback.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Client <span className="text-primary">Sentiments</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Analyze and respond to traveler feedback</p>
                </div>
            </div>

            {/* Insight Module */}
            <div className="admin-card p-8">
                <div className="relative group">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Filter sentiments by customer, destination, or keyword..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="admin-input-premium w-full pl-14 pr-6 py-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary/30 focus:bg-white bg-gray-50/50 transition-all duration-300 font-medium"
                    />
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                        Analysis Queue: <span className="text-primary">{filteredFeedback.length} Reviews</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 italic">Semantic Response: Enabled</span>
                    </div>
                </div>
            </div>

            {/* Ledger Section */}
            <div className="admin-card overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary shadow-lg shadow-primary/20"></div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Processing Sentiment Engine...</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="admin-table-header">
                                    <tr>
                                        <th className="px-8 py-6">Traveler Profile</th>
                                        <th className="px-8 py-6">Route Insight</th>
                                        <th className="px-8 py-6">Sentiment Detail</th>
                                        <th className="px-8 py-6 text-right">Moderation</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentFeedback.map((item) => {
                                        const customerName = item.name || `${item.firstname || ''} ${item.lastname || ''}`.trim() || 'Anonymous Traveler';
                                        const message = item.message || item.text || 'Expression received without textual data.';
                                        return (
                                            <tr key={item._id} className="admin-table-row group">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center font-black text-primary text-sm shadow-sm">
                                                            {customerName[0].toUpperCase()}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <p className="text-sm font-black text-gray-900 group-hover:text-primary transition-colors">{customerName}</p>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{item.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col">
                                                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{item.tripDestination || 'General Experience'}</p>
                                                        <p className="text-[10px] font-bold text-primary/60 mt-1 uppercase tracking-tighter italic">Source: {item.feedbackType || 'Public Review'}</p>
                                                        <div className="mt-2">{item.rating ? renderStars(item.rating) : null}</div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex flex-col max-w-sm">
                                                        <p className="text-xs text-gray-600 line-clamp-2 italic leading-relaxed group-hover:text-gray-900 transition-colors">"{message}"</p>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                                                        <button className="p-3 text-green-500 bg-green-50 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-sm">
                                                            <FaCheckCircle size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(item._id)}
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
            </div>

            {/* Interaction Overhaul: Confirm Delete */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Discard Sentiment"
                message="Are you sure you want to permanently remove this customer feedback? This action cannot be reversed."
                type="danger"
                confirmText="Discard Review"
            />
        </div>
    );
}
