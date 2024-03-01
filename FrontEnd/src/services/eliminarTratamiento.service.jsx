import axios from "axios";
import { URLAPI } from "../config";

export const eliminarTratamientoService = async (idTratamiento) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `${URLAPI}bajaLogicaTratamiento?tratamiento_id=${idTratamiento}`;
    const response = await axios.delete(_urlApi, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    });
    
    return response;
  }