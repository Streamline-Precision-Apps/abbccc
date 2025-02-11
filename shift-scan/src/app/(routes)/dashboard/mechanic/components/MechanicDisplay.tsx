"use client";
import { Holds } from "@/components/(reusable)/holds";
import { useState } from "react";
import MechanicPriority from "./MechanicPriority";
import MechanicManagerPriority from "./MechanicManagerPriority";

export default function MechanicDisplay() {
  const [isManager, setIsManager] = useState(true);
  return (
    <>
      {!isManager && <MechanicPriority />}
      {isManager && <MechanicManagerPriority />}
    </>
  );
}
