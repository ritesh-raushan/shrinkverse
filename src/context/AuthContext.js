"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('userEmail');
        if (token && email) {
            setIsLoggedIn(true);
            setUserEmail(email);
        }
    }, []);

    const login = (token, email) => {
        localStorage.setItem('token', token);
        localStorage.setItem('userEmail', email);
        setIsLoggedIn(true);
        setUserEmail(email);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        setIsLoggedIn(false);
        setUserEmail('');
        router.push('/');
    };

    // const checkAuth = () => {
    //     if (isLoggedIn) {
    //         toast.error('You are already logged in!');
    //         router.push('/shorten');
    //         return true;
    //     }
    //     return false;
    // };

    return (
        // <AuthContext.Provider value={{ isLoggedIn, userEmail, login, logout, checkAuth }}>
        <AuthContext.Provider value={{ isLoggedIn, userEmail, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}