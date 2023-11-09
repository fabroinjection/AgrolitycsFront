import axios from "axios";

export const getCultivosService = async () => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `http://127.0.0.1:8000/cultivos` ;
    const response = await axios.get(_urlApi,{
        headers: {
            Authorization : `Bearer ${token.access_token}`
        }
    });
    return response;
}

export const getCultivoService = async (id) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `http://127.0.0.1:8000/cultivoNombre?id_cultivo=${id}` ;
    const response = await axios.get(_urlApi,{
        headers: {
            Authorization : `Bearer ${token.access_token}`
        }
    });
    return response;
}