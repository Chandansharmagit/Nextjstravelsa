"use client";

import { motion } from 'framer-motion';
import { FaSearch, FaCalendarCheck, FaPlane, FaStar, FaRoute } from 'react-icons/fa';

const HowItWorks = () => {
    const steps = [
        {
            id: "01",
            icon: <FaSearch className="text-3xl text-amber-400" />,
            title: "Discover Destination",
            description: "Explore handpicked Himalayan treks, heritage tours, and VIP helicopter safaris tailored to your vision."
        },
        {
            id: "02",
            icon: <FaCalendarCheck className="text-3xl text-teal-400" />,
            title: "Personalize Package",
            description: "Customize dates, group size, lodge preferences, and special inclusions with our local experts."
        },
        {
            id: "03",
            icon: <FaPlane className="text-3xl text-blue-400" />,
            title: "Seamless Travel",
            description: "Enjoy zero-stress travel with 24/7 dedicated concierge, private transfers, and certified local guides."
        },
        {
            id: "04",
            icon: <FaStar className="text-3xl text-amber-400" />,
            title: "Cherish Memories",
            description: "Return home with life-changing memories, high-altitude summits, and genuine cultural connections."
        }
    ];

    return (
        <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-teal-300 font-black text-xs uppercase tracking-[0.3em] font-outfit mb-4"
                    >
                        <FaRoute /> Effortless 4-Step Process
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-6xl font-black font-outfit tracking-tight text-white mb-4"
                    >
                        How Your Journey <span className="font-playfair italic font-normal text-amber-400">Unfolds</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto font-medium"
                    >
                        From initial inspiration to standing atop mountain passes, we handle every detail seamlessly.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.6 }}
                            className="relative group"
                        >
                            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 hover:border-amber-400/50 shadow-xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                            {step.icon}
                                        </div>
                                        <span className="text-3xl font-black font-outfit text-amber-400/40 group-hover:text-amber-400 transition-colors">
                                            {step.id}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-black font-outfit text-white mb-3 tracking-tight group-hover:text-amber-300 transition-colors">
                                        {step.title}
                                    </h3>

                                    <p className="text-slate-300 text-sm leading-relaxed font-medium">
                                        {step.description}
                                    </p>
                                </div>
                            </div>

                            {/* Connector Line (Desktop) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[2px] bg-gradient-to-r from-amber-400/50 to-transparent z-20 pointer-events-none" />
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
