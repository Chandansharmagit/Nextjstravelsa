"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaArrowLeft, FaSave } from 'react-icons/fa';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';
import ImageUpload from '@/components/ImageUpload';
import Image from 'next/image';

export default function EditServicePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        icon: 'FaConciergeBell',
        image: ''
    });

    useEffect(() => {
        const fetchService = async () => {
            try {
                const res = await api.get(`/services/${id}`);
                setFormData(res.data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load service details");
                router.push('/admin/services');
            } finally {
                setFetching(false);
            }
        };

        if (id) {
            fetchService();
        }
    }, [id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageUpload = (url: string) => {
        setFormData({ ...formData, image: url });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.put(`/services/${id}`, formData);
            toast.success('Service updated successfully');
            router.push('/admin/services');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update service');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto">
            <div className="mb-8">
                <Link href="/admin/services" className="flex items-center text-gray-500 hover:text-primary transition mb-4">
                    <FaArrowLeft className="mr-2" /> Back to Services
                </Link>
                <h1 className="text-3xl font-bold text-gray-800">Edit Service</h1>
                <p className="text-gray-500 mt-2">Update service details.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Basic Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Service Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    required
                                    value={formData.title}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                    placeholder="e.g. Airport Pickup"
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                <input
                                    type="text"
                                    name="price"
                                    required
                                    value={formData.price}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                    placeholder="e.g. $50 or $20/day"
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    required
                                    rows={5}
                                    value={formData.description}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                                    placeholder="Describe the service..."
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Media */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">Service Image</h2>

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                            <ImageUpload
                                onChange={(val: any) => setFormData({ ...formData, image: val?.path || val?.url || val })}
                                value={formData.image}
                            />
                            {formData.image && (
                                <div className="mt-4 relative h-40 w-full rounded-lg overflow-hidden border border-gray-200">
                                    <Image src={formData.image} alt="Preview" fill className="object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-orange-600 transition disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Saving...' : <><FaSave /> Update Service</>}
                    </button>

                    <Link href="/admin/services">
                        <button type="button" className="w-full py-3 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition mt-2">
                            Cancel
                        </button>
                    </Link>
                </div>
            </form>
        </div>
    );
}
