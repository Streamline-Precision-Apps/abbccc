import React from 'react';

interface Option {
  code: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  placeholder: string;
  onOptionSelect: (option: Option) => void;
  selectedOption: Option | null;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  placeholder,
  onOptionSelect,
  selectedOption,
}) => {
  return (
    <select
      value={selectedOption ? selectedOption.code : ''}
      onChange={(e) => {
        const selected = options.find(option => option.code === e.target.value);
        if (selected) {
          onOptionSelect(selected);
        }
      }}
      className="block mx-auto mb-4 p-2 border border-gray-300 rounded"
    >
      <option value="">{placeholder}</option>
      {options.map(option => (
        <option key={option.code} value={option.code}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default CustomSelect;
