"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
const LocaleContext = createContext();

export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState('en'); // Default locale

    useEffect(() => {
    const savedLocale = localStorage.getItem('locale') || cookies.get('locale') || 'en';
    setLocale(savedLocale);
    }, []);

    const changeLocale = (newLocale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale); // Save locale in localStorage
    Cookies.set('locale', newLocale, { expires: 365*24 }); // Save locale in a cookie
    };

    return (
    <LocaleContext.Provider value={{ locale, changeLocale }}>
        {children}
    </LocaleContext.Provider>
    );
};

export const useLocale = () => useContext(LocaleContext);