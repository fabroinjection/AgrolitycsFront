import axios from "axios";
import { URLAPI } from "../../../config";

export const registrarLaboratorioService = async (laboratorio) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `${URLAPI}laboratorioAlta`;
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
    const _urlApi = `${URLAPI}laboratorio?lab_id=${idLaboratorio}`;
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
  const _urlApi = `${URLAPI}laboratorioModificar/${idLaboratorio}?laboratorio_id=${idLaboratorio}`;
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
  const _urlApi = `${URLAPI}laboratorioBaja?laboratorio_id=${idLaboratorio}`;
  const response = await axios.delete(_urlApi, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  return response;
}