import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RedirectAfterDelayProps {
    delay: number;
    to: string;
}

const RedirectAfterDelay: React.FC<RedirectAfterDelayProps> = ({ delay, to }) => {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push(to);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay, to, router]);

    return null;
};

export default RedirectAfterDelay;