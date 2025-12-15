"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

const partners = [
    { name: 'Nepal Tourism Board', logo: 'https://companieslogo.com/img/orig/TRIP-f63c878d.png?t=1658990666' }, // Mock logo
    { name: 'TripAdvisor', logo: 'https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary.svg' },
    { name: 'Lonely Planet', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Lonely_Planet_Logo.svg' },
    { name: 'Expedia', logo: 'https://www.expedia.com/_dms/header/logo.svg?locale=en_US&siteid=1' },
    { name: 'Booking.com', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Booking.com_logo.svg' },
    { name: 'Qatar Airways', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c2/Qatar_Airways_logo_2006.svg' }
];

export default function TrustedPartners() {
    return (
        <section className="py-12 bg-white border-b border-gray-100">
            <div className="container mx-auto px-4 xl:px-20">
                <div className="text-center mb-10">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Trusted By Global Partners</p>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-70">
                    {partners.map((partner, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.1, opacity: 1, filter: 'grayscale(0%)' }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 0.6, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative w-32 h-12 grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
                        >
                            <Image
                                src={partner.logo}
                                alt={partner.name}
                                fill
                                className="object-contain"
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
