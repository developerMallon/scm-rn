import React, { useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStorageState } from "./useStorageState";

type User = {
  id: number;
  first_name: string;
  last_name: string;
  id_level: number;
  access_token: string;
};

const AuthContext = React.createContext<{
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  session?: User | null;
  isLoading: boolean;
}>({
  signIn: async () => {},
  signOut: () => {},
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState<User | null>("session");

  useEffect(() => {
    // Load the token from storage if it exists
    const loadSession = async () => {
      const sessionStr = await AsyncStorage.getItem('session');
      if (sessionStr) {
        const user = JSON.parse(sessionStr) as User;
        setSession(user);
      } else {
        setSession(null);
      }
    };
    loadSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: async (email, password) => {
          try {
            // Chamada ao login da API
            const response = await fetch("https://scm-api.mallon.click/user/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
              throw new Error("Falha no login");
            }
                       
            const userData = await response.json() as User;

            await AsyncStorage.setItem('session', JSON.stringify(userData));
            setSession(userData);
          } catch (error) {
            console.error("Falha no login:", error);
            throw error;
          }
        },
        signOut: async () => {
          await AsyncStorage.removeItem('session');
          setSession(null);
        },
        session,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
