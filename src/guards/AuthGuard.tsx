import React, { ReactNode, useEffect, useState } from "react";
import { authStore } from "../store/authStore";
import { useRouter, useRootNavigationState } from "expo-router";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false); // Ensures redirection logic runs only after auth check

  const { getUserFromLocalStorage } = authStore();
  const router = useRouter();
  const navigationState = useRootNavigationState(); // Checks if navigation is ready

  useEffect(() => {
    const checkAuth = async () => {
      const res = await getUserFromLocalStorage();
      console.log("--User from Local Storage in AuthGuard : ", res);
      setUser(res);
      setIsAuthChecked(true);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthChecked && !user && navigationState?.key) {
      router.replace("/login");
    }
  }, [user, isAuthChecked, navigationState]);

  if (!isAuthChecked || !navigationState?.key) {
    return null; // Avoid rendering children until authentication is checked and navigation is ready
  }

  return <>{children}</>;
};

export default AuthGuard;
