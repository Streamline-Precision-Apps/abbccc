import { ReactNode } from 'react';

interface SwitchWithLabelProps {
    children: ReactNode;
}

export default function SwitchWithLabel({ children}: SwitchWithLabelProps) {
    return (
        <div className="flex m-6 mb-3 justify-center gap-3">
            {children}
        </div>
    );
}

