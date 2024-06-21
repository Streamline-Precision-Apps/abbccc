import React from 'react';
import "../../src/app/globals.css";
// allows us to use the search bar and the dropdown together like modern design

interface Option {
  value: string;
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
    <div className="custom-select-container">
      <div className="custom-select bg-green-500 ">
        {selectedOption ? selectedOption.label : placeholder}
      </div>
        <div className="custom-select-dropdown">
          {options.map((option) => (
            <div
              key={option.value}
              className="text-3xl"
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