import { createContext, useState } from 'react'

export const GlobalContext = createContext();

function GlobalState({children}){
  const [showLoginView, setShowLoginView] = useState(false);

  return (
    <GlobalContext.Provider value={{
      showLoginView,
      setShowLoginView
    }}>
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalState;
