"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaConciergeBell } from "react-icons/fa";
import Image from "next/image";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import Modal from "@/components/Modal";

export default function AdminServicesPage() {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLimitModalOpen, setIsLimitModalOpen] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await api.get("/services");
            setServices(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load services");
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            try {
                await api.delete(`/services/${id}`);
                toast.success("Service deleted successfully");
                fetchServices();
            } catch (error: any) {
                toast.error(error.response?.data?.message || "Delete failed");
            }
        }
    };

    const filteredServices = services.filter((service) =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 md:p-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Manage Services</h1>
                <button
                    onClick={() => setIsLimitModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-orange-600 transition shadow-lg"
                >
                    <FaPlus /> Add New Service
                </button>
            </div>

            {/* Stats Cards (Optional - using simplified layout for now) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full text-xl">
                        <FaConciergeBell />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm">Total Services</p>
                        <h3 className="text-2xl font-bold">{services.length}</h3>
                    </div>
                </div>
            </div>

            {/* Tool Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-96">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary"
                    />
                </div>
                {/* Additional filters can go here */}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-6 font-semibold text-gray-600">Image</th>
                                <th className="p-6 font-semibold text-gray-600">Title</th>
                                <th className="p-6 font-semibold text-gray-600">Price</th>
                                <th className="p-6 font-semibold text-gray-600">Created At</th>
                                <th className="p-6 font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center text-gray-500">Loading...</td>
                                </tr>
                            ) : filteredServices.length > 0 ? (
                                filteredServices.map((service) => (
                                    <tr key={service._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-6">
                                            <div className="w-16 h-12 relative rounded-lg overflow-hidden bg-gray-100">
                                                {service.image ? (
                                                    <Image src={service.image} alt={service.title} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <FaConciergeBell />
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-6 font-medium text-gray-900">{service.title}</td>
                                        <td className="p-6 text-green-600 font-semibold">{service.price}</td>
                                        <td className="p-6 text-gray-500 text-sm">
                                            {new Date(service.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-6">
                                            <div className="flex gap-3">
                                                <Link href={`/admin/services/edit/${service._id}`}>
                                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit">
                                                        <FaEdit />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(service._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center text-gray-500">No services found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Limit Warning Modal */}
            <Modal
                isOpen={isLimitModalOpen}
                onClose={() => setIsLimitModalOpen(false)}
                title="Storage Limit Exceeded"
            >
                <div className="text-center py-6">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                        <FaPlus className="text-4xl transform rotate-45" />
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed mb-8">
                        Your package of Cloudinary image saved exceed limit.
                        Please subscribe to another plan to enable uploading.
                    </p>
                    <button
                        onClick={() => setIsLimitModalOpen(false)}
                        className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-teal-700 transition shadow-lg"
                    >
                        Got it
                    </button>
                </div>
            </Modal>
        </div>
    );
}
