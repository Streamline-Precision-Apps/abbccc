"use client";

import { useState } from "react";

export default function useLeftSideTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return {
    isOpen,
    toggleSidebar,
  };
}
