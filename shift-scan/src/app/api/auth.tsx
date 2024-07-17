'use client'
import { clear } from "console"
import {signIn, signOut} from "next-auth/react"

export const LoginButton = () => {
    return<button onClick={() => signIn()}>Login</button>
}

export const LogoutButton = () => {
    return<button onClick={() => signOut()}>Logout</button>
}
// auth steps to getting to dashboard
export const getAuthStep = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem('authStep');
    }
    return null;
};

export const clearAuthStep = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem('authStep');
    }
};

export const setAuthStep = (authStep: string) => {
    if (typeof window !== "undefined") {
        localStorage.setItem('authStep', authStep);
    }
};

export const isAuthenticated = () => {
    const currentStep = getAuthStep();
    
    return currentStep === 'success';
};
export const isDashboardAuthenticated = () => {
    const currentStep = getAuthStep();
    
    return currentStep === 'success';
};