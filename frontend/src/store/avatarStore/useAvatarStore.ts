import { create } from "zustand";

interface AvatarStore {
  file: File | null;
  previewUrl: string | null;

  // Setters
  setFile: (file: File | null) => void;
  setPreviewUrl: (url: string | null) => void;

  // Actions
  handleFileSelect: (file: File) => void;
  clearFile: () => void;
}

export const useAvatarStore = create<AvatarStore>((set, get) => ({
  file: null,
  previewUrl: null,

  setFile: (file) => set({ file }),
  setPreviewUrl: (previewUrl) => set({ previewUrl }),

  // Helper action to do both at once safely
  handleFileSelect: (file) => {
    // 1. Clean up the old URL to prevent memory leaks
    const currentUrl = get().previewUrl;
    if (currentUrl && currentUrl.startsWith("blob:")) {
      URL.revokeObjectURL(currentUrl);
    }

    // 2. Create the new preview URL and save the file
    const objectUrl = URL.createObjectURL(file);
    console.log(objectUrl);
    set({ file, previewUrl: objectUrl });
  },

  clearFile: () => {
    const currentUrl = get().previewUrl;
    if (currentUrl && currentUrl.startsWith("blob:")) {
      URL.revokeObjectURL(currentUrl);
    }
    set({ file: null, previewUrl: null });
  },
}));
