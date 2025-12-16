"use client";

import { useState } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface ImageType {
    path?: string;
    url?: string;
    [key: string]: any;
}

interface DestinationImageGalleryProps {
    images: (ImageType | string)[];
    mainImage?: string;
    title: string;
}

export default function DestinationImageGallery({ images, mainImage, title }: DestinationImageGalleryProps) {
    // Normalize images to an array of URL strings
    const allImages = images.map(img => {
        if (typeof img === 'string') return img;
        return img.path || img.url || '/placeholder.jpg';
    });

    // If mainImage is provided and distinct, distinct it or just ensure we have a list
    // Typically, images array contains all gallery images.
    // If images is empty, use mainImage.
    let displayImages = allImages.length > 0 ? allImages : (mainImage ? [mainImage] : ['/placeholder.jpg']);

    // Ensure displayImages has unique entries if needed, but duplicates are rare here.

    const [selectedIndex, setSelectedIndex] = useState(0);

    const handlePrev = () => {
        setSelectedIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Main Large Image */}
            <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-sm bg-gray-100 group">
                <Image
                    src={displayImages[selectedIndex]}
                    alt={`${title} - View ${selectedIndex + 1}`}
                    fill
                    className="object-cover transition-all duration-500"
                    priority
                />

                {/* Navigation Arrows (only if multiple images) */}
                {displayImages.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                        >
                            <FaChevronLeft />
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleNext(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                        >
                            <FaChevronRight />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {displayImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedIndex(idx)}
                            className={`relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 ${selectedIndex === idx
                                    ? 'border-orange-500 ring-2 ring-orange-200 scale-105'
                                    : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
