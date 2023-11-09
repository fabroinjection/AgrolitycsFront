import axios from "axios";


export const loginService = async credentials => {

    const _urlApi = "http://127.0.0.1:8000/token/";
    const response = await axios.post(_urlApi, credentials);

    return response;
}