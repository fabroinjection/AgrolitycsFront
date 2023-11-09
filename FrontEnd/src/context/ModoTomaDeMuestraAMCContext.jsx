import { useState, createContext } from "react";

export const ModoTomaDeMuestraAMCContext = createContext();


export const ModoTomaDeMuestraAMCProvider = ({ children }) => {
    const [ modoTomaDeMuestra, setModoTomaDeMuestra ] = useState([]);
  
    return (
      <ModoTomaDeMuestraAMCContext.Provider value={[ modoTomaDeMuestra, setModoTomaDeMuestra ]}>
        {children}
      </ModoTomaDeMuestraAMCContext.Provider>
    );
};