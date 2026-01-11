"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FaPaperPlane } from "react-icons/fa";
import Navbar from "./Navbar";
import TopBar from "./TopBar";
import Footer from "./Footer";

import FeedbackWidget from "./FeedbackWidget";
import LoginPopup from "./LoginPopup";
import AIChatWidget from "./AIChatWidget";
import LeadCaptureModal from "./LeadCaptureModal";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);

    // Auto-popup after some time if not on admin page
    useEffect(() => {
        if (!isAdmin) {
            const timer = setTimeout(() => {
                const hasSeenPopup = sessionStorage.getItem('hasSeenLeadPopup');
                if (!hasSeenPopup) {
                    setIsLeadModalOpen(true);
                    sessionStorage.setItem('hasSeenLeadPopup', 'true');
                }
            }, 30000); // 30 seconds
            return () => clearTimeout(timer);
        }
    }, [isAdmin]);

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <TopBar />
            <Navbar />
            <LoginPopup />
            <main className="min-h-screen pt-[115px]">
                {children}
            </main>
            <FeedbackWidget />
            <AIChatWidget />

            {/* Lead Capture Floating Button */}
            <button
                onClick={() => setIsLeadModalOpen(true)}
                className="fixed bottom-24 right-6 z-40 bg-secondary text-white p-4 rounded-full shadow-2xl hover:bg-orange-600 transition-all transform hover:scale-110 group active:scale-95 border-2 border-white/20"
                aria-label="Plan My Trip"
            >
                <div className="flex items-center gap-2">
                    <FaPaperPlane className="text-xl group-hover:rotate-12 transition-transform" />
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap">
                        Plan My Trip
                    </span>
                </div>
            </button>

            <LeadCaptureModal
                isOpen={isLeadModalOpen}
                onClose={() => setIsLeadModalOpen(false)}
            />

            <Footer />
        </>
    );
}
