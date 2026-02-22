'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaCopy, FaEnvelope, FaSearch, FaCheck, FaKey, FaPlus, FaTerminal, FaTimes } from 'react-icons/fa';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function NewsletterAdmin() {
    const [activeTab, setActiveTab] = useState<'subscribers' | 'api'>('subscribers');
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [apiKeys, setApiKeys] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // API Key State
    const [newKeyName, setNewKeyName] = useState('');
    const [generatedKey, setGeneratedKey] = useState<{ name: string, key: string } | null>(null);
    const [isCreatingKey, setIsCreatingKey] = useState(false);

    useEffect(() => {
        if (activeTab === 'subscribers') {
            fetchSubscribers();
        } else {
            fetchApiKeys();
        }
    }, [activeTab]);

    const fetchSubscribers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/newsletter');
            setSubscribers(data);
        } catch (error) {
            console.error('Failed to fetch subscribers', error);
            toast.error('Failed to load subscribers');
        } finally {
            setLoading(false);
        }
    };

    const fetchApiKeys = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/apikeys');
            setApiKeys(data);
        } catch (error) {
            console.error('Failed to fetch keys', error);
            toast.error('Failed to load API keys');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, email: string) => {
        if (!confirm(`Are you sure you want to remove ${email} from the newsletter?`)) return;

        try {
            await api.delete(`/newsletter/${id}`);
            setSubscribers(subscribers.filter(sub => sub._id !== id));
            toast.success('Subscriber removed');
        } catch (error) {
            toast.error('Failed to delete subscriber');
        }
    };

    const handleDeleteKey = async (id: string, name: string) => {
        if (!confirm(`Revoke API Key "${name}"? Access will be immediately blocked.`)) return;

        try {
            await api.delete(`/apikeys/${id}`);
            setApiKeys(apiKeys.filter(k => k._id !== id));
            toast.success('API Key revoked');
        } catch (error) {
            toast.error('Failed to revoke key');
        }
    };

    const handleCreateKey = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreatingKey(true);
        try {
            const { data } = await api.post('/apikeys', { name: newKeyName });
            setGeneratedKey(data);
            setNewKeyName('');
            fetchApiKeys();
            toast.success('API Key generated');
        } catch (error) {
            toast.error('Failed to generate key');
        } finally {
            setIsCreatingKey(false);
        }
    };

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success('Copied to clipboard');
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredSubscribers = subscribers.filter(sub =>
        sub.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-3xl font-black text-gray-800 tracking-tight">Newsletter & API</h1>
                    <p className="text-gray-500 mt-1">Manage subscribers and external access</p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('subscribers')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'subscribers' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Subscribers
                    </button>
                    <button
                        onClick={() => setActiveTab('api')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'api' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        API Access
                    </button>
                </div>
            </div>

            {loading && !generatedKey ? (
                <div className="flex items-center justify-center p-12">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    {activeTab === 'subscribers' ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100">
                                <div className="relative max-w-sm">
                                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search emails..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none"
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#f8fafc] border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Email Address</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Subscribed Date</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <AnimatePresence>
                                            {filteredSubscribers.map((sub) => (
                                                <motion.tr
                                                    key={sub._id}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="group hover:bg-gray-50/50 transition-colors"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                                                                <FaEnvelope size={12} />
                                                            </div>
                                                            <span className="font-medium text-gray-700">{sub.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {new Date(sub.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleCopy(sub.email, sub._id)}
                                                                className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors relative"
                                                            >
                                                                {copiedId === sub._id ? <FaCheck className="text-green-500" /> : <FaCopy size={14} />}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(sub._id, sub.email)}
                                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <FaTrash size={14} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                        {filteredSubscribers.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                                    No subscribers found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Create Key Section */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FaPlus className="text-primary" /> Generate New Key
                                </h3>
                                <form onSubmit={handleCreateKey} className="flex gap-4">
                                    <input
                                        type="text"
                                        value={newKeyName}
                                        onChange={(e) => setNewKeyName(e.target.value)}
                                        placeholder="Key Name (e.g. Mobile App v1)"
                                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={isCreatingKey}
                                        className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors"
                                    >
                                        Generate
                                    </button>
                                </form>

                                {/* Generated Key Display */}
                                <AnimatePresence>
                                    {generatedKey && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="mt-6 bg-green-50 border border-green-200 rounded-xl p-6"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="p-3 bg-green-100 text-green-600 rounded-full">
                                                    <FaKey size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-green-800 mb-1">API Key Created Successfully</h4>
                                                    <p className="text-green-700 text-sm mb-4">
                                                        Copy this key now. You won't be able to see it again!
                                                    </p>
                                                    <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-green-200 font-mono text-sm text-gray-600 break-all">
                                                        {generatedKey.key}
                                                        <button
                                                            onClick={() => handleCopy(generatedKey.key, 'new-key')}
                                                            className="ml-auto text-gray-400 hover:text-green-600"
                                                        >
                                                            {copiedId === 'new-key' ? <FaCheck /> : <FaCopy />}
                                                        </button>
                                                    </div>
                                                </div>
                                                <button onClick={() => setGeneratedKey(null)} className="text-green-400 hover:text-green-600">
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Active Keys List */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h3 className="font-bold text-gray-800">Active API Keys</h3>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {apiKeys.map((key) => (
                                        <div key={key._id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                                                    <FaKey />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-800">{key.name}</h4>
                                                    <p className="text-xs text-gray-400">Created: {new Date(key.createdAt).toLocaleDateString()}</p>
                                                    {key.lastUsed && (
                                                        <p className="text-xs text-green-600 mt-1">Last used: {new Date(key.lastUsed).toLocaleDateString()}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteKey(key._id, key.name)}
                                                className="px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg font-medium transition-colors border border-transparent hover:border-red-100"
                                            >
                                                Revoke Access
                                            </button>
                                        </div>
                                    ))}
                                    {apiKeys.length === 0 && (
                                        <div className="p-12 text-center text-gray-400">
                                            No active API keys found.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Integration Guide */}
                            <div className="bg-[#0f172a] text-gray-300 rounded-2xl p-6 shadow-lg">
                                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                    <FaTerminal /> Integration Example
                                </h3>
                                <div className="bg-black/50 p-4 rounded-xl font-mono text-xs md:text-sm overflow-x-auto">
                                    <p className="text-gray-500 mb-2"># Get all subscribers (Authentication required)</p>
                                    <p className="break-all">
                                        curl -X GET https://travelsansar.com/api/newsletter \<br />
                                        &nbsp;&nbsp;-H "x-api-key: YOUR_API_KEY"
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
