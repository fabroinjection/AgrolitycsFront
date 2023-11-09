import { useState, createContext } from "react";

export const HectareasContext = createContext();

export const HectareasProvider = ({ children }) => {
    const [ hectareas, setHectareas ] = useState();

    return(
        <HectareasContext.Provider value={[hectareas, setHectareas]}>
            {children}
        </HectareasContext.Provider>
    )
}