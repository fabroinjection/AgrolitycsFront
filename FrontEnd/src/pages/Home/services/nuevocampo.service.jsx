import axios from "axios";
import { URLAPI } from "../../../config";

export const nuevoCampoService = async (campo) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `${URLAPI}campoAlta`;
    const response = await axios.post(_urlApi, campo, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
    return response;
}