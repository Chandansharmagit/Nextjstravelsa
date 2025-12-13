"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaPlus, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';
import api from '@/lib/api';

export default function CreateTourPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        destination: '',
        duration: '',
        price: '',
        groupSize: '',
        difficulty: 'moderate',
        type: 'trekking',
        description: '',
        itinerary: [''],
        images: ['']
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/tours', formData);
            alert('Tour created successfully!');
            router.push('/admin/tours');
        } catch (error: any) {
            console.error('Error:', error);
            alert(error.response?.data?.message || 'Error creating tour');
        } finally {
            setLoading(false);
        }
    };

    const addItinerary = () => {
        setFormData({ ...formData, itinerary: [...formData.itinerary, ''] });
    };

    const removeItinerary = (index: number) => {
        const updated = formData.itinerary.filter((_, i) => i !== index);
        setFormData({ ...formData, itinerary: updated });
    };

    const updateItinerary = (index: number, value: string) => {
        const updated = [...formData.itinerary];
        updated[index] = value;
        setFormData({ ...formData, itinerary: updated });
    };

    const addImage = () => {
        setFormData({ ...formData, images: [...formData.images, ''] });
    };

    const removeImage = (index: number) => {
        const updated = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: updated });
    };

    const updateImage = (index: number, value: string) => {
        const updated = [...formData.images];
        updated[index] = value;
        setFormData({ ...formData, images: updated });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link href="/admin/tours" className="flex items-center gap-2 text-primary hover:text-teal-700 mb-4">
                        <FaArrowLeft /> Back to Tours
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">Create New Tour</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 font-bold mb-2">Tour Title *</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                            placeholder="e.g., Annapurna Base Camp Trek"
                        />
                    </div>

                    {/* Destination */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Destination *</label>
                        <input
                            type="text"
                            required
                            value={formData.destination}
                            onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                            placeholder="e.g., Annapurna Region"
                        />
                    </div>

                    {/* Duration */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Duration (days) *</label>
                        <input
                            type="number"
                            required
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                            placeholder="e.g., 7"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Price (NRS) *</label>
                        <input
                            type="number"
                            required
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                            placeholder="e.g., 850"
                        />
                    </div>

                    {/* Group Size */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Group Size</label>
                        <input
                            type="text"
                            value={formData.groupSize}
                            onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                            placeholder="e.g., 2-12 people"
                        />
                    </div>

                    {/* Difficulty */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Difficulty *</label>
                        <select
                            value={formData.difficulty}
                            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                        >
                            <option value="easy">Easy</option>
                            <option value="moderate">Moderate</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Tour Type *</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                        >
                            <option value="trekking">Trekking</option>
                            <option value="cultural">Cultural</option>
                            <option value="adventure">Adventure</option>
                            <option value="wildlife">Wildlife</option>
                            <option value="beach">Beach</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 font-bold mb-2">Description *</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={5}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition resize-none"
                            placeholder="Describe the tour..."
                        />
                    </div>

                    {/* Itinerary */}
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 font-bold mb-2">Itinerary (Day by Day)</label>
                        {formData.itinerary.map((day, index) => (
                            <div key={index} className="flex gap-2 mb-3">
                                <span className="px-4 py-3 bg-gray-100 rounded-xl font-bold text-gray-700">Day {index + 1}</span>
                                <input
                                    type="text"
                                    value={day}
                                    onChange={(e) => updateItinerary(index, e.target.value)}
                                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                                    placeholder={`Day ${index + 1} activities`}
                                />
                                {formData.itinerary.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeItinerary(index)}
                                        className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addItinerary}
                            className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-teal-700 transition flex items-center gap-2"
                        >
                            <FaPlus /> Add Day
                        </button>
                    </div>

                    {/* Images */}
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 font-bold mb-2">Tour Images</label>
                        {formData.images.map((image, index) => (
                            <div key={index} className="flex gap-4 mb-4 items-start">
                                <div className="flex-1">
                                    <ImageUpload
                                        label={`Image ${index + 1}`}
                                        value={image}
                                        onChange={(value) => updateImage(index, value)}
                                    />
                                </div>
                                {formData.images.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="mt-8 p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addImage}
                            className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-teal-700 transition flex items-center gap-2"
                        >
                            <FaPlus /> Add Another Image
                        </button>
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-secondary text-white rounded-xl font-bold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating...' : 'Create Tour'}
                    </button>
                    <Link
                        href="/admin/tours"
                        className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
