import { useState, createContext } from "react";

export const CantidadSubMuestrasContext = createContext();

export const CantidadSubMuestrasProvider = ({ children }) => {
    const [ cantidadSubmuestras, setCantidadSubmuestras ] = useState();

    return(
        <CantidadSubMuestrasContext.Provider value={[cantidadSubmuestras, setCantidadSubmuestras]}>
            {children}
        </CantidadSubMuestrasContext.Provider>
    )
}