import React, { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import classNames from "classnames";

const changeLocale = (newLocale) => {
    Cookies.set('', newLocale, { expires: 365 });
    window.location.reload();
};
// const LocaleToggleSwitch = () => {
//     const t = useTranslations('PortalLogin');
//     const [locale, setLocale] = useState("en");

//     useEffect(() => {
//         const currentLocale = Cookies.get('locale') || "en";
//         setLocale(currentLocale);
//     }, []);

// const handleChange = (event) => {
//     const newLocale = event.target.checked ? "es" : "en";
//     console.log(newLocale);
//     setLocale(newLocale); // updates the local state
//     changeLocale(newLocale); // updates the cookie and reloads the page
// };



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