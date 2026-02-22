"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

import Sidebar from '@/components/AdminSidebar';
import { CONFIG } from '@/lib/config';

const API_URL = CONFIG.API_BASE_URL;

export default function EditCustomerPage() {
    const params = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'user'
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (id) {
            fetchCustomer();
        }
    }, [id]);

    const fetchCustomer = async () => {
        try {
            const res = await fetch(`${API_URL}/users/${id}`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Failed to fetch customer');
            const data = await res.json();

            setFormData({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                role: data.role || 'user'
            });
        } catch (error) {
            console.error('Error fetching customer:', error);
            alert('Failed to load customer data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch(`${API_URL}/users/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to update customer');
            }

            alert('Customer updated successfully!');
            router.push('/admin/customers');
        } catch (error: any) {
            console.error('Error updating customer:', error);
            alert(error.message || 'Error updating customer');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || authLoading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Customer</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-8 space-y-6">
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:outline-none"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 py-3 px-6 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 py-3 px-6 rounded-xl bg-primary text-white font-bold hover:bg-orange-600 transition disabled:opacity-50"
                    >
                        {submitting ? 'Updating...' : 'Update Customer'}
                    </button>
                </div>
            </form>
        </div>
    );
}
