import axios from "axios";
import { URLAPI } from "../../../config";

export const fertilizantesByNombreService = async (nombre) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const encodedNombre = encodeURI(nombre);
    const _urlApi = `${URLAPI}fertilizanteByNombre?nombre=${encodedNombre}`;
    const response = await axios.get(_urlApi, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
    
    return response;
}

export const registrarTratamientoService = async (tratamiento) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `${URLAPI}registrarTratamientos`;
    const response = await axios.post(_urlApi, tratamiento, {
        headers: {
        Authorization: `Bearer ${token.access_token}`
        }
    })
    return response;
      
}