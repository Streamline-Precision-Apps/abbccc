import React, { ReactNode } from 'react';

type Props = {
    children_left: ReactNode[];
    children_right: ReactNode[];
    LeftTitle: string;
    RightTitle: string;
    edit?: boolean;
    editHandler?: () => void;
};

export const HalfSplitContainer = ({ children_left, children_right, LeftTitle, RightTitle, edit=false }: Props) => {
    const renderWithDividers = (children: ReactNode[]) => {
        return children.map((child, index) => (
            <React.Fragment key={index}>
                {edit ? (
                    <input
                        type="text"
                        defaultValue={child as string}
                        className="border p-1 mr-2"
                    />
                ) : (
                    <span>{child}</span>
                )}
                {index < children.length - 1 && <div className="border-t border-black"></div>}
            </React.Fragment>
        ));
    };

    return (
            <div className="h-auto w-full p-0 lg:p-10">
                <div className="grid grid-cols-2 gap-4 text-lg lg:text-3xl">
                    <h2 className="text-center">{LeftTitle}</h2>
                    <h2 className="text-center">{RightTitle}</h2>
                </div>
                <div className="grid grid-cols-2 border-4 border-black rounded-lg">
                    <div className="h-auto py-2 lg:p-5 text-lg bg-white border-black border-r-2">
                        {renderWithDividers(children_left)}
                    </div>
                    <div className="h-auto py-2 lg:p-5 text-lg bg-white border-black border-l-2">
                        {renderWithDividers(children_right)}
                    </div>
                </div>
            </div>
        );
    };