import { create } from "zustand";
import { loginSchema } from "@/lib/zod/loginSchema";

type LoginFields = {
  email: string;
  password: string;
};

type LoginStore = LoginFields & {
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  show: boolean;

  setField: (field: keyof LoginFields, value: string) => void;
  toggleShow: () => void;
  validate: () => boolean;
  reset: () => void;
};

export const useLoginStore = create<LoginStore>((set, get) => ({
  email: "",
  password: "",

  errors: {},
  touched: {},
  show: false,

  setField: (field, value) => {
    set((state) => ({
      ...state,
      [field]: value,
      touched: { ...state.touched, [field]: true },
    }));

    const { email, password } = get();

    const result = loginSchema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      const formatted: Record<string, string> = {};

      Object.entries(fieldErrors).forEach(([key, value]) => {
        if (value?.length) {
          formatted[key] = value[0];
        }
      });

      set({ errors: formatted });
    } else {
      set({ errors: {} });
    }
  },

  toggleShow: () =>
    set((state) => ({
      show: !state.show,
    })),

  validate: () => {
    const { email, password } = get();

    const result = loginSchema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      const formatted: Record<string, string> = {};

      Object.entries(fieldErrors).forEach(([key, value]) => {
        if (value?.length) {
          formatted[key] = value[0];
        }
      });

      set({ errors: formatted });
      return false;
    }

    set({ errors: {} });
    return true;
  },

  reset: () =>
    set({
      email: "",
      password: "",
      errors: {},
      touched: {},
      show: false,
    }),
}));
