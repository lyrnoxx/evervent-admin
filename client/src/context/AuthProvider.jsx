import { useEffect, useMemo, useState } from "react";
import { loginRequest, logoutRequest, meRequest, registerRequest } from "../api/authApi";
import AuthContext from "./authContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const response = await meRequest();
        setUser(response.data.user);
      } catch {
        setUser(null);
      } finally {
        setIsBootstrapping(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (payload) => {
    const response = await loginRequest(payload);
    setUser(response.data.user);
    return response;
  };

  const register = async (payload) => {
    const response = await registerRequest(payload);
    setUser(response.data.user);
    return response;
  };

  const logout = async () => {
    await logoutRequest();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBootstrapping,
      login,
      register,
      logout,
    }),
    [user, isBootstrapping]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
