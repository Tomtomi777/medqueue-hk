
import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export default function ConnectionStatus() {
  const [online, setOnline] = useState(
    () => navigator.onLine
  );

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener(
      "online",
      handleOnline
    );

    window.addEventListener(
      "offline",
      handleOffline
    );

    return () => {
      window.removeEventListener(
        "online",
        handleOnline
      );

      window.removeEventListener(
        "offline",
        handleOffline
      );
    };
  }, []);

  if (online) {
    return null;
  }

  return (
    <div
      className="offline-banner"
      role="status"
    >
      <WifiOff size={19} />

      <div>
        <strong>You are offline</strong>

        <p>
          Waiting time information may be outdated.
          Reconnect to retrieve updated statistics.
        </p>
      </div>
    </div>
  );
}
