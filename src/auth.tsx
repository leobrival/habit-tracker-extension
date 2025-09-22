import { Action, ActionPanel, Form, showToast, Toast, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import { authService } from "./auth-service";
import { handleLogout } from "./logout-action";
import { ApiError } from "./types";

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type AuthView = "login" | "signup";

export default function Auth() {
  const [currentView, setCurrentView] = useState<AuthView>("login");
  const [isLoading, setIsLoading] = useState(false);
  const { pop } = useNavigation();

  useEffect(() => {
    authService.initialize();
  }, []);

  const handleLogin = async (formData: LoginFormData) => {
    if (!formData.email || !formData.password) {
      showToast(Toast.Style.Failure, "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await authService.login({
        email: formData.email,
        password: formData.password,
      });

      showToast(Toast.Style.Success, "Login successful!");
      pop();
    } catch (error) {
      if (error instanceof ApiError) {
        showToast(Toast.Style.Failure, "Login failed", error.message);
      } else {
        showToast(Toast.Style.Failure, "Login failed", "An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (formData: RegisterFormData) => {
    if (!formData.fullName || !formData.email || !formData.password) {
      showToast(Toast.Style.Failure, "Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast(Toast.Style.Failure, "Passwords don't match");
      return;
    }

    if (formData.password.length < 6) {
      showToast(Toast.Style.Failure, "Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      showToast(Toast.Style.Success, "Registration successful!");
      pop();
    } catch (error) {
      if (error instanceof ApiError) {
        showToast(Toast.Style.Failure, "Registration failed", error.message);
      } else {
        showToast(Toast.Style.Failure, "Registration failed", "An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (currentView === "signup") {
    return (
      <SignUpView isLoading={isLoading} onSubmit={handleRegister} onSwitchToLogin={() => setCurrentView("login")} />
    );
  }

  return <LoginView isLoading={isLoading} onSubmit={handleLogin} onSwitchToSignUp={() => setCurrentView("signup")} />;
}

// Login View Component
interface LoginViewProps {
  isLoading: boolean;
  onSubmit: (formData: LoginFormData) => Promise<void>;
  onSwitchToSignUp: () => void;
}

function LoginView({ isLoading, onSubmit, onSwitchToSignUp }: LoginViewProps) {
  return (
    <Form
      isLoading={isLoading}
      navigationTitle="Login to Habit Tracker"
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Login" onSubmit={onSubmit} />
          <Action title="Switch to Sign up" onAction={onSwitchToSignUp} shortcut={{ modifiers: ["cmd"], key: "n" }} />
          <ActionPanel.Section title="Account">
            <Action
              title="Logout"
              onAction={handleLogout}
              icon="🚪"
              style={Action.Style.Destructive}
              shortcut={{ modifiers: ["cmd"], key: "q" }}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    >
      <Form.Description text="Welcome back! Please login to your account." />
      <Form.Separator />

      <Form.TextField
        id="email"
        title="Email"
        placeholder="Enter your email address"
        info="The email address associated with your account"
      />
      <Form.PasswordField id="password" title="Password" placeholder="Enter your password" />
    </Form>
  );
}

// Sign Up View Component
interface SignUpViewProps {
  isLoading: boolean;
  onSubmit: (formData: RegisterFormData) => Promise<void>;
  onSwitchToLogin: () => void;
}

function SignUpView({ isLoading, onSubmit, onSwitchToLogin }: SignUpViewProps) {
  return (
    <Form
      isLoading={isLoading}
      navigationTitle="Sign Up for Habit Tracker"
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Account" onSubmit={onSubmit} />
          <Action title="Switch to Login" onAction={onSwitchToLogin} shortcut={{ modifiers: ["cmd"], key: "l" }} />
          <ActionPanel.Section title="Account">
            <Action
              title="Logout"
              onAction={handleLogout}
              icon="🚪"
              style={Action.Style.Destructive}
              shortcut={{ modifiers: ["cmd"], key: "q" }}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    >
      <Form.Description text="Create your new Habit Tracker account to start tracking your progress!" />
      <Form.Separator />

      <Form.TextField
        id="fullName"
        title="Full Name"
        placeholder="Enter your full name"
        info="This will be displayed in your profile"
      />
      <Form.TextField
        id="email"
        title="Email"
        placeholder="Enter your email address"
        info="We'll use this to send you important updates"
      />
      <Form.PasswordField
        id="password"
        title="Password"
        placeholder="Choose a strong password (min 6 characters)"
        info="Must be at least 6 characters long"
      />
      <Form.PasswordField id="confirmPassword" title="Confirm Password" placeholder="Confirm your password" />
    </Form>
  );
}
