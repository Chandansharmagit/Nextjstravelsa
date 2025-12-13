"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Correct hook for app router
import ImageUpload from '@/components/ImageUpload';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function EditTourPage() {
    const params = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        description: '',
        price: '',
        image: '',
        duration: '',
        difficulty: 'Easy',
        groupSize: ''
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
            fetchTour();
        }
    }, [id]);

    const fetchTour = async () => {
        try {
            const res = await api.get(`/tours/${id}`);
            const data = res.data;

            setFormData({
                title: data.title || '',
                location: data.location || '',
                description: data.description || '',
                price: data.price || '',
                image: data.image || '',
                duration: data.duration || '',
                difficulty: data.difficulty || 'Easy',
                groupSize: data.groupSize || ''
            });
        } catch (error) {
            console.error('Error fetching tour:', error);
            alert('Failed to load tour data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (value: string) => {
        setFormData(prev => ({ ...prev, image: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await api.put(`/tours/${id}`, formData);

            alert('Tour updated successfully!');
            router.push('/admin/tours');
        } catch (error: any) {
            console.error('Error updating tour:', error);
            alert(error.response?.data?.message || error.message || 'Error updating tour');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || authLoading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Tour Package</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-8 space-y-6">
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Tour Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                        required
                    />
                </div>

                <ImageUpload
                    value={formData.image}
                    onChange={handleImageChange}
                    label="Tour Image"
                />

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Price (NRS)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Duration (Days)</label>
                        <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            placeholder="e.g. 5"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Group Size</label>
                        <input
                            type="text"
                            name="groupSize"
                            value={formData.groupSize}
                            onChange={handleChange}
                            placeholder="e.g. 12"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Difficulty</label>
                        <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                        >
                            <option value="Easy">Easy</option>
                            <option value="Moderate">Moderate</option>
                            <option value="Difficult">Difficult</option>
                            <option value="Extreme">Extreme</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                        required
                    ></textarea>
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
                        {submitting ? 'Updating...' : 'Update Tour'}
                    </button>
                </div>
            </form>
        </div>
    );
}
