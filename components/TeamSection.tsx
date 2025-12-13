"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import api from '@/lib/api';

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
                // Handle different response structures
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

    if (loading) {
        return (
            <section className="py-20 px-4 xl:px-20 bg-white">
                <div className="text-center">
                    <p className="text-gray-500">Loading team...</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 px-4 xl:px-20 bg-white">
            <div className="text-center mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold text-primary mb-4"
                >
                    Meet Our Team
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-gray-600 text-lg max-w-2xl mx-auto"
                >
                    Passionate professionals dedicated to making your travel dreams come true
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                {team.map((member, index) => (
                    <motion.div
                        key={member._id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group"
                    >
                        <div className="bg-light rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                            {/* Image */}
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <p className="text-white text-sm leading-relaxed">
                                        {member.bio}
                                    </p>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-6 text-center">
                                <h3 className="text-xl font-bold text-primary mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-secondary font-semibold">
                                    {member.role}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default TeamSection;
