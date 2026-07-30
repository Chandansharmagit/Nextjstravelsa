"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaCheckCircle, FaUserCircle } from 'react-icons/fa';
import api from '@/lib/api';

interface Review {
    _id: string;
    name?: string;
    firstname?: string;
    lastname?: string;
    email: string;
    tripDestination?: string;
    rating?: number;
    feedbackType?: string;
    message?: string;
    text?: string;
}

const fallbackReviews: Review[] = [
    {
        _id: 'fb1',
        name: 'Sarah & Mark Jenkins',
        email: 'sarah.j@example.com',
        tripDestination: 'Everest Base Camp Trek',
        rating: 5,
        feedbackType: 'Luxury Trekking',
        message: 'Travel Sansar organized the trek of a lifetime for us! The helicopter flight out of Gorakshep back to Kathmandu was breathtaking. Our guide Pasang took care of every single detail with immense warmth.'
    },
    {
        _id: 'fb2',
        name: 'David Richardson',
        email: 'david.r@example.com',
        tripDestination: 'Annapurna Luxury Circuit',
        rating: 5,
        feedbackType: 'VIP Expedition',
        message: 'Flawless execution! Staying in handpicked mountain lodges after long days of trekking made all the difference. Their 24/7 concierge was always on top of weather updates.'
    },
    {
        _id: 'fb3',
        name: 'Elena Rostova',
        email: 'elena@example.com',
        tripDestination: 'Kathmandu & Chitwan Safari',
        rating: 5,
        feedbackType: 'Cultural & Wildlife',
        message: 'Unforgettable experience seeing wild rhinos and tigers in Chitwan! The cultural heritage walk in Bhaktapur with their senior historian guide was deeply insightful.'
    }
];

const ReviewsSection = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await api.get('/feedback');
                const data = res.data;
                const reviewsData = Array.isArray(data) ? data : data.data || data.feedback || [];
                const filteredReviews = reviewsData
                    .filter((r: Review) => r.rating && r.rating > 0)
                    .slice(0, 6);
                setReviews(filteredReviews.length > 0 ? filteredReviews : fallbackReviews);
            } catch (error) {
                console.warn('Failed to fetch reviews from API, using curated fallbacks', error);
                setReviews(fallbackReviews);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const renderStars = (rating: number) => (
        <div className="flex gap-1 text-amber-400 mb-4">
            {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < rating ? 'text-amber-400' : 'text-slate-700'} size={14} />
            ))}
        </div>
    );

    return (
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/3 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-amber-300 font-black text-xs uppercase tracking-[0.3em] font-outfit mb-4"
                    >
                        <FaCheckCircle className="text-amber-400" /> Verified Traveler Stories
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black font-outfit tracking-tight text-white mb-4"
                    >
                        Voices of <span className="font-playfair italic font-normal text-amber-400">Explorers</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto font-medium"
                    >
                        Real experiences shared by adventurers who placed their trust in Travel Sansar.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review, index) => {
                        const customerName = review.name || `${review.firstname || ''} ${review.lastname || ''}`.trim() || 'Valued Traveler';
                        const feedback = review.message || review.text || '';

                        return (
                            <motion.div
                                key={review._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08, duration: 0.6 }}
                                className="group relative bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-amber-400/40 shadow-xl transition-all duration-500 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        {renderStars(review.rating || 5)}
                                        <FaQuoteLeft className="text-2xl text-amber-400/30 group-hover:text-amber-400/60 transition-colors" />
                                    </div>

                                    <p className="text-slate-200 text-sm leading-relaxed mb-8 italic font-medium">
                                        "{feedback}"
                                    </p>
                                </div>

                                <div className="pt-6 border-t border-white/10 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-lg font-outfit shrink-0">
                                        {customerName.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-white font-outfit text-base">
                                                {customerName}
                                            </h4>
                                            <FaCheckCircle className="text-teal-400 text-xs" title="Verified Traveler" />
                                        </div>
                                        {review.tripDestination && (
                                            <p className="text-xs text-amber-300 font-medium mt-0.5">
                                                {review.tripDestination}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ReviewsSection;
