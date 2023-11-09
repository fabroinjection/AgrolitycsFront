import axios from "axios"

export const AxiosInterceptor = () => {
    axios.interceptors.request.use( (request) => {
        //Acá se pueden manejar encabezados de la request
        return request;
    });

    axios.interceptors.response.use()
};