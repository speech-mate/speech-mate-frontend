import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import useRefreshToken from "../hooks/useRefreshToken";

function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const logout = useLogout();
  const { auth } = useAuth();

  useEffect(() => {
    async function verifyRefreshToken() {
      try {
        await refresh();
      } catch (error) {
        if (error.response?.status === 401) {
          logout();
        }
      } finally {
        setIsLoading(false);
      }
    }

    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  return isLoading ? <p>Loading...</p> : <Outlet />;
}

export default PersistLogin;
