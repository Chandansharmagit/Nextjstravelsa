"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
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

const ReviewsSection = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await api.get('/feedback');
                // Get the data array from the response
                const data = res.data;
                const reviewsData = Array.isArray(data) ? data : data.data || data.feedback || [];
                // Filter only reviews with ratings and limit to 6
                const filteredReviews = reviewsData
                    .filter((r: Review) => r.rating && r.rating > 0)
                    .slice(0, 6);
                setReviews(filteredReviews);
            } catch (error) {
                console.error('Failed to fetch reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                    <FaStar
                        key={i}
                        className={`${i < rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                    />
                ))}
            </div>
        );
    };

    if (loading) {
        return (
            <section className="py-20 px-4 xl:px-20 bg-light">
                <div className="text-center">
                    <p className="text-gray-500">Loading reviews...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 px-4 xl:px-20 bg-light">
            <div className="text-center mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold text-primary mb-4"
                >
                    What Our Travelers Say
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-600 text-lg max-w-2xl mx-auto"
                >
                    Real experiences from real travelers who trusted us with their journeys
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {reviews.map((review, index) => {
                    const customerName = review.name || `${review.firstname || ''} ${review.lastname || ''}`.trim() || 'Anonymous';
                    const feedback = review.message || review.text || '';

                    return (
                        <motion.div
                            key={review._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-8 rounded-2xl shadow-card hover:shadow-xl transition-all duration-300 relative"
                        >
                            {/* Quote Icon */}
                            <FaQuoteLeft className="text-4xl text-secondary/20 absolute top-4 right-4" />

                            {/* Rating */}
                            {renderStars(review.rating || 0)}

                            {/* Feedback */}
                            <p className="text-gray-700 leading-relaxed mb-6 italic">
                                "{feedback}"
                            </p>

                            {/* Customer Info */}
                            <div className="border-t pt-4">
                                <h4 className="font-bold text-primary">
                                    {customerName}
                                </h4>
                                {review.tripDestination && (
                                    <p className="text-sm text-gray-500">
                                        Traveled to {review.tripDestination}
                                    </p>
                                )}
                                {review.feedbackType && (
                                    <p className="text-xs text-secondary mt-1">
                                        {review.feedbackType}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {reviews.length === 0 && (
                <div className="text-center text-gray-500">
                    <p>No reviews available at the moment.</p>
                </div>
            )}
        </section>
    );
};

export default ReviewsSection;
