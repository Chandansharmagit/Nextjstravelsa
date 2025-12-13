"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import ImageUpload from '@/components/ImageUpload';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function EditTeamPage() {
    const params = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

    const [formData, setFormData] = useState({
        name: '',
        role: '',
        bio: '',
        image: '',
        social: {
            facebook: '',
            twitter: '',
            linkedin: '',
            instagram: ''
        }
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (id) {
            fetchTeamMember();
        }
    }, [id]);

    const fetchTeamMember = async () => {
        try {
            const res = await api.get(`/team/${id}`);
            const data = res.data;

            // Adjust depending on API response structure
            const member = data.data || data;

            setFormData({
                name: member.name || '',
                role: member.role || '',
                bio: member.bio || '',
                image: member.image || '',
                social: {
                    facebook: member.social?.facebook || '',
                    twitter: member.social?.twitter || '',
                    linkedin: member.social?.linkedin || '',
                    instagram: member.social?.instagram || ''
                }
            });
        } catch (error) {
            console.error('Error fetching team member:', error);
            alert('Failed to load team member data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('social.')) {
            const socialKey = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                social: { ...prev.social, [socialKey]: value }
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleImageChange = (value: string) => {
        setFormData(prev => ({ ...prev, image: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await api.put(`/team/${id}`, formData);

            alert('Team member updated successfully!');
            router.push('/admin/team');
        } catch (error: any) {
            console.error('Error updating team member:', error);
            alert(error.response?.data?.message || 'Error updating team member');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || authLoading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Team Member</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-8 space-y-6">
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Role/Position</label>
                    <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                        required
                    />
                </div>

                <ImageUpload
                    value={formData.image}
                    onChange={handleImageChange}
                    label="Profile Photo"
                />

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                    ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Facebook URL</label>
                        <input
                            type="text"
                            name="social.facebook"
                            value={formData.social.facebook}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Twitter URL</label>
                        <input
                            type="text"
                            name="social.twitter"
                            value={formData.social.twitter}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">LinkedIn URL</label>
                        <input
                            type="text"
                            name="social.linkedin"
                            value={formData.social.linkedin}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Instagram URL</label>
                        <input
                            type="text"
                            name="social.instagram"
                            value={formData.social.instagram}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 py-3 px-6 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 py-3 px-6 rounded-xl bg-primary text-white font-bold hover:bg-orange-600 transition disabled:opacity-50"
                    >
                        {submitting ? 'Updating...' : 'Update Member'}
                    </button>
                </div>
            </form>
        </div>
    );
}
