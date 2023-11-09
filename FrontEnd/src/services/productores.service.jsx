import axios from "axios";

export const productoresService = async () => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = "http://127.0.0.1:8000/productores";
    const valor = await axios.get(_urlApi, {
        headers: {
            Authorization: `Bearer ${token.access_token}`
        }
    });
    return valor;
}