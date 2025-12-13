"use client";

import { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

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

        // Auth Check
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

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-secondary/10 p-4 rounded-xl border-l-4 border-secondary">
                <p className="text-sm text-gray-700">
                    <span className="font-semibold">Booking for:</span> {destinationTitle}
                </p>
            </div>

            <div>
                <label htmlFor="book-name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                </label>
                <input
                    type="text"
                    id="book-name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none"
                    placeholder="John Doe"
                />
            </div>

            <div>
                <label htmlFor="book-email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                </label>
                <input
                    type="email"
                    id="book-email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none"
                    placeholder="john@example.com"
                />
            </div>

            <div>
                <label htmlFor="book-phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                </label>
                <input
                    type="tel"
                    id="book-phone"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none"
                    placeholder="+977 98XXXXXXXX"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="travelers" className="block text-sm font-semibold text-gray-700 mb-2">
                        Travelers *
                    </label>
                    <select
                        id="travelers"
                        required
                        value={formData.travelers}
                        onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                                {num} {num === 1 ? "Person" : "People"}
                            </option>
                        ))}
                        <option value="10+">10+ People</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="travelDate" className="block text-sm font-semibold text-gray-700 mb-2">
                        Travel Date *
                    </label>
                    <input
                        type="date"
                        id="travelDate"
                        required
                        value={formData.travelDate}
                        onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="specialRequests" className="block text-sm font-semibold text-gray-700 mb-2">
                    Special Requests
                </label>
                <textarea
                    id="specialRequests"
                    rows={4}
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none resize-none"
                    placeholder="Any special requirements or preferences?"
                />
            </div>

            {submitStatus === "success" && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl">
                    ✓ Booking request submitted! We'll contact you shortly to confirm.
                </div>
            )}

            {submitStatus === "error" && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl">
                    ✗ Something went wrong (or you need to login). Please try again.
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-secondary text-white font-bold text-lg rounded-xl hover:bg-orange-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? "Processing..." : "Submit Booking Request"}
            </button>
        </form>
    );
};

export default BookNowForm;
