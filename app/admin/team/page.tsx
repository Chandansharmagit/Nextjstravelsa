"use client";

import { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';
import ConfirmModal from '@/components/ConfirmModal';

export default function TeamAdminPage() {
    const [team, setTeam] = useState<any[]>([]);
    const [filteredTeam, setFilteredTeam] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchTeam();
    }, []);

    useEffect(() => {
        const filtered = team.filter(member =>
            member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.role?.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredTeam(filtered);
    }, [searchQuery, team]);

    const fetchTeam = async () => {
        try {
            const res = await api.get('/team');
            const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
            setTeam(data || []);
            setFilteredTeam(data || []);
        } catch (error) {
            console.error('Failed to fetch team:', error);
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
            await api.delete(`/team/${itemToDelete}`);
            setTeam(team.filter(t => t._id !== itemToDelete));
        } catch (error) {
            console.error('Failed to delete:', error);
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
                        Team <span className="text-secondary">Orchestra</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage and organize your human resources</p>
                </div>
                <Link href="/admin/team/create">
                    <button className="admin-btn-secondary flex items-center gap-3">
                        <FaPlus size={14} /> <span>Add Member</span>
                    </button>
                </Link>
            </div>

            <div className="admin-card p-8">
                <div className="relative group">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search team by name or role..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="admin-input-premium w-full pl-14 pr-6 py-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary/30 focus:bg-white bg-gray-50/50 transition-all duration-300 font-medium"
                    />
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                        Active Personnel: <span className="text-primary">{filteredTeam.length}</span>
                    </p>
                </div>
            </div>

            <div className="admin-card overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary shadow-lg shadow-primary/20"></div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Updating Roster...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="admin-table-header">
                                <tr>
                                    <th className="px-8 py-6">Identity</th>
                                    <th className="px-8 py-6">Functional Role</th>
                                    <th className="px-8 py-6">Biography</th>
                                    <th className="px-8 py-6 text-right">Moderation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredTeam.map((member) => (
                                    <tr key={member._id} className="admin-table-row group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 shadow-sm group-hover:scale-105 transition-transform duration-300">
                                                    <Image
                                                        src={member.image}
                                                        alt={member.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <p className="text-sm font-black text-gray-900 group-hover:text-primary transition-colors">{member.name}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-4 py-1.5 bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-xs text-gray-500 font-medium max-w-sm line-clamp-2 leading-relaxed italic">
                                                "{member.bio}"
                                            </p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/team/edit/${member._id}`}>
                                                    <button className="p-3 text-green-500 bg-green-50 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-sm">
                                                        <FaEdit size={14} />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(member._id)}
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
                )}
            </div>

            {/* Interaction Overhaul: Confirm Delete */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Remove Team Member"
                message="Are you sure you want to permanently remove this member from the organization? This will revoke all their administrative privileges."
                type="danger"
                confirmText="Revoke Access"
            />
        </div>
    );
}
