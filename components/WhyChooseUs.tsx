"use client";

import { motion } from 'framer-motion';
import { FaDollarSign, FaUserTie, FaHeadset, FaShieldAlt, FaClock, FaHeart, FaAward } from 'react-icons/fa';

const WhyChooseUs = () => {
    const benefits = [
        {
            id: 1,
            icon: <FaDollarSign className="text-3xl text-amber-500" />,
            badge: "Best Price Guarantee",
            title: "Transparent & Direct Pricing",
            description: "Direct local operator rates with zero hidden middleman fees. Guaranteed highest value for luxury expeditions."
        },
        {
            id: 2,
            icon: <FaUserTie className="text-3xl text-teal-600" />,
            badge: "Local Excellence",
            title: "Certified Sherpa Guides",
            description: "Native Himalayan summiteers and heritage experts trained in high-altitude safety and wilderness medicine."
        },
        {
            id: 3,
            icon: <FaHeadset className="text-3xl text-blue-600" />,
            badge: "VIP Concierge",
            title: "24/7 Dedicated Support",
            description: "Personal travel manager assigned to your expedition before, during, and after your trip for seamless care."
        },
        {
            id: 4,
            icon: <FaShieldAlt className="text-3xl text-emerald-600" />,
            badge: "Safety Guaranteed",
            title: "Comprehensive Safety Net",
            description: "Satellite GPS tracking, emergency helicopter evacuation coordination, and medical-grade oxygen on high passes."
        },
        {
            id: 5,
            icon: <FaClock className="text-3xl text-indigo-600" />,
            badge: "100% Peace of Mind",
            title: "Flexible Rescheduling",
            description: "Book with confidence. Enjoy free trip date changes up to 30 days before departure with full credit guarantee."
        },
        {
            id: 6,
            icon: <FaHeart className="text-3xl text-rose-500" />,
            badge: "Bespoke Curation",
            title: "Tailored Luxury Experiences",
            description: "From private helicopter breakfasts facing Mount Everest to private monastic blessings, crafted just for you."
        }
    ];

    return (
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-amber-300 font-black text-xs uppercase tracking-[0.3em] font-outfit mb-4"
                    >
                        <FaAward /> Premier Travel Agency Standard
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black font-outfit tracking-tight text-white mb-6"
                    >
                        Why Travel With <span className="font-playfair italic font-normal text-amber-400">Travel Sansar</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed"
                    >
                        We combine 15+ years of high-altitude Himalayan mastery with luxury hospitality standards to deliver unforgettable journeys.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((b, index) => (
                        <motion.div
                            key={b.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08, duration: 0.6 }}
                            className="group relative bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-amber-400/40 shadow-xl hover:shadow-[0_20px_50px_rgba(247,147,30,0.15)] transition-all duration-500 flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        {b.icon}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider font-outfit px-3 py-1 rounded-full bg-white/10 text-slate-300 border border-white/10">
                                        {b.badge}
                                    </span>
                                </div>

                                <h3 className="text-xl font-black font-outfit text-white mb-3 tracking-tight group-hover:text-amber-300 transition-colors">
                                    {b.title}
                                </h3>

                                <p className="text-slate-300 text-sm leading-relaxed font-medium">
                                    {b.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
