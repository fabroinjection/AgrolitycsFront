import { useState, createContext } from "react";

export const PolygonCoordsContext = createContext();


export const PolygonCoordsProvider = ({ children }) => {
    const [ polygonCoords, setPolygonCoords ] = useState([]);
  
    return (
      <PolygonCoordsContext.Provider value={[polygonCoords, setPolygonCoords]}>
        {children}
      </PolygonCoordsContext.Provider>
    );
};