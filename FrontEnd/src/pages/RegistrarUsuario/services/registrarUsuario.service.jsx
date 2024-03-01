import axios from "axios";
import { URLAPI } from "../../../config";

export const signUp = async (usuario) => {
    const response = await axios.post(`${URLAPI}signup`, usuario);
    return response;
}