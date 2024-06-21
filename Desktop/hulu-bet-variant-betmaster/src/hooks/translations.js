//import React, { useState, useContext } from "react";
// import LocalizedStrings from "react-localization";
import localization from '@services/localization';
import { useLanguageContext } from '@contexts/LanguageContext';

export default function useTranslation() {
  const { language } = useLanguageContext();
  let translation = localization;

  translation.setLanguage(language);
  return translation;
}
