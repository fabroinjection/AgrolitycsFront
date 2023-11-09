import axios from "axios";

export const getAnalisisService = async (idTomaMuestra) => {
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