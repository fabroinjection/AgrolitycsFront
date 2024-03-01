import axios from "axios";
import { URLAPI } from "../config";

export const provinciasService = async () => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `${URLAPI}provincias`;
    const valor = await axios.get(_urlApi, {
        headers: {
            Authorization: `Bearer ${token.access_token}`
        }
    });
    return valor
}

export const provinciasServiceSinAuth = async () => {
    const _urlApi = `${URLAPI}provincias_sin_token`;
    const valor = await axios.get(_urlApi);
    return valor
}