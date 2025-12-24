"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaBriefcase } from 'react-icons/fa';
import { getAllJobs, deleteJob, Job } from '@/lib/api-jobs';
import { toast } from 'react-hot-toast';
import ConfirmModal from '@/components/ConfirmModal';
import { FaSearch } from 'react-icons/fa';

export default function AdminJobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const res = await getAllJobs();
            setJobs(res.data); // Assuming res.data is the array
        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job =>
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeleteClick = (id: string) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await deleteJob(itemToDelete);
            toast.success('Job deleted successfully');
            fetchJobs();
        } catch (error) {
            console.error('Error deleting job:', error);
            toast.error('Failed to delete job');
        } finally {
            setItemToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Career <span className="text-primary">Portals</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Coordinate and broadcast occupational openings</p>
                </div>
                <Link href="/admin/jobs/create">
                    <button className="admin-btn-primary flex items-center gap-3">
                        <FaPlus size={14} /> <span>Open New Position</span>
                    </button>
                </Link>
            </div>

            <div className="admin-card p-8">
                <div className="relative group">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search positions by title or geographic location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="admin-input-premium w-full pl-14 pr-6 py-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary/30 focus:bg-white bg-gray-50/50 transition-all duration-300 font-medium"
                    />
                </div>
            </div>

            <div className="admin-card overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary shadow-lg shadow-primary/20"></div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Syncing Career Database...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="admin-table-header">
                                <tr>
                                    <th className="px-8 py-6">Operational Title</th>
                                    <th className="px-8 py-6">Engagement Type</th>
                                    <th className="px-8 py-6">Geographic Locale</th>
                                    <th className="px-8 py-6">Status Ledger</th>
                                    <th className="px-8 py-6">Entry Log</th>
                                    <th className="px-8 py-6 text-right">Moderation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredJobs.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-24 text-center text-gray-400 text-xs font-bold uppercase tracking-widest italic">
                                            No occupational assets discovered in this sector
                                        </td>
                                    </tr>
                                ) : (
                                    filteredJobs.map((job) => (
                                        <tr key={job._id} className="admin-table-row group">
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-black text-gray-900 group-hover:text-primary transition-colors">{job.title}</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-4 py-1.5 bg-blue-500/10 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-500/20">
                                                    {job.type}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-xs font-bold text-gray-500 uppercase tracking-tighter italic">
                                                {job.location}
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${job.isActive ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-red-500/10 text-red-600 border border-red-500/20'}`}>
                                                    {job.isActive ? 'Active' : 'Archived'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-[10px] font-black text-gray-400 tabular-nums">
                                                {new Date(job.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleDeleteClick(job._id)}
                                                        className="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
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
                title="Terminate Job Posting"
                message="Are you sure you want to permanently erase this occupational opening? Candidates will no longer be able to apply."
                type="danger"
                confirmText="Archive Posting"
            />
        </div>
    );
}
