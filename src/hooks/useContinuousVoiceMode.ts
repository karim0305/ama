import { useCallback, useEffect, useRef, useState } from "react";
import AndroidLauncher, {
    overlayEmitter,
} from "../../modules/android-launcher";
import {
    hasOverlayPermission,
    requestOverlayPermission,
} from "../services/Android/OverlayPermission";
import {
    localeForLanguage,
    requestMicPermission,
    startListening,
    stopListening,
} from "../services/Speech/SpeechService";

export function useContinuousVoiceMode(onCommand: (text: string) => void) {
  const [active, setActive] = useState(false);
  const activeRef = useRef(false);

  const stop = useCallback(() => {
    activeRef.current = false;
    setActive(false);
    stopListening();
    AndroidLauncher.stopVoiceOverlay();
  }, []);

  const start = useCallback(async () => {
    const micGranted = await requestMicPermission();
    if (!micGranted) return false;

    if (!hasOverlayPermission()) {
      requestOverlayPermission();
      return false; // user must grant, then tap the mic again
    }

    activeRef.current = true;
    setActive(true);
    AndroidLauncher.startVoiceOverlay();
    startListening(localeForLanguage("auto"));
    return true;
  }, []);

  // Called by the speech 'end' event — restarts listening if still active
  const handleRecognitionEnd = useCallback(() => {
    if (activeRef.current) {
      startListening(localeForLanguage("auto"));
    }
  }, []);

  useEffect(() => {
    const sub = overlayEmitter.addListener("onOverlayStopPressed", () => {
      stop();
    });
    return () => sub.remove();
  }, [stop]);

  return { active, start, stop, handleRecognitionEnd };
}
