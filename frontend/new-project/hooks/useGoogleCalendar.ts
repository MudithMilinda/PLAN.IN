import { useCallback, useState } from "react";
import {
  disconnectGoogle,
  getGoogleConnectUrl,
  getGoogleStatus,
} from "@/services/calendarApi";
import { SyncMessage } from "@/types/calendar";

export function useGoogleCalendar(userId?: string | null) {
  const [googleConnected, setGoogleConnected] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const checkGoogleStatus = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await getGoogleStatus(userId);
      setGoogleConnected(data.connected);
    } catch {
      // no-op
    }
  }, [userId]);

  const handleGoogleConnect = () => {
    if (!userId) return;
    setGoogleLoading(true);
    window.location.href = getGoogleConnectUrl(userId);
  };

  const handleGoogleDisconnect = async (
    setSyncMessage: (message: SyncMessage | null) => void,
  ) => {
    if (!userId) return;
    try {
      await disconnectGoogle(userId);
      setGoogleConnected(false);
      setSyncMessage({
        type: "success",
        text: "Google Calendar disconnected.",
      });
      setTimeout(() => setSyncMessage(null), 3000);
    } catch {
      setSyncMessage({ type: "error", text: "Failed to disconnect." });
    }
  };

  return {
    googleConnected,
    setGoogleConnected,
    googleLoading,
    checkGoogleStatus,
    handleGoogleConnect,
    handleGoogleDisconnect,
  };
}
