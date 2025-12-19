"use client";

import { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import Link from 'next/link';
import Pagination from '@/components/Pagination';
import Image from 'next/image';
import api from '@/lib/api';
import Modal from '@/components/Modal';

export default function DestinationsAdminPage() {
    const [destinations, setDestinations] = useState<any[]>([]);
    const [filteredDestinations, setFilteredDestinations] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);
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

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this destination?')) {
            try {
                await api.delete(`/destinations/${id}`);
                setDestinations(destinations.filter(d => d._id !== id));
                alert('Destination deleted successfully');
            } catch (error) {
                console.error('Failed to delete:', error);
                alert('Failed to delete destination');
            }
        }
    };

    const totalPages = Math.ceil(filteredDestinations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentDestinations = filteredDestinations.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Destinations Management</h1>
                    <p className="text-gray-600 mt-2">Manage your travel destinations</p>
                </div>
                <button
                    onClick={() => setIsLimitModalOpen(true)}
                    className="px-6 py-3 bg-secondary text-white rounded-xl font-bold hover:bg-orange-600 transition shadow-lg flex items-center gap-2"
                >
                    <FaPlus /> Add Destination
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
                <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search destinations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                    />
                </div>
                <p className="mt-3 text-sm text-gray-600">
                    Showing {currentDestinations.length} of {filteredDestinations.length} destinations
                </p>
            </div>

            {/* Table */}
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
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Image</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Title</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Location</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Best Time</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Featured</th>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentDestinations.map((dest) => {
                                        const image0 = dest.images?.[0];
                                        const imageSrc = (typeof image0 === 'string' ? image0 : image0?.path || image0?.url) || dest.image || '/placeholder.jpg';
                                        return (
                                            <tr key={dest._id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4">
                                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                                                        <Image
                                                            src={imageSrc}
                                                            alt={dest.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-800 font-medium">{dest.title}</td>
                                                <td className="px-6 py-4 text-gray-600">{dest.location || 'N/A'}</td>
                                                <td className="px-6 py-4 text-gray-600">{dest.bestTimeToVisit || 'All Season'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${dest.featured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {dest.featured ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                                            <FaEye />
                                                        </button>
                                                        <Link href={`/admin/destinations/edit/${dest._id}`}>
                                                            <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition">
                                                                <FaEdit />
                                                            </button>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(dest._id)}
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
            </div>
        </div>
    );
}
