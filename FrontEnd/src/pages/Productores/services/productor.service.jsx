import axios from "axios";
import { URLAPI } from "../../../config";

export const registrarProductorService = async (productor) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `${URLAPI}productorAlta`;
  const response = await axios.post(_urlApi, productor, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  return response;
}

export const modificarProductorService = async (productor, idProductor) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `${URLAPI}productorModificar?productor_id=${idProductor}`;
  const response = await axios.put(_urlApi, productor, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  return response;
}

export const eliminarProductorService = async(idProductor) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `${URLAPI}productorBaja?productor_id=${idProductor}`;
  const response = await axios.delete(_urlApi, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  });
  
  return response;
}