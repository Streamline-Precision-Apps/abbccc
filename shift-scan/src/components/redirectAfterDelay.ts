"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type RedirectAfterDelayProps = {
  delay: number;
  to: string;
};

export default function RedirectAfterDelay({
  delay,
  to,
}: RedirectAfterDelayProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(to);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, to, router]);

  return null;
}
