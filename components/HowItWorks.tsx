"use client";

import { motion } from 'framer-motion';
import { FaSearch, FaCalendarCheck, FaPlane, FaStar } from 'react-icons/fa';

const HowItWorks = () => {
    const steps = [
        {
            id: 1,
            icon: <FaSearch className="text-5xl text-secondary" />,
            title: "Search Destination",
            description: "Browse through our curated destinations and find your perfect getaway"
        },
        {
            id: 2,
            icon: <FaCalendarCheck className="text-5xl text-secondary" />,
            title: "Book Your Trip",
            description: "Select your dates, customize your package, and secure your booking instantly"
        },
        {
            id: 3,
            icon: <FaPlane className="text-5xl text-secondary" />,
            title: "Travel Safely",
            description: "Enjoy your journey with our 24/7 support and expert local guides"
        },
        {
            id: 4,
            icon: <FaStar className="text-5xl text-secondary" />,
            title: "Create Memories",
            description: "Experience unforgettable moments and share your amazing stories"
        }
    ];

    return (
        <section className="py-20 px-4 xl:px-20 bg-white">
            <div className="text-center mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold text-primary mb-4"
                >
                    How It Works
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-600 text-lg max-w-2xl mx-auto"
                >
                    Your journey to adventure starts here. Follow these simple steps to plan your perfect trip.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {steps.map((step, index) => (
                    <motion.div
                        key={step.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="relative"
                    >
                        <div className="bg-light p-8 rounded-2xl shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center h-full">
                            {/* Step Number */}
                            <div className="absolute -top-4 -left-4 w-12 h-12 bg-secondary text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                                {step.id}
                            </div>

                            {/* Icon */}
                            <div className="mb-6 flex justify-center">
                                {step.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-primary mb-3">
                                {step.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 leading-relaxed">
                                {step.description}
                            </p>
                        </div>

                        {/* Connector Line (hidden on last item) */}
                        {index < steps.length - 1 && (
                            <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-secondary/30" />
                        )}
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
