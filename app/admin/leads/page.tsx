"use client";

import { useState, useEffect } from 'react';
import { FaSearch, FaTrash, FaEye, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import ConfirmModal from '@/components/ConfirmModal';
import api from '@/lib/api';

export default function AdminLeadsPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [filteredLeads, setFilteredLeads] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [selectedLead, setSelectedLead] = useState<any | null>(null);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const response = await api.get('/leads');
            if (response.data.success) {
                setLeads(response.data.data);
                setFilteredLeads(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const filtered = leads.filter(lead =>
            (lead.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (lead.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (lead.destination || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredLeads(filtered);
        setCurrentPage(1);
    }, [searchQuery, leads]);

    const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentLeads = filteredLeads.slice(startIndex, startIndex + itemsPerPage);

    const handleDeleteClick = (id: string) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            const response = await api.delete(`/leads/${itemToDelete}`);
            if (response.data.success) {
                setLeads(leads.filter(l => l._id !== itemToDelete));
            }
        } catch (error) {
            console.error('Error deleting lead:', error);
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
                        Travel <span className="text-primary">Leads</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage and respond to trip planning inquiries</p>
                </div>
                <div className="bg-primary/10 px-6 py-3 rounded-2xl border border-primary/20">
                    <p className="text-xs font-black uppercase tracking-widest text-primary">Total Prospects</p>
                    <p className="text-2xl font-black text-primary">{leads.length}</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="admin-card p-8">
                <div className="relative group">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search leads by name, email, or destination..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="admin-input-premium w-full pl-14 pr-6 py-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary/30 focus:bg-white bg-gray-50/50 transition-all duration-300 font-medium"
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="admin-card overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary shadow-lg shadow-primary/20"></div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Loading Leads...</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="admin-table-header">
                                    <tr>
                                        <th className="px-8 py-6 text-xs uppercase tracking-widest">Prospect</th>
                                        <th className="px-8 py-6 text-xs uppercase tracking-widest">Trip Details</th>
                                        <th className="px-8 py-6 text-xs uppercase tracking-widest">Date Recieved</th>
                                        <th className="px-8 py-6 text-right text-xs uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {currentLeads.map((lead) => (
                                        <tr key={lead._id} className="admin-table-row group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center font-black text-primary text-sm shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                        {(lead.name || 'L')[0].toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <p className="text-sm font-black text-gray-900">{lead.name}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <FaEnvelope className="text-[10px] text-gray-400" />
                                                            <p className="text-[10px] font-bold text-gray-500 lowercase">{lead.email}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <FaPhone className="text-[10px] text-gray-400" />
                                                            <p className="text-[10px] font-bold text-gray-500">{lead.phone || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <FaMapMarkerAlt className="text-secondary text-xs" />
                                                        <span className="text-sm font-black text-gray-800">{lead.destination}</span>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
                                                            <FaCalendarAlt />
                                                            <span>{lead.travelDate || 'Anytime'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
                                                            <FaDollarSign />
                                                            <span>{lead.budget || 'Open'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <p className="text-xs font-bold text-gray-600">{new Date(lead.createdAt).toLocaleDateString()}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => setSelectedLead(lead)}
                                                        className="p-3 text-primary bg-primary/5 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
                                                    >
                                                        <FaEye size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(lead._id)}
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

            {/* Lead Detail Modal */}
            <ConfirmModal
                isOpen={!!selectedLead}
                onClose={() => setSelectedLead(null)}
                onConfirm={() => setSelectedLead(null)}
                title="Lead Details"
                message={selectedLead ? (
                    <div className="text-left space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Prospect</p>
                                <p className="font-bold text-gray-900">{selectedLead.name}</p>
                                <p className="text-sm text-gray-600">{selectedLead.email}</p>
                                <p className="text-sm text-gray-600">{selectedLead.phone}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Destination</p>
                                <p className="font-bold text-gray-900">{selectedLead.destination}</p>
                                <p className="text-sm text-gray-600">Travel Date: {selectedLead.travelDate}</p>
                                <p className="text-sm text-gray-600">Budget: {selectedLead.budget}</p>
                            </div>
                        </div>
                        <div className="pt-4 border-t border-gray-100">
                            <p className="text-[10px] font-black uppercase text-gray-400 mb-1">Message</p>
                            <p className="p-4 bg-gray-50 rounded-xl text-sm italic text-gray-700 leading-relaxed border border-gray-200">
                                "{selectedLead.message || 'No message provided.'}"
                            </p>
                        </div>
                    </div>
                ) : ''}
                type="info"
                confirmText="Close"
            />

            {/* Confirm Delete */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Lead"
                message="Are you sure you want to permanently delete this lead? This action cannot be undone."
                type="danger"
                confirmText="Delete Permanently"
            />
        </div>
    );
}
