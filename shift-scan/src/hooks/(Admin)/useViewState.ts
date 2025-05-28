// hooks/useViewState.ts
import { useState } from "react";

export type PersonnelView =
  | { mode: "default" }
  | { mode: "user"; userId: string }
  | { mode: "crew"; crewId: string }
  | { mode: "user+crew"; userId: string; crewId: string }
  | { mode: "registerUser" }
  | { mode: "registerCrew" }
  | { mode: "registerUser+crew"; crewId: string }
  | { mode: "registerCrew+user"; userId: string }
  | { mode: "registerBoth" };

export const useViewState = () => {
  const [view, setView] = useState<PersonnelView>({ mode: "default" });
  return { view, setView };
};
