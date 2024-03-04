import axios from "axios";
import { URLAPI } from "../config";


export const loginService = async credentials => {

    const _urlApi = `${URLAPI}token`;
    const response = await axios.post(_urlApi, credentials);

    return response;
}