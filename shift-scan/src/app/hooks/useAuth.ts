import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // app router specific hook
import { auth } from '@/auth'; // Replace with your auth logic

interface Session {
  user: {
    id: string;
    // add other user properties if needed
  } | null;
}

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const session: Session | null = await auth();
      
      if (!session || !session.user || !session.user.id) {
        router.push('/signin'); // Redirect if not authenticated
      } else {
        setUserId(session.user.id);
      }
    }
    checkAuth();
  }, [router]);

  return { userId };
}