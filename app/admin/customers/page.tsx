"use client";

import { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Pagination from '@/components/Pagination';
import Link from 'next/link';

// Use environment variable for API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backendtsa.travelsansr.com/api';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetch(`${API_URL}/users`, {
                credentials: 'include' // Include cookies for authentication
            });

            if (response.ok) {
                const data = await response.json();
                setCustomers(data);
                setFilteredCustomers(data);
            } else {
                console.error('Failed to fetch customers');
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const filtered = customers.filter(customer =>
            (customer.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (customer.email || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCustomers(filtered);
        setCurrentPage(1);
    }, [searchQuery, customers]);

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this customer?')) {
            try {
                const response = await fetch(`https://backendtsa.travelsansr.com/api/users/${id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                if (response.ok) {
                    setCustomers(customers.filter(c => c._id !== id));
                    alert('Customer deleted successfully');
                } else {
                    alert('Failed to delete customer');
                }
            } catch (error) {
                console.error('Error deleting customer:', error);
                alert('Error deleting customer');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Customers Management</h1>
                    <p className="text-gray-600 mt-2">Manage your customer database</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
                <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search customers by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                    />
                </div>
                <p className="mt-3 text-sm text-gray-600">
                    Showing {currentCustomers.length} of {filteredCustomers.length} customers
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
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Email</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Phone</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Bookings</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Joined</th>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentCustomers.map((customer) => (
                                        <tr key={customer._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 text-gray-800 font-medium">{customer.name}</td>
                                            <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                                            <td className="px-6 py-4 text-gray-600">{customer.phone || 'N/A'}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                                                    {customer.bookings || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                                                        <FaEye />
                                                    </button>
                                                    <Link href={`/admin/customers/edit/${customer._id}`}>
                                                        <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition">
                                                            <FaEdit />
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(customer._id)}
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
