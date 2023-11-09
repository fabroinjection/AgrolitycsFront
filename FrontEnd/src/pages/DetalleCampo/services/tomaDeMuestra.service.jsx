import axios from "axios";

export const tomasDeMuestraLoteService = async (idLote) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `http://127.0.0.1:8000/tomaDeMuestraConsulta/${idLote}`;
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
  const _urlApi = `http://127.0.0.1:8000/tipoMuestreo/`;
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
  const _urlApi = `http://127.0.0.1:8000/tipoDeProfundidad/`;
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
    const _urlApi = `http://127.0.0.1:8000/tomaDeMuestraAlta/`;
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
  const _urlApi = `http://127.0.0.1:8000/tomaDeMuestraBaja?tomaDeMuestra_id=${idTomaDeMuestra}`;
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
  const _urlApi = `http://127.0.0.1:8000/tomaDeMuestraModificacion?toma_demuestra_id=${idTomaDeMuestra}`;
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
  const _urlApi = `http://127.0.0.1:8000/submuestras?lote_id=${idLote}&metodo=${metodo}&num_muestras=${cantSubmuestras}`;
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
  const _urlApi = `http://127.0.0.1:8000/tomaDeMuestraTomada?tomaDeMuestra_id=${idTomaDeMuestra}&nueva_fecha=${fecha}`;
  const response = await axios.put(_urlApi, null, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  return response;
}