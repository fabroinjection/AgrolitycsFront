import { useState, createContext } from "react";

export const IdLoteTomaMuestrasContext = createContext();

export const IdLoteTomaMuestrasProvider = ({ children }) => {
    const [ idLoteTomaMuestras, setIdLoteTomaMuestras ] = useState();

    return(
        <IdLoteTomaMuestrasContext.Provider value={[idLoteTomaMuestras, setIdLoteTomaMuestras]}>
            {children}
        </IdLoteTomaMuestrasContext.Provider>
    )
}