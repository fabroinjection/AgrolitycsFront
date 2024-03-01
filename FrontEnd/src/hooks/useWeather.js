import { useState, useEffect } from "react";

import { climaService } from "../services/campo.service";

const useWeather = ( lat, lon ) => {

    const [ data, setData ] = useState(null);
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const fetchClima = async () => {
            try {
                const { data } = await climaService(lat, lon);
                setLoading(false);
                setData(data);
            } catch (error) {
                setData(null);
                setError(error);
            }
        }
        fetchClima();
    }, 
    [lat, lon]);

    return [ data, loading, error ];
}

export default useWeather;

