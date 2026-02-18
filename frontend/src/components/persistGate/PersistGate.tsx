import { useIsRestoring } from "@tanstack/react-query";

import { Loader2 } from "lucide-react";

export const PersistGate = ({ children }: { children: React.ReactNode }) => {
  const isRestoring = useIsRestoring();

  // If the cache is still loading from IndexedDB, show a spinner
  if (isRestoring) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-50 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
        <p className="text-sm text-gray-500 font-medium">
          Restoring your session...
        </p>
      </div>
    );
  }

  // Once restored, render the app (Auth Guard will now see the correct data)
  return <>{children}</>;
};
