"use client";

import { useNotification } from "@/app/context/NotificationContext";

export default function Crew() {
  const { setNotification } = useNotification();

  const handleSubmit = () => {
    setNotification("Operation was successful!");
  };

  return (
    <div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
