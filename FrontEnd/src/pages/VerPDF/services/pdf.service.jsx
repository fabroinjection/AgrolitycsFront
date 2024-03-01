import axios from "axios";
import { URLAPI } from "../../../config";

export const datosRotuloService = async (idTM) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `${URLAPI}rotulo?toma_de_muestra_id=${idTM}`;
    const response = await axios.get(_urlApi, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
    
    return response;
}
