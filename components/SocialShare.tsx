"use client";

import { FaFacebook, FaTwitter, FaWhatsapp, FaLinkedin, FaLink, FaShareAlt } from 'react-icons/fa';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface SocialShareProps {
    url: string;
    title: string;
    description?: string;
    className?: string;
}

export default function SocialShare({ url, title, description = '', className = '' }: SocialShareProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDesc = encodeURIComponent(description);

    const shareLinks = [
        {
            name: 'Facebook',
            icon: FaFacebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            color: 'bg-blue-600'
        },
        {
            name: 'Twitter',
            icon: FaTwitter,
            href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
            color: 'bg-sky-500'
        },
        {
            name: 'WhatsApp',
            icon: FaWhatsapp,
            href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
            color: 'bg-green-500'
        },
        {
            name: 'LinkedIn',
            icon: FaLinkedin,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            color: 'bg-blue-700'
        }
    ];

    const copyToClipboard = () => {
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
    };

    const nativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: description,
                    url: url,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            setIsMenuOpen(!isMenuOpen);
        }
    };

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <h4 className="font-bold text-gray-700 flex items-center gap-2 text-sm">
                <FaShareAlt className="text-secondary" /> Share:
            </h4>

            <div className="flex flex-wrap gap-2">
                {shareLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-8 h-8 rounded-full ${link.color} text-white flex items-center justify-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}
                        title={`Share on ${link.name}`}
                    >
                        <link.icon className="text-sm" />
                    </a>
                ))}

                <button
                    onClick={copyToClipboard}
                    className="w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
                    title="Copy Link"
                >
                    <FaLink className="text-sm" />
                </button>
            </div>
        </div>
    );
}
