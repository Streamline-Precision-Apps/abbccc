// this wrapper prevent bad SSR
// DO NOT REMOVE
"use client";

import dynamic from "next/dynamic";

const AutoPermissionsManager = dynamic(
  () => import("@/components/(settings)/AutoPermissionsManager"),
  { ssr: false },
);

export default function AutoPermissionsManagerClient() {
  return <AutoPermissionsManager />;
}
