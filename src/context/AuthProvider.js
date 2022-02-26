import React, { createContext, useState } from "react";
import propTypes from "prop-types";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({});

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: propTypes.node,
};

export default AuthContext;
