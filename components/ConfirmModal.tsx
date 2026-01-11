"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle, FaTrash, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import { useEffect } from "react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string | React.ReactNode;
    type?: 'danger' | 'success' | 'info';
    confirmText?: string;
    cancelText?: string;
}

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = 'danger',
    confirmText = 'Confirm Action',
    cancelText = 'Cancel'
}: ConfirmModalProps) => {

    // Close on ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    const getIcon = () => {
        switch (type) {
            case 'danger': return <FaTrash className="text-red-500" />;
            case 'success': return <FaCheckCircle className="text-green-500" />;
            default: return <FaInfoCircle className="text-blue-500" />;
        }
    };

    const getColorClass = () => {
        switch (type) {
            case 'danger': return 'from-red-500 to-rose-600 shadow-red-200';
            case 'success': return 'from-green-500 to-emerald-600 shadow-green-200';
            default: return 'from-blue-500 to-indigo-600 shadow-blue-200';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 400 }}
                        className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_32px_120px_-20px_rgba(0,0,0,0.2)] overflow-hidden border border-gray-100"
                    >
                        <div className="p-10 text-center">
                            {/* Icon Header */}
                            <div className="mx-auto w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-3xl mb-6 shadow-inner border border-gray-50">
                                {getIcon()}
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
                                {title}
                            </h3>
                            <p className="text-slate-500 font-medium leading-relaxed mb-10 px-4">
                                {message}
                            </p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`w-full py-4 rounded-2xl bg-gradient-to-br ${getColorClass()} text-white font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all`}
                                >
                                    {confirmText}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 rounded-2xl bg-gray-50 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:bg-gray-100 hover:text-slate-600 transition-all border border-gray-100"
                                >
                                    {cancelText}
                                </button>
                            </div>
                        </div>

                        {/* Visual Accent */}
                        <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${getColorClass().split(' ').slice(0, 2).join(' ')}`} />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;
