"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';
import api from '@/lib/api';

export default function CreateTeamMemberPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        bio: '',
        image: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/team', formData);
            alert('Team member added successfully!');
            router.push('/admin/team');
        } catch (error: any) {
            console.error('Error:', error);
            alert(error.response?.data?.message || 'Error adding team member');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link href="/admin/team" className="flex items-center gap-2 text-primary hover:text-teal-700 mb-4">
                        <FaArrowLeft /> Back to Team
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">Add Team Member</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-8 max-w-2xl">
                <div className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Full Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                            placeholder="e.g., John Doe"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Role/Position *</label>
                        <input
                            type="text"
                            required
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                            placeholder="e.g., Tour Guide, Manager"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Bio *</label>
                        <textarea
                            required
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            rows={5}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition resize-none"
                            placeholder="Tell us about this team member..."
                        />
                    </div>

                    {/* Profile Image */}
                    <ImageUpload
                        label="Profile Image *"
                        value={formData.image}
                        onChange={(value) => setFormData({ ...formData, image: value })}
                    />
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-secondary text-white rounded-xl font-bold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Adding...' : 'Add Team Member'}
                    </button>
                    <Link
                        href="/admin/team"
                        className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
