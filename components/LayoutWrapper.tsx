"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import TopBar from "./TopBar";
import Footer from "./Footer";

import LoginPopup from "./LoginPopup";
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
            <main className="min-h-screen">
                {children}
            </main>

            <LeadCaptureModal
                isOpen={isLeadModalOpen}
                onClose={() => setIsLeadModalOpen(false)}
            />

            <Footer />
        </>
    );
}
