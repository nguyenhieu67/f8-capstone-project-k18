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
import { getMe, logout as logoutService } from "@/services/auth";
import { getUserById } from "@/services/user";
import type { MeI, UserI } from "@/types/auth.types";

const AuthContext = createContext<{
  isLoading: boolean;
  me: MeI | null;
  setMe: (m: MeI | null) => void;
  user: UserI | null;
  setUser: (u: UserI) => void;
  refetchUser: () => void;
  logout: () => Promise<void>;
  handleCheckAuth: () => Promise<boolean>;
}>({
  isLoading: true,
  me: null,
  setMe: () => {},
  user: null,
  setUser: () => {},
  refetchUser: () => {},
  logout: async () => {},
  handleCheckAuth: async () => false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<MeI | null>(null);
  const [user, setUser] = useState<UserI | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const me = (await getMe()) as MeI;
      setMe(me);
      const user = await getUserById(me.id);
      setUser(user as UserI);
      return true;
    } catch {
      setMe(null);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await logoutService();
    } finally {
      setMe(null);
      setUser(null);
    }
  };

  const handleCheckAuth = async () => {
    const isValid = await fetchUser();
    return isValid;
  };

  return createElement(
    AuthContext.Provider,
    {
      value: {
        isLoading,
        me,
        setMe,
        user,
        setUser,
        logout,
        refetchUser: fetchUser,
        handleCheckAuth,
      },
    },
    children,
  );
}

export const useAuth = () => useContext(AuthContext);

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { me, isLoading } = useAuth();
  if (isLoading) return createElement(LoadingSpinner);
  if (!me)
    return createElement(Navigate, { to: ROUTE_PATHS.LOGIN, replace: true });
  return children;
}
