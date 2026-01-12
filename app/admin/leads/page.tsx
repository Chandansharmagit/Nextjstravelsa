"use client";

import { useState, useEffect } from 'react';
import { FaSearch, FaTrash, FaEye, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import ConfirmModal from '@/components/ConfirmModal';
import api from '@/lib/api';
import Modal from '@/components/Modal';

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
                        Plan My <span className="text-primary">Trip</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage and respond to custom travel inquiries</p>
                </div>
                <div className="bg-primary/10 px-6 py-3 rounded-2xl border border-primary/20">
                    <p className="text-xs font-black uppercase tracking-widest text-primary">Active Inquiries</p>
                    <p className="text-2xl font-black text-primary">{leads.length}</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="admin-card p-8">
                <div className="relative group">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search custom inquiries by name, email, or destination..."
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
                                                            <a
                                                                href={`mailto:${lead.email}`}
                                                                className="text-[10px] font-bold text-primary hover:underline lowercase"
                                                            >
                                                                {lead.email}
                                                            </a>
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <FaPhone className="text-[10px] text-gray-400" />
                                                            <a
                                                                href={`tel:${lead.phone}`}
                                                                className="text-[10px] font-bold text-primary hover:underline"
                                                            >
                                                                {lead.phone || 'N/A'}
                                                            </a>
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
            <Modal
                isOpen={!!selectedLead}
                onClose={() => setSelectedLead(null)}
                title="Trip Planning Inquiry"
            >
                {selectedLead && (
                    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
                        {/* Prospect Bio */}
                        <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                            <div className="w-20 h-20 rounded-3xl bg-primary text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-primary/20">
                                {(selectedLead.name || 'L')[0].toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">{selectedLead.name}</h3>
                                <div className="flex flex-wrap gap-4 mt-2">
                                    <a href={`mailto:${selectedLead.email}`} className="flex items-center gap-2 text-sm font-bold text-primary hover:text-teal-700 transition-colors">
                                        <FaEnvelope /> {selectedLead.email}
                                    </a>
                                    {selectedLead.phone && (
                                        <a href={`tel:${selectedLead.phone}`} className="flex items-center gap-2 text-sm font-bold text-primary hover:text-teal-700 transition-colors">
                                            <FaPhone /> {selectedLead.phone}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Trip Specs */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Destination</p>
                                <div className="flex items-center gap-3">
                                    <FaMapMarkerAlt className="text-secondary text-xl" />
                                    <span className="font-bold text-gray-900">{selectedLead.destination}</span>
                                </div>
                            </div>
                            <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Travel Window</p>
                                <div className="flex items-center gap-3">
                                    <FaCalendarAlt className="text-primary text-xl" />
                                    <span className="font-bold text-gray-900">{selectedLead.travelDate || 'Flexible'}</span>
                                </div>
                            </div>
                            <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Budget Range</p>
                                <div className="flex items-center gap-3">
                                    <FaDollarSign className="text-green-500 text-xl" />
                                    <span className="font-bold text-gray-900">{selectedLead.budget || 'Open'}</span>
                                </div>
                            </div>
                        </div>

                        {/* The Inquiry Content */}
                        <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Proposed Itinerary / Special Requests</p>
                            <div className="p-8 bg-slate-900 text-slate-200 rounded-[2.5rem] text-lg leading-relaxed font-medium italic relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
                                <span className="relative z-10">"{selectedLead.message || 'The user did not provide additional details for this trip inquiry.'}"</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <a
                                href={`mailto:${selectedLead.email}?subject=Response to your trip planning inquiry - Travel Sansar`}
                                className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-center hover:bg-teal-700 transition shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
                            >
                                <FaEnvelope /> Respond via Email
                            </a>
                            <button
                                onClick={() => setSelectedLead(null)}
                                className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition"
                            >
                                Close View
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Confirm Delete */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Inquiry"
                message="Are you sure you want to permanently delete this trip inquiry? This action cannot be undone."
                type="danger"
                confirmText="Delete Permanently"
            />
        </div>
    );
}
