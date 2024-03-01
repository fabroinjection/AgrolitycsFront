import axios from "axios";
import { URLAPI } from "../config";

export const fertilizantesService = async () => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `${URLAPI}fertilizante`;
    const valor = await axios.get(_urlApi, {
        headers: {
            Authorization: `Bearer ${token.access_token}`
        }
    });
    return valor;
}