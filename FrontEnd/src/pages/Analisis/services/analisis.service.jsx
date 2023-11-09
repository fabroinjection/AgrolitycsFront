import axios from "axios";

export const buscarAnalisisService = async (idTomaMuestra) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `http://127.0.0.1:8000/analisisSueloConsulta/${idTomaMuestra}`;
    const response = await axios.get(_urlApi, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
    
    return response;
};

export const registrarNuevoAnalisisBasico = async (analisisBasico) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = "http://127.0.0.1:8000/analisisSueloBasicoAlta";
  const response = await axios.post(_urlApi, analisisBasico, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  return response;
}

export const registrarNuevoAnalisisCompleto = async (idTomaMuestra, analisisCompleto) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `http://127.0.0.1:8000/analisisSueloCompleto?tomaDeMuestra_id=${idTomaMuestra}`;
  const response = await axios.post(_urlApi, analisisCompleto, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  return response;
}

export const registrarNuevoAnalisisAguautil = async (idTomaMuestra, analisisAguaUtil) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `http://127.0.0.1:8000/analisisSueloAguaUtilAlta?tomaDeMuestra_id=${idTomaMuestra}`;
  const response = await axios.post(_urlApi, analisisAguaUtil, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  return response;
}

export const modificarAnalisisBasicoService = async (idAnalisis, analisisBasico) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `http://127.0.0.1:8000/analisisSueloBasicoModificacion?analisis_id=${idAnalisis}`;
    const response = await axios.put(_urlApi, analisisBasico, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
    return response;
}

export const modificarAnalisisCompletoService = async (idAnalisis, analisisCompleto) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `http://127.0.0.1:8000/analisisSueloCompletoModificacion?analisis_id=${idAnalisis}`;
    const response = await axios.put(_urlApi, analisisCompleto, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
    return response;
}

export const modificarAnalisisAguaService = async (idAnalisis, analisisAgua) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `http://127.0.0.1:8000/analisisSueloAguaUtilModificacion?analisis_id=${idAnalisis}`;
    const response = await axios.put(_urlApi, analisisAgua, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
    return response;
}