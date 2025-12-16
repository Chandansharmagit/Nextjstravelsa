"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import api from '@/lib/api';
import { FaLinkedinIn, FaEnvelope, FaTwitter, FaUserTie } from 'react-icons/fa';

interface TeamMember {
    _id: string;
    name: string;
    role: string;
    image: string;
    bio: string;
}

const TeamSection = () => {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await api.get('/team');
                const data = Array.isArray(res.data) ? res.data : res.data.team || res.data.data || [];
                setTeam(data);
            } catch (error) {
                console.error('Failed to fetch team:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
    }, []);

    if (loading) return null;

    return (
        <section className="py-24 px-4 xl:px-20 bg-white">
            <div className="text-center mb-20">
                <span className="inline-block py-1 px-3 rounded-full bg-orange-50 text-orange-600 font-bold text-xs tracking-wider uppercase mb-4 border border-orange-100">
                    The People
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                    Meet Our Team
                </h2>
                <div className="w-24 h-1.5 bg-gradient-to-r from-orange-400 to-red-400 mx-auto rounded-full mb-6"></div>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed font-light">
                    The dedicated professionals working behind the scenes to create unforgettable experiences.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {team.map((member, index) => (
                    <motion.div
                        key={member._id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
                        className="group relative bg-white rounded-[24px] shadow-sm hover:shadow-2xl hover:shadow-orange-900/10 transition-all duration-500 overflow-hidden border border-gray-100 flex flex-col h-[400px]"
                    >
                        {/* Image Layer - Full Background */}
                        <div className="absolute inset-0 h-full w-full z-0">
                            {member.image ? (
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                                    <FaUserTie size={48} />
                                </div>
                            )}
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                        </div>

                        {/* Floating Role Pill */}
                        <div className="absolute top-4 right-4 z-20">
                            <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                {member.role || 'Member'}
                            </div>
                        </div>

                        {/* Content Layer */}
                        <div className="relative z-10 p-6 flex flex-col h-full justify-end">
                            <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-orange-200 transition-colors transform translate-y-2 group-hover:translate-y-0 duration-300">
                                {member.name}
                            </h3>

                            <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                                {member.bio}
                            </p>

                            {/* Social Icons */}
                            <div className="flex gap-3 mt-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-100">
                                <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white hover:text-blue-600 text-white backdrop-blur-sm flex items-center justify-center transition-colors">
                                    <FaLinkedinIn size={14} />
                                </button>
                                <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white hover:text-blue-400 text-white backdrop-blur-sm flex items-center justify-center transition-colors">
                                    <FaTwitter size={14} />
                                </button>
                                <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white hover:text-red-500 text-white backdrop-blur-sm flex items-center justify-center transition-colors">
                                    <FaEnvelope size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Subtle Border Glow on Hover */}
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-500/30 rounded-[24px] pointer-events-none transition-colors duration-500" />
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default TeamSection;
