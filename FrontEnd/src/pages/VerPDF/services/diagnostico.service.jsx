import axios from "axios";

export const diagnosticoService = async (idAnalisis, rendimiento, idCultivo) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `http://127.0.0.1:8000/diagnostico?id_analisis=${idAnalisis}&rinde=${rendimiento}&id_cultivo=${idCultivo}`;
    const response = await axios.get(_urlApi, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
    
    return response;
}

export const interpretacionBasicoYCompletoService = async (idAnalisis) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `http://127.0.0.1:8000/interpretacion_CompletoYBasico?analisis_id=${idAnalisis}`;
  const response = await axios.get(_urlApi, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  
  return response;
}

export const interpretacionAguaUtilService = async (idAnalisis) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `http://127.0.0.1:8000/interpretacion_AguaUtil?analisis_id=${idAnalisis}`;
  const response = await axios.get(_urlApi, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  
  return response;
}

export const consultarDiagnosticoService = async (idAnalisis, idDiagnostico) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `http://127.0.0.1:8000/diagnosticoConsultaV2?id_analisis=${idAnalisis}&diagnostico_id=${idDiagnostico}`;
  const response = await axios.get(_urlApi, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  
  return response;
};