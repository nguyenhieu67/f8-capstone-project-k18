import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  createElement,
} from "react";
import { Navigate } from "react-router-dom";

import { LoadingSpinner } from "@/components/ui";
import { ROUTE_PATHS } from "@/constants/routePaths";
import { getMe } from "@/services/auth";

type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
};

const AuthContext = createContext<{
  user: User | null;
  isLoading: boolean;
  setUser: (u: User | null) => void;
}>({ user: null, isLoading: true, setUser: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const user = await getMe();
      setUser(user as User);
      setIsLoading(false);
    };

    getUser();
  }, []);

  return createElement(
    AuthContext.Provider,
    {
      value: { user, isLoading, setUser },
    },
    children,
  );
}

export const useAuth = () => useContext(AuthContext);

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return createElement(LoadingSpinner);
  if (!user)
    return createElement(Navigate, { to: ROUTE_PATHS.LOGIN, replace: true });
  return children;
}
