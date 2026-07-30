"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaUser, FaClock, FaArrowRight } from 'react-icons/fa';

const articles = [
    {
        id: 1,
        title: "Top 10 Hidden Gems in Kathmandu Valley",
        category: "Culture",
        date: "Dec 10, 2025",
        author: "Sarah Anderson",
        readTime: "8 min read",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2600&auto=format&fit=crop",
        excerpt: "Explore the ancient alleyways and secret temples that most tourists miss when visiting Nepal's capital. From hidden courtyards to local artisan workshops.",
        featured: true
    },
    {
        id: 2,
        title: "The Ultimate Packing List for Everest Base Camp",
        category: "Trekking",
        date: "Nov 28, 2025",
        author: "Pasang Sherpa",
        readTime: "8 min read",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600&auto=format&fit=crop",
        excerpt: "Don't get caught unaware. Here is everything you need to survive and thrive on the world's most famous trek.",
        featured: true
    },
    {
        id: 3,
        title: "Why Bhutan Should Be Your Next Spiritual Retreat",
        category: "Wellness",
        date: "Dec 05, 2025",
        author: "Sonam Tshering",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=1600&auto=format&fit=crop",
        excerpt: "Discover the serenity of the Thunder Dragon Kingdom and find inner peace in its monasteries, surrounded by pristine Himalayan landscapes.",
        featured: true
    },
    {
        id: 4,
        title: "A Foodie's Guide to Nepalese Cuisine",
        category: "Food & Culture",
        date: "Nov 20, 2025",
        author: "Rajesh Thapa",
        readTime: "10 min read",
        image: "https://images.unsplash.com/photo-1596040033229-a0b5e0e7e6c2?q=80&w=2670&auto=format&fit=crop",
        excerpt: "From momos to dal bhat, explore the rich flavors of Nepal's diverse culinary landscape and where to find the best local eats."
    },
    {
        id: 5,
        title: "Sustainable Trekking: How to Travel Responsibly",
        category: "Eco-Tourism",
        date: "Nov 15, 2025",
        author: "Emma Williams",
        readTime: "7 min read",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2670&auto=format&fit=crop",
        excerpt: "Learn how to minimize your environmental impact while trekking in the Himalayas and support local communities."
    },
    {
        id: 6,
        title: "Monsoon Magic: Why to Visit Nepal in the Rain",
        category: "Travel Tips",
        date: "Nov 10, 2025",
        author: "David Kumar",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2670&auto=format&fit=crop",
        excerpt: "Discover the lush green landscapes and fewer crowds that make monsoon season a hidden treasure for adventurous travelers."
    },
    {
        id: 7,
        title: "Best Photography Spots in the Annapurna Region",
        category: "Photography",
        date: "Nov 5, 2025",
        author: "Lisa Chen",
        readTime: "9 min read",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2670&auto=format&fit=crop",
        excerpt: "Capture breathtaking Himalayan vistas with our guide to the most photogenic locations in the Annapurna Conservation Area."
    },
    {
        id: 8,
        title: "Cultural Etiquette: Do's and Don'ts in Nepal",
        category: "Culture",
        date: "Oct 28, 2025",
        author: "Karma Sherpa",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2600&auto=format&fit=crop",
        excerpt: "Navigate social customs with confidence and show respect for local traditions during your Nepalese adventure."
    },
    {
        id: 9,
        title: "Wildlife Encounters: Chitwan National Park Guide",
        category: "Wildlife",
        date: "Oct 20, 2025",
        author: "James Martinez",
        readTime: "11 min read",
        image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?q=80&w=2676&auto=format&fit=crop",
        excerpt: "Everything you need to know about spotting rhinos, tigers, and exotic birds in one of Asia's premier wildlife destinations."
    }
];

export default function BlogPage() {
    const featuredArticles = articles.filter(a => a.featured);
    const regularArticles = articles.filter(a => !a.featured);

    return (
        <main className="bg-white">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2670&auto=format&fit=crop')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-orange-700/90" />

                <div className="relative z-10 text-center text-white px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl md:text-7xl font-bold mb-4"
                    >
                        Travel Stories & Guides
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl md:text-2xl max-w-3xl mx-auto"
                    >
                        Insights, tips, and inspiration for your Himalayan adventure
                    </motion.p>
                </div>
            </section>

            {/* Featured Articles */}
            <section className="py-20 px-4 xl:px-20 bg-gray-50">
                <div className="container mx-auto">
                    <h2 className="text-4xl font-bold text-gray-800 mb-12">Featured Stories</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {featuredArticles.map((article, index) => (
                            <Link key={article.id} href={`/blog/${article.id}`}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                                >
                                    <div className="relative h-64 overflow-hidden">
                                        <span className="absolute top-4 left-4 z-10 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                            {article.category}
                                        </span>
                                        <Image
                                            src={article.image}
                                            alt={article.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="p-8">
                                        <div className="flex items-center gap-4 text-gray-400 text-sm mb-3">
                                            <span className="flex items-center gap-1">
                                                <FaCalendarAlt />
                                                {article.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaClock />
                                                {article.readTime}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 line-clamp-3">
                                            {article.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500 flex items-center gap-2">
                                                <FaUser className="text-primary" />
                                                {article.author}
                                            </span>
                                            <span className="text-primary font-bold text-sm border-b-2 border-transparent group-hover:border-primary transition-all">
                                                Read More
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>

                    {/* All Articles */}
                    <h2 className="text-3xl font-bold text-gray-800 mb-8">All Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {regularArticles.map((article, index) => (
                            <Link key={article.id} href={`/blog/${article.id}`}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.05 }}
                                    viewport={{ once: true }}
                                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={article.image}
                                            alt={article.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold rounded-full">
                                            {article.category}
                                        </span>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center gap-3 text-gray-400 text-xs mb-2">
                                            <span>{article.date}</span>
                                            <span>•</span>
                                            <span>{article.readTime}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                            {article.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-500">{article.author}</span>
                                            <FaArrowRight className="text-primary group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Signup */}
            <section className="py-16 px-4 bg-primary text-white">
                <div className="container mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Inspired</h2>
                    <p className="text-lg mb-8 text-white/90">
                        Get the latest travel stories, tips, and exclusive deals delivered to your inbox
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-6 py-4 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <button className="px-8 py-4 bg-white text-primary rounded-full font-bold hover:bg-gray-100 transition">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
