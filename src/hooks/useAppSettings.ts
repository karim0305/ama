import { useCallback, useEffect, useState } from "react";
import { getSetting, setSetting } from "../services/Storage/LocalStorage";
import { setSpeechEnabled } from "../services/TTS/TTSService";

export interface AppSettings {
  voiceResponseEnabled: boolean;
  confirmCalls: boolean;
  historyEnabled: boolean;
}

const DEFAULTS: AppSettings = {
  voiceResponseEnabled: true,
  confirmCalls: true,
  historyEnabled: true,
};

export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const voice = await getSetting("voice_response_enabled");
      const confirm = await getSetting("confirm_calls");
      const history = await getSetting("history_enabled");

      const loadedSettings: AppSettings = {
        voiceResponseEnabled:
          voice !== null ? voice === "1" : DEFAULTS.voiceResponseEnabled,
        confirmCalls:
          confirm !== null ? confirm === "1" : DEFAULTS.confirmCalls,
        historyEnabled:
          history !== null ? history === "1" : DEFAULTS.historyEnabled,
      };
      setSettings(loadedSettings);
      setSpeechEnabled(loadedSettings.voiceResponseEnabled);
      setLoaded(true);
    })();
  }, []);

  const updateSetting = useCallback(
    async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
      await setSetting(
        key === "voiceResponseEnabled"
          ? "voice_response_enabled"
          : key === "confirmCalls"
            ? "confirm_calls"
            : "history_enabled",
        value ? "1" : "0",
      );
      if (key === "voiceResponseEnabled") setSpeechEnabled(value as boolean);
    },
    [],
  );

  return { settings, updateSetting, loaded };
}
