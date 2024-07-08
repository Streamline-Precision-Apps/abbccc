import React, { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import classNames from "classnames";


const LocaleToggleSwitch = () => {
    const [isSelected, setIsSelected] = useState(false);

    return (
            <div
                onClick={() => setIsSelected(!isSelected)}
                className="flex w-20 h-10 bg-blue-900  border-black border-2 jusify-center items-center rounded-xl">

                    <span
                        className={classNames(" w-9 h-9 rounded-xl  border-black border-2 transition-all duration-500", {
                            "ml-10": isSelected,
                            "bg-green-500": isSelected,
                            "bg-red-500": !isSelected 
                        })}
                    />
            </div>
    );
};

export default LocaleToggleSwitch;