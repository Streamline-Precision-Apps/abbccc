"use client";
import '@/app/globals.css';


export default function AppUser ({ user }: any) {
    return (
        <div className="flex flex-col items-center space-y-4 ">
            <h2 className='text-3xl'>{user.firstName } {user.lastName }</h2>
        </div>
    );
}   