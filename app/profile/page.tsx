"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaLock, FaHeart, FaHistory, FaCog } from 'react-icons/fa';
import Image from 'next/image';

export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        country: '',
        image: ''
    });

    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        if (!user) {
            router.push('/login');
        } else {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || '',
                country: user.country || 'Nepal',
                image: user.image || ''
            });
            fetchBookings();
        }
    }, [user, router]);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings/mybookings');
            setBookings(res.data);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <FaUser /> },
        { id: 'bookings', label: 'Bookings', icon: <FaHistory /> },
        { id: 'favorites', label: 'Favorites', icon: <FaHeart /> },
        { id: 'security', label: 'Security', icon: <FaLock /> },
        { id: 'settings', label: 'Settings', icon: <FaCog /> },
    ];

    const handleSave = async () => {
        try {
            const res = await api.put('/users/profile', formData);
            if (res.status === 200 || res.status === 201) {
                setIsEditing(false);
                // Reload to refresh context
                window.location.reload();
            }
        } catch (error: any) {
            console.error('Save error:', error);
            alert(error.response?.data?.message || 'Failed to save profile');
        }
    };

    return (
        <div className="min-h-screen bg-light pt-32 pb-20 px-4 xl:px-20">
            <div className="max-w-6xl mx-auto">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-card p-8 mb-8"
                >
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Profile Picture */}
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                                {(formData.image || user.image) ? (
                                    <img
                                        src={
                                            (formData.image || user.image || '').startsWith('http')
                                                ? (formData.image || user.image)
                                                : `https://backendtsa.travelsansr.com${formData.image || user.image}`
                                        }
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    user.name?.charAt(0).toUpperCase()
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white hover:bg-orange-600 transition cursor-pointer shadow-md">
                                <FaEdit />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        const uploadFormData = new FormData();
                                        uploadFormData.append('image', file);

                                        try {
                                            const res = await api.post('/upload', uploadFormData, {
                                                headers: {
                                                    'Content-Type': 'multipart/form-data',
                                                },
                                            });

                                            // Get Cloudinary URL from response
                                            const imageUrl = res.data.image.path;

                                            // Update form data state (not saved yet - user must click Save Changes)
                                            setFormData(prev => ({ ...prev, image: imageUrl }));
                                            setIsEditing(true);

                                        } catch (err) {
                                            console.error(err);
                                        }
                                    }}
                                />
                            </label>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h1>
                            <p className="text-gray-600 mb-1 flex items-center justify-center md:justify-start gap-2">
                                <FaEnvelope className="text-primary" />
                                {user.email}
                            </p>
                            <p className="text-sm text-gray-500">Member since {new Date().getFullYear()}</p>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-primary">5</div>
                                <div className="text-sm text-gray-600">Bookings</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-secondary">12</div>
                                <div className="text-sm text-gray-600">Favorites</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-card overflow-hidden">
                    {/* Tab Headers */}
                    <div className="flex border-b border-gray-200 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 font-semibold transition whitespace-nowrap ${activeTab === tab.id
                                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                                    {!isEditing ? (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="px-6 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-teal-700 transition flex items-center gap-2"
                                        >
                                            <FaEdit /> Edit Profile
                                        </button>
                                    ) : (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="px-6 py-2 bg-secondary text-white rounded-xl font-semibold hover:bg-orange-600 transition"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">Full Name</label>
                                        <div className="relative">
                                            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                disabled={!isEditing}
                                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition disabled:bg-gray-50"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">Email Address</label>
                                        <div className="relative">
                                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                disabled={!isEditing}
                                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition disabled:bg-gray-50"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">Phone Number</label>
                                        <div className="relative">
                                            <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                disabled={!isEditing}
                                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition disabled:bg-gray-50"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">Country</label>
                                        <div className="relative">
                                            <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                value={formData.country}
                                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                disabled={!isEditing}
                                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition disabled:bg-gray-50"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-gray-700 font-bold mb-2">Address</label>
                                        <textarea
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            disabled={!isEditing}
                                            rows={3}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition disabled:bg-gray-50 resize-none"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}


                        {/* Bookings Tab */}
                        {activeTab === 'bookings' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking History</h2>
                                {bookings.length > 0 ? (
                                    <div className="space-y-4">
                                        {bookings.map((booking: any) => (
                                            <div key={booking._id} className="bg-gray-50 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-start md:items-center">
                                                <div className="w-full md:w-32 h-24 bg-gray-200 rounded-lg overflow-hidden relative">
                                                    {(booking.tour?.image || booking.destination?.image) && (
                                                        <img
                                                            src={booking.tour?.image || booking.destination?.image}
                                                            alt={booking.title || "Booking"}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg text-gray-800">
                                                        {booking.tour?.title || booking.destination?.title || booking.destination?.name || "Ref: " + booking._id.substring(0, 8)}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                                                        <span className="flex items-center gap-1">
                                                            <FaHistory className="text-primary" />
                                                            {new Date(booking.travelDate).toLocaleDateString()}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <FaUser className="text-primary" />
                                                            {booking.travelers} Travelers
                                                        </span>
                                                        <span className="font-semibold text-gray-800">
                                                            ${booking.tour?.price || booking.destination?.price || "N/A"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="self-start md:self-center">
                                                    <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                                        booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20">
                                        <FaHistory className="text-6xl text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">No bookings yet</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Favorites Tab */}
                        {activeTab === 'favorites' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Favorite Destinations</h2>
                                <div className="text-center py-20">
                                    <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No favorites yet</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
                                <div className="max-w-md space-y-6">
                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">Current Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">New Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-bold mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition"
                                        />
                                    </div>
                                    <button className="w-full py-3 bg-secondary text-white rounded-xl font-bold hover:bg-orange-600 transition">
                                        Update Password
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <h3 className="font-bold text-gray-800">Email Notifications</h3>
                                            <p className="text-sm text-gray-600">Receive booking confirmations and updates</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div>
                                            <h3 className="font-bold text-gray-800">Newsletter</h3>
                                            <p className="text-sm text-gray-600">Get travel tips and special offers</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>

                                    <div className="pt-6 border-t border-gray-200">
                                        <button className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition">
                                            Delete Account
                                        </button>
                                        <p className="text-sm text-gray-500 mt-2">This action cannot be undone</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
