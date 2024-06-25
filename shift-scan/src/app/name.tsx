import { useTranslations } from "next-intl";
import '@/app/globals.css';

export default function Name({user}: any) {
    return (
        <div>
            <h2 className='text-3xl'>{user.firstName } {user.lastName }</h2>
        </div>
    );
}   