import axios from "axios";

export const nuevoLoteService = async (lote) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `http://127.0.0.1:8000/loteAlta/`;
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
  const _urlApi = `http://127.0.0.1:8000/lotesConsulta/${idCampoLote}`;
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
  const _urlApi = `http://127.0.0.1:8000/loteModificar/${idCampoLote}/${idLote}`;
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
  const _urlApi = `http://127.0.0.1:8000/loteBaja/${idLote}`;
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
  const _urlApi = `http://127.0.0.1:8000/loteConsultaId/${idLote}`;
  const response = await axios.get(_urlApi, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  
  return response;
}