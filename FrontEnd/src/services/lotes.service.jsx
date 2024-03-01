import axios from "axios";
import { URLAPI } from "../config";

export const lotesCampoService = async (idCampoLote) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `${URLAPI}lotesConsulta/${idCampoLote}`;
    const response = await axios.get(_urlApi, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
    
    return response;
  };