import { useState, createContext } from "react";

export const HayAnalisisContext = createContext();

export const HayAnalisisProvider = ({ children }) => {
    const [ hayAnalisis, setHayAnalisis ] = useState();

    return(
        <HayAnalisisContext.Provider value={[hayAnalisis, setHayAnalisis]}>
            {children}
        </HayAnalisisContext.Provider>
    )
}