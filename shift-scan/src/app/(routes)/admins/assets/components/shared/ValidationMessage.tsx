import React from "react";

interface ValidationMessageProps {
  message?: string;
  className?: string;
}

/**
 * Always renders a div to reserve space for validation messages.
 * If no message, renders an invisible placeholder to keep spacing consistent.
 */
const ValidationMessage: React.FC<ValidationMessageProps> = ({
  message,
  className,
}) => (
  <div
    className={`text-xs min-h-[10px] mt-1 mb-2 ${
      message ? "text-red-500" : "invisible"
    } ${className || ""}`.trim()}
    aria-live="polite"
  >
    {message || "\u00A0"}
  </div>
);

export default ValidationMessage;
