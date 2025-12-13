"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import TopBar from "./TopBar";
import Footer from "./Footer";

import FeedbackWidget from "./FeedbackWidget";
import LoginPopup from "./LoginPopup";
import PromoPopup from "./PromoPopup";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <TopBar />
            <Navbar />
            <LoginPopup />
            <PromoPopup />
            <main className="min-h-screen">
                {children}
            </main>
            <FeedbackWidget />
            <Footer />
        </>
    );
}
