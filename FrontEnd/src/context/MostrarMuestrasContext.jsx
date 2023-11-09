import { useState, createContext } from "react";

export const MostrarMuestrasContext = createContext();

export const MostrarMuestrasProvider = ({ children }) => {
    const [ mostrarMuestras, setMostrarMuestras ] = useState(false);

    return(
        <MostrarMuestrasContext.Provider value={[mostrarMuestras, setMostrarMuestras]}>
            {children}
        </MostrarMuestrasContext.Provider>
    )

}