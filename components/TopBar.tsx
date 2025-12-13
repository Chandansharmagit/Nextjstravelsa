import { FaPhoneAlt, FaEnvelope, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const TopBar = () => {
    return (
        <div className="bg-primary text-white text-[13px] font-medium py-2 px-6 xl:px-24 hidden lg:flex justify-center z-50 relative border-b border-white/10">
            <div className="flex justify-between items-center w-full max-w-[1440px]">
                <div className="flex gap-6">
                    <div className="flex items-center gap-2 hover:text-white/80 transition cursor-pointer">
                        <FaPhoneAlt size={12} />
                        <span>+977 123 456 7890</span>
                    </div>
                    <div className="flex items-center gap-2 hover:text-white/80 transition cursor-pointer">
                        <FaEnvelope size={12} />
                        <span>info@travelsansar.com</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    <a href="#" className="hover:text-white hover:scale-110 transition duration-300"><FaFacebook /></a>
                    <a href="#" className="hover:text-white hover:scale-110 transition duration-300"><FaTwitter /></a>
                    <a href="#" className="hover:text-white hover:scale-110 transition duration-300"><FaInstagram /></a>
                    <a href="#" className="hover:text-white hover:scale-110 transition duration-300"><FaLinkedin /></a>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
