import { Redirect, router } from "expo-router";
import { createContext, useContext, useState } from "react";

const Session = createContext(null);

export const homeFor = (user) => !user ? "/" : user.role === "buyer" ? "/catalog" : "/organizer";
export const roleLabel = (user) => user.role === "buyer" ? "Comprador" : "Organizador";

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [accountOpen, setAccountOpen] = useState(false);

  // Entering, switching or leaving an account always restarts navigation at that role's home.
  function signIn(next) {
    setAccountOpen(false);
    setUser(next);
    if (router.canDismiss()) router.dismissAll();
    router.replace(homeFor(next));
  }

  return (
    <Session.Provider value={{
      user, users, setUsers, signIn, accountOpen,
      openAccount: () => setAccountOpen(true), closeAccount: () => setAccountOpen(false),
    }}>
      {children}
    </Session.Provider>
  );
}

export function useSession() {
  return useContext(Session);
}

// Returns a redirect element when the current account may not see the screen.
export function useRedirect(role) {
  const { user } = useSession();
  return !user || (role && user.role !== role) ? <Redirect href={homeFor(user)} /> : null;
}
