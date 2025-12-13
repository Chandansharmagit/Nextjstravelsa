"use client";

import { useState } from 'react';
import Modal from '@/components/Modal';
import AskQuestionForm from '@/components/AskQuestionForm';
import BookNowForm from '@/components/BookNowForm';

interface DestinationClientWrapperProps {
    destinationTitle: string;
    destinationId: string;
}

const DestinationClientWrapper = ({ destinationTitle, destinationId }: DestinationClientWrapperProps) => {
    const [isBookNowOpen, setIsBookNowOpen] = useState(false);
    const [isAskQuestionOpen, setIsAskQuestionOpen] = useState(false);

    return (
        <>
            <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-card border border-gray-100">
                        <h3 className="text-xl font-bold text-primary mb-4">Plan Your Trip</h3>
                        <p className="text-gray-500 text-sm mb-6">Interested in visiting {destinationTitle}? Contact us to arrange a custom package.</p>
                        <button
                            onClick={() => setIsBookNowOpen(true)}
                            className="w-full py-4 rounded-xl bg-secondary text-white font-bold text-lg hover:bg-orange-600 transition shadow-lg mb-4"
                        >
                            Book Now
                        </button>
                        <button
                            onClick={() => setIsAskQuestionOpen(true)}
                            className="w-full py-3 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary/5 transition"
                        >
                            Ask a Question
                        </button>
                    </div>

                    <div className="bg-primary text-white p-6 rounded-2xl shadow-card">
                        <h3 className="text-xl font-bold mb-2">Need Help?</h3>
                        <p className="text-white/80 text-sm mb-4">Call our travel experts 24/7</p>
                        <p className="text-2xl font-bold">+977 123 456 7890</p>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal
                isOpen={isBookNowOpen}
                onClose={() => setIsBookNowOpen(false)}
                title="Book Your Trip"
            >
                <BookNowForm
                    destinationTitle={destinationTitle}
                    destinationId={destinationId}
                    onSuccess={() => setIsBookNowOpen(false)}
                />
            </Modal>

            <Modal
                isOpen={isAskQuestionOpen}
                onClose={() => setIsAskQuestionOpen(false)}
                title="Ask a Question"
            >
                <AskQuestionForm
                    destinationTitle={destinationTitle}
                    onSuccess={() => setIsAskQuestionOpen(false)}
                />
            </Modal>
        </>
    );
};

export default DestinationClientWrapper;
