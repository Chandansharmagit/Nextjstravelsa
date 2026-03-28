"use client";

import { useState, useEffect, useCallback } from 'react';
import { FaLock, FaShieldAlt, FaPlus, FaTrash, FaImage, FaCheckCircle, FaExclamationTriangle, FaCloudUploadAlt, FaListUl } from 'react-icons/fa';
import api from '@/lib/api';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function SuperAdminPage() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [activeTab, setActiveTab] = useState<'list' | 'upload'>('list');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        title: '',
        subtitle: '',
        tag: 'Live Trade',
        image_url: '',
        order: 0,
        is_public: true
    });
    const [uploading, setUploading] = useState(false);

    const fetchResults = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get('/results');
            setResults(res.data);
        } catch (err) {
            console.error('Failed to fetch results', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (username === 'chandansharma_Superadmin' && password === 'SuperAdmin@#$') {
            setIsAuthorized(true);
            setError('');
            fetchResults();
        } else {
            setError('Invalid Developer Credentials');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append('image', file);

        try {
            const res = await api.post('/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setFormData({ ...formData, image_url: res.data.image.path });
        } catch (err) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/results', formData);
            setFormData({ title: '', subtitle: '', tag: 'Live Trade', image_url: '', order: 0, is_public: true });
            setActiveTab('list');
            fetchResults();
        } catch (err) {
            alert('Failed to create result');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this result?')) return;
        try {
            await api.delete(`/results/${id}`);
            fetchResults();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    if (!isAuthorized) {
        return (
            <div className="flex items-center justify-center min-h-[70vh]">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md p-12 bg-white rounded-[40px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100"
                >
                    <div className="text-center mb-10">
                        <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-8 transition-transform hover:rotate-12 duration-500">
                            <FaShieldAlt size={48} />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Super <span className="text-primary underline decoration-primary/20 underline-offset-8">Admin</span></h1>
                        <p className="text-gray-400 mt-4 font-bold uppercase tracking-[0.3em] text-[10px]">Developer Authentication Required</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="group">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1 group-focus-within:text-primary transition-colors">Developer ID</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-8 py-5 bg-gray-50/50 border-2 border-gray-100 rounded-3xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300"
                                    placeholder="Enter username"
                                    required
                                />
                            </div>
                            <div className="group">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1 group-focus-within:text-primary transition-colors">Access Key</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-8 py-5 bg-gray-50/50 border-2 border-gray-100 rounded-3xl focus:border-primary focus:bg-white outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[11px] font-black tracking-wider animate-shake">
                                <FaExclamationTriangle />
                                <span>{error}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-6 bg-primary text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 mt-8"
                        >
                            <FaLock /> AUTHORIZE ACCOUNT
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
            {/* Minimalist Header with Tabs */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-4 border-b border-gray-100">
                <div>
                    <div className="flex items-center gap-3 text-primary mb-2">
                        <FaShieldAlt />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Developer Console</span>
                    </div>
                    <h1 className="text-5xl font-black text-gray-900 tracking-tighter">
                        Manage <span className="text-primary italic">Results</span>
                    </h1>
                </div>

                <div className="flex bg-gray-100/80 p-1.5 rounded-[24px] border border-gray-200/50 backdrop-blur-sm">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`flex items-center gap-3 px-8 py-3.5 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all ${
                            activeTab === 'list' 
                            ? 'bg-white text-primary shadow-sm shadow-black/5' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        <FaListUl /> <span>Vault Inventory</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`flex items-center gap-3 px-8 py-3.5 rounded-[20px] text-xs font-black uppercase tracking-widest transition-all ${
                            activeTab === 'upload' 
                            ? 'bg-white text-primary shadow-sm shadow-black/5' 
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                    >
                        <FaPlus /> <span>New Deployment</span>
                    </button>
                </div>
            </div>

            <main className="min-h-[60vh]">
                <AnimatePresence mode="wait">
                    {activeTab === 'list' ? (
                        <motion.div 
                            key="list"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            {loading ? (
                                <div className="py-40 flex flex-col items-center justify-center gap-6">
                                    <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin"></div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 animate-pulse">Syncing Vault Data...</p>
                                </div>
                            ) : results.length === 0 ? (
                                <div className="py-40 bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-200 text-center">
                                    <p className="text-gray-400 font-bold italic text-lg tracking-tight">The vault is currently empty.</p>
                                    <button onClick={() => setActiveTab('upload')} className="mt-6 text-primary font-black uppercase text-[10px] tracking-widest hover:underline decoration-2 underline-offset-8">Initialize First Upload</button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {results.map((result) => (
                                        <div key={result._id} className="bg-white rounded-[32px] p-4 shadow-sm hover:shadow-2xl transition-all duration-500 group border border-gray-100">
                                            <div className="relative h-64 overflow-hidden rounded-[24px]">
                                                <Image
                                                    src={result.image_url}
                                                    alt={result.title}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                />
                                                <div className="absolute top-4 right-4 z-10">
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-xl ${
                                                        result.tag === 'Certificate' ? 'bg-blue-600' :
                                                        result.tag === 'Live Trade' ? 'bg-emerald-600' : 'bg-violet-600'
                                                    }`}>
                                                        {result.tag}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="font-black text-xl text-gray-900 leading-tight mb-1">{result.title}</h3>
                                                        <p className="text-xs text-gray-400 font-bold italic font-playfair">{result.subtitle}</p>
                                                    </div>
                                                    <div className={`w-3 h-3 rounded-full mt-2 shadow-sm ${result.is_public ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-gray-300 ring-4 ring-gray-100'}`} title={result.is_public ? 'Public' : 'Private'} />
                                                </div>
                                                <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-50">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Display Rank</span>
                                                        <span className="font-black text-gray-800 text-sm">{result.order.toString().padStart(2, '0')}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDelete(result._id)}
                                                        className="w-12 h-12 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-2xl transition-all hover:scale-110 active:scale-90"
                                                    >
                                                        <FaTrash size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="upload"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white p-12 rounded-[48px] shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                                <FaCloudUploadAlt size={200} />
                            </div>

                            <div className="relative z-10">
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-12">New Deployment <span className="text-primary tracking-normal ml-2">Form</span></h2>
                                
                                <form onSubmit={handleSubmit} className="space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-8">
                                            <div className="group">
                                                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1 group-focus-within:text-primary transition-colors">Descriptor Title</label>
                                                <input
                                                    type="text"
                                                    value={formData.title}
                                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                    className="w-full px-8 py-5 bg-gray-50/50 border-2 border-gray-100 rounded-[24px] focus:border-primary focus:bg-white outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300"
                                                    placeholder="e.g. +$8,012 PROFIT"
                                                    required
                                                />
                                            </div>
                                            <div className="group">
                                                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1 group-focus-within:text-primary transition-colors">Secondary Meta Data</label>
                                                <input
                                                    type="text"
                                                    value={formData.subtitle}
                                                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                                    className="w-full px-8 py-5 bg-gray-50/50 border-2 border-gray-100 rounded-[24px] focus:border-primary focus:bg-white outline-none transition-all font-bold text-gray-800 placeholder:text-gray-300"
                                                    placeholder="e.g. VERIFIED CERTIFICATE"
                                                    required
                                                />
                                            </div>
                                            <div className="group">
                                                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1 group-focus-within:text-primary transition-colors">Classification</label>
                                                <div className="relative">
                                                    <select
                                                        value={formData.tag}
                                                        onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                                        className="w-full px-8 py-5 bg-gray-50/50 border-2 border-gray-100 rounded-[24px] focus:border-primary focus:bg-white outline-none appearance-none transition-all font-bold text-gray-800 cursor-pointer"
                                                    >
                                                        <option value="Certificate">Certificate</option>
                                                        <option value="Live Trade">Live Trade</option>
                                                        <option value="Funded">Funded</option>
                                                    </select>
                                                    <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                                                        <FaPlus size={10} className="rotate-45" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="relative">
                                                <label className="block text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 ml-1">Visual Evidence Upload</label>
                                                <div className={`relative h-[300px] w-full rounded-[32px] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center p-3 overflow-hidden ${
                                                    formData.image_url 
                                                    ? 'border-emerald-500/50 bg-emerald-50 shadow-inner' 
                                                    : 'border-gray-200 bg-gray-50/50 hover:border-primary/50 hover:bg-white'
                                                }`}>
                                                    {uploading ? (
                                                        <div className="text-center">
                                                            <div className="w-16 h-16 border-t-2 border-primary rounded-full animate-spin mx-auto mb-6 shadow-lg shadow-primary/20"></div>
                                                            <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] animate-pulse">Processing Resource...</p>
                                                        </div>
                                                    ) : formData.image_url ? (
                                                        <>
                                                            <Image src={formData.image_url} alt="Preview" fill className="object-cover opacity-90 transition-transform duration-1000 hover:scale-105" />
                                                            <div className="absolute bottom-6 left-6 right-6 z-10 bg-white/95 backdrop-blur-xl px-6 py-3.5 rounded-2xl border border-emerald-100 flex items-center justify-between shadow-2xl shadow-emerald-500/10">
                                                                <div className="flex items-center gap-3">
                                                                    <FaCheckCircle className="text-emerald-500" />
                                                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest font-sans">Asset Locked</span>
                                                                </div>
                                                                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic">Replace? Click box</span>
                                                            </div>
                                                            <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                        </>
                                                    ) : (
                                                        <div className="text-center group cursor-pointer w-full h-full flex flex-col items-center justify-center">
                                                            <div className="w-20 h-20 bg-white rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                                                <FaImage className="text-gray-200 group-hover:text-white transition-colors" size={28} />
                                                            </div>
                                                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] group-hover:text-primary transition-colors">Select Proof Asset</p>
                                                            <p className="text-[8px] text-gray-300 font-bold mt-3 tracking-tighter uppercase mb-2">Max Size: 5MB</p>
                                                            <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" required />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col lg:flex-row gap-10 items-center justify-between pt-12 border-t border-gray-100">
                                        <div className="flex flex-wrap items-center gap-12">
                                            <div className="w-40">
                                                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-3 ml-1">Vault Rank</label>
                                                <input
                                                    type="number"
                                                    value={formData.order}
                                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                                                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-primary outline-none text-center font-black text-gray-800"
                                                />
                                            </div>
                                            
                                            <label className="flex items-center gap-6 cursor-pointer group bg-gray-50 px-8 py-4 rounded-3xl border-2 border-gray-100 transition-all hover:bg-white hover:border-gray-200">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] group-hover:text-gray-600 transition-colors">Public Access</span>
                                                <div className={`w-14 h-7 rounded-full p-1.5 transition-all duration-500 ${formData.is_public ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-gray-300'}`}>
                                                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-500 ${formData.is_public ? 'translate-x-7' : 'translate-x-0'}`} />
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={formData.is_public}
                                                    onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                                                />
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={uploading || !formData.image_url}
                                            className="w-full lg:w-auto min-w-[340px] px-12 py-7 bg-primary text-white rounded-[32px] font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 flex items-center justify-center gap-4"
                                        >
                                            {uploading ? (
                                                <span className="animate-pulse">DECODING...</span>
                                            ) : (
                                                <>
                                                    <FaCloudUploadAlt className="text-xl" />
                                                    <span>Authorize Deployment</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
