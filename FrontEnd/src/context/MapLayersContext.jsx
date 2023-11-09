import { useState, createContext } from "react";

export const MapLayersContext = createContext();


export const MapLayersProvider = ({ children }) => {
    const [mapLayers, setMapLayers] = useState([]);
  
    return (
      <MapLayersContext.Provider value={[mapLayers, setMapLayers]}>
        {children}
      </MapLayersContext.Provider>
    );
};