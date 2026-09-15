import { WifiOff } from "lucide-react";

export const metadata = { title: "Offline" };

export default function OfflinePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
      <WifiOff className="text-muted-foreground size-12" />
      <h1 className="text-2xl font-semibold">You&apos;re offline</h1>
      <p className="text-muted-foreground max-w-md text-balance">
        This page isn&apos;t cached yet. Reconnect to the internet and try again.
      </p>
    </main>
  );
}
