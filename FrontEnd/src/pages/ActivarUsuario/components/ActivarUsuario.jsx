import '../../../components/Estilos/estilosFormulario.css';

// import hooks
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';

// import components
import { Button } from "react-bootstrap";
import Error from '../../../components/Modals/Error/Error';

// import context
import { UsuarioContext } from '../../../context/UsuarioContext';

// import services
import { loginService } from '../../../services/login.service';
import { activarUsuarioService } from '../services/activarUsuario.service';

// import utilities
import Cookies from 'js-cookie';

function ActivarUsuario(){

    let navigate = useNavigate();

    const [ usuario, setUsuario ] = useContext(UsuarioContext);

    // estado para errores endpoint login Usuario
    const [ esUsuarioValido, setEsUsuarioValido ] = useState(false);
    const [ esUsuarioRegistrado, setEsUsuarioRegistrado ] = useState(false);
    const [ esUsuarioVerificado, setEsUsuarioVerificado ] = useState(false);

    // estado para errores endpoint activar Usuario
    const [ esContraseñaIncorrecta, setEsContraseñaIncorrecta ] = useState(false);
    const [ usuarioNoEncontrado, setUsuarioNoEncontrado ] = useState(false);
    const [ noAutorizado, setNoAutorizado ] = useState(false);

    const cancelar = () => {
        navigate('/');
    }

    const activarUsuario = async () => {
        try {
            await activarUsuarioService(usuario.username, usuario.password);
            try {
                const { data } = await loginService(usuario);
                const user = data;
                window.localStorage.setItem(
                    'loggedAgroUser', JSON.stringify(user)
                );
                const nombreUsuario = {
                    nombre: user.nombre + " " + user.apellido,
                    email: usuario.username,
                }
                setCookies(nombreUsuario)
                navigate("/home");
            } catch (error) {
                const statusCode = error.response.status;
                if (statusCode === 403){
                    setEsUsuarioValido(true);
                }
                else if (statusCode === 401){
                    setEsUsuarioRegistrado(true);
                }
                else if (statusCode === 405) {
                    setEsUsuarioVerificado(true);
                }
            }
        } catch (error) {
            const statusCodeActiv = error.response.status
            if (statusCodeActiv === 403){
                setEsContraseñaIncorrecta(true);
            }
            else if (statusCodeActiv === 404){
                setUsuarioNoEncontrado(true);
            }
            else if (statusCodeActiv === 405) {
                setNoAutorizado(true);
            }
        }

        
    }

    const setCookies = (nombreUsuario) =>{
        //Calculo fecha y hora para la duración de 7 dias de la Cookie
        let currentDate = new Date();
        let expirationDate = new Date(currentDate.getTime() + (7 * 24 * 60 * 60 * 1000));

        //Se genera la cookie
        Cookies.set('email', nombreUsuario.email, {expires: expirationDate});
        Cookies.set('username', nombreUsuario.nombre, {expires: expirationDate})
    }

    return(
        <>
            <div className='fondoImagen'>
                <div className='formularioOscuro formCentrado'>
                    <div>
                        <p className='tituloMensaje'>Su cuenta se encuentra desactivada.</p>
                        <p className='tituloMensaje'>¿Desea volver a activarla?</p>
                    </div>

                    <div className='seccionBotonesFormulario margenTop20'>
                        <Button 
                            variant="outline-primary" 
                            className='botonCancelarFormulario'
                            onClick={cancelar}
                        >
                            Cancelar
                        </Button>

                        <Button 
                            variant="primary" 
                            className='botonConfirmacionFormulario'
                            onClick={activarUsuario}
                        >
                            Activar
                        </Button>
                    </div>
                </div>
            </div>
            {
                esUsuarioValido &&
                <Error texto = "El usuario o contraseña no es válido" 
                onConfirm={() => setEsUsuarioValido(false)}/>
            }
            {
                esUsuarioRegistrado &&
                <Error texto = "El usuario no está registrado"
                onConfirm={() => setEsUsuarioRegistrado(false)}/>
            }
            {
                esUsuarioVerificado &&
                <Error texto = "El usuario no tiene email verificado"
                onConfirm={() => setEsUsuarioVerificado(false)}/>
            }
            {
                esContraseñaIncorrecta &&
                <Error texto = "La contraseña ingresada es incorrecta." 
                onConfirm={() => setEsContraseñaIncorrecta(false)}/>
            }
            {
                usuarioNoEncontrado &&
                <Error texto = "El usuario a activar no fue encontrado." 
                onConfirm={() => setUsuarioNoEncontrado(false)}/>
            }
            {
                noAutorizado &&
                <Error texto = "No se encuentra autorizado para activar el usuario" 
                onConfirm={() => setNoAutorizado(false)}/>
            }
        </>
    );
}

export default ActivarUsuario;