import { useState, createContext } from "react";

export const IdDiagnosticoContext = createContext();

export const IdDiagnosticoProvider = ({ children }) => {
    const [ idDiagnostico, setIdDiagnostico ] = useState();

    return(
        <IdDiagnosticoContext.Provider value={[ idDiagnostico, setIdDiagnostico ]}>
            {children}
        </IdDiagnosticoContext.Provider>
    )
}