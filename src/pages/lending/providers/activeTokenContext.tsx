import React from "react";

const TokenContext = React.createContext<any>("");
const TokenUpdateContext = React.createContext<any>("");
export function useToken() {
  return React.useContext(TokenContext);
}

export function useSetToken() {
    return React.useContext(TokenUpdateContext);
  }
export default function TokenProvider({ children }: any) {
  const [token, setToken] = React.useState(null);

  function updateToken(token: any) {
    setToken(token);
  }
  return (
    <TokenContext.Provider value={[token, setToken]}>
        <TokenUpdateContext.Provider value={updateToken}>
      {children}
      </TokenUpdateContext.Provider>
    </TokenContext.Provider>
  );
}
