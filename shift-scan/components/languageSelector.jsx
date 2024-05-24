import i18n from "@/i18n";
import React from "react";

const languages = [{code : "en", lang: "english"},
{code : "es", lang: "spanish"},
];

const changeLanguage = (lng) => {
  i18n.changeLanguage(lng);
};

const LanguageSelector = () => {
  const {i18n} = useTranslations();
  return( 
  <div className="language-selector">
    {languages.map((lng) => {
      return ( 
      <button className={lng.code === i18n.language ? "Selected" : ""} 
      key={lng.code} onClick={()=> changeLanguage(lng.code)}>
      {lng.lang}
      </button>
      );
    })}
  </div>
)};
export default LanguageSelector;