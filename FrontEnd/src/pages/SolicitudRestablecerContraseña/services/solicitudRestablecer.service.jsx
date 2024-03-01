import axios from "axios";
import { URLAPI } from "../../../config";

export const enviarMailRestablecimientoService = async (mail) => {
    const encodedMail = encodeURIComponent(mail);
    const _urlApi = `${URLAPI}restablecer_Contrase%C3%B1a?mail=${encodedMail}`;
    const response = await axios.put(_urlApi, null);
    return response;
}