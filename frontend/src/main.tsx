// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { App } from "./App.tsx";
// import "./index.css";

// const rootEl = document.getElementById("root");
// if (!rootEl) throw new Error("Failed to find root element");
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 1000 * 60 * 30,
//       refetchOnWindowFocus: true,
//     },
//   },
// });

// createRoot(document.getElementById("root")!).render(
//   <StrictMode>
//     <QueryClientProvider client={queryClient}>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </QueryClientProvider>
//   </StrictMode>,
// );

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { get, set, del } from "idb-keyval";
import { App } from "./App.tsx";
import { PersistGate } from "@/components/persistGate/PersistGate.tsx";
import "./index.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Failed to find root element");

// 1. Configure the Cache Strategy
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30,
      gcTime: 1000 * 60 * 60 * 24 * 7,
      refetchOnWindowFocus: false,
    },
  },
});

// 2. Create the IndexedDB Persister
const persister = createAsyncStoragePersister({
  storage: {
    getItem: async (key) => {
      const res = await get(key);
      return res;
    },
    setItem: async (key, value) => {
      await set(key, value);
    },
    removeItem: async (key) => {
      await del(key);
    },
  },
});

createRoot(rootEl).render(
  <StrictMode>
    {/* 3. Swap to PersistQueryClientProvider */}
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      }}
      onSuccess={() => console.log("🌊 Cache hydrated from IndexedDB")}
    >
      <PersistGate>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </PersistQueryClientProvider>
  </StrictMode>,
);
