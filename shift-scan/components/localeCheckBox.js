import React from "react";
import { useLocale } from "../components/localeContext";
import Cookies from "js-cookie";

const LocaleCheckBox = () => {
    const { locale, changeLocale } = useLocale();

    const handleChange = (event) => {
        const newLocale = event.target.checked ? "es" : "en";
        console.log(newLocale);
        changeLocale(newLocale); // updates the locale
        window.location.reload();
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