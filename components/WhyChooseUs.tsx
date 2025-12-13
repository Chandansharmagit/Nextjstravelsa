"use client";

import { motion } from 'framer-motion';
import { FaDollarSign, FaUserTie, FaHeadset, FaShieldAlt, FaClock, FaHeart } from 'react-icons/fa';

const WhyChooseUs = () => {
    const benefits = [
        {
            id: 1,
            icon: <FaDollarSign className="text-5xl text-secondary" />,
            title: "Best Price Guarantee",
            description: "We offer the most competitive prices with no hidden fees. Get the best value for your money."
        },
        {
            id: 2,
            icon: <FaUserTie className="text-5xl text-secondary" />,
            title: "Expert Local Guides",
            description: "Our experienced guides know every corner and will make your trip truly memorable."
        },
        {
            id: 3,
            icon: <FaHeadset className="text-5xl text-secondary" />,
            title: "24/7 Support",
            description: "Round-the-clock customer support to assist you before, during, and after your trip."
        },
        {
            id: 4,
            icon: <FaShieldAlt className="text-5xl text-secondary" />,
            title: "Safety First",
            description: "Your safety is our priority. All tours follow strict safety protocols and guidelines."
        },
        {
            id: 5,
            icon: <FaClock className="text-5xl text-secondary" />,
            title: "Flexible Booking",
            description: "Easy booking process with flexible cancellation policies for your peace of mind."
        },
        {
            id: 6,
            icon: <FaHeart className="text-5xl text-secondary" />,
            title: "Personalized Experience",
            description: "Customized itineraries tailored to your preferences and travel style."
        }
    ];

    return (
        <section className="py-20 px-4 xl:px-20 bg-light">
            <div className="text-center mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold text-primary mb-4"
                >
                    Why Choose Travel Sansar?
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-600 text-lg max-w-2xl mx-auto"
                >
                    We're committed to making your travel dreams come true with exceptional service and unforgettable experiences.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                    <motion.div
                        key={benefit.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white p-8 rounded-2xl shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                    >
                        {/* Icon */}
                        <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                            {benefit.icon}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-primary mb-3">
                            {benefit.title}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 leading-relaxed">
                            {benefit.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default WhyChooseUs;
