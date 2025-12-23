"use client";

import { useState } from 'react';
import Modal from '@/components/Modal';
import AskQuestionForm from '@/components/AskQuestionForm';
import BookNowForm from '@/components/BookNowForm';
import { motion } from 'framer-motion';
import { FaCalendarCheck, FaQuestionCircle, FaHeadset } from 'react-icons/fa';

interface DestinationClientWrapperProps {
    destinationTitle: string;
    destinationId: string;
}

const DestinationClientWrapper = ({ destinationTitle, destinationId }: DestinationClientWrapperProps) => {
    const [isBookNowOpen, setIsBookNowOpen] = useState(false);
    const [isAskQuestionOpen, setIsAskQuestionOpen] = useState(false);

    return (
        <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-8">
                {/* Booking Card */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/70 backdrop-blur-3xl p-8 rounded-[40px] shadow-[0_32px_80px_-16px_rgba(0,0,0,0.08)] border border-white/60 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-500/10 transition-colors duration-500" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <FaCalendarCheck />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tighter h-font">Plan Your Trip</h3>
                        </div>
                        
                        <p className="text-slate-500 font-bold text-sm mb-8 leading-relaxed">
                            Interested in visiting <span className="text-blue-600">{destinationTitle}</span>? Our experts will craft the perfect journey for you.
                        </p>
                        
                        <div className="space-y-4">
                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsBookNowOpen(true)}
                                className="w-full py-5 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
                            >
                                Secure Expedition
                            </motion.button>
                            
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsAskQuestionOpen(true)}
                                className="w-full py-4 rounded-2xl border-2 border-slate-100 text-slate-500 font-black text-xs uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all flex items-center justify-center gap-3"
                            >
                                <FaQuestionCircle className="text-lg" />
                                Custom Request
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* Support Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-900 p-8 rounded-[40px] shadow-2xl relative overflow-hidden group"
                >
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mb-16 blur-2xl group-hover:bg-white/10 transition-colors duration-500" />
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4 text-blue-400">
                            <FaHeadset className="text-2xl" />
                            <h3 className="text-lg font-black tracking-tight text-white h-font">Concierge Support</h3>
                        </div>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-6 leading-none">Available 24/7 for you</p>
                        <div className="space-y-1">
                            <div className="text-2xl font-black text-white tracking-tighter">056-516888</div>
                            <div className="text-2xl font-black text-blue-400 tracking-tighter">9855051795</div>
                        </div>
                    </div>
                </motion.div>
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

            <style jsx global>{`
                .h-font { font-family: 'Outfit', sans-serif; }
            `}</style>
        </div>
    );
};

export default DestinationClientWrapper;
