import { createContext, useState } from "react";

export const ModoPDFContext = createContext();

export const ModoPDFProvider = ({ children }) => {
    const [ modoPDF, setModoPDF] = useState();

    return(
        <ModoPDFContext.Provider value={[modoPDF, setModoPDF]}>
            {children}
        </ModoPDFContext.Provider>
    )
}