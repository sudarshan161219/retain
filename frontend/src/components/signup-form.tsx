import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { EyeOffIcon } from "lucide-react";
import { validatePassword } from "@/lib/validator/ValidatePassword";
import { Rule } from "@/components/Rule/Rule";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore/useAuthStore";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import { useSignupStore } from "@/store/authStore/useSignupStore";
import { useRegister } from "@/hooks/user/useRegister";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const {
    name,
    email,
    password,
    confirmPassword,
    errors,
    touched,
    show,
    setField,
    toggleShow,
    validate,
  } = useSignupStore();
  const { mutate: registerUser, isPending } = useRegister();
  const { toggleAuthMode } = useAuthStore();

  const handleShowHide = () => {
    toggleShow();
  };

  const rules = useMemo(() => {
    return validatePassword(password);
  }, [password]);

  const isValid = Object.values(rules).every(Boolean);

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  const handleGoogleLogin = () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";

    //Configuration Options
    const options = {
      redirect_uri: "http://localhost:5173/auth/google/callback",
      client_id:
        "674923430308-72mo7a6qvefsud1p9npro0juvsokioa8.apps.googleusercontent.com",
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    };

    const qs = new URLSearchParams(options).toString();

    window.location.href = `${rootUrl}?${qs}`;
  };

  const handleGithubLogin = () => {
    const CLIENT_ID = "Ov23liwpeZdHplnGpOCQ";
    const REDIRECT_URI = "http://localhost:5173/auth/github/callback";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user:email`;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    registerUser({
      name,
      email,
      password,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>
        <Field>
          <FieldLabel className="text-(--label) text-xs" htmlFor="name">
            Full Name
          </FieldLabel>
          <Input
            name="name"
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setField("name", e.target.value)}
            required
          />
          {touched.name && errors.name && (
            <p className="text-red-500 text-xs">{errors.name}</p>
          )}
        </Field>
        <Field>
          <FieldLabel className="text-(--label) text-xs" htmlFor="email">
            Email
          </FieldLabel>
          <Input
            name="email"
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setField("email", e.target.value)}
            required
          />
          {touched.email && errors.email && (
            <p className="text-red-500 text-xs">{errors.email}</p>
          )}
        </Field>
        <Field>
          <FieldLabel className="text-(--label) text-xs" htmlFor="password">
            Password
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              name="password"
              id="password"
              type={show ? "text" : "password"}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setField("password", e.target.value)}
            />

            <InputGroupAddon
              className="cursor-pointer"
              onClick={handleShowHide}
              align="inline-end"
            >
              <EyeOffIcon />
            </InputGroupAddon>
          </InputGroup>

          <ul>
            <Rule valid={rules.minLength}>8+ characters</Rule>
            <Rule valid={rules.hasUppercase}>1 uppercase</Rule>
            <Rule valid={rules.hasLowercase}>1 lowercase</Rule>
            <Rule valid={rules.hasNumber}>1 number</Rule>
            <Rule valid={rules.hasSpecial}>1 special character</Rule>
          </ul>
        </Field>
        <Field>
          <FieldLabel
            className="text-(--label) text-xs"
            htmlFor="confirm-password"
          >
            Confirm Password
          </FieldLabel>
          <InputGroup>
            <InputGroupInput
              name="confirmPassword"
              id="confirm-password"
              type={show ? "text" : "password"}
              placeholder="Enter password"
              value={confirmPassword}
              onChange={(e) => setField("confirmPassword", e.target.value)}
            />

            <InputGroupAddon
              className="cursor-pointer"
              onClick={handleShowHide}
              align="inline-end"
            >
              <EyeOffIcon />
            </InputGroupAddon>
          </InputGroup>

          {confirmPassword && (
            <div
              className={`${passwordsMatch ? "text-green-500" : "text-red-500"}`}
              style={{
                fontSize: "0.78rem",
              }}
            >
              {passwordsMatch
                ? "✔ Passwords match"
                : "✖ Passwords do not match"}
            </div>
          )}
        </Field>
        <Field>
          <Button
            disabled={!isValid || !passwordsMatch || isPending}
            className="cursor-pointer"
            type="submit"
          >
            {isPending ? "Please Wait..." : "Create Account"}
          </Button>
        </Field>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <Button
            onClick={handleGoogleLogin}
            className="cursor-pointer"
            variant="outline"
            type="button"
            disabled={isPending}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Continue with Google
          </Button>
          <Button
            onClick={handleGithubLogin}
            className="cursor-pointer"
            disabled={isPending}
            variant="outline"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Continue with GitHub
          </Button>
          <FieldDescription className="px-6 text-center">
            Already have an account?
            <Button
              className="cursor-pointer"
              onClick={toggleAuthMode}
              variant="link"
              disabled={isPending}
            >
              Sign in
            </Button>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
