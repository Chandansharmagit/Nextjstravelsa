"use client";

import { motion } from 'framer-motion';
import { FaGlobeAmericas, FaHeart, FaStar, FaCompass, FaFistRaised, FaQuoteLeft, FaMountain, FaUsers, FaLeaf } from 'react-icons/fa';
import Image from 'next/image';

const features = [
    {
        icon: <FaGlobeAmericas />,
        title: "Cultural Bridge",
        description: "We don't just show you places; we immerse you in the local narrative, connecting you with the soul of the Himalayas."
    },
    {
        icon: <FaLeaf />,
        title: "Eco-Conscious",
        description: "Our expeditions are designed to leave nothing but footprints, supporting local ecosystems and communities."
    },
    {
        icon: <FaStar />,
        title: "Artisanal Travel",
        description: "Every itinerary is a custom-crafted masterpiece, refined through decades of on-ground expertise."
    }
];

const pillars = [
    { title: "Authenticity", value: "Real stories, real people, real encounters." },
    { title: "Precision", value: "Meticulous planning for seamless exploration." },
    { title: "Heritage", value: "Preserving the legacy of Himalayan traditions." }
];

export default function AboutPage() {
    return (
        <main className="bg-[#FDFCFB] min-h-screen pb-32 pt-40 relative font-sans overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[5%] left-[10%] w-[40%] h-[40%] bg-[#D4AF37]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] right-[0%] w-[50%] h-[50%] bg-[#4A4036]/5 rounded-full blur-[180px]" />
                <div className="absolute top-1/2 left-0 w-[20%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-[1400px] mx-auto px-6 lg:px-20 relative z-10">

                {/* 1. Hero: The Narrative Start */}
                <div className="text-center mb-40">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-3 text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.6em] mb-10"
                    >
                        <span className="w-12 h-[1px] bg-[#D4AF37]" />
                        The Travel Sansar Ethos
                        <span className="w-12 h-[1px] bg-[#D4AF37]" />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-[10rem] font-black text-[#4A4036] tracking-tighter mb-16 leading-[0.85] p-font"
                    >
                        Heritage <br /> Reimagined.
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="max-w-3xl mx-auto"
                    >
                        <p className="text-2xl text-[#8D7B68] font-medium leading-relaxed mb-8">
                            Travel Sansar emerged not as a commercial venture, but as a <span className="text-[#4A4036] font-bold">manifesto for the modern wanderer</span>. We believe that global exploration should be as cinematic as it is meaningful.
                        </p>
                        <div className="flex justify-center gap-8 pt-8">
                            {pillars.map((p, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-2">{p.title}</div>
                                    <div className="w-1 h-1 bg-[#D4AF37] rounded-full mx-auto" />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* 2. Visual Storytelling Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-40">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#D4AF37]/10 rounded-full blur-3xl" />
                        <div className="rounded-[80px] overflow-hidden border-8 border-white shadow-3xl">
                            <Image
                                src="https://img.freepik.com/free-photo/beautiful-nepal-landscape-mountains_23-2149153277.jpg"
                                alt="Himalayan Heritage"
                                width={800}
                                height={1000}
                                className="object-cover h-[700px] hover:scale-105 transition-transform duration-1000"
                            />
                        </div>
                        <div className="absolute -bottom-10 -right-10 bg-[#4A4036] p-10 rounded-[40px] shadow-2xl text-[#F5F2ED] max-w-[280px]">
                            <FaQuoteLeft className="text-[#D4AF37] mb-6 text-3xl" />
                            <p className="font-medium leading-relaxed italic">"Discovery is for everyone, but the narrative is for those who dare to look deeper."</p>
                        </div>
                    </motion.div>

                    <div className="space-y-12">
                        <h2 className="text-5xl md:text-7xl font-black text-[#4A4036] tracking-tighter leading-none h-font">
                            Our Approach to <br /> The Ordinary.
                        </h2>
                        <p className="text-[#8D7B68] text-xl font-medium leading-relaxed">
                            We discard the concept of 'tours'. At Travel Sansar, we curate <span className="text-[#4A4036] font-bold">expeditions</span>. From the hidden trails of the Annapurna range to the silent temples of Patan, we reveal the stories that usually remain whispered.
                        </p>
                        <div className="grid grid-cols-1 gap-6">
                            {[
                                { t: "Bespoke Curation", d: "No two journeys are ever identical." },
                                { t: "Local Sovereignty", d: "We partner exclusively with community-led guides." },
                                { t: "Digital Precision", d: "Seamless booking powered by modern tech." }
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-6 items-center p-6 bg-white/50 rounded-3xl border border-white hover:border-[#D4AF37]/30 transition-all group">
                                    <div className="w-12 h-12 bg-[#D4AF37]/10 text-[#D4AF37] rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37] group-hover:text-white transition-colors">
                                        <FaCompass />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#4A4036] h-font">{item.t}</h4>
                                        <p className="text-sm text-[#8D7B68] font-medium">{item.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. The Studio Identity */}
                <div className="mb-40">
                    <div className="text-center mb-20">
                        <h2 className="text-5xl font-black text-[#4A4036] tracking-tight h-font mb-4">Core Principles</h2>
                        <div className="w-20 h-1 bg-[#D4AF37] mx-auto rounded-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {features.map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-12 rounded-[56px] bg-white border border-white shadow-xl hover:shadow-2xl transition-all text-center"
                            >
                                <div className="w-20 h-20 rounded-3xl bg-[#4A4036] text-[#D4AF37] flex items-center justify-center mb-10 mx-auto text-3xl shadow-lg">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-[#4A4036] mb-6 h-font">{feature.title}</h3>
                                <p className="text-[#8D7B68] font-medium leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 4. The Global Impact (Stats & Community) */}
                <div className="relative rounded-[72px] overflow-hidden bg-[#4A4036] p-20 lg:p-32 text-[#F5F2ED] mb-40">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                        <div>
                            <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.5em] mb-10 block">Global Footprint</span>
                            <h3 className="text-6xl md:text-8xl font-bold tracking-tighter mb-10 p-font leading-[0.9]">Beyond <br /> Borders.</h3>
                            <div className="grid grid-cols-2 gap-10">
                                <div className="space-y-2">
                                    <div className="text-5xl font-black text-[#D4AF37] h-font">150+</div>
                                    <div className="text-xs uppercase tracking-widest text-white/50 font-bold">Curated Routes</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-5xl font-black text-white h-font">12k</div>
                                    <div className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">Explorers Joined</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-5xl font-black text-white h-font">24/7</div>
                                    <div className="text-xs uppercase tracking-widest text-white/50 font-bold">Concierge Support</div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-5xl font-black text-[#D4AF37] h-font">100%</div>
                                    <div className="text-xs uppercase tracking-widest text-white/50 font-bold">Local Guides</div>
                                </div>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                className="grid grid-cols-2 gap-4"
                            >
                                <div className="space-y-4">
                                    <div className="rounded-3xl overflow-hidden h-64 border-4 border-white/5">
                                        <Image src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2071&auto=format&fit=crop" width={400} height={400} className="object-cover h-full" alt="Expedition" />
                                    </div>
                                    <div className="rounded-3xl overflow-hidden h-40 border-4 border-white/5">
                                        <Image src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop" width={400} height={400} className="object-cover h-full" alt="Vista" />
                                    </div>
                                </div>
                                <div className="space-y-4 pt-12">
                                    <div className="rounded-3xl overflow-hidden h-40 border-4 border-white/5">
                                        <Image src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop" width={400} height={400} className="object-cover h-full" alt="Sanctuary" />
                                    </div>
                                    <div className="rounded-3xl overflow-hidden h-64 border-4 border-white/5">
                                        <Image src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" width={400} height={400} className="object-cover h-full" alt="Mountain" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* 5. Founding Philosophy */}
                <div className="bg-white/40 backdrop-blur-3xl p-16 lg:p-24 rounded-[64px] border border-white max-w-5xl mx-auto shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 text-[#D4AF37]/10 text-9xl">
                        <FaCompass />
                    </div>
                    <div className="relative z-10 space-y-8">
                        <div className="w-16 h-1 bg-[#D4AF37]" />
                        <h2 className="text-4xl md:text-6xl font-black text-[#4A4036] tracking-tighter p-font">Our Legacy <br /> Your Journey.</h2>
                        <div className="space-y-6 text-[#8D7B68] text-xl font-medium leading-relaxed">
                            <p>Founded on the principle that travel is the highest form of education, Travel Sansar continues to bridge the gap between digital ease and physical raw experience. We don't just sell tickets; we open doors to the unknown.</p>
                            <div className="flex items-center gap-6 pt-10">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="w-14 h-14 rounded-full border-4 border-[#FDFCFB] bg-slate-200 overflow-hidden shadow-lg">
                                            <Image src={`https://randomuser.me/api/portraits/thumb/men/${i + 20}.jpg`} alt="guide" width={56} height={56} />
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <div className="text-[#4A4036] font-black h-font">Join the Elite Collective</div>
                                    <div className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">5400+ Active Explorers</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Outfit:wght@400;600;800;900&display=swap');
                .p-font { font-family: 'Playfair Display', serif; }
                .h-font { font-family: 'Outfit', sans-serif; }
            `}</style>
        </main>
    );
}
