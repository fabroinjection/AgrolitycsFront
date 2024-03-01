import axios from "axios";
import { URLAPI } from "../../../config";

export const activarUsuarioService = async (mail, pwd) => {
      const _urlApi = `${URLAPI}activarUsuarios?email=${mail}&password=${pwd}`;
      const response = await axios.put(_urlApi, null)
      return response;
  }