'use client';
import {useTranslations} from 'next-intl';
import { useEffect, useState } from 'react';


type Props = {
time : number
};

export const Clock = ({time: initial}: Props) => {
    const t = useTranslations('Index');
    const [time, setTime] = useState(new Date(initial));

    useEffect(() => {
        const timer = setInterval(() => 
            setTime(new Date()
    ), 1000);
        return () => clearInterval(timer);
    }, []); 

    return (
        <div className="text-3xl tabular-nums" suppressHydrationWarning >{time.toLocaleTimeString(undefined,
            {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }
        )}</div>
    );
};
