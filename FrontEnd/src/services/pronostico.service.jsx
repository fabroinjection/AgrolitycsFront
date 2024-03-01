import axios from "axios";

export const climaService = async ( lat, lon ) => {
    const API_KEY = "d89c02228ef2491fbbc130516240301";
    const _urlApi = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=6&lang=es`;
    const response = axios.get(_urlApi);
    return response;
}