// "use client";

// import { ChangeEvent } from "react";

// export interface CheckboxProps {
//   disabled?: boolean;
//   defaultChecked?: boolean;
//   id: string;
//   name: string;
//   label?: string;
//   size?: number;
//   onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
// }

// export const CheckBox = ({
//   disabled,
//   defaultChecked,
//   id,
//   name,
//   label,
//   size = 4,
//   onChange,
// }: CheckboxProps) => (
//   <div className="w-full flex justify-end">
//     <input
//       className={`
//       peer relative appearance-none shrink-0 border-[3px] border-black mt-1 shadow-[8px_8px_0px_grey]
//       focus:outline-none focus:ring-offset-0 focus:ring-1
//       checked:bg-app-green checked:border-[3px] rounded-[10px]
//       disabled:border-steel-400 disabled:bg-steel-400
//       `}
//       type="checkbox"
//       id={id}
//       name={name}
//       defaultChecked={defaultChecked}
//       checked={defaultChecked}
//       disabled={disabled}
//       onChange={onChange}
//       style={{ width: `${size}em`, height: `${size}em` }} // Dynamically setting size with inline styles
//     />
//     <svg
//       className="absolute pointer-events-none hidden peer-checked:block stroke-black mt-1 outline-none animate-wave"
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="4"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//       style={{ width: `${size}em`, height: `${size}em` }} // Dynamically setting size for SVG
//     >
//       <polyline points="20 6 9 17 4 12"></polyline>
//     </svg>
//     {label && <label htmlFor={id}>{label}</label>}
//   </div>
// );

"use client";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
// import { cn } from "@/components/(reusable)/utils";
import { ChangeEvent } from "react";
// import { Holds } from "../(reusable)/holds";

const CheckboxVariants = cva(
  "", //this applies to all variants
{
  variants: {
    background: {
      default: "bg-none checked:bg-app-green peer appearance-none shrink-0 border-[3px] border-black mt-1 rounded-[10px]",
      red: "bg-app-red checked:bg-app-green",
      },
    position: {//only position attributes
      center: "self-center",
      left: "self-start",
      right: "self-end",
    },
    size: {
      "5": "w-5 h-5",
      "6": "w-6 h-6",
      "8": "w-8 h-8",
      "10": "w-10 h-10",
      "12": "w-12 h-12",
      "16": "w-16 h-16",
      "20": "w-20 h-20",
    }
  },
  defaultVariants: {
    background: "default",
    position: "center",
    size: "10",
  },
}
)

// this extends the capability of HTMLAttributes or the VariantProps that it can hold, specify your props here
export interface CheckboxProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof CheckboxVariants> {
  disabled?: boolean;
  defaultChecked?: boolean;
  checked?: boolean;
  id: string;
  name: string;
  label?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

// className, background, position, size, disabled, defaultChecked, id, name, label, onChange, ...props
const Checkbox: FC<CheckboxProps> = ({}) => {
  
  return (
    null
  )
}

export {Checkbox, CheckboxVariants}


{/* <input 
    className={cn(CheckboxVariants({background, position, size, className }))} {...props}
      type={"checkbox"}
      id={id}
      name={name}
      defaultChecked={defaultChecked}
      checked={checked}
      disabled={disabled}
      onChange={onChange}
    />
    <svg
      className= "absolute pointer-events-none hidden peer-checked:block outline-none animate-wave"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="1 1 65 65"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ width: `${size}em`, height: `${size}em`}} // Dynamically setting size for SVG
    >
      <polyline points="21 3 11 19 6 14"></polyline>
    </svg>
    {label && <label htmlFor={id}>{label}</label>} 
    
    ----------------------------------------------------------------
    
    <Holds className="w-full h-full">
      {label && <label htmlFor={id} className="flex items-center cursor-pointer relative">{label}
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={defaultChecked}
          disabled={disabled}
          onChange={onChange}
          className={cn(CheckboxVariants({background, position, size, className, ...props}))}
        />
        <span className="absolute opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
            viewBox="2 2 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="21 3 11 19 6 14"></polyline>
          </svg>
        </span>

        </label>}
    </Holds>*/}

