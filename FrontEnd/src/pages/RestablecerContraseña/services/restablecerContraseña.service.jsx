import axios from "axios";
import { URLAPI } from "../../../config";

export const restablecerContraseñaService = async (token, contraseña) => {
    const _urlApi = `${URLAPI}nuevaContrase%C3%B1a?new_password=${contraseña}`;
    const response = await axios.put(_urlApi, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response;
}