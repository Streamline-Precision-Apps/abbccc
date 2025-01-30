import Image from "next/image";
import React, { useState } from "react";

interface TextInputWithRevertProps {
  label: string;
  size?: "small" | "medium" | "large";
  value: string;
  onChange: (value: string) => void;
  showAsterisk?: boolean;
  defaultValue: string;
}

const sizeClasses = {
  small: "h-8 text-sm",
  medium: "h-10 text-base",
  large: "h-12 text-lg",
};

const TextInputWithRevert: React.FC<TextInputWithRevertProps> = ({
  label,
  size = "medium",
  value,
  onChange,
  showAsterisk = false,
  defaultValue,
}) => {
  const [hasChanged, setHasChanged] = useState(false);

  const handleRevert = () => {
    onChange(defaultValue);
    setHasChanged(false);
  };

  const handleChange = (newValue: string) => {
    setHasChanged(newValue !== defaultValue);
    onChange(newValue);
  };

  return (
    <div className="w-full h-full px-2">
      <div className="flex items-center gap-4">
        {/* Label */}
        <label className="w-1/2 text-xl flex items-center">
          {label}
          {showAsterisk && <span className="text-red-500 ml-1">*</span>}
        </label>

        {/* Input */}
        <div
          className={`flex items-center gap-2 w-1/2 border-[3px] rounded-[10px] border-black ${sizeClasses[size]}`}
        >
          <input
            type="text"
            className="h-full w-full border-none focus:outline-none px-2"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
          />
          {hasChanged && (
            <button
              className="w-1/6 flex justify-center items-center"
              title="Revert changes"
              onClick={handleRevert}
            >
              <Image src="/turnBack.svg" alt="revert" className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TextInputWithRevert;
