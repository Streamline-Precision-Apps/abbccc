'use client'

import { clear } from "console"
import {signIn, signOut} from "next-auth/react"

export const LoginButton = () => {
    return<button onClick={() => signIn()}>Login</button>
}

export const LogoutButton = () => {
    localStorage.clear();
    return<button onClick={() => signOut()}>Logout</button>
}
// auth steps to getting to dashboard
export const setAuthStep = (step: string) => {
    localStorage.setItem('authStep', step);
};

export const getAuthStep = () => {
    return localStorage.getItem('authStep');
};

export const clearAuthStep = () => {
    localStorage.removeItem('authStep');
};

export const isAuthenticated = () => {
    const currentStep = getAuthStep();
    
    return currentStep === 'success';
};
export const isDashboardAuthenticated = () => {
    const currentStep = getAuthStep();
    
    return currentStep === 'success';
};