import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const changeLocale = (newLocale) => {
    Cookies.set('locale', newLocale, { expires: 365 });
    window.location.reload();
};

const LocaleCheckBox = () => {
    const [locale, setLocale] = useState("en");

    useEffect(() => {
        const currentLocale = Cookies.get('locale') || "en";
        setLocale(currentLocale);
    }, []);

    const handleChange = (event) => {
        const newLocale = event.target.checked ? "es" : "en";
        console.log(newLocale);
        setLocale(newLocale); // updates the local state
        changeLocale(newLocale); // updates the cookie and reloads the page
    };

    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    onChange={handleChange}
                    checked={locale === "es"}
                />
                Español
            </label>
        </div>
    );
};

export default LocaleCheckBox;