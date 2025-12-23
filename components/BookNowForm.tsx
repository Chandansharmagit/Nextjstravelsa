"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaEnvelope, FaPhone, FaUsers, FaCalendarAlt, FaEdit, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

interface BookNowFormProps {
    destinationTitle: string;
    destinationId: string;
    onSuccess?: () => void;
}

const BookNowForm = ({ destinationTitle, destinationId, onSuccess }: BookNowFormProps) => {
    const { user, setShowLoginModal } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: "",
        travelers: "1",
        travelDate: "",
        specialRequests: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!user) {
            setShowLoginModal(true);
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus("idle");

        try {
            const res = await api.post('/bookings', {
                destination: destinationId,
                ...formData
            });

            if (res.status !== 200 && res.status !== 201) throw new Error('Booking failed');

            setSubmitStatus("success");
            setFormData({
                name: user?.name || "",
                email: user?.email || "",
                phone: "",
                travelers: "1",
                travelDate: "",
                specialRequests: "",
            });

            if (onSuccess) {
                setTimeout(() => onSuccess(), 1500);
            }
        } catch (error) {
            console.error(error);
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = "w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-md border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium";
    const labelClasses = "block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1 h-font";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50/50 p-6 rounded-[32px] border border-blue-100/50 flex items-center gap-4"
            >
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 text-xl">
                    <FaCheckCircle className="opacity-20 absolute scale-150" />
                    <FaEdit className="relative z-10" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-0.5">Reservation For</p>
                    <p className="text-lg font-black text-slate-900 tracking-tight leading-none">{destinationTitle}</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                    <label className={labelClasses}>Full Name</label>
                    <div className="relative group">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={inputClasses}
                            placeholder="Chandan Sharma"
                        />
                    </div>
                </div>

                <div className="relative">
                    <label className={labelClasses}>Email Address</label>
                    <div className="relative group">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={inputClasses}
                            placeholder="hello@example.com"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                    <label className={labelClasses}>Phone Number</label>
                    <div className="relative group">
                        <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className={inputClasses}
                            placeholder="+977 98XXXXXXXX"
                        />
                    </div>
                </div>

                <div className="relative">
                    <label className={labelClasses}>Travelers</label>
                    <div className="relative group">
                        <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        <select
                            required
                            value={formData.travelers}
                            onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                            className={inputClasses}
                        >
                            {[1, 2, 3, 4, 5, 10].map((num) => (
                                <option key={num} value={num}>
                                    {num} {num === 1 ? "Explorer" : "Explorers"}
                                </option>
                            ))}
                            <option value="10+">Expedition (10+)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="relative">
                <label className={labelClasses}>Preferred Start Date</label>
                <div className="relative group">
                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="date"
                        required
                        value={formData.travelDate}
                        onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                        min={new Date().toISOString().split("T")[0]}
                        className={inputClasses}
                    />
                </div>
            </div>

            <div className="relative">
                <label className={labelClasses}>Expedition Notes</label>
                <textarea
                    rows={4}
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    className="w-full p-5 bg-white/50 backdrop-blur-md border border-slate-200 rounded-[32px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-slate-700 placeholder:text-slate-400 placeholder:font-medium resize-none"
                    placeholder="Tell us about your dream trip preferences..."
                />
            </div>

            <AnimatePresence>
                {submitStatus === "success" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-500/10 backdrop-blur-md border border-green-500/20 text-green-700 px-6 py-4 rounded-2xl flex items-center gap-3 font-bold"
                    >
                        <FaCheckCircle className="shrink-0" />
                        Booking request launched! We'll reach out soon.
                    </motion.div>
                )}

                {submitStatus === "error" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-700 px-6 py-4 rounded-2xl flex items-center gap-3 font-bold"
                    >
                        <FaExclamationCircle className="shrink-0" />
                        Launch failed. Please verify your details or login.
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-5 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.3em] rounded-[32px] hover:bg-black transition-all shadow-2xl shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10">{isSubmitting ? "Launching..." : "Initiate Reservation"}</span>
            </motion.button>

            <style jsx global>{`
                .h-font { font-family: 'Outfit', sans-serif; }
            `}</style>
        </form>
    );
};

export default BookNowForm;
