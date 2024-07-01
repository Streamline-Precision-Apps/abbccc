"use client";
import '@/app/globals.css';


export default function AppUser ({ user }: any) {
    return (
        <div className="flex justify-center items-center space-y-4  ">
            <h2 className='text-3xl mt-6 mb-6'>{user.firstName} {user.lastName}</h2>
        </div>
    );
}   