"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaCloudUploadAlt, FaTimes } from 'react-icons/fa';
import api from '@/lib/api';
import { CONFIG } from '@/lib/config';

interface ImageUploadProps {
    value: any | any[];
    onChange: (value: any | any[]) => void;
    label?: string;
    multiple?: boolean;
    autoUpload?: boolean;
}

export default function ImageUpload({ value, onChange, label = "Upload Image", multiple = false, autoUpload = true }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        let createdUrls: string[] = [];

        if (Array.isArray(value)) {
            // Handle array of objects (new format), strings (legacy), or Files (deferred)
            const validPreviews = value.map(v => {
                if (v instanceof File) {
                    const url = URL.createObjectURL(v);
                    createdUrls.push(url);
                    return url;
                }
                if (typeof v === 'string') return v;
                return v?.path || v?.url || '';
            }).filter(v => v);
            setPreviews(validPreviews);
        } else if (value) {
            // Handle single object, string, or File
            let preview = '';
            if (value instanceof File) {
                preview = URL.createObjectURL(value);
                createdUrls.push(preview);
            } else {
                preview = typeof value === 'string' ? value : (value.path || value.url);
            }

            if (preview) setPreviews([preview]);
            else setPreviews([]);
        } else {
            setPreviews([]);
        }

        // Cleanup function to revoke object URLs created in this effect
        return () => {
            createdUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [value]);

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (!files || files.length === 0) return;

        // Reuse the upload logic
        await processFiles(files);
    };

    const processFiles = async (files: FileList) => {
        // If autoUpload is false, just pass the files back to parent
        if (!autoUpload) {
            const newFiles = Array.from(files);
            if (multiple) {
                const currentValues = Array.isArray(value) ? value : (value ? [value] : []);
                // Filter out empty placeholders
                const cleanCurrent = currentValues.filter((v: any) => v && (typeof v === 'string' ? v !== '' : true));
                const newValues = [...cleanCurrent, ...newFiles];
                onChange(newValues);
            } else {
                onChange(newFiles[0]);
            }
            return;
        }

        setUploading(true);
        const uploadedImages: any[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append('image', file);

                const response = await api.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                const data = response.data;
                let imagePayload = data.image;

                if (typeof imagePayload === 'string') {
                    const url = imagePayload.startsWith('http') ? imagePayload : `${CONFIG.BACKEND_URL}${imagePayload}`;
                    imagePayload = { path: url };
                }

                uploadedImages.push(imagePayload);
            }

            if (multiple) {
                const currentValues = Array.isArray(value) ? value : (value ? [value] : []);
                const cleanCurrent = currentValues.filter((v: any) => v && (typeof v === 'string' ? v !== '' : true));
                const newValues = [...cleanCurrent, ...uploadedImages];
                onChange(newValues);
            } else {
                onChange(uploadedImages[0]);
            }

        } catch (error: any) {
            console.error('Error uploading image:', error);
            alert('Error uploading image: ' + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };

    // Wrapper for input change event to match processFiles signature
    const uploadFileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            processFiles(e.target.files);
            e.target.value = ''; // Reset input
        }
    };

    const handleRemove = (indexToRemove: number) => {
        if (multiple) {
            const currentValues = Array.isArray(value) ? value : [];
            const newValues = currentValues.filter((_, index) => index !== indexToRemove);
            onChange(newValues);
        } else {
            onChange('');
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
                {label}
            </label>

            <div className="space-y-4">
                {/* Previews Grid */}
                {previews.length > 0 && (
                    <div className={`grid gap-4 ${multiple ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-1'}`}>
                        {previews.map((previewUrl, index) => (
                            <div key={`${previewUrl}-${index}`} className="relative aspect-square rounded-lg overflow-hidden border border-gray-300 group bg-gray-50">
                                <Image
                                    src={previewUrl}
                                    alt={`Preview ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                                >
                                    <FaTimes size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Upload Button Area */}
                <div className="flex items-center justify-center w-full">
                    <label
                        htmlFor="image-upload"
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 
                            ${isDragging
                                ? 'border-primary bg-primary/10 scale-[1.02]'
                                : 'border-gray-300 bg-gray-50 hover:bg-gray-100'} 
                            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <FaCloudUploadAlt className={`w-8 h-8 mb-3 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
                            <p className="mb-2 text-sm text-gray-500 font-semibold">
                                {uploading ? 'Uploading...' : isDragging ? 'Drop files here' : 'Click or Drag & Drop to upload'}
                            </p>
                            <p className="text-xs text-gray-500">
                                {multiple ? 'Upload multiple files' : 'Upload a file'} (JPG, PNG, WebP)
                            </p>
                        </div>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            multiple={multiple}
                            className="hidden"
                            onChange={uploadFileHandler}
                            disabled={uploading}
                        />
                    </label>
                </div>
            </div>
        </div>
    );
}
