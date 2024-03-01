import axios from "axios";
import { URLAPI } from "../../../config";

export const consultarTratamientoService = async (idTM) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `${URLAPI}tratamientoDeTomaDeMuestra?tomaDeMuestra_id=${idTM}`;
    const response = await axios.get(_urlApi, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
    
    return response;
}

export const getDiagnosticosTMService = async (idTM) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `${URLAPI}diagnosticoListadoPorTomaDeMuestra?toma_de_muestra_id=${idTM}`;
  const response = await axios.get(_urlApi, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  
  return response;
}