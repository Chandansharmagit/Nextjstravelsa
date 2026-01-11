'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, User, Loader2, ChevronRight, Minimize2 } from 'lucide-react';
import api from '@/lib/api';

interface Message {
    role: 'user' | 'bot';
    content: string;
}

export default function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', content: 'Namaste! I am your AI Guide. Ask me anything about Nepal trips, trekking, or culture!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await api.post('/ai/chat', {
                message: userMessage,
                context: typeof window !== 'undefined' ? window.location.pathname : 'Unknown'
            });

            const botMessage = response.data.message;
            setMessages(prev => [...prev, { role: 'bot', content: botMessage }]);
        } catch (error: any) {
            console.error('AI Chat Error:', error);
            let errorMsg = 'Sorry, the connection faltered. Please try again.';
            if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            }
            setMessages(prev => [...prev, { role: 'bot', content: errorMsg }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="pointer-events-auto mb-4 w-[350px] sm:w-[400px] h-[600px] max-h-[80vh] flex flex-col rounded-[32px] overflow-hidden shadow-2xl border border-white/20 backdrop-blur-3xl bg-white/80 dark:bg-black/80"
                    >
                        {/* Modern Glass Header */}
                        <div className="relative p-6 bg-gradient-to-r from-violet-600 to-indigo-600 flex items-center justify-between shrink-0">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <div className="relative z-10 flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md shadow-inner border border-white/10">
                                    <Sparkles className="text-white w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg tracking-tight">Travel AI</h3>
                                    <div className="flex items-center gap-1.5 opacity-80">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
                                        <span className="text-[10px] uppercase tracking-widest text-white font-medium">Always Active</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="relative z-10 p-2 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white"
                            >
                                <Minimize2 size={18} />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-black/20">
                            <div className="space-y-6">
                                {messages.map((msg, idx) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={idx}
                                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {msg.role === 'bot' && (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 p-[1px] shadow-lg shrink-0 mt-2">
                                                <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                                                    <Bot size={14} className="text-violet-500" />
                                                </div>
                                            </div>
                                        )}

                                        <div
                                            className={`max-w-[80%] p-4 text-sm font-medium leading-relaxed shadow-sm ${msg.role === 'user'
                                                ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-2xl rounded-tr-sm shadow-indigo-500/20'
                                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-sm shadow-gray-200/50 dark:shadow-none'
                                                }`}
                                        >
                                            {msg.content}
                                        </div>

                                        {msg.role === 'user' && (
                                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 mt-2 text-gray-500">
                                                <User size={14} />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                                {isLoading && (
                                    <div className="flex gap-3 justify-start">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 p-[1px] shadow-lg shrink-0">
                                            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                                                <Bot size={14} className="text-violet-500" />
                                            </div>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm flex gap-1 items-center h-10">
                                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white/80 dark:bg-black/50 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 shrink-0">
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Type your question..."
                                    disabled={isLoading}
                                    className="w-full pl-5 pr-14 py-4 rounded-3xl bg-gray-100/50 dark:bg-gray-800/50 border border-transparent focus:bg-white dark:focus:bg-black focus:border-violet-300 focus:ring-4 focus:ring-violet-100 dark:focus:ring-violet-900/30 transition-all text-sm outline-none placeholder:text-gray-400"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!input.trim() || isLoading}
                                    className={`absolute right-2 top-2 p-2 rounded-full transition-all duration-300 ${!input.trim() || isLoading
                                        ? 'bg-gray-200 text-gray-400 dark:bg-gray-700'
                                        : 'bg-violet-600 text-white shadow-lg shadow-violet-500/30 hover:scale-105 active:scale-95'
                                        }`}
                                >
                                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <ChevronRight size={20} />}
                                </button>
                            </div>
                            <div className="mt-3 flex justify-center items-center gap-2">
                                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest flex items-center gap-1">
                                    <Sparkles size={10} className="text-violet-400" /> Powered by OpenAI
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Trigger Button */}
            {!isOpen && (
                <motion.button
                    layoutId="chat-trigger"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    onClick={() => setIsOpen(true)}
                    className="pointer-events-auto p-0 w-16 h-16 rounded-full shadow-[0_8px_30px_rgb(124,58,237,0.3)] bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white border-4 border-white/20 backdrop-blur-sm group overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-white/20 rotate-45 transform translate-y-full group-hover:translate-y-[-100%] transition-transform duration-700"></div>
                    <Sparkles size={28} className="relative z-10" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce"></span>
                </motion.button>
            )}
        </div>
    );
}
