"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.user?.email) {
            setIsLoggedIn(true);
            setUserEmail(session.user.email);
        } else {
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('userEmail');
            if (token && email) {
                setIsLoggedIn(true);
                setUserEmail(email);
            }
        }
    }, [session]);

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