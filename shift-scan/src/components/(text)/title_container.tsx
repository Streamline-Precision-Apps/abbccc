import { ReactNode } from 'react';

type Props = {
    children: ReactNode;
    TitleofContainer: string;
};

export const TitleContainer = ({ children, TitleofContainer }: Props) => {
    return (
        <div className="h-auto w-full p-0  m-auto lg:p-2">
            <h1 className="text-left border-b-2 border-black pl-2 py-2 text-xl md:text-2xl lg:text-3xl mb-2">{TitleofContainer}</h1>
            <div className="h-auto border-4 border-black rounded-2xl p-2 text-center bg-white md:w-2/3 md:mx-auto lg:w-2/3 lg:mx-auto">
                {children}
            </div>
        </div>
    );
};