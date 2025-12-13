"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation'; // Correct hook for app router
import ImageUpload from '@/components/ImageUpload';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function EditDestinationPage() {
    const params = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    // params.id might be undefined initially or array, handle safely
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

    const [formData, setFormData] = useState({
        name: '',
        location: '',
        description: '',
        price: '',
        image: '',
        rating: '5',
        duration: ''
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
            fetchDestination();
        }
    }, [id]);

    const fetchDestination = async () => {
        try {
            const res = await api.get(`/destinations/${id}`);
            // Handle if response is { destination: ... } or just ...
            const data = res.data.destination || res.data;

            setFormData({
                name: data.title || data.name || '', // Map title to name or keep name if existing
                location: data.location || '',
                description: data.description || '',
                price: data.price || '',
                image: data.image || (data.images && data.images[0] ? (data.images[0].path || data.images[0].url) : '') || '',
                rating: data.rating || '5',
                duration: data.duration || ''
            });
        } catch (error) {
            console.error('Error fetching destination:', error);
            alert('Failed to load destination data');
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
            // Map form data back to API schema (title, not name)
            const payload = {
                ...formData,
                title: formData.name, // The backend likely expects 'title'
            };

            await api.put(`/destinations/${id}`, payload);

            alert('Destination updated successfully!');
            router.push('/admin/destinations');
        } catch (error: any) {
            console.error('Error updating destination:', error);
            alert(error.message || 'Error updating destination');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || authLoading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Destination</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-8 space-y-6">
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Destination Name</label>
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

                {/* Replaced URL input with Image Upload */}
                <ImageUpload
                    value={formData.image}
                    onChange={handleImageChange}
                    label="Destination Image"
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
                            placeholder="e.g. 5 Days / 4 Nights"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                            required
                        />
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
                        {submitting ? 'Updating...' : 'Update Destination'}
                    </button>
                </div>
            </form>
        </div>
    );
}
