import axios from "axios";
import { URLAPI } from "../../../config";

export const listadoTratamientoService = async (idLote) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `${URLAPI}listadoTratamientos?lote_id=${idLote}`;
    const response = await axios.get(_urlApi, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
    
    return response;
};

export const tomaDeMuestraTratamientoService = async (idTratamiento) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `${URLAPI}tratamientoTomaDeMuestra?tratamiento_id=${idTratamiento}`;
    const response = await axios.get(_urlApi, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
    
    return response;
};

