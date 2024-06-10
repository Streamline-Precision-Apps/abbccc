'use client';
import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  placeholder: string;
  onOptionSelect: (option: Option) => void;
  isDropdownOpen: boolean;
  toggleDropdown: () => void;
  selectedOption: Option | null;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  placeholder,
  onOptionSelect,
  isDropdownOpen,
  toggleDropdown,
  selectedOption,
}) => {
  return (
    <div className="custom-select-container">
      <div className="custom-select" onClick={toggleDropdown}>
        {selectedOption ? selectedOption.label : placeholder}
      </div>
      {isDropdownOpen && (
        <div className="custom-select-dropdown">
          {options.map((option) => (
            <div
              key={option.value}
              className="custom-select-option"
              onClick={() => onOptionSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
      <style jsx>{`
        .custom-select-container {
          position: relative;
          width: 200px;
        }
        .custom-select {
          padding: 8px;
          border: 1px solid #ccc;
          cursor: pointer;
        }
        .custom-select-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          border: 1px solid #ccc;
          background: white;
          z-index: 10;
        }
        .custom-select-option {
          padding: 8px;
          cursor: pointer;
        }
        .custom-select-option:hover {
          background: #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default CustomSelect;