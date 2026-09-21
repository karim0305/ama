import { useCallback, useState } from "react";
import { AssistantState } from "../types/commands";

export function useAssistantState() {
  const [state, setState] = useState<AssistantState>("IDLE");
  const [statusText, setStatusText] = useState("");

  const reset = useCallback(() => {
    setState("IDLE");
    setStatusText("");
  }, []);

  return { state, setState, statusText, setStatusText, reset };
}
