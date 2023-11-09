import axios from "axios";

export const registrarLaboratorioService = async (laboratorio) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = "http://127.0.0.1:8000/laboratorioAlta";
    const response = await axios.post(_urlApi, laboratorio, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
    return response;
  }

export const consultarLaboratorioService = async (idLaboratorio) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `http://127.0.0.1:8000/laboratorio?lab_id=${idLaboratorio}`;
    const response = await axios.get(_urlApi, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
    return response;
}

export const modificarLaboratorioService = async (laboratorio, idLaboratorio) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `http://127.0.0.1:8000/laboratorioModificar/${idLaboratorio}?laboratorio_id=${idLaboratorio}`;
  const response = await axios.put(_urlApi, laboratorio, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  return response;
}

export const eliminarLaboratorioService = async (idLaboratorio) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `http://127.0.0.1:8000/laboratorioBaja?laboratorio_id=${idLaboratorio}`;
  const response = await axios.delete(_urlApi, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  return response;
}