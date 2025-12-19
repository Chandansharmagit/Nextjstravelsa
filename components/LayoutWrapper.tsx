"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import TopBar from "./TopBar";
import Footer from "./Footer";

import FeedbackWidget from "./FeedbackWidget";
import LoginPopup from "./LoginPopup";
import PromoPopup from "./PromoPopup";
import SnowEffect from "./SnowEffect";
import ChristmasDecorations from "./ChristmasDecorations";
import ChristmasPopup from "./ChristmasPopup";

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
            <SnowEffect />
            <ChristmasDecorations />
            <ChristmasPopup />
            <main className="min-h-screen">
                {children}
            </main>
            <FeedbackWidget />
            <Footer />
        </>
    );
}
