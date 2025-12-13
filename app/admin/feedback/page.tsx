"use client";

import { useState, useEffect } from 'react';
import { FaSearch, FaTrash, FaStar, FaCheckCircle } from 'react-icons/fa';
import Pagination from '@/components/Pagination';
import api from '@/lib/api';

export default function FeedbackAdminPage() {
    const [feedback, setFeedback] = useState<any[]>([]);
    const [filteredFeedback, setFilteredFeedback] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
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

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this feedback?')) {
            try {
                await api.delete(`/feedback/${id}`);
                setFeedback(feedback.filter(f => f._id !== id));
                alert('Feedback deleted successfully');
            } catch (error) {
                console.error('Failed to delete:', error);
                alert('Failed to delete feedback');
            }
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
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Feedback Management</h1>
                    <p className="text-gray-600 mt-2">Manage customer reviews and feedback</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
                <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search feedback..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                    />
                </div>
                <p className="mt-3 text-sm text-gray-600">
                    Showing {currentFeedback.length} of {filteredFeedback.length} feedback items
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b-2 border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Customer</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Destination</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Rating</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Type</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Message</th>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentFeedback.map((item) => {
                                        const customerName = item.name || `${item.firstname || ''} ${item.lastname || ''}`.trim() || 'Anonymous';
                                        const message = item.message || item.text || '';
                                        return (
                                            <tr key={item._id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="text-gray-800 font-medium">{customerName}</p>
                                                        <p className="text-sm text-gray-500">{item.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">{item.tripDestination || 'N/A'}</td>
                                                <td className="px-6 py-4">
                                                    {item.rating ? renderStars(item.rating) : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                                        {item.feedbackType || 'General'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600 max-w-md truncate">{message}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition" title="Approve">
                                                            <FaCheckCircle />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        >
                                                            <FaTrash />
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
        </div>
    );
}
