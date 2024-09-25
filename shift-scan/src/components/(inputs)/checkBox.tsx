"use client";
export interface CheckboxProps {
  disabled?: boolean;
  defaultChecked?: boolean;
  id: string;
  name: string;
  label: string;
  onChange?: (e: any) => Promise<void>
}

const Checkbox = (props: CheckboxProps) => (
  <div className="w-full flex gap-2">
    <input
      className="
      peer relative appearance-none shrink-0 w-16 h-16 border-4 border-black mt-1 bg-white shadow-[8px_8px_0px_grey] rounded-[10px]
      focus:outline-none focus:ring-offset-0 focus:ring-1 focus:ring-blue-100
      checked:bg-app-green checked:border-4 rounded-[10px]
      disabled:border-steel-400 disabled:bg-steel-400
      "
      type="checkbox"
      {...props}
    />
    <svg
      className="absolute w-16 h-16 pointer-events-none hidden peer-checked:block stroke-black mt-1 outline-none animate-wave"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      
      >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    <label htmlFor={props.id}>
      {props.label}
    </label>
  </div>
);

export default Checkbox;