"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaConciergeBell, FaArrowRight, FaStar } from 'react-icons/fa';
import ServiceBookingModal from './ServiceBookingModal';

interface Service {
    _id: string;
    title: string;
    description: string;
    price: string;
    image?: string;
    icon?: string;
}

export default function FeaturedServices({ services }: { services: Service[] }) {
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    if (!services || services.length === 0) return null;

    return (
        <section className="py-24 px-4 xl:px-20 bg-gradient-to-b from-white to-gray-50">
            <div className="text-center mb-20">
                <span className="inline-block py-1 px-3 rounded-full bg-teal-50 text-teal-600 font-bold text-xs tracking-wider uppercase mb-4 border border-teal-100">
                    Premium Offerings
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                    Exclusive Services
                </h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-teal-500 to-emerald-400 mx-auto rounded-full mb-6"></div>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed font-light">
                    Elevate your travel experience with our curated selection of premium services, designed for seamless comfort.
                </p>

                <div className="mt-8">
                    <Link href="/services" className="inline-flex items-center text-teal-600 font-semibold hover:text-teal-700 transition-colors group">
                        Explore All Services
                        <span className="ml-2 w-6 h-6 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center text-xs group-hover:translate-x-1 transition-transform">
                            <FaArrowRight />
                        </span>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {services.map((service, index) => (
                    <motion.div
                        key={service._id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                        className="group relative bg-white rounded-[24px] shadow-sm hover:shadow-2xl hover:shadow-teal-900/10 transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col h-[420px]"
                    >
                        {/* Image Layer */}
                        <div className="absolute inset-0 h-full w-full z-0">
                            {service.image ? (
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                                    <FaConciergeBell size={48} />
                                </div>
                            )}
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-90 transition-opacity duration-300" />
                        </div>

                        {/* Floating Price Pill */}
                        <div className="absolute top-4 right-4 z-20">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                                {service.price}
                            </div>
                        </div>

                        {/* Content Layer */}
                        <div className="relative z-10 p-8 flex flex-col h-full justify-end">
                            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-teal-200 transition-colors transform translate-y-2 group-hover:translate-y-0 duration-300">
                                {service.title}
                            </h3>

                            <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                                {service.description}
                            </p>

                            <button
                                onClick={() => setSelectedService(service)}
                                className="w-full py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold hover:bg-white hover:text-teal-900 transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                            >
                                Book Now
                                <FaArrowRight className="text-xs transition-transform duration-300 group-hover/btn:translate-x-1" />
                            </button>
                        </div>

                        {/* Subtle Border Glow on Hover */}
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-teal-500/30 rounded-[24px] pointer-events-none transition-colors duration-500" />
                    </motion.div>
                ))}
            </div>

            {selectedService && (
                <ServiceBookingModal
                    isOpen={!!selectedService}
                    onClose={() => setSelectedService(null)}
                    service={selectedService}
                />
            )}
        </section>
    );
}
