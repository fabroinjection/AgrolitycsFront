import axios from "axios";

export const laboratoriosService = async () => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = "http://127.0.0.1:8000/laboratorios";
    const laboratorios = await axios.get(_urlApi, {
        headers: {
            Authorization: `Bearer ${token.access_token}`
        }
    });
    return laboratorios;
}

export const consultarLaboratorio = async (idLabo) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `http://127.0.0.1:8000/laboratorios?lab_id=${idLabo}`;
    const laboratorio = await axios.get(_urlApi, {
        headers: {
            Authorization: `Bearer ${token.access_token}`
        }
    });
    return laboratorio;
}