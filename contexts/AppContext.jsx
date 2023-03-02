import { createContext, useContext, useState } from "react";

export class User {
  constructor(id, name, email, address, isAdmin) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.address = address;
    this.isAdmin = isAdmin;
  }
}

const UserContext = createContext(null);
const SetUserContext = createContext(null);

const TokensContext = createContext(null);
const SetTokensContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState([]);

  return (
    <UserContext.Provider value={user}>
      <SetUserContext.Provider value={setUser}>
        <TokensContext.Provider value={tokens}>
          <SetTokensContext.Provider value={setTokens}>
            {children}
          </SetTokensContext.Provider>
        </TokensContext.Provider>
      </SetUserContext.Provider>
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

export function useSetUser() {
  return useContext(SetUserContext);
}

export function useTokens() {
  return useContext(TokensContext);
}

export function useSetTokens() {
  return useContext(SetTokensContext);
}
