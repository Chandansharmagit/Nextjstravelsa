"use client";

import { useState, useEffect } from 'react';
import { FaSearch, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/lib/api';

export default function TeamAdminPage() {
    const [team, setTeam] = useState<any[]>([]);
    const [filteredTeam, setFilteredTeam] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

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

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this team member?')) {
            try {
                await api.delete(`/team/${id}`);
                setTeam(team.filter(t => t._id !== id));
                alert('Team member deleted successfully');
            } catch (error) {
                console.error('Failed to delete:', error);
                alert('Failed to delete team member');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Team Management</h1>
                    <p className="text-gray-600 mt-2">Manage your team members</p>
                </div>
                <Link href="/admin/team/create">
                    <button className="px-6 py-3 bg-secondary text-white rounded-xl font-bold hover:bg-orange-600 transition shadow-lg flex items-center gap-2">
                        <FaPlus /> Add Team Member
                    </button>
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
                <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search team members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                    />
                </div>
                <p className="mt-3 text-sm text-gray-600">
                    Showing {filteredTeam.length} team members
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Photo</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Role</th>
                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Bio</th>
                                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredTeam.map((member) => (
                                    <tr key={member._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                                <Image
                                                    src={member.image}
                                                    alt={member.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-800 font-medium">{member.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 max-w-md truncate">{member.bio}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/team/edit/${member._id}`}>
                                                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition">
                                                        <FaEdit />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(member._id)}
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
                )}
            </div>
        </div>
    );
}
