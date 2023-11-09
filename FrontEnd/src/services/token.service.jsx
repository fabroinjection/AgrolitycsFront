import axios from "axios";

export const renewToken = async () => {
    const tokenJSON = window.localStorage.getItem('loggedAgroUser');
    const token = JSON.parse(tokenJSON);
    const refreshToken = token.refresh_token;
    const response = await axios.post('http://127.0.0.1:8000/refresh_token', null, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    
    const newTokenJSON = JSON.stringify({
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      token_type: response.data.token_type,
      nombre: response.data.nombre,
      apellido: response.data.apellido
    });
    window.localStorage.setItem('loggedAgroUser', newTokenJSON);

    return response;
}