import axios from "axios";

export const datosRotuloService = async (idTM) => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const _urlApi = `http://127.0.0.1:8000/rotulo?toma_de_muestra_id=${idTM}`;
    const response = await axios.get(_urlApi, {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    })
    
    return response;
}

export const datosCampoPDFService = async (idTM) => {
  const tokenJSON = window.localStorage.getItem('loggedAgroUser');
  const token = JSON.parse(tokenJSON);
  const _urlApi = `http://127.0.0.1:8000/datosPDF?toma_de_muestra_id=${idTM}`;
  const response = await axios.get(_urlApi, {
    headers: {
      Authorization: `Bearer ${token.access_token}`
    }
  })
  
  return response;
}
