"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import api from '@/lib/api';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/contact', formData);
            if (res.status === 201) {
                setSubmitted(true);
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                setTimeout(() => setSubmitted(false), 3000);
            }
        } catch (error) {
            console.error('Contact submit error:', error);
        }
    };

    const contactInfo = [
        {
            icon: <FaPhone className="text-3xl" />,
            title: "Phone",
            details: "056-516888, 9855051795",
            subdetails: "Mon-Sat, 9AM-6PM",
            color: "bg-blue-500"
        },
        {
            icon: <FaEnvelope className="text-3xl" />,
            title: "Email",
            details: "info@travelsansar.com",
            subdetails: "We reply within 24 hours",
            color: "bg-red-500"
        },
        {
            icon: <FaMapMarkerAlt className="text-3xl" />,
            title: "Address",
            details: "Bharatpur-1, Shahid Chowk, Narayahgarh (Krishnaman Plaza)",
            subdetails: "Nepal",
            color: "bg-green-500"
        },
        {
            icon: <FaClock className="text-3xl" />,
            title: "Working Hours",
            details: "Mon - Sat: 9AM - 6PM",
            subdetails: "Sunday: Closed",
            color: "bg-purple-500"
        }
    ];

    const socialLinks = [
        { icon: <FaFacebook size={24} />, name: "Facebook", color: "hover:bg-blue-600", link: "#" },
        { icon: <FaInstagram size={24} />, name: "Instagram", color: "hover:bg-pink-600", link: "#" },
        { icon: <FaTwitter size={24} />, name: "Twitter", color: "hover:bg-sky-500", link: "#" },
        { icon: <FaWhatsapp size={24} />, name: "WhatsApp", color: "hover:bg-green-600", link: "#" }
    ];

    return (
        <>
            {/* Hero Section */}
            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2074&auto=format&fit=crop')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-teal-800/90" />

                <div className="relative z-10 text-center text-white px-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl md:text-6xl font-bold mb-4"
                    >
                        Get In Touch
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl md:text-2xl"
                    >
                        We'd love to hear from you
                    </motion.p>
                </div>
            </section>

            {/* Contact Info Cards */}
            <section className="py-20 px-4 xl:px-20 bg-light">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {contactInfo.map((info, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white p-6 rounded-2xl shadow-card hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
                        >
                            <div className={`${info.color} w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                                {info.icon}
                            </div>
                            <h3 className="text-lg font-bold text-primary mb-2">{info.title}</h3>
                            <p className="text-gray-700 font-semibold mb-1">{info.details}</p>
                            <p className="text-sm text-gray-500">{info.subdetails}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Contact Form & Map */}
            <section className="py-20 px-4 xl:px-20 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-light p-8 rounded-2xl shadow-card"
                        >
                            <h2 className="text-3xl font-bold text-primary mb-6">Send Us a Message</h2>

                            {submitted && (
                                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-6">
                                    ✓ Thank you! Your message has been sent successfully.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">Your Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-primary transition"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-primary transition"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-primary transition"
                                        placeholder="+977 98XXXXXXXX"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">Subject</label>
                                    <input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-primary transition"
                                        placeholder="Inquiry about..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 font-bold mb-2">Message *</label>
                                    <textarea
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:border-primary transition resize-none"
                                        placeholder="How can we help you?"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-secondary text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    Send Message
                                </button>
                            </form>
                        </motion.div>

                        {/* Info & Social */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            {/* Why Contact Us */}
                            <div className="bg-primary text-white p-8 rounded-2xl shadow-card">
                                <h3 className="text-2xl font-bold mb-4">Why Contact Us?</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <span className="text-secondary text-xl">✓</span>
                                        <span>Get personalized travel recommendations</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-secondary text-xl">✓</span>
                                        <span>Customize your perfect itinerary</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-secondary text-xl">✓</span>
                                        <span>Ask about special group discounts</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="text-secondary text-xl">✓</span>
                                        <span>Get expert travel advice</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Social Media */}
                            <div className="bg-light p-8 rounded-2xl shadow-card">
                                <h3 className="text-2xl font-bold text-primary mb-4">Follow Us</h3>
                                <p className="text-gray-600 mb-6">Stay connected for travel inspiration and exclusive offers</p>
                                <div className="grid grid-cols-2 gap-4">
                                    {socialLinks.map((social, index) => (
                                        <a
                                            key={index}
                                            href={social.link}
                                            className={`flex items-center gap-3 px-4 py-3 bg-white rounded-xl border-2 border-gray-200 hover:border-transparent ${social.color} hover:text-white transition duration-300 group`}
                                        >
                                            <span className="group-hover:scale-110 transition-transform">
                                                {social.icon}
                                            </span>
                                            <span className="font-semibold">{social.name}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="bg-secondary/10 p-8 rounded-2xl border-l-4 border-secondary">
                                <h3 className="text-xl font-bold text-primary mb-3">Need Immediate Help?</h3>
                                <p className="text-gray-700 mb-4">
                                    For urgent inquiries, call us directly or chat with us on WhatsApp
                                </p>
                                <div className="flex gap-3">
                                    <a href="tel:+9771234567890" className="px-6 py-3 bg-primary text-white rounded-full font-bold hover:bg-teal-700 transition">
                                        Call Now
                                    </a>
                                    <a href="https://wa.me/9771234567890" className="px-6 py-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition">
                                        WhatsApp
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ContactPage;
