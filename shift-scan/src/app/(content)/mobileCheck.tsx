"use client";
import HamburgerMenuNew from "@/components/(animations)/hamburgerMenuNew";
import { Grids } from "@/components/(reusable)/grids";
import WidgetSection from "./widgetSection";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRouter } from "next/navigation";
import Spinner from "@/components/(animations)/spinner";

export default function MobileCheck({
  locale,
  session,
}: {
  locale: string;
  session: Session;
}) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isMobile === undefined) return; // Wait for isMobile to resolve
    if (!isMobile) {
      router.replace("/admins");
    } else {
      setReady(true);
    }
  }, [isMobile, router]);

  if (!ready) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <Grids rows={"8"} gap={"5"}>
      <HamburgerMenuNew />
      <WidgetSection locale={locale} session={session} />
    </Grids>
  );
}
