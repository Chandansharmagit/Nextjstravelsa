"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import api from '@/lib/api';
import { FaLinkedinIn, FaEnvelope, FaTwitter, FaUserTie } from 'react-icons/fa';
import { TiltCard } from '@/components/TiltCard';

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

    const mainMember = team[0];
    const otherMembers = team.slice(1);

    return (
        <section className="py-24 bg-white border-b border-gray-100">
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
                <div className="text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-block py-1.5 px-4 rounded-full bg-orange-50 text-orange-600 font-black text-xs tracking-widest uppercase mb-4 border border-orange-100 font-outfit"
                    >
                        THE PEOPLE
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight font-outfit"
                    >
                        Meet Our Team
                    </motion.h2>
                    <div className="w-20 h-1.5 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto rounded-full mb-6" />
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">

                    {/* Featured Card (CEO) */}
                    {mainMember && (
                        <TiltCard className="lg:row-span-2 lg:col-span-1 h-full">
                            <div className="group h-full bg-white rounded-[32px] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col relative z-0">
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
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                                </div>

                                <div className="relative z-10 mt-auto p-8 text-white transform transition-transform duration-500 group-hover:translate-z-[20px]">
                                    <div className="inline-block px-3 py-1 mb-3 rounded-full bg-orange-500 text-white text-xs font-black uppercase tracking-wider font-outfit shadow-lg">
                                        {mainMember.role}
                                    </div>
                                    <h3 className="text-3xl font-black mb-2 font-outfit">{mainMember.name}</h3>
                                    <p className="text-gray-200 text-sm leading-relaxed line-clamp-3 mb-6 opacity-90 font-medium">
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

                    {/* Other Members */}
                    {otherMembers.map((member) => (
                        <TiltCard key={member._id} className="h-full">
                            <div className="group h-full bg-white rounded-[24px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col md:flex-row lg:flex-col relative z-0">
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
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                                </div>

                                <div className="p-6 flex flex-col justify-center flex-grow relative bg-white transition-colors group-hover:bg-orange-50/20">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors font-outfit">
                                            {member.name}
                                        </h3>
                                        <div className="text-orange-500 text-xs font-black tracking-wide uppercase mb-3 font-outfit">
                                            {member.role || 'Team Member'}
                                        </div>
                                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 group-hover:text-gray-700 font-medium">
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
                </div>
            </div>
        </section>
    );
};

const SocialIcon = ({ Icon }: { Icon: any }) => (
    <button className="w-10 h-10 rounded-full bg-white/20 hover:bg-orange-500 hover:text-white text-white backdrop-blur-sm flex items-center justify-center transition-all duration-300 transform hover:scale-110">
        <Icon size={16} />
    </button>
);

const SocialIconSmall = ({ Icon }: { Icon: any }) => (
    <button className="w-8 h-8 rounded-full bg-gray-50 hover:bg-orange-500 hover:text-white text-gray-400 flex items-center justify-center transition-all duration-300">
        <Icon size={12} />
    </button>
);

export default TeamSection;
