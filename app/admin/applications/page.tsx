"use client";

import { useState, useEffect } from 'react';
import { FaFilePdf, FaEnvelope, FaPhone, FaCheck, FaTimes, FaSearch } from 'react-icons/fa';
import { getApplications, updateApplicationStatus, Application } from '@/lib/api-applications';
import { toast } from 'react-hot-toast';

export default function AdminApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('All');

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const res = await getApplications();
            setApplications(res.data);
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await updateApplicationStatus(id, newStatus);
            toast.success(`Status updated to ${newStatus}`);
            // Optimistic update or refresh
            setApplications(apps => apps.map(app =>
                app._id === id ? { ...app, status: newStatus as any } : app
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update status');
        }
    };

    const filteredApplications = filterStatus === 'All'
        ? applications
        : applications.filter(app => app.status === filterStatus);

    // API URL for full resume path
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backendtsa.travelsansr.com/api';
    const BASE_URL = API_URL.replace('/api', '');

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Job Applications</h1>
                    <p className="text-gray-500">Manage candidate applications</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-medium">Filter by Status:</span>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="All">All Applications</option>
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                {filteredApplications.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl text-center shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg">No applications found matching your criteria.</p>
                    </div>
                ) : (
                    filteredApplications.map((app) => (
                        <div key={app._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition hover:shadow-md">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-gray-800">{app.name}</h3>
                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold
                                            ${app.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                                            ${app.status === 'Reviewed' ? 'bg-blue-100 text-blue-700' : ''}
                                            ${app.status === 'Shortlisted' ? 'bg-green-100 text-green-700' : ''}
                                            ${app.status === 'Rejected' ? 'bg-red-100 text-red-700' : ''}
                                        `}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 font-medium mb-1">Applying for: <span className="text-primary">{app.job?.title || 'Unknown Job'}</span></p>

                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-3">
                                        <a href={`mailto:${app.email}`} className="flex items-center gap-1.5 hover:text-primary transition">
                                            <FaEnvelope /> {app.email}
                                        </a>
                                        <a href={`tel:${app.phone}`} className="flex items-center gap-1.5 hover:text-primary transition">
                                            <FaPhone /> {app.phone}
                                        </a>
                                        <span className="text-gray-400">Applied: {new Date(app.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    {app.coverLetter && (
                                        <div className="mt-4 bg-gray-50 p-4 rounded-lg text-sm text-gray-600 italic border-l-4 border-gray-200">
                                            "{app.coverLetter}"
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-3 min-w-[200px]">
                                    <a
                                        href={`${BASE_URL}${app.resume}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                                    >
                                        <FaFilePdf className="text-red-500" /> View Resume
                                    </a>

                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => handleStatusUpdate(app._id, 'Shortlisted')}
                                            className="flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-sm font-medium"
                                            title="Shortlist"
                                        >
                                            <FaCheck /> Shortlist
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                                            className="flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                                            title="Reject"
                                        >
                                            <FaTimes /> Reject
                                        </button>
                                    </div>

                                    {app.status !== 'Reviewed' && app.status === 'Pending' && (
                                        <button
                                            onClick={() => handleStatusUpdate(app._id, 'Reviewed')}
                                            className="w-full px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                                        >
                                            Mark as Reviewed
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
