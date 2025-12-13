"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { FaEnvelope, FaSpinner } from "react-icons/fa";

export default function AdminMessages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await api.get('/contact');
                setMessages(res.data);
            } catch (error) {
                console.error("Failed to fetch messages", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, []);

    if (loading) return <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-4xl text-secondary" /></div>;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Messages</h1>
                <p className="text-gray-500">View inquiries from the contact form.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                {messages.length === 0 ? (
                    <div className="px-6 py-12 text-center text-gray-400 flex flex-col items-center justify-center">
                        <FaEnvelope size={40} className="mb-3 opacity-20" />
                        No messages found.
                    </div>
                ) : (
                    messages.map((c: any) => (
                        <div key={c._id} className="p-6 hover:bg-gray-50 transition cursor-pointer group">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center font-bold">
                                        {c.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 group-hover:text-secondary transition">{c.subject || "No Subject"}</h3>
                                        <p className="text-xs text-gray-500">{c.name} &lt;{c.email}&gt;</p>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{new Date(c.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="pl-13 ml-13 mt-3 flex justify-between items-end">
                                <p className="text-gray-600 bg-gray-50 p-4 rounded-xl text-sm border border-gray-100 leading-relaxed group-hover:bg-white group-hover:shadow-sm transition flex-1 mr-4">{c.message}</p>
                                <button
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        if (confirm("Delete this message?")) {
                                            try {
                                                await api.delete(`/contact/${c._id}`);
                                                setMessages(messages.filter((msg: any) => msg._id !== c._id));
                                            } catch (err) {
                                                alert("Failed to delete message");
                                            }
                                        }
                                    }}
                                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded transition"
                                    title="Delete Message"
                                >
                                    <FaEnvelope className="inline mr-1" /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div >
    );
}
