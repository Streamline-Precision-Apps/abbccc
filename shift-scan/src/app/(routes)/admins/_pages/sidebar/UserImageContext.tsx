"use client";

import { se } from "date-fns/locale";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useState, useCallback } from "react";

interface UserProfileContextType {
  image: string | null;
  name: string;
  role: string;
  refresh: () => Promise<void>;
  setImage: (img: string | null) => void;
  loading: boolean;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(
  undefined,
);

export const useUserProfile = () => {
  const ctx = useContext(UserProfileContext);
  if (!ctx)
    throw new Error("useUserProfile must be used within UserProfileProvider");
  return ctx;
};

export const UserProfileProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const { data: session, status } = useSession();

  // Set name and role only after session is loaded
  React.useEffect(() => {
    if (status === "loading") {
      setLoading(true);
      return;
    }
    if (session?.user) {
      setName(
        session.user.firstName && session.user.lastName
          ? `${session.user.firstName} ${session.user.lastName.slice(0, 1)}`
          : "",
      );
      setRole(session.user.permission || "");
    }
  }, [session, status]);

  const refresh = useCallback(async () => {
    // Only make API calls if user is authenticated
    if (status !== "authenticated") {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/getUserImage");
      if (!response.ok) throw new Error("Failed to fetch profile picture");
      const data = await response.json();
      setImage(data.image || null);
    } catch (error) {
      console.error("Error fetching profile picture:", error);
    } finally {
      setLoading(false);
    }
  }, [status]);

  React.useEffect(() => {
    // Only refresh when authenticated
    if (status === "authenticated") {
      refresh();
    }
  }, [refresh, status]);

  return (
    <UserProfileContext.Provider
      value={{ image, name, role, refresh, setImage, loading }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};
