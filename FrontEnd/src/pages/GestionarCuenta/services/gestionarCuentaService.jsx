import axios from "axios";
import { URLAPI } from "../../../config";

export const consultarUsuarioService = async (email) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);

    const encodedEmail = encodeURIComponent(email);

    const _urlApi = `${URLAPI}consultar_usuario?usuario_email=${encodedEmail}` ;
    const response = await axios.get(_urlApi,{
        headers: {
            Authorization : `Bearer ${token.access_token}`
        }
    });
    return response;
}

export const modificarUsuarioService = async (email, usuario) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);

    const encodedEmail = encodeURIComponent(email);

    const _urlApi = `${URLAPI}modificar_perfil?usuario_email=${encodedEmail}` ;
    const response = await axios.put(_urlApi, usuario, {
        headers: {
            Authorization : `Bearer ${token.access_token}`
        }
    });
    return response;
}

export const desactivarCuentaService = async (password) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    
    const encodedPassword = encodeURIComponent(password);

    const _urlApi = `${URLAPI}desactivarUsuarios?password=${encodedPassword}` ;
    const response = await axios.put(_urlApi, password,{
        headers: {
            Authorization : `Bearer ${token.access_token}`
        }
    });
    return response;
}

export const modificarPasswordService = async (oldPassword, newPassword) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    
    const encodedOldPassword = encodeURIComponent(oldPassword);
    const encodedNewPassword = encodeURIComponent(newPassword);

    const _urlApi = `${URLAPI}cambioDeContrase%C3%B1a?old_password=${encodedOldPassword}&new_password=${encodedNewPassword}`;
    const response = await axios.put(_urlApi, null, {
        headers: {
            Authorization : `Bearer ${token.access_token}`
        }
    });
    return response;
}

export const darDeBajaUsuarioService = async (password) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);

    const encodedPassword = encodeURIComponent(password);

    const _urlApi = `${URLAPI}DarDeBajaUsuario?password=${encodedPassword}`;
    const response = await axios.delete(_urlApi, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
    return response;
  }