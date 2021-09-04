import { createContext, FC, useEffect, useState } from "react";
import { useHistory } from "react-router";
import useSWR from "swr";

export const AuthContext = createContext<
  | {
      loggedIn: boolean;
      user?: any;
      logout: Function;
      login: Function;
    }
  | undefined
>(undefined);

const AuthProvider: FC = ({ children }) => {
  const { data, revalidate } = useSWR("http://localhost:4000/api/me");

  const auth = useState({
    loggedIn: false,
    user: null,
  });

  useEffect(() => {
    auth[1]({
      user: data?.data,
      loggedIn: !!data?.data,
    });
  }, [data]);

  return (
    <AuthContext.Provider
      value={{
        ...auth[0],
        logout: () => {
          localStorage.removeItem("jid");
          auth[1]({
            loggedIn: false,
            user: null,
          });
        },
        login: async (token: string) => {
          localStorage.setItem("jid", token);
          await revalidate();
          auth[1]({
            loggedIn: true,
            user: data.data,
          });
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
