import axios from "axios";
import { URLAPI } from "../config";

export const localidadesService = async (id) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `${URLAPI}provincias/${id}/localidades`;
    const valor = await axios.get(_urlApi, {
        headers: {
            Authorization: `Bearer ${token.access_token}`
        }
    });
    return valor;
}

export const localidadesServiceSinAuth = async (idProv) => {
    const _urlApi = `${URLAPI}provincias/${idProv}/localidades_sin_token`;
    const valor = await axios.get(_urlApi);
    return valor;
}