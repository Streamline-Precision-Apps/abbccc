import React from 'react';
import "@/app/globals.css";
// allows us to use the search bar and the dropdown together like modern design

interface Option {
  code: string;
  label: string;
}
// CustomSelectProps holds all the option passed in from CostCodeFinder
// along with other dropdown properties
interface CustomSelectProps {
  options: Option[];
  placeholder: string;
  onOptionSelect: (option: Option) => void;
  selectedOption: Option | null;
}
// passed the variables from the CostCodeFinder here
const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  placeholder,
  onOptionSelect,
  selectedOption,
}) => {
  // the ui of the dropdown and has the toggle method here to toggle the dropdown
  // it also map out all the elements in the drop down list. 
  // provide a key with the name as option value  becuase it is unique
  // if the costcodes need to be bilingual i would need to make a josn file for them. 
  return (
    <div className="w-full max-h-[15rem] overflow-y-auto text-center p-4  ">
        <div className="">
          {options.map((option) => (
            <div
              key={option.code}
              className="text-3xl p-4 hover:bg-gray-200 cursor-pointer even:bg-gray-100"
              onClick={() => onOptionSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
    </div>
  );
};

export default CustomSelect;