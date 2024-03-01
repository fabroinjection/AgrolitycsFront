import axios from "axios";
import { URLAPI } from "../../../config";

export const tomasDeMuestraLoteService = async (idLote) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `${URLAPI}tomaDeMuestraConsulta/${idLote}`;
    const response = await axios.get(_urlApi, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
    
    return response;
};

export const tiposDeMuestreoService = async () => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `${URLAPI}tipoMuestreo/`;
  const response = await axios.get(_urlApi, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  
  return response;
};

export const profundidadesService = async () => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `${URLAPI}tipoDeProfundidad/`;
  const response = await axios.get(_urlApi, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  
  return response;
};

export const nuevaTomaDeMuestraService = async (tomaDeMuestra) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `${URLAPI}tomaDeMuestraAlta/`;
    const response = await axios.post(_urlApi, tomaDeMuestra, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
    return response;
}

export const darDeBajaTomaDeMuestraService = async (idTomaDeMuestra) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `${URLAPI}tomaDeMuestraBaja?tomaDeMuestra_id=${idTomaDeMuestra}`;
  const response = await axios.delete(_urlApi, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  return response;
}

export const modificarTomaDeMuestraService = async (idTomaDeMuestra, tomaDeMuestra) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `${URLAPI}tomaDeMuestraModificacion?toma_demuestra_id=${idTomaDeMuestra}`;
  const response = await axios.put(_urlApi, tomaDeMuestra, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  return response;
}

export const puntosSubmuestraService = async (idLote, metodo, cantSubmuestras) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `${URLAPI}submuestras?lote_id=${idLote}&metodo=${metodo}&num_muestras=${cantSubmuestras}`;
  const response = await axios.get(_urlApi, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  return response;
}

export const registrarTomaDeMuestraTomadaService = async (idTomaDeMuestra, fecha) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `${URLAPI}tomaDeMuestraTomada?tomaDeMuestra_id=${idTomaDeMuestra}&nueva_fecha=${fecha}`;
  const response = await axios.put(_urlApi, null, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  return response;
}