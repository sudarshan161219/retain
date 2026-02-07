import { create } from "zustand";
import { signupSchema } from "@/lib/zod/signupSchema";

type SignupFields = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SignupStore = SignupFields & {
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  show: boolean;

  setField: (field: keyof SignupFields, value: string) => void;
  toggleShow: () => void;
  validate: () => boolean;
  reset: () => void;
};

export const useSignupStore = create<SignupStore>((set, get) => ({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  errors: {},
  touched: {},
  show: false,

  setField: (field, value) => {
    set((state) => ({
      ...state,
      [field]: value,
      touched: { ...state.touched, [field]: true },
    }));

    const { name, email, password, confirmPassword } = get();

    const result = signupSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
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
    const { name, email, password, confirmPassword } = get();

    const result = signupSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
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
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      errors: {},
      touched: {},
      show: false,
    }),
}));
