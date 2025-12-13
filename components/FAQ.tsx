"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown } from 'react-icons/fa';

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "How do I book a tour with Travel Sansar?",
            answer: "Booking is simple! Browse our destinations or tours, select your preferred package, choose your dates, and click 'Book Now'. Fill in your details, and our team will contact you within 24 hours to confirm your booking."
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept various payment methods including credit/debit cards, bank transfers, and digital wallets. A deposit is usually required to confirm your booking, with the balance due before your trip starts."
        },
        {
            question: "Can I customize my tour package?",
            answer: "Absolutely! We specialize in creating personalized itineraries. Contact us with your preferences, budget, and interests, and we'll design a custom package just for you."
        },
        {
            question: "What is your cancellation policy?",
            answer: "Cancellation policies vary by tour type. Generally, cancellations made 30+ days before departure receive a full refund minus processing fees. Cancellations within 15-30 days receive 50% refund. Please check specific tour details for exact policies."
        },
        {
            question: "Do you provide travel insurance?",
            answer: "We highly recommend travel insurance and can help you arrange comprehensive coverage. Insurance typically covers trip cancellations, medical emergencies, lost luggage, and more."
        },
        {
            question: "Are your tours suitable for solo travelers?",
            answer: "Yes! Many of our tours are perfect for solo travelers. We can arrange group tours where you'll meet fellow travelers, or customize a private tour just for you."
        },
        {
            question: "What should I pack for my trip?",
            answer: "Packing lists vary by destination and season. Once you book, we'll send you a detailed packing guide specific to your tour, including clothing recommendations, essential items, and any special equipment needed."
        },
        {
            question: "Do you provide 24/7 support during the trip?",
            answer: "Yes! We provide round-the-clock support throughout your journey. You'll have emergency contact numbers and our team is always available to assist with any issues or questions."
        }
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 px-4 xl:px-20 bg-white">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-primary mb-4"
                    >
                        Frequently Asked Questions
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 text-lg"
                    >
                        Got questions? We've got answers!
                    </motion.p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-light rounded-2xl shadow-card overflow-hidden"
                        >
                            <button
                                suppressHydrationWarning
                                onClick={() => toggleFAQ(index)}
                                className="w-full px-8 py-6 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-bold text-primary text-lg pr-8">
                                    {faq.question}
                                </span>
                                <FaChevronDown
                                    className={`text-secondary text-xl flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-8 pb-6 text-gray-600 leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center bg-primary/5 p-8 rounded-2xl"
                >
                    <h3 className="text-2xl font-bold text-primary mb-3">
                        Still have questions?
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Our team is here to help! Contact us anytime.
                    </p>
                    <a href="/contact">
                        <button suppressHydrationWarning className="px-8 py-3 bg-secondary text-white rounded-full font-bold hover:bg-orange-600 transition duration-300 shadow-lg">
                            Contact Us
                        </button>
                    </a>
                </motion.div>
            </div>
        </section>
    );
};

export default FAQ;
