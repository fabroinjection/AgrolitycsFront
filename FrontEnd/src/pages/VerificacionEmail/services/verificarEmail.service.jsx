import axios from "axios";
import { URLAPI } from "../../../config";

export const verificarEmailService = async (token) => {
    const response = await axios.get(`${URLAPI}verify?token=${token}`);
    return response;
}