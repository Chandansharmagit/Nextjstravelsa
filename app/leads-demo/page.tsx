import React from 'react';
import LeadCaptureForm from '@/components/LeadCaptureForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const LeadDemoPage = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-bold tracking-wider uppercase mb-4">
                            Exclusive Service
                        </span>
                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
                            Start Your Journey <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">With Travel Sansar</span>
                        </h1>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                            Expertly crafted itineraries for the most discerning travelers. Your dream destination is just one form away.
                        </p>
                    </div>

                    <LeadCaptureForm />

                    {/* Additional Social Proof/Info */}
                    <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                        <div className="text-center">
                            <div className="text-4xl font-black text-primary mb-2">500+</div>
                            <div className="text-gray-600 font-bold">Custom Itineraries</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-black text-primary mb-2">99%</div>
                            <div className="text-gray-600 font-bold">Customer Satisfaction</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-black text-primary mb-2">24/7</div>
                            <div className="text-gray-600 font-bold">Travel Support</div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default LeadDemoPage;
