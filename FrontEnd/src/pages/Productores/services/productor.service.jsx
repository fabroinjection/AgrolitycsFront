import axios from "axios";

export const registrarProductorService = async (productor) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = "http://127.0.0.1:8000/productorAlta";
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
  const _urlApi = `http://127.0.0.1:8000/productorModificar?productor_id=${idProductor}`;
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
  const _urlApi = `http://127.0.0.1:8000/productorBaja?productor_id=${idProductor}`;
  const response = await axios.delete(_urlApi, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  });
  
  return response;
}