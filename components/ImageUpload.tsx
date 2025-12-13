"use client";

import { useState } from 'react';
import Image from 'next/image';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import api from '@/lib/api';

interface ImageUploadProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

export default function ImageUpload({ value, onChange, label = "Upload Image" }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(value);

    // Update preview if value changes externally
    if (value && value !== preview) {
        setPreview(value);
    }

    const uploadFileHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show local preview immediately
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const response = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = response.data;
            const imageUrl = data.image.startsWith('http')
                ? data.image
                : `https://backendtsa.travelsansr.com${data.image}`;

            onChange(imageUrl);
            setPreview(imageUrl);
        } catch (error: any) {
            console.error('Error uploading image:', error);
            alert('Error uploading image: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        onChange('');
        setPreview('');
    };

    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
                {label}
            </label>

            <div className="flex items-center space-x-4">
                {preview ? (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-300 group">
                        <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <FaTimes size={12} />
                        </button>
                    </div>
                ) : (
                    <div className="w-32 h-32 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                        <FaCloudUploadAlt className="text-gray-400 text-3xl" />
                    </div>
                )}

                <div className="flex-1">
                    <input
                        type="file"
                        id="image-upload"
                        onChange={uploadFileHandler}
                        accept="image/*"
                        className="hidden"
                    />
                    <label
                        htmlFor="image-upload"
                        className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {uploading ? 'Uploading...' : 'Choose File'}
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                        JPG, PNG, WebP up to 5MB
                    </p>
                </div>
            </div>
        </div>
    );
}
