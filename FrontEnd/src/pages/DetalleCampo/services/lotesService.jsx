import axios from "axios";
import { URLAPI } from "../../../config";

export const nuevoLoteService = async (lote) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `${URLAPI}loteAlta/`;
    const response = await axios.post(_urlApi, lote, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
    
    return response;
};

export const listaLotesService = async (idCampoLote) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `${URLAPI}lotesConsulta/${idCampoLote}`;
  const response = await axios.get(_urlApi, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  
  return response;
};

export const modificarLoteService = async(idCampoLote, idLote, lote) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `${URLAPI}loteModificar/${idCampoLote}/${idLote}`;
  const response = await axios.put(_urlApi, lote, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  });
  
  return response;
}

export const eliminarLoteService = async(idLote) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `${URLAPI}loteBaja/${idLote}`;
  const response = await axios.delete(_urlApi, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  });
  
  return response;
}

export const consultarLoteService = async (idLote) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `${URLAPI}loteConsultaId/${idLote}`;
  const response = await axios.get(_urlApi, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  
  return response;
}