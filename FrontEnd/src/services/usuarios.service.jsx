import axios from "axios";
import { URLAPI } from "../config";

export const validarUsuarioExistenteService = async (email) => {
    const encodedEmail = encodeURIComponent(email);
    const response = await axios.get(`${URLAPI}verificacionDeUsuarioExistente?email=${encodedEmail}`);
    return response;
}