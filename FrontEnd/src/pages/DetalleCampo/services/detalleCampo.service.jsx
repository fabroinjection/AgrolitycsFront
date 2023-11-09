import axios from "axios";

export const modificarCampoService = async (campo) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `http://127.0.0.1:8000/campoModificar/${campo.id}`;
    const response = await axios.put(_urlApi, campo, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
    return response;
}

export const eliminarCampoService = async (id) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `http://127.0.0.1:8000/campoBaja/${id}`;
  const response = await axios.delete(_urlApi, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  
  return response;
}