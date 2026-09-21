import { useCallback, useEffect, useState } from "react";
import { getSetting, setSetting } from "../services/Storage/LocalStorage";
import { Language } from "../types/commands";

const SETTING_KEY = "preferred_language";

export function useLanguagePreference() {
  const [language, setLanguageState] = useState<Language>("auto");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getSetting(SETTING_KEY).then((value) => {
      if (value) setLanguageState(value as Language);
      setLoaded(true);
    });
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    await setSetting(SETTING_KEY, lang);
  }, []);

  return { language, setLanguage, loaded };
}
