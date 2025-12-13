"use client";

import { useState, FormEvent } from "react";

interface AskQuestionFormProps {
    destinationTitle: string;
    onSuccess?: () => void;
}

const AskQuestionForm = ({ destinationTitle, onSuccess }: AskQuestionFormProps) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        question: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus("idle");

        try {
            // Simulate API call - replace with actual API endpoint
            await new Promise((resolve) => setTimeout(resolve, 1000));

            console.log("Question submitted:", {
                ...formData,
                destination: destinationTitle,
            });

            setSubmitStatus("success");
            setFormData({ name: "", email: "", phone: "", question: "" });

            if (onSuccess) {
                setTimeout(() => onSuccess(), 1500);
            }
        } catch (error) {
            setSubmitStatus("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-primary/5 p-4 rounded-xl border-l-4 border-primary">
                <p className="text-sm text-gray-700">
                    <span className="font-semibold">Asking about:</span> {destinationTitle}
                </p>
            </div>

            <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                </label>
                <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                    placeholder="John Doe"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                </label>
                <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                    placeholder="john@example.com"
                />
            </div>

            <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                </label>
                <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                    placeholder="+977 98XXXXXXXX"
                />
            </div>

            <div>
                <label htmlFor="question" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Question *
                </label>
                <textarea
                    id="question"
                    required
                    rows={5}
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
                    placeholder="What would you like to know about this destination?"
                />
            </div>

            {submitStatus === "success" && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl">
                    ✓ Your question has been submitted! We'll get back to you soon.
                </div>
            )}

            {submitStatus === "error" && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl">
                    ✗ Something went wrong. Please try again.
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-primary/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? "Sending..." : "Submit Question"}
            </button>
        </form>
    );
};

export default AskQuestionForm;
