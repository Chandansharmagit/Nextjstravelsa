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
        <section className="py-24 px-4 xl:px-20 bg-white relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-50 rounded-full blur-3xl -mr-64 -mt-64 opacity-50" />
            
            <div className="text-center mb-24 relative z-10">
                <span className="inline-block py-1.5 px-5 rounded-full bg-slate-100 text-slate-500 font-black text-[10px] tracking-[0.3em] uppercase mb-6 border border-slate-200/50 font-outfit">
                    Connoisseur Offerings
                </span>
                <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter font-outfit">
                    Elite <span className="font-normal italic font-playfair text-slate-400/80 ml-2">Services</span>
                </h2>
                <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                    Curated experiences designed to transcend the ordinary. Every detail meticulously crafted for your journey.
                </p>

                <div className="mt-10">
                    <Link href="/services" className="inline-flex items-center gap-3 text-slate-900 font-black text-[12px] uppercase tracking-widest hover:text-blue-600 transition-all group font-outfit">
                        Explore Full Archive
                        <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-900 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <FaArrowRight size={10} />
                        </span>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {services.map((service, index) => (
                    <motion.div
                        key={service._id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.8 }}
                        className="group relative bg-white rounded-[20px] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)] transition-all duration-700 overflow-hidden border border-slate-100 flex flex-col h-[460px]"
                    >
                        {/* Image Layer */}
                        <div className="absolute inset-0 h-full w-full z-0 overflow-hidden">
                            {service.image ? (
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200">
                                    <FaConciergeBell size={48} />
                                </div>
                            )}
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent opacity-90 group-hover:opacity-95 transition-all duration-500" />
                        </div>

                        {/* Floating Price Pill */}
                        <div className="absolute top-5 right-5 z-20">
                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-4 py-1.5 rounded-full text-[11px] font-black tracking-widest font-outfit shadow-lg">
                                {service.price}
                            </div>
                        </div>

                        {/* Content Layer */}
                        <div className="relative z-10 p-8 flex flex-col h-full justify-end">
                            <h3 className="text-2xl font-black text-white mb-3 group-hover:translate-x-2 transition-transform duration-500 font-outfit tracking-tight">
                                {service.title}
                            </h3>

                            <p className="text-white/60 text-sm leading-relaxed mb-8 line-clamp-2 font-medium">
                                {service.description}
                            </p>

                            <button
                                onClick={() => setSelectedService(service)}
                                className="w-full py-4 rounded-[16px] bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[11px] font-black uppercase tracking-[0.2em] font-outfit hover:bg-white hover:text-slate-950 transition-all duration-500 flex items-center justify-center gap-3 group/btn shadow-xl shadow-black/20"
                            >
                                Secure Sanctuary
                                <FaArrowRight size={10} className="transition-transform duration-500 group-hover/btn:translate-x-2 group-hover/btn:rotate-[-45deg]" />
                            </button>
                        </div>

                        {/* Subtle Border Glow on Hover */}
                        <div className="absolute inset-0 border border-transparent group-hover:border-white/20 rounded-[20px] pointer-events-none transition-colors duration-500" />
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
