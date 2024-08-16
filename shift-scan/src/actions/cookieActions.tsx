'use server'
import { cookies } from 'next/headers'

export async function setLocale(isSpanish: boolean) {
try {
    cookies().set('locale', isSpanish ? 'es' : 'en', {
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
    });
    
} catch (error) {
    console.error("Failed to set locale cookie:", error);
}
}