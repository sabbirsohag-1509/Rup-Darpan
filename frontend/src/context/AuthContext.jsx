import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // login 
  const login = async (email, password) => {
    const response = await axios.post(
      "http://localhost:5000/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      },
    );

    setUser(response.data.user);

    return response.data.user;
  };
  // logout
  const logout = async () => {
  await axios.post(
    "http://localhost:5000/logout",
    {},
    {
      withCredentials: true,
    },
  );

  setUser(null);
};

  useEffect(() => {
    axios
      .get("http://localhost:5000/me", {
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const authInfo = {
    user,
    setUser,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
