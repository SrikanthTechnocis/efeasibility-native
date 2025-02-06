import React, { ReactNode, useEffect, useState } from "react";
import { authStore } from "../store/authStore";
import { useRouter, useRootNavigationState } from "expo-router";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [authState, setAuthState] = useState<{
    user: any;
    selectedRole: any;
  } | null>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false); // Ensures redirection logic runs only after auth check
  const { getUserFromLocalStorage, getUserRoleFromLocalStorage } = authStore();
  const router = useRouter();
  const navigationState = useRootNavigationState(); // Checks if navigation is ready

  // Fetch user and role info from local storage
  useEffect(() => {
    const checkAuth = async () => {
      const selectedRole = await getUserRoleFromLocalStorage();
      const user = await getUserFromLocalStorage();
      setAuthState({ user, selectedRole });
      setIsAuthChecked(true);
    };
    checkAuth();
  }, []);

  // Redirect logic after authentication check
  useEffect(() => {
    if (isAuthChecked && navigationState?.key) {
      // Get the current route from navigation state
      const currentRoute = navigationState.routes[navigationState.index]?.name;

      if (authState?.user && authState?.selectedRole) {
        // Redirect to /dashboard if not already there
        if (currentRoute !== "dashboard") {
          router.replace("/dashboard");
        }
      } else {
        // Redirect to /login if not already there
        if (currentRoute !== "login") {
          router.replace("/login");
        }
      }
    }
  }, [authState, isAuthChecked, navigationState, router]);

  if (!isAuthChecked || !navigationState?.key) {
    return null; // Avoid rendering children until authentication is checked and navigation is ready
  }

  return <>{children}</>;
};

export default AuthGuard;
