import { Options } from '@/components/(reusable)/options';
import { Selects } from '@/components/(reusable)/selects';
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
    <Selects
      value={selectedOption ? selectedOption.code : ''}
      onChange={(e) => {
        const selected = options.find(option => option.code === e.target.value);
        if (selected) {
          onOptionSelect(selected);
        }
      }}
      className="block mx-auto mb-4 p-2 border border-gray-300 rounded"
    >
       <Options variant={"default"} value="">{placeholder} </Options>
      {options.map(option => (
         <Options variant={"default"} key={option.code} value={option.code}>
          {option.label}
         </Options>
      ))}
    </Selects>
  );
};

export default CustomSelect;
