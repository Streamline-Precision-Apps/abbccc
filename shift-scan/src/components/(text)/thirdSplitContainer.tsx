import React, { ReactNode } from 'react';

type Props = {
    children_left: ReactNode[];
    children_center: ReactNode[];
    children_right: ReactNode[];
    LeftTitle: string;
    CenterTitle: string;
    RightTitle: string;
    
};

export const ThirdSplitContainer = ({ children_left, children_center, children_right, LeftTitle, CenterTitle, RightTitle }: Props) => {
    const renderWithDividers = (children: ReactNode[]) => {
        return children.map((child, index) => (
            <React.Fragment key={index}>
                <button className="w-full h-[50px] bg-gray-100 hover:bg-gray-300">{child}</button>
                {index < children.length - 1 && <div className="border-t border-black"></div>}
            </React.Fragment>
        ));
    };

    return (
        <div className="h-auto w-full p-0  lg:p-10  ">
            <div className="grid grid-cols-3 gap-2 text-2xl ">
                <h2 className="text-center text-lg">{LeftTitle}</h2>
                <h2 className="text-center  text-lg">{CenterTitle}</h2>
                <h2 className="text-center text-lg">{RightTitle}</h2>
            </div>
            <div className="grid grid-cols-3 border-4 border-black">
                <div className="h-auto text-sm p-0 lg:p-5 bg-white  border-r-2 border-black">
                    {renderWithDividers(children_left)}
                </div>
                <div className="h-auto  text-sm p-0 lg:p-5 bg-white  border-black">
                    {renderWithDividers(children_center)}
                </div>
                <div className="h-auto text-sm p-0 lg:p-5 bg-white border-l-2 border-black ">
                    {renderWithDividers(children_right)}
                </div>
            </div>
        </div>
    );
};