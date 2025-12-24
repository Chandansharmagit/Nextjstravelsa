"use client";

import { FaPhone, FaEnvelope } from "react-icons/fa";

const TopBar = () => {
    return (
        <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white">
            <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
                <div className="flex items-center justify-between h-10 text-xs">
                    {/* Left: Contact Info */}
                    <div className="hidden md:flex items-center gap-6">
                        <a
                            href="tel:+9779855051795"
                            className="flex items-center gap-2 hover:text-amber-400 transition-colors"
                        >
                            <FaPhone size={10} />
                            <span>+977-9855051795</span>
                        </a>
                        <a
                            href="mailto:info@travelsansr.com"
                            className="flex items-center gap-2 hover:text-amber-400 transition-colors"
                        >
                            <FaEnvelope size={10} />
                            <span>info@travelsansr.com</span>
                        </a>
                    </div>

                    {/* Center: Announcement */}
                    <div className="flex-1 md:flex-none text-center">
                        <span className="font-semibold">
                            🎄 Special Holiday Offers Available! Book Your Dream Trip Now
                        </span>
                    </div>

                    {/* Right: Empty space for balance on desktop */}
                    <div className="hidden md:block w-48"></div>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
