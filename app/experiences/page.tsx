"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { FaHiking, FaPaw, FaLandmark, FaParachuteBox, FaArrowRight, FaStar, FaQuoteLeft, FaPlay } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

const ExperiencesPage = () => {
    const categories = [
        {
            id: 1,
            title: "Trekking & Hiking",
            subtitle: "Conquer the Giants",
            icon: <FaHiking className="text-4xl" />,
            image: "https://img.freepik.com/free-photo/breathtaking-shot-snowy-mountains-cloudy-sky_181624-9640.jpg?w=1380&t=st=1706692800~exp=1706693400~hmac=abcdef", // Mountain
            description: "From the legendary Everest Base Camp to the mystic Annapurna trails, walk amongst the clouds.",
            tags: ["Everest", "Annapurna", "Langtang"]
        },
        {
            id: 2,
            title: "Wildlife Safari",
            subtitle: "Into the Jungle",
            icon: <FaPaw className="text-4xl" />,
            image: "https://img.freepik.com/free-photo/elephant-walking-road-sri-lanka_181624-21146.jpg?w=1380&t=st=1706692800~exp=1706693400~hmac=abcdef", // Elephant/Jungle
            description: "Track the elusive Bengal Tiger and One-Horned Rhino in the dense jungles of Chitwan and Bardia.",
            tags: ["Chitwan", "Bardia", "Elephant Safari"]
        },
        {
            id: 3,
            title: "Cultural Immersion",
            subtitle: "Heritage & History",
            icon: <FaLandmark className="text-4xl" />,
            image: "https://img.freepik.com/free-photo/temple-complex-kathmandu-nepal_181624-37015.jpg?w=1380&t=st=1706692800~exp=1706693400~hmac=abcdef", // Temple
            description: "Lose yourself in the ancient alleyways of Kathmandu and the serene temples of Lumbini.",
            tags: ["UNESCO Sites", "Festivals", "Homestays"]
        },
        {
            id: 4,
            title: "Adventure Sports",
            subtitle: "Adrenaline Rush",
            icon: <FaParachuteBox className="text-4xl" />,
            image: "https://img.freepik.com/free-photo/people-rafting-river_23-2149199342.jpg?w=1380&t=st=1706692800~exp=1706693400~hmac=abcdef", // Rafting
            description: "Raft raging rivers, bungee jump from suspension bridges, or paraglide over lakes.",
            tags: ["Rafting", "Bungee", "Paragliding"]
        },
    ];

    return (
        <main className="bg-white">
            {/* 1. Cinematic Hero Section with Parallax Effect */}
            <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <div
                    className="absolute inset-0 bg-cover bg-center bg-fixed transform scale-105"
                    style={{ backgroundImage: "url('https://img.freepik.com/free-photo/beautiful-view-green-mountains-cloudy-sky_181624-9547.jpg?w=1380&t=st=1706692800~exp=1706693400~hmac=abcdef')" }}
                />

                <div className="relative z-20 container mx-auto px-6 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <span className="inline-block py-2 px-6 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-secondary font-bold tracking-widest uppercase mb-6">
                            Nepal Awaits You
                        </span>
                        <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight drop-shadow-2xl">
                            Beyond <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">Imagination</span>
                        </h1>
                        <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-10 text-gray-200 font-light leading-relaxed">
                            Discover a land where mountains touch the sky and culture breathes in every stone.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Link href="/contact">
                                <button className="px-10 py-5 bg-secondary text-white rounded-full font-bold text-lg hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-500/30 hover:-translate-y-1">
                                    Plan Your Trip
                                </button>
                            </Link>
                            {/* <div className="flex items-center gap-4 cursor-pointer group">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                                    <FaPlay className="text-white ml-1" />
                                </div>
                                <span className="font-semibold text-lg">Watch Film</span>
                            </div> */}
                        </div>
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50"
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                        <div className="w-1 h-3 bg-white rounded-full"></div>
                    </div>
                </motion.div>
            </section>

            {/* 2. Intro Text */}
            <section className="py-24 px-6 xl:px-24 bg-white relative">
                {/* Decorative background text */}
                <div className="absolute top-10 left-0 text-[200px] font-bold text-gray-50 opacity-[0.03] select-none pointer-events-none leading-none">
                    EXPLORE
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                        Events & <span className="text-primary italic">Experiences</span>
                    </h2>
                    <p className="text-gray-600 text-xl leading-relaxed font-light">
                        Travel Sansar isn't just about reaching a destination; it's about the journey within. We curate experiences that challenge, inspire, and transform you. Whether you seek the silence of the peaks or the rhythm of the jungle, we have a story waiting for you.
                    </p>
                </div>
            </section>

            {/* 3. The Experience Categories (Alternating Layout) */}
            <section className="pb-24 px-4 xl:px-20 bg-gray-50">
                <div className="space-y-24">
                    {categories.map((cat, index) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7 }}
                            className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                        >
                            {/* Image Side */}
                            <div className="w-full lg:w-1/2 relative h-[500px] lg:h-[600px] group">
                                <div className="absolute inset-0 bg-primary/20 rounded-[40px] transform rotate-3 transition-transform group-hover:rotate-6"></div>
                                <div className="absolute inset-0 rounded-[40px] overflow-hidden shadow-2xl transform transition-transform group-hover:-translate-y-2">
                                    <Image
                                        src={cat.image}
                                        alt={cat.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                                </div>

                                {/* Floating Badge */}
                                <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-secondary rounded-xl text-2xl">
                                            {cat.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium opacity-80 uppercase tracking-wider">{cat.subtitle}</p>
                                            <h3 className="text-2xl font-bold">{cat.title}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="w-full lg:w-1/2 space-y-8">
                                <h3 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                                    {cat.title.split(' ')[0]} <br />
                                    <span className="text-secondary">{cat.title.split(' ').slice(1).join(' ')}</span>
                                </h3>
                                <p className="text-xl text-gray-600 leading-relaxed border-l-4 border-gray-200 pl-6">
                                    {cat.description}
                                </p>

                                <div className="flex flex-wrap gap-3">
                                    {cat.tags.map(tag => (
                                        <span key={tag} className="px-4 py-2 bg-gray-100 rounded-full text-gray-600 font-medium text-sm hover:bg-white hover:shadow-md transition-all cursor-default">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <Link href="/tours">
                                    <button className="flex items-center gap-3 text-lg font-bold text-primary group-hover:gap-4 transition-all mt-4 border-b-2 border-transparent hover:border-primary pb-1">
                                        Explore Packages <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 4. Interactive Numbers Section */}
            <section className="py-20 bg-primary text-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
                        <div>
                            <div className="text-5xl font-bold mb-2">500+</div>
                            <div className="text-white/80">Happy Travelers</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">50+</div>
                            <div className="text-white/80">Unique Destinations</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">24/7</div>
                            <div className="text-white/80">Support</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold mb-2">100%</div>
                            <div className="text-white/80">Customizable</div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ExperiencesPage;
