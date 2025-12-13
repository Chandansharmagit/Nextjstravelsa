"use client";

import { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import Link from 'next/link';
import Pagination from '@/components/Pagination';
import api from '@/lib/api';

export default function ToursAdminPage() {
    const [tours, setTours] = useState<any[]>([]);
    const [filteredTours, setFilteredTours] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
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

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this tour?')) {
            try {
                await api.delete(`/tours/${id}`);
                setTours(tours.filter(t => t._id !== id));
                alert('Tour deleted successfully');
            } catch (error) {
                console.error('Failed to delete:', error);
                alert('Failed to delete tour');
            }
        }
    };

    const totalPages = Math.ceil(filteredTours.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentTours = filteredTours.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Tours Management</h1>
                    <p className="text-gray-600 mt-2">Manage your tour packages</p>
                </div>
                <Link href="/admin/tours/create">
                    <button className="px-6 py-3 bg-secondary text-white rounded-xl font-bold hover:bg-orange-600 transition shadow-lg flex items-center gap-2">
                        <FaPlus /> Add Tour
                    </button>
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
                <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search tours..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                    />
                </div>
                <p className="mt-3 text-sm text-gray-600">
                    Showing {currentTours.length} of {filteredTours.length} tours
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
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Title</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Destination</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Duration</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Price</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Group Size</th>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentTours.map((tour) => (
                                        <tr key={tour._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-gray-800 font-medium">{tour.title}</td>
                                            <td className="px-6 py-4 text-gray-600">{typeof tour.destination === 'object' ? (tour.destination?.title || tour.destination?.name || 'N/A') : (tour.destination || 'N/A')}</td>
                                            <td className="px-6 py-4 text-gray-600">{tour.duration} days</td>
                                            <td className="px-6 py-4 text-gray-800 font-semibold">NRS {tour.price}</td>
                                            <td className="px-6 py-4 text-gray-600">{tour.groupSize || 'N/A'}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                                        <FaEye />
                                                    </button>
                                                    <Link href={`/admin/tours/edit/${tour._id}`}>
                                                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition">
                                                            <FaEdit />
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(tour._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    >
                                                        <FaTrash />
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
            </div>
        </div>
    );
}
