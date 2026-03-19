"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { usePathname } from "next/navigation";
import LoginPromptModal from "./LoginPromptModal";

const LoginPromptManager = () => {
    const { user } = useAuth();
    const pathname = usePathname();
    const [showPrompt, setShowPrompt] = useState(false);

    // Don't show on auth pages or if already logged in
    const isAuthPage = pathname === "/login" || pathname === "/register";
    const isAdminPage = pathname.startsWith("/admin");

    const triggerPrompt = useCallback(() => {
        if (!user && !isAuthPage && !isAdminPage && !showPrompt) {
            setShowPrompt(true);
        }
    }, [user, isAuthPage, isAdminPage, showPrompt]);

    useEffect(() => {
        // If logged in, ensure prompt is closed and don't start timer
        if (user) {
            setShowPrompt(false);
            return;
        }

        // Set up interval to trigger every 10 seconds
        const interval = setInterval(() => {
            triggerPrompt();
        }, 10000);

        // Also trigger initially after 10 seconds of landing
        const initialTimeout = setTimeout(() => {
            triggerPrompt();
        }, 10000);

        return () => {
            clearInterval(interval);
            clearTimeout(initialTimeout);
        };
    }, [user, triggerPrompt]);

    return (
        <LoginPromptModal 
            isOpen={showPrompt} 
            onClose={() => setShowPrompt(false)} 
        />
    );
};

export default LoginPromptManager;
