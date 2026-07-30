"use client";

import { motion } from 'framer-motion';
import { FaUsers, FaMapMarkedAlt, FaClock, FaStar, FaShieldAlt, FaMedal } from 'react-icons/fa';

const StatsSection = () => {
    const stats = [
        {
            id: 1,
            icon: <FaUsers className="text-4xl text-amber-400 mb-3" />,
            number: "15,000+",
            label: "Adventurers Served",
            desc: "From 45+ countries worldwide"
        },
        {
            id: 2,
            icon: <FaMapMarkedAlt className="text-4xl text-teal-400 mb-3" />,
            number: "65+",
            label: "Curated Destinations",
            desc: "Nepal, Bhutan & Tibet"
        },
        {
            id: 3,
            icon: <FaClock className="text-4xl text-blue-400 mb-3" />,
            number: "15+ Years",
            label: "Himalayan Mastery",
            desc: "Licensed since 2011"
        },
        {
            id: 4,
            icon: <FaStar className="text-4xl text-amber-400 mb-3" />,
            number: "99.8%",
            label: "Satisfaction Rate",
            desc: "4.9 ★ Average Reviews"
        }
    ];

    return (
        <section className="py-24 bg-gradient-to-br from-teal-950 via-slate-900 to-slate-950 text-white relative overflow-hidden">
            {/* Ambient Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[160px] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-amber-300 font-black text-xs uppercase tracking-[0.3em] font-outfit mb-4"
                    >
                        <FaMedal /> Benchmark of Excellence
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black font-outfit tracking-tight text-white mb-4"
                    >
                        Our Heritage in <span className="font-playfair italic font-normal text-amber-400">Numbers</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto font-medium"
                    >
                        Backed by official certifications from TAAN, NATTA, NMA & Nepal Tourism Board.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.08, duration: 0.5 }}
                        >
                            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/15 hover:border-amber-400/50 shadow-xl transition-all duration-500 hover:scale-105 text-center h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-center">{stat.icon}</div>
                                    <h3 className="text-4xl md:text-5xl font-black font-outfit text-white mb-1 tracking-tight">
                                        {stat.number}
                                    </h3>
                                    <p className="text-amber-300 text-base font-bold font-outfit uppercase tracking-wider mb-2">
                                        {stat.label}
                                    </p>
                                    <p className="text-slate-400 text-xs font-medium">
                                        {stat.desc}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Trust Seals Banner */}
                <div className="pt-8 border-t border-white/10 flex flex-wrap justify-center items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-400 font-outfit">
                    <span className="flex items-center gap-2"><FaShieldAlt className="text-amber-400" /> TAAN Member</span>
                    <span className="flex items-center gap-2"><FaShieldAlt className="text-teal-400" /> NATTA Accredited</span>
                    <span className="flex items-center gap-2"><FaShieldAlt className="text-blue-400" /> NMA Certified</span>
                    <span className="flex items-center gap-2"><FaShieldAlt className="text-amber-400" /> Government Licensed #1842</span>
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
