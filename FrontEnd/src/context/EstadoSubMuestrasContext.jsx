import { useState, createContext } from "react";

export const EstadoSubMuestrasContext = createContext();

export const EstadoSubMuestrasProvider = ({ children }) => {
    const [ haySubmuestras, setHaySubmuestras ] = useState();

    return(
        <EstadoSubMuestrasContext.Provider value={[haySubmuestras, setHaySubmuestras]}>
            {children}
        </EstadoSubMuestrasContext.Provider>
    )
}