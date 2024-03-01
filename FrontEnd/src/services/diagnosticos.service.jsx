import axios from "axios";
import { URLAPI } from "../config";

export const getCultivosService = async () => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `${URLAPI}cultivos` ;
    const response = await axios.get(_urlApi,{
        headers: {
            Authorization : `Bearer ${token.access_token}`
        }
    });
    return response;
}

export const getCultivoService = async (id) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `${URLAPI}cultivoNombre?id_cultivo=${id}` ;
    const response = await axios.get(_urlApi,{
        headers: {
            Authorization : `Bearer ${token.access_token}`
        }
    });
    return response;
}

export const getDiagnosticoByIdService = async (idAnalisis, idDiagnostico) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `${URLAPI}diagnosticoConsultaV2?id_analisis=${idAnalisis}&diagnostico_id=${idDiagnostico}`;
    const response = await axios.get(_urlApi,{
        headers: {
            Authorization : `Bearer ${token.access_token}`
        }
    });
    return response;
}