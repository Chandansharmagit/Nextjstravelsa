"use client";

import { motion } from 'framer-motion';
import { FaCompass } from 'react-icons/fa';
import Image from 'next/image';

export default function ApproachSection() {
    return (
        <section className="py-24 bg-[#FDFCFB] overflow-hidden relative">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-[#D4AF37]/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-[1400px] mx-auto px-6 lg:px-20 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="rounded-[60px] overflow-hidden border-8 border-white shadow-2xl">
                            <Image
                                src="/approach-mountain.jpg"
                                alt="Our Approach"
                                width={800}
                                height={800}
                                className="object-cover h-[600px] w-full"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 bg-[#4A4036] p-8 rounded-[32px] shadow-2xl text-[#F5F2ED] max-w-[240px]">
                            <p className="font-medium text-sm leading-relaxed italic">"Discovery is for everyone, but the narrative is for those who dare to look deeper."</p>
                        </div>
                    </motion.div>

                    {/* Text Section */}
                    <div className="space-y-10">
                        <div className="space-y-4">
                            <h2 className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.5em]">The Philosophy</h2>
                            <h3 className="text-5xl md:text-7xl font-black text-[#4A4036] tracking-tighter leading-none p-font">
                                Our Approach to <br /> The Ordinary.
                            </h3>
                        </div>

                        <p className="text-[#8D7B68] text-xl font-medium leading-relaxed">
                            We discard the concept of 'tours'. At Travel Sansar, we curate <span className="text-[#4A4036] font-bold">expeditions</span>. From the hidden trails of the Annapurna range to the silent temples of Patan, we reveal the stories that usually remain whispered.
                        </p>

                        <div className="space-y-6">
                            {[
                                { t: "Bespoke Curation", d: "No two journeys are ever identical." },
                                { t: "Local Sovereignty", d: "We partner exclusively with community-led guides." }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-6 items-center p-6 bg-white/60 backdrop-blur-xl rounded-3xl border border-white hover:border-[#D4AF37]/30 transition-all group">
                                    <div className="w-12 h-12 bg-[#D4AF37]/10 text-[#D4AF37] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
                                        <FaCompass />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#4A4036]">{item.t}</h4>
                                        <p className="text-sm text-[#8D7B68] font-medium">{item.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&display=swap');
                .p-font { font-family: 'Playfair Display', serif; }
            `}</style>
        </section>
    );
}
