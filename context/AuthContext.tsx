"use client";

import { createContext, useState, useEffect, useContext } from 'react';
import api from '../lib/api';
import { useRouter } from 'next/navigation';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    image?: string;
    phone?: string;
    address?: string;
    country?: string;
    token?: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: any) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
    showLoginModal: boolean;
    setShowLoginModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => { },
    register: async () => { },
    logout: async () => { },
    loading: true,
    showLoginModal: false,
    setShowLoginModal: () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        try {
            const res = await api.get('/auth/me');
            setUser(res.data);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (userData: any) => {
        const res = await api.post('/auth/login', userData);
        setUser(res.data);
        router.push('/');
    };

    const register = async (userData: any) => {
        const res = await api.post('/auth/register', userData);
        setUser(res.data);
        router.push('/');
    };

    const [showLoginModal, setShowLoginModal] = useState(false);

    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, showLoginModal, setShowLoginModal }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
