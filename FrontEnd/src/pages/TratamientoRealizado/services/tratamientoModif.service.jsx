import axios from "axios";
import { URLAPI } from "../../../config";

export const modificarTratamientoService = async (idTratamiento, tratamiento) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `${URLAPI}modificarTratamiento?tratamiento_id=${idTratamiento}`;
    const response = await axios.put(_urlApi, tratamiento, {
        headers: {
        Authorization: `Bearer ${token.access_token}`
        }
    })
    return response;
      
}