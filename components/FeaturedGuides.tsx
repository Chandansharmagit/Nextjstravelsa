"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight, FaCalendarAlt } from 'react-icons/fa';

const guides = [
    {
        id: 1,
        title: "Top 10 Hidden Gems in Kathmandu Valley",
        category: "Culture",
        date: "Dec 10, 2025",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2600&auto=format&fit=crop",
        excerpt: "Explore the ancient alleyways and secret temples that most tourists miss when visiting Nepal's capital."
    },
    {
        id: 2,
        title: "The Ultimate Packing List for Everest Base Camp",
        category: "Trekking",
        date: "Nov 28, 2025",
        image: "https://images.unsplash.com/photo-1545562083-c583d014b261?q=80&w=2670&auto=format&fit=crop",
        excerpt: "Don't get caught unaware. Here is everything you need to survive and thrive on the world's most famous trek."
    },
    {
        id: 3,
        title: "Why Bhutan Should Be Your Next Spiritual Retreat",
        category: "Wellness",
        date: "Dec 05, 2025",
        image: "https://images.unsplash.com/photo-1578559318534-1100df88d04a?q=80&w=2681&auto=format&fit=crop",
        excerpt: "Discover the serenity of the Thunder Dragon Kingdom and find inner peace in its monasteries."
    }
];

export default function FeaturedGuides() {
    return (
        <section className="py-20 px-4 xl:px-20 bg-gray-50">
            <div className="container mx-auto">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-800 mb-4">Travel Inspiration & Tips</h2>
                        <p className="text-gray-600 max-w-2xl">Curated travel advice to help you plan your perfect trip.</p>
                    </div>
                    <Link href="/blog" className="hidden md:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                        View All Articles <FaArrowRight />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {guides.map((guide, index) => (
                        <Link key={guide.id} href="/blog">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <span className="absolute top-4 left-4 z-10 px-4 py-1 bg-white/90 backdrop-blur-md text-gray-800 text-xs font-bold rounded-full uppercase tracking-wider">
                                        {guide.category}
                                    </span>
                                    <Image
                                        src={guide.image}
                                        alt={guide.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-8">
                                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                                        <FaCalendarAlt />
                                        <span>{guide.date}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                        {guide.title}
                                    </h3>
                                    <p className="text-gray-600 mb-6 line-clamp-3">
                                        {guide.excerpt}
                                    </p>
                                    <span className="text-primary font-bold text-sm border-b-2 border-transparent group-hover:border-primary transition-all">
                                        Read Article
                                    </span>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-primary font-bold">
                        View All Articles <FaArrowRight />
                    </Link>
                </div>
            </div>
        </section>
    );
}
