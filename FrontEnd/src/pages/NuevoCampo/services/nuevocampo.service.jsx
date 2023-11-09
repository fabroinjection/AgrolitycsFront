import axios from "axios";

export const nuevoCampoService = async (campo) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = "http://127.0.0.1:8000/campoAlta";
    const response = await axios.post(_urlApi, campo, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
    return response;
}