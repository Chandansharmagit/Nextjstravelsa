"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaConciergeBell } from "react-icons/fa";
import Image from "next/image";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import Modal from "@/components/Modal";
import ConfirmModal from "@/components/ConfirmModal";

export default function AdminServicesPage() {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

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

    const handleDeleteClick = (id: string) => {
        setItemToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await api.delete(`/services/${itemToDelete}`);
            toast.success("Service deleted successfully");
            fetchServices();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Delete failed");
        } finally {
            setItemToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };

    const filteredServices = services.filter((service) =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Service <span className="text-primary">Portfolio</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Configure and maintain your enterprise offerings</p>
                </div>
                <Link
                    href="/admin/services/create"
                    className="admin-btn-primary flex items-center gap-3"
                >
                    <FaPlus size={14} /> <span>Initialize Service</span>
                </Link>
            </div>

            {/* Dashboard Insight */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="admin-card p-8 flex items-center gap-6 group hover:translate-y-[-4px]">
                    <div className="w-16 h-16 bg-blue-500/10 text-blue-600 rounded-[1.5rem] flex items-center justify-center text-2xl group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 shadow-sm shadow-blue-500/10">
                        <FaConciergeBell />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Catalog</p>
                        <h3 className="text-3xl font-black text-gray-900 mt-1">{services.length} <span className="text-xs font-bold text-gray-400">Units</span></h3>
                    </div>
                </div>
            </div>

            {/* Command Bar */}
            <div className="admin-card p-8">
                <div className="relative group">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search services by operational title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="admin-input-premium w-full pl-14 pr-6 py-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary/30 focus:bg-white bg-gray-50/50 transition-all duration-300 font-medium"
                    />
                </div>
            </div>

            {/* Table Section */}
            <div className="admin-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="admin-table-header">
                            <tr>
                                <th className="px-8 py-6">Operation Item</th>
                                <th className="px-8 py-6">Financial Value</th>
                                <th className="px-8 py-6">Creation Log</th>
                                <th className="px-8 py-6 text-right">Admin Controls</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Loading Services...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredServices.length > 0 ? (
                                filteredServices.map((service) => (
                                    <tr key={service._id} className="admin-table-row group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-12 relative rounded-xl overflow-hidden bg-gray-50 border border-gray-100 group-hover:scale-105 transition-transform duration-300">
                                                    {service.image ? (
                                                        <Image src={service.image} alt={service.title} fill className="object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <FaConciergeBell />
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm font-black text-gray-900 group-hover:text-primary transition-colors">{service.title}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <p className="text-sm font-black text-gray-900 tabular-nums">NRP {service.price}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Market Rate</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            {new Date(service.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex justify-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/services/edit/${service._id}`}>
                                                    <button className="p-3 text-green-500 bg-green-50 rounded-xl hover:bg-green-500 hover:text-white transition-all shadow-sm">
                                                        <FaEdit size={14} />
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteClick(service._id)}
                                                    className="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-gray-400 text-xs font-bold uppercase tracking-widest italic">
                                        No services found in database
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* Interaction Overhaul: Confirm Delete */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Terminate Service"
                message="Are you sure you want to permanently remove this service from your portfolio? Operational data may be affected."
                type="danger"
                confirmText="Archive Service"
            />
        </div>
    );
}
