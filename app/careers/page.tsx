"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaMapMarkerAlt, FaBriefcase, FaMoneyBillWave, FaClock } from 'react-icons/fa';
import { getAllJobs, Job } from '@/lib/api-jobs';
import JobApplicationModal from '@/components/JobApplicationModal';

export default function CareersPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (job: Job) => {
        setSelectedJob(job);
        setIsModalOpen(true);
    };

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Fetch only active jobs
                const res = await getAllJobs(true);
                // Filter client side as well if needed, but API handles it via param if implemented
                // My API implementation handles query active=true
                setJobs(res.data);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="bg-primary text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">Join Our Team</h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Be a part of a passionate team dedicated to creating unforgettable travel experiences.
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-16 xl:px-20">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="mt-4 text-gray-500">Loading opportunities...</p>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaBriefcase className="text-3xl text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Openings Currently</h2>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto">
                            We don't have any open positions right now, but please check back later or send your CV to our team.
                        </p>
                        <Link href="/contact" className="px-8 py-3 bg-secondary text-white font-bold rounded-xl hover:bg-orange-600 transition">
                            Contact Us
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
                        {jobs.map((job) => (
                            <div key={job._id} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                                            {job.title}
                                        </h2>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                                                <FaBriefcase size={14} /> {job.type}
                                            </span>
                                            <span className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">
                                                <FaMapMarkerAlt size={14} /> {job.location}
                                            </span>
                                            {job.salary && (
                                                <span className="flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1 rounded-full font-medium">
                                                    <FaMoneyBillWave size={14} /> {job.salary}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <span className="text-sm text-gray-400 flex items-center gap-1">
                                            <FaClock size={12} /> Posted {new Date(job.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-2">Job Description</h3>
                                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                            {job.description}
                                        </p>
                                    </div>

                                    {job.requirements && job.requirements.length > 0 && (
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-2">Requirements</h3>
                                            <ul className="space-y-2">
                                                {job.requirements.map((req, idx) => (
                                                    <li key={idx} className="flex items-start gap-2 text-gray-600">
                                                        <span className="mt-2 w-1.5 h-1.5 bg-secondary rounded-full flex-shrink-0"></span>
                                                        <span>{req}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                                        {job.deadline && (
                                            <p className="text-sm text-red-500 font-medium">
                                                Deadline: {new Date(job.deadline).toLocaleDateString()}
                                            </p>
                                        )}
                                        <button
                                            onClick={() => openModal(job)}
                                            className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition ml-auto"
                                        >
                                            Apply Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Application Modal */}
            {selectedJob && (
                <JobApplicationModal
                    jobId={selectedJob._id}
                    jobTitle={selectedJob.title}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}
