import { createContext, useContext, useState } from "react";

const Session = createContext(null);

export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  return <Session.Provider value={{ user, setUser }}>{children}</Session.Provider>;
}

export function useSession() {
  return useContext(Session);
}
