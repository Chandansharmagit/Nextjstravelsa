import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-primary text-white pt-16 pb-0 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 xl:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20 relative z-10">

                {/* Brand */}
                <div>
                    <h2 className="text-3xl font-bold tracking-wider mb-4">
                        TRAVEL<span className="text-secondary">SANSAR</span>
                    </h2>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6">
                        Your trusted partner for unforgettable journeys. Explore the world with confidence and comfort.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-start gap-3 text-gray-400">
                            <FaMapMarkerAlt className="mt-1 flex-shrink-0 text-secondary" />
                            <span>Bharatpur-1, Shahid Chowk, Narayahgarh (Krishnaman Plaza)</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-400">
                            <FaPhone className="flex-shrink-0 text-secondary" />
                            <span>056-516888, 9855051795</span>
                        </li>
                        <li className="flex items-center gap-3 text-gray-400">
                            <FaEnvelope className="flex-shrink-0 text-secondary" />
                            <span>info@travelsansar.com</span>
                        </li>
                    </ul>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li><Link href="/" className="hover:text-secondary transition">Home</Link></li>
                        <li><Link href="/destinations" className="hover:text-secondary transition">Destinations</Link></li>
                        <li><Link href="/tours" className="hover:text-secondary transition">Tours</Link></li>
                        <li><Link href="/experiences" className="hover:text-secondary transition">Experiences</Link></li>
                        <li><Link href="/contact" className="hover:text-secondary transition">Contact</Link></li>
                        <li><Link href="/careers" className="hover:text-secondary transition">Career</Link></li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="text-xl font-bold mb-4">Support</h3>
                    <ul className="space-y-2 text-gray-300">
                        <li><Link href="#" className="hover:text-secondary transition">FAQ</Link></li>
                        <li><Link href="#" className="hover:text-secondary transition">Privacy Policy</Link></li>
                        <li><Link href="#" className="hover:text-secondary transition">Terms & Conditions</Link></li>
                        <li><Link href="#" className="hover:text-secondary transition">Customer Service</Link></li>
                    </ul>
                </div>

                {/* Newsletter & Social */}
                <div>
                    <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
                    <div className="flex gap-4 mb-6">
                        <FaFacebook className="text-2xl cursor-pointer hover:text-secondary transition" />
                        <FaTwitter className="text-2xl cursor-pointer hover:text-secondary transition" />
                        <FaInstagram className="text-2xl cursor-pointer hover:text-secondary transition" />
                        <FaLinkedin className="text-2xl cursor-pointer hover:text-secondary transition" />
                    </div>
                    <p className="text-sm text-gray-300 mb-2">Subscribe to our newsletter</p>
                    <div className="flex">
                        <input suppressHydrationWarning type="email" placeholder="Email" className="px-4 py-2 rounded-l-lg text-primary w-full focus:outline-none" />
                        <button suppressHydrationWarning className="bg-secondary px-4 py-2 rounded-r-lg font-bold hover:bg-orange-600 transition">Go</button>
                    </div>
                </div>
            </div>

            {/* Large Footer Typography */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full text-center pointer-events-none select-none overflow-hidden leading-none z-0">
                <h1 className="text-[12vw] md:text-[150px] font-black text-white/10 tracking-[10px] md:tracking-[20px] whitespace-nowrap uppercase italic ml-[10px] md:ml-[20px]">
                    TRAVEL SANSR
                </h1>
            </div>

            <div className="border-t border-white/10 pt-8 pb-8 text-center text-gray-400 text-sm relative z-10 glass-effect-light">
                <p>&copy; {new Date().getFullYear()} Travel Sansar. All rights reserved.</p>
                <div className="flex items-center justify-center gap-4 mt-4 text-xs font-mono text-gray-500">
                    <span className="flex items-center gap-2">
                        Designed & Developed by <span className="text-secondary font-bold">Chandan Sharma</span>
                    </span>
                    <a href="https://www.facebook.com/Chandan.Sharma.8689" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                        <FaFacebook size={16} />
                    </a>
                    <a href="https://wa.me/9779845427041" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 transition-colors">
                        <FaPhone size={14} />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
