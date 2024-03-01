import axios from "axios";
import { URLAPI } from "../../../config";

export const fertilizantePorLoteService = async (idCampo, idLote) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `${URLAPI}generarEstadisticaFertilizantePorLote?campo_id=${idCampo}&lote_id=${idLote}`;
    const response = await axios.get(_urlApi, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
    
    return response;
}

export const nutrientePorLoteService = async (idCampo, idLote, nutriente) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `${URLAPI}generarEstadisticaNutrientePorLote?campo_id=${idCampo}&lote_id=${idLote}&nutriente=${nutriente}`;
  const response = await axios.get(_urlApi, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  
  return response;
}