"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { FaEnvelope, FaSpinner, FaTrash, FaSearch } from "react-icons/fa";
import ConfirmModal from "@/components/ConfirmModal";

export default function AdminMessages() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const res = await api.get('/contact');
            setMessages(res.data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        } finally {
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
            await api.delete(`/contact/${itemToDelete}`);
            setMessages(messages.filter((msg: any) => msg._id !== itemToDelete));
        } catch (err) {
            console.error("Failed to delete message", err);
        } finally {
            setItemToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };

    const filteredMessages = messages.filter((msg: any) =>
        (msg.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (msg.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (msg.subject || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (msg.message || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Loading handled within return for consistency with other pages

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                        Inquiry <span className="text-primary">Inbox</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Decipher and respond to global communications</p>
                </div>
            </div>

            <div className="admin-card p-8">
                <div className="relative group">
                    <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Search communications by traveler, subject, or keyword..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="admin-input-premium w-full pl-14 pr-6 py-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-primary/30 focus:bg-white bg-gray-50/50 transition-all duration-300 font-medium"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="admin-card py-24 flex flex-col items-center justify-center gap-4">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-primary shadow-lg shadow-primary/20"></div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Decrypting Transmission...</p>
                    </div>
                ) : filteredMessages.length === 0 ? (
                    <div className="admin-card py-24 text-center text-gray-400 flex flex-col items-center justify-center gap-4">
                        <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-3xl opacity-50">
                            <FaEnvelope />
                        </div>
                        <p className="text-xs font-black uppercase tracking-widest italic">No correspondence discovered in this frequency</p>
                    </div>
                ) : (
                    filteredMessages.map((c: any) => (
                        <div key={c._id} className="admin-card p-0 overflow-hidden group hover:translate-x-1 transition-all duration-300">
                            <div className="p-8 flex flex-col md:flex-row gap-8">
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center font-black text-primary text-sm shadow-sm border border-primary/20 group-hover:scale-105 transition-transform">
                                                {c.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h3 className="text-base font-black text-gray-900 group-hover:text-primary transition-colors">{c.subject || "Undisclosed Subject"}</h3>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                    {c.name} <span className="mx-2 text-gray-200">|</span> <span className="lowercase">{c.email}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100 tabular-nums">
                                                {new Date(c.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute left-0 top-0 w-1 h-full bg-primary/10 rounded-full"></div>
                                        <p className="text-sm text-gray-600 pl-6 leading-relaxed font-medium italic">
                                            "{c.message}"
                                        </p>
                                    </div>
                                </div>
                                <div className="flex md:flex-col justify-end items-end gap-3 opacity-40 group-hover:opacity-100 transition-opacity p-2">
                                    <button
                                        onClick={() => handleDeleteClick(c._id)}
                                        className="p-4 text-red-500 bg-red-50 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-100 flex items-center gap-2 group/btn"
                                        title="Purge Message"
                                    >
                                        <FaTrash size={14} className="group-hover/btn:scale-110 transition-transform" />
                                        <span className="text-[10px] font-black uppercase tracking-widest md:hidden">Delete Transmission</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Interaction Overhaul: Confirm Delete */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Purge Communication"
                message="Are you sure you want to permanently delete this inquiry? Correspondence records may be necessary for future reference."
                type="danger"
                confirmText="Erase Transmission"
            />
        </div>
    );
}
