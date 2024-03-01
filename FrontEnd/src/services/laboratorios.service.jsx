import axios from "axios";
import { URLAPI } from "../config";

export const laboratoriosService = async () => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `${URLAPI}laboratorios`;
    const laboratorios = await axios.get(_urlApi, {
        headers: {
            Authorization: `Bearer ${token.access_token}`
        }
    });
    return laboratorios;
}

export const consultarLaboratorio = async (idLabo) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `${URLAPI}laboratorio?lab_id=${idLabo}`;
    const laboratorio = await axios.get(_urlApi, {
        headers: {
            Authorization: `Bearer ${token.access_token}`
        }
    });
    return laboratorio;
}