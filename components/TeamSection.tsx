"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import api from '@/lib/api';
import { FaLinkedinIn, FaEnvelope, FaTwitter, FaUserTie } from 'react-icons/fa';

interface TeamMember {
    _id: string;
    name: string;
    role: string;
    image: string;
    bio: string;
    social?: {
        facebook?: string;
        twitter?: string;
        linkedin?: string;
        instagram?: string;
    };
}

import { TiltCard } from '@/components/TiltCard';

const TeamSection = () => {
    const [team, setTeam] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await api.get('/team');
                let data = Array.isArray(res.data) ? res.data : res.data.team || res.data.data || [];

                // Sort by Role Priority: CEO > Managing Director > Others
                data = data.sort((a: TeamMember, b: TeamMember) => {
                    const roleA = a.role.toLowerCase().trim();
                    const roleB = b.role.toLowerCase().trim();

                    const getPriority = (role: string) => {
                        if (role.includes('ceo') || role.includes('chief executive')) return 1;
                        if (role.includes('managing director') || role.includes('md')) return 2;
                        if (role.includes('hod') || role.includes('head')) return 3;
                        return 4;
                    };

                    return getPriority(roleA) - getPriority(roleB);
                });

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

    // Split team: First member (CEO) vs Rest
    const mainMember = team[0];
    const otherMembers = team.slice(1);

    return (
        <section className="py-24 px-4 bg-gray-50/50">
            <div className="max-w-[1400px] mx-auto">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 font-bold text-xs tracking-wider uppercase mb-4"
                    >
                        The People
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight"
                    >
                        Meet Our Team
                    </motion.h2>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mb-6" />
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">

                    {/* Large Featured Card (CEO) - Spans 2 Rows on Desktop */}
                    {mainMember && (
                        <TiltCard className="lg:row-span-2 lg:col-span-1 h-full">
                            <div className="group h-full bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col relative z-0">
                                <div className="absolute inset-0 bg-gray-100">
                                    {mainMember.image ? (
                                        <Image
                                            src={mainMember.image}
                                            alt={mainMember.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 1024px) 100vw, 33vw"
                                            priority
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <FaUserTie size={120} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                </div>

                                <div className="relative z-10 mt-auto p-8 text-white transform transition-transform duration-500 group-hover:translate-z-[20px]">
                                    <div className="inline-block px-3 py-1 mb-3 rounded-full bg-orange-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                                        {mainMember.role}
                                    </div>
                                    <h3 className="text-3xl font-bold mb-2">{mainMember.name}</h3>
                                    <p className="text-gray-200 text-sm leading-relaxed line-clamp-3 mb-6 opacity-90">
                                        {mainMember.bio}
                                    </p>

                                    <div className="flex gap-4">
                                        <SocialIcon Icon={FaLinkedinIn} />
                                        <SocialIcon Icon={FaTwitter} />
                                        <SocialIcon Icon={FaEnvelope} />
                                    </div>
                                </div>
                            </div>
                        </TiltCard>
                    )}

                    {/* Grid of Other Members */}
                    {otherMembers.map((member, index) => (
                        <TiltCard key={member._id} className="h-full">
                            <div className="group h-full bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col md:flex-row lg:flex-col relative z-0">
                                {/* Image */}
                                <div className="relative w-full md:w-2/5 lg:w-full h-64 md:h-auto lg:h-64 bg-gray-100 flex-shrink-0">
                                    {member.image ? (
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <FaUserTie size={48} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col justify-center flex-grow relative bg-white transition-colors group-hover:bg-orange-50/30">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                                            {member.name}
                                        </h3>
                                        <div className="text-orange-500 text-xs font-bold tracking-wide uppercase mb-3">
                                            {member.role || 'Member'}
                                        </div>
                                        {/* Brief Bio if needed, kept hidden for cleaner grid unless large */}
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 group-hover:text-gray-700">
                                            {member.bio}
                                        </p>
                                    </div>

                                    <div className="flex gap-3 pt-4 border-t border-gray-100 mt-auto">
                                        <SocialIconSmall Icon={FaLinkedinIn} />
                                        <SocialIconSmall Icon={FaTwitter} />
                                        <SocialIconSmall Icon={FaEnvelope} />
                                    </div>
                                </div>
                            </div>
                        </TiltCard>
                    ))}

                    {/* Empty Stat/Filler Cards if needed to balance grid - Optional */}
                </div>
            </div>
        </section>
    );
};

const SocialIcon = ({ Icon }: { Icon: any }) => (
    <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-white hover:text-orange-600 text-white backdrop-blur-sm flex items-center justify-center transition-all duration-300 transform hover:scale-110">
        <Icon size={16} />
    </button>
);

const SocialIconSmall = ({ Icon }: { Icon: any }) => (
    <button className="w-8 h-8 rounded-full bg-gray-50 hover:bg-white hover:shadow-md text-gray-400 hover:text-orange-500 flex items-center justify-center transition-all duration-300">
        <Icon size={12} />
    </button>
);

export default TeamSection;
