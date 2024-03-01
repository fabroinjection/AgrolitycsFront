import axios from "axios";
import { URLAPI } from "../config";

export const campoService = async (id) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `${URLAPI}/campo/${id}` ;
    const response = await axios.get(_urlApi,{
        headers: {
            Authorization : `Bearer ${token.access_token}`
        }
    });
    return response;
}

export const camposService = async () => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `${URLAPI}campos` ;
    const response = axios.get(_urlApi, {
        headers: {
            Authorization : `Bearer ${token.access_token}`
        }
    });
    return response;
}

export const climaService = async ( lat, lon ) => {
    const apiKey = "ada83f9b9a68190d23b8814ea69bc3c8";
    const _urlApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&lang=es&appid=${apiKey}&units=metric`;
    const response = axios.get(_urlApi);
    return response;
}

