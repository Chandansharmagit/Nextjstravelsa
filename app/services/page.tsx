"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaConciergeBell, FaSearch } from 'react-icons/fa';
import Image from 'next/image';
import api from '@/lib/api';
import ServiceBookingModal from '@/components/ServiceBookingModal';

export default function ServicesPage() {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await api.get('/services');
            setServices(res.data);
        } catch (error) {
            console.error("Failed to fetch services", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBookNow = (service: any) => {
        setSelectedService(service);
        setIsModalOpen(true);
    };

    return (
        <main className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2670&auto=format&fit=crop')" }}
                />
                <div className="relative z-20 text-center text-white px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Services</h1>
                        <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
                            Premium travel services designed to make your journey more comfortable and memorable.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 px-4 xl:px-20 max-w-[1440px] mx-auto">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : services.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={service._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-card group hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col"
                            >
                                <div className="relative h-56 overflow-hidden bg-gray-100">
                                    {service.image ? (
                                        <Image
                                            src={service.image}
                                            alt={service.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <FaConciergeBell className="text-6xl" />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-primary shadow-sm">
                                        {service.price}
                                    </div>
                                </div>

                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-primary transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-gray-600 line-clamp-3 leading-relaxed">
                                            {service.description}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                                        <button
                                            onClick={() => handleBookNow(service)}
                                            className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-primary hover:-translate-y-1 transition-all shadow-lg hover:shadow-primary/30"
                                        >
                                            Book This Service
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        <FaSearch className="text-6xl mx-auto mb-4 opacity-20" />
                        <h3 className="text-xl font-bold">No services found</h3>
                        <p>Please check back later.</p>
                    </div>
                )}
            </section>

            {/* Booking Modal */}
            {selectedService && (
                <ServiceBookingModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    service={selectedService}
                />
            )}
        </main>
    );
}
