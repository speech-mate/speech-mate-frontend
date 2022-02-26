import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

function useAuth() {
  console.log(useContext(AuthContext));
  return useContext(AuthContext);
}

export default useAuth;
