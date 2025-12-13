"use client";

import { motion } from 'framer-motion';
import { FaUsers, FaMapMarkedAlt, FaClock, FaStar } from 'react-icons/fa';

const StatsSection = () => {
    const stats = [
        {
            id: 1,
            icon: <FaUsers className="text-5xl text-white mb-4" />,
            number: "10,000+",
            label: "Happy Travelers",
            color: "bg-primary"
        },
        {
            id: 2,
            icon: <FaMapMarkedAlt className="text-5xl text-white mb-4" />,
            number: "50+",
            label: "Destinations",
            color: "bg-secondary"
        },
        {
            id: 3,
            icon: <FaClock className="text-5xl text-white mb-4" />,
            number: "15+",
            label: "Years Experience",
            color: "bg-primary"
        },
        {
            id: 4,
            icon: <FaStar className="text-5xl text-white mb-4" />,
            number: "500+",
            label: "Tours Completed",
            color: "bg-secondary"
        }
    ];

    return (
        <section className="py-20 px-4 xl:px-20 bg-gradient-to-br from-primary to-teal-800 text-white">
            <div className="text-center mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold mb-4"
                >
                    Our Journey in Numbers
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-white/90 text-lg max-w-2xl mx-auto"
                >
                    Trusted by thousands of travelers worldwide
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="text-center"
                    >
                        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
                            <div className="flex justify-center">
                                {stat.icon}
                            </div>
                            <h3 className="text-4xl md:text-5xl font-bold mb-2">
                                {stat.number}
                            </h3>
                            <p className="text-white/90 text-lg font-medium">
                                {stat.label}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default StatsSection;
