import axios from "axios";

export const campoService = async (id) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `http://127.0.0.1:8000/campo/${id}` ;
    const response = await axios.get(_urlApi,{
        headers: {
            Authorization : `Bearer ${token.access_token}`
        }
    });
    return response;
}

export const camposService = async () => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = "http://127.0.0.1:8000/campos" ;
    const response = axios.get(_urlApi, {
        headers: {
            Authorization : `Bearer ${token.access_token}`
        }
    });
    return response;
}

