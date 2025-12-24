"use client";

import { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import ConfirmModal from '@/components/ConfirmModal';

// Use environment variable for API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backendtsa.travelsansr.com/api';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
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

    const handleDeleteClick = (id: string) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            const response = await fetch(`https://backendtsa.travelsansr.com/api/users/${itemToDelete}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                setCustomers(customers.filter(c => c._id !== itemToDelete));
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
        } finally {
            setItemToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Client <span className="text-primary">Directory</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Analyze and manage your registered user base</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="admin-card p-8">
                <div className="relative group">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search customers by name, email, or identifier..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="admin-input-premium w-full pl-14 pr-6 py-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary/30 focus:bg-white bg-gray-50/50 transition-all duration-300 font-medium"
                    />
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                        Profile Sync: <span className="text-primary">{filteredCustomers.length} Users</span>
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 italic">Database Integrity: Optimal</p>
                </div>
            </div>

            {/* Table Section */}
            <div className="admin-card overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary shadow-lg shadow-primary/20"></div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Accessing User Vault...</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="admin-table-header">
                                    <tr>
                                        <th className="px-8 py-6">User Persona</th>
                                        <th className="px-8 py-6">Interaction Meta</th>
                                        <th className="px-8 py-6">Status/Origin</th>
                                        <th className="px-8 py-6 text-right">Administrative</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentCustomers.map((customer) => (
                                        <tr key={customer._id} className="admin-table-row group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-black text-primary text-sm shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                        {(customer.name || 'U')[0].toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <p className="text-sm font-black text-gray-900 group-hover:text-primary transition-colors">{customer.name || 'Anonymous User'}</p>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{customer.email}</p>
                                                        <p className="text-[10px] font-bold text-gray-500 mt-1 italic tracking-tighter">{customer.phone || 'Contact N/A'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black uppercase text-gray-400 w-12">Logins</span>
                                                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-lg text-[10px] font-black">{customer.bookings || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                                        <span className="w-12">Latest</span>
                                                        <span>{customer.lastLoginAt ? new Date(customer.lastLoginAt).toLocaleDateString() : 'None'}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{customer.lastLoginLocation || 'Global Client'}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 mt-1 font-mono uppercase tracking-tighter">{customer.lastLoginIp || 'Proxy.Mask'}</p>
                                                    <p className="text-[10px] font-bold text-primary/60 mt-2 uppercase tracking-[0.2em]">Since {customer.createdAt ? new Date(customer.createdAt).getFullYear() : '2024'}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                                                    <button className="p-3 text-blue-500 bg-blue-50 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                                                        <FaEye size={14} />
                                                    </button>
                                                    <Link href={`/admin/customers/edit/${customer._id}`}>
                                                        <button className="p-3 text-green-500 bg-green-50 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-sm">
                                                            <FaEdit size={14} />
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteClick(customer._id)}
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
            </div>

            {/* Interaction Overhaul: Confirm Delete */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Deactivate Account"
                message="Are you sure you want to remove this client from the active directory? This will restrict their access to the platform."
                type="danger"
                confirmText="Execute Deletion"
            />
        </div>
    );
}
