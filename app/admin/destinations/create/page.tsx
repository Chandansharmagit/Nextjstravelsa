"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaImage, FaPlus, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';
import api from '@/lib/api';
import { CONFIG } from '@/lib/config';

export default function CreateDestinationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        category: 'mountain',
        description: '',
        bestTime: '',
        thingsToDo: [''],
        featured: false,
        images: [] as any[]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.images.length < 5) {
            alert('Please upload at least 5 images.');
            return;
        }

        setLoading(true);

        try {
            // Handle image uploads
            const processedImages = [];

            // Separate files that need uploading vs already uploaded (if any)
            for (let i = 0; i < formData.images.length; i++) {
                const img = formData.images[i];

                if (img instanceof File) {
                    // Upload the file
                    const uploadFormData = new FormData();
                    uploadFormData.append('image', img);

                    try {
                        const response = await api.post('/upload', uploadFormData, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                        });

                        let uploadedData = response.data.image;
                        if (typeof uploadedData === 'string') {
                            const url = uploadedData.startsWith('http') ? uploadedData : `${CONFIG.BACKEND_URL}${uploadedData}`;
                            uploadedData = { path: url };
                        }
                        processedImages.push(uploadedData);

                    } catch (uploadError) {
                        console.error('Failed to upload image', i + 1, uploadError);
                        alert(`Failed to upload image ${i + 1}. Please try again.`);
                        setLoading(false);
                        return; // Stop the process
                    }
                } else {
                    // Already uploaded object
                    processedImages.push(img);
                }
            }

            // Update formData with processed images
            const submissionData = {
                ...formData,
                images: processedImages
            };

            await api.post('/destinations', submissionData);

            alert('Destination created successfully!');
            router.push('/admin/destinations');
        } catch (error) {
            console.error('Error:', error);
            alert('Error creating destination');
        } finally {
            setLoading(false);
        }
    };

    const addThingToDo = () => {
        setFormData({ ...formData, thingsToDo: [...formData.thingsToDo, ''] });
    };

    const removeThingToDo = (index: number) => {
        const updated = formData.thingsToDo.filter((_, i) => i !== index);
        setFormData({ ...formData, thingsToDo: updated });
    };

    const updateThingToDo = (index: number, value: string) => {
        const updated = [...formData.thingsToDo];
        updated[index] = value;
        setFormData({ ...formData, thingsToDo: updated });
    };



    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <Link href="/admin/destinations" className="flex items-center gap-2 text-primary hover:text-teal-700 mb-4">
                        <FaArrowLeft /> Back to Destinations
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-800">Create New Destination</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 font-bold mb-2">Destination Title *</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                            placeholder="e.g., Ghandruk Village"
                        />
                    </div>

                    {/* Location */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Location *</label>
                        <input
                            type="text"
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                            placeholder="e.g., Gandaki Province, Nepal"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Category *</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                        >
                            <option value="mountain">Mountains</option>
                            <option value="beach">Beaches</option>
                            <option value="city">Cities</option>
                            <option value="cultural">Cultural</option>
                        </select>
                    </div>

                    {/* Best Time */}
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 font-bold mb-2">Best Time to Visit</label>
                        <input
                            type="text"
                            value={formData.bestTime}
                            onChange={(e) => setFormData({ ...formData, bestTime: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                            placeholder="e.g., March to May, September to November"
                        />
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
                            placeholder="Describe the destination..."
                        />
                    </div>

                    {/* Things to Do */}
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 font-bold mb-2">Things to Do</label>
                        {formData.thingsToDo.map((thing, index) => (
                            <div key={index} className="flex gap-2 mb-3">
                                <input
                                    type="text"
                                    value={thing}
                                    onChange={(e) => updateThingToDo(index, e.target.value)}
                                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                                    placeholder={`Activity ${index + 1}`}
                                />
                                {formData.thingsToDo.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeThingToDo(index)}
                                        className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addThingToDo}
                            className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-teal-700 transition flex items-center gap-2"
                        >
                            <FaPlus /> Add Activity
                        </button>
                    </div>

                    {/* Images */}
                    <div className="md:col-span-2">
                        <ImageUpload
                            label="Destination Images (Minimum 5 required)"
                            multiple
                            autoUpload={false}
                            value={formData.images}
                            onChange={(images) => setFormData({ ...formData, images: images as any[] })}
                        />
                        <p className="text-sm text-gray-500 mt-2">
                            Please upload at least 5 images. Images will be uploaded when you click Create Destination.
                        </p>
                    </div>

                    {/* Featured */}
                    <div className="md:col-span-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <span className="text-gray-700 font-bold">Mark as Featured Destination</span>
                        </label>
                    </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-secondary text-white rounded-xl font-bold hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : 'Create Destination'}
                    </button>
                    <Link
                        href="/admin/destinations"
                        className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition"
                    >
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
