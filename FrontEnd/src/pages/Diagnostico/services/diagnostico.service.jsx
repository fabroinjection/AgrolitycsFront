import axios from "axios";
import { URLAPI } from "../../../config";

export const listadoDiagnosticosService = async (idAnalisis) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `${URLAPI}diagnosticoListado?analisis_id=${idAnalisis}`;
  const response = await axios.get(_urlApi, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  
  return response;
}

export const eliminarDiagnosticoService = async (idDiagnostico) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `${URLAPI}diagnosticoBorrado?diagnostico_id=${idDiagnostico}`;
  const response = await axios.delete(_urlApi, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  
  return response;
}