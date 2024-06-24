import React, { createContext, useContext, useState, ReactNode } from "react";

// setting the type of the context to a boolean
interface ToggleContextHoursProps {
    toogle: boolean;
    setToggle: (toggle: boolean) => void;
}
// creating the context and setting possible definitions
const ToggleContextHours = createContext<ToggleContextHoursProps | undefined>(undefined);

// creating the provider to wap around the children
export const ToggleContextHoursProvider = ({ children }: { children: ReactNode }) => {

    const [toggle, setToggle] = useState(false);
    return (
        <ToggleContextHours.Provider value={{ toogle: toggle, setToggle }}>
            {children}
        </ToggleContextHours.Provider>
    );
};
export const useToggleContextHours = () => {

    const context = useContext(ToggleContextHours);

    if (!context) {
        throw new Error("useToggleContextHours must be used within a ToggleContextHoursProvider");
    }

    return context;
}