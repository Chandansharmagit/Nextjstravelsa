"use client";

import FAQ from "@/components/FAQ";
import { motion } from "framer-motion";

export default function FAQPage() {
    return (
        <main className="min-h-screen bg-gray-50 pt-24">
            <div className="bg-primary/5 py-16 text-center mb-10">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold text-gray-800"
                >
                    Frequently Asked Questions
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-600 mt-4 max-w-2xl mx-auto px-4"
                >
                    Find answers to common questions about booking, payments, and your travel experience.
                </motion.p>
            </div>

            <div className="-mt-10">
                <FAQ />
            </div>
        </main>
    );
}
