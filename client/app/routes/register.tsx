import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { toast } from "sonner";
import { Link } from "react-router";

export default function Login() {
  const [error, setError] = useState(null);
  const [instructor, setInstructor] = useState(false);
  const login = useAuth().login;

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {
      username: formData.get("username"),
      display_name: formData.get("display_name"),
      password: formData.get("password"),
      password_confirm: formData.get("password2"),
    };

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("password2") as string;

    if (password !== confirmPassword) {
      try {
        throw new Error("Passwords do not match.");
      } catch (err: any) {
        setError(err.message);
      }
      return;
    }

    try {
      /* TODO: change api domain*/
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        if (result.detail) {
          if (typeof result.detail === "object") {
            // Handle field-specific errors
            const errorMessages = Object.values(result.detail)
              .map((messages) => (messages as string[]).join("\n"))
              .join("\n");
            throw new Error(errorMessages);
          } else {
            // Handle simple string errors
            throw new Error(result.detail);
          }
        }
        // Handle invalid server responses / Server non-responses
        toast.error("Registration failed. Please try again.");
        throw new Error("Registration failed. Please try again.");
      }

      login({ ...result.data.user });

      // Redirect to the dashboard on success
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex w-screen items-center justify-center">
      <div className="bg-foreground text-secondary-foreground outline-foreground-border my-1 flex w-fit flex-col items-center rounded-3xl p-6 outline-1">
        <h1 className="text-xl font-medium">Create an account</h1>
        <form onSubmit={handleSubmit} className="my-6 flex flex-col gap-5">
          <div className="flex gap-2">
            <div>
              <label htmlFor="first_name">
                Display Name <span className="text-error">*</span>
              </label>
              <Input
                minLength={2}
                type="text"
                name="display_name"
                id="display_name"
                placeholder="ex: Jane"
                className="input"
                required
              />
            </div>
            <div>
              <label htmlFor="last_name">
                Username <span className="text-error">*</span>
              </label>
              <Input
                minLength={2}
                type="text"
                name="username"
                id="username"
                placeholder="ex: Smith"
                className="input"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="password">
              Password <span className="text-error">*</span>
            </label>
            <PasswordInput
              name="password"
              id="password"
              placeholder="Password"
              className="input"
              disabled={false}
            />
          </div>
          <div>
            <label htmlFor="password">
              Confirm Password <span className="text-error">*</span>
            </label>
            <PasswordInput
              name="password2"
              id="password2"
              placeholder="Password"
              className="input"
              disabled={false}
              required
            />
          </div>
          <div>
            <Button
              aria-label="Create Account"
              type="submit"
              className="button bg-primary text-primary-foreground outline-primary-border w-full outline-1 active:brightness-110"
              variant={"default"}
            >
              Create Account
            </Button>
          </div>
          {error && (
            <p className="text-error-border w-full text-center">{error}</p>
          )}
        </form>
        <p className="text-muted-foreground text-center">
          Already have an account? <br />
          <Link to="/login" className="text-blue-500 underline">
            Log In
          </Link>{" "}
          instead
        </p>
      </div>
    </div>
  );
}
//
