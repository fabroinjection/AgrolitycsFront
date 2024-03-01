// import Componentes
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Error from '../../../../components/Modals/Error/Error';
import InformacionFooter from '../../../../components/InformacionFooter/InformacionFooter';

import marcaApp from "../../../../assets/marcaApp.png";

// import Servicios
import { loginService } from '../../../../services/login.service';

// import hooks
import { useState, useContext } from 'react';

// import context
import { UsuarioContext } from '../../../../context/UsuarioContext';

// import utilities
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { validarEmail } from '../../../../utilities/validarEmail';

// import Estilos
import './Login.css'


function Login() {   

    // estado para Usuario
    const [ esUsuarioValido, setEsUsuarioValido] = useState(false);
    const [ esUsuarioRegistrado, setEsUsuarioRegistrado] = useState(false);
    const [ esUsuarioVerificado, setEsUsuarioVerificado] = useState(false);

    let navigate = useNavigate();

    const { handleSubmit, reset } = useForm();

    const [ usuario, setUsuario ] = useContext(UsuarioContext);

    // estados para el form
    const [ email, setEmail ] = useState('');
    const [ pwd, setPwd ] = useState('');

    // estados para manejar el rojo del label
    const [ errorEmail, setErrorEmail ] = useState(false);
    const [ errorPwd, setErrorPwd ] = useState(false);

    const validarForm = () => {
        if (email === '') {
            setErrorEmail(true);
            mostrarErrorUsuarioVacio();
            return false;
        }

        if (!validarEmail(email)) {
            setErrorEmail(true);
            mostrarErrorMailNoValido();
            return false;
        }

        if (pwd === '') {
            setErrorPwd(true);
            mostrarErrorContraseñaVacia();
            return false;
        }

        return true;
    }

    const enviarFormulario = async () => {
        if (validarForm()) {
            try {
                const credentials = {
                    username: email,
                    password: pwd
                }
                const { data } = await loginService(credentials);
                const user = data;
                window.localStorage.setItem(
                    'loggedAgroUser', JSON.stringify(user)
                );
                const nombreUsuario = {
                    nombre: user.nombre + " " + user.apellido,
                    email: email,
                }
                setCookies(nombreUsuario)
                reset();
                navigate("/home");
            } catch (error) {
                errorUsuario(error.response);
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

    const mostrarErrorUsuarioNoValido = () => {
        toast.error('El usuario o contraseña no es válido', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            onClose: () => {
                setErrorEmail(false);
                setErrorPwd(false);
            }
        });
    }

    const mostrarErrorUsuarioVacio = () => {
        toast.error('Ingrese correo electrónico.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            onClose: () => {setErrorEmail(false)}
        });
    }

    const mostrarErrorMailNoValido = () => {
        toast.error('Ingrese un correo electrónico en formato válido.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            onClose: () => {setErrorEmail(false)}
        });
    }

    const mostrarErrorContraseñaVacia = () => {
        toast.error('Ingrese una contraseña.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            onClose: () => {setErrorPwd(false)}
        });
    }

    const errorUsuario = (error) => {
        const statusCode = error.status;
        if (statusCode === 403){
            setEsUsuarioValido(true);
            mostrarErrorUsuarioNoValido();
        }
        else if (statusCode === 401){
            setEsUsuarioRegistrado(true);
        }
        else if (statusCode === 405) {
            setEsUsuarioVerificado(true);
        }
        else if (statusCode === 406) {
            setUsuario({
                username: email,
                password: pwd
            });
            navigate('/activarUsuario');
        }

    }

    const navegarARegistroUsuario = () => {
        navigate("/registrarUsuario");
    }

    const handleChangeEmail = (e) => {
        const { value } = e.target;
        setEmail(value);
    }
    
    const handleChangePwd = (e) => {
        const { value } = e.target;
        setPwd(value);
    }

  return (

    <div className="pagina">
        <div className='contenido-columnas'>
            <div className='izquierda'>  
                <div className='contenedor-izquierda'>
                        
                    <div className='marca'>
                        <img  className="nombreMarca" src={marcaApp} alt="" />
                    </div>

                    <div className='centrar-formulario-login'>
                        <Form className="formulario-login" onSubmit={handleSubmit(enviarFormulario)}>
                            <fieldset>
                                <div className="tituloIniciarSesion">
                                    <span className="tituloForm titulo-login">Iniciar Sesión</span>
                                </div>

                                <Form.Group controlId="formEmail" className="seccionFormulario">
                                    <Form.Label className={(errorEmail || esUsuarioValido) ? "campoVacioIS" : "labelFormulario"}><strong>Correo electrónico</strong></Form.Label>
                                    <Form.Control type="text" className="inputFormularioOscuro" value={email} onChange={handleChangeEmail}
                                    ></Form.Control>
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
                                    
                                </Form.Group>

                                <Form.Group controlId="formPassword" className="seccionFormulario">
                                    <Form.Label className={(errorPwd || esUsuarioValido) ? "campoVacioIS" : "labelFormulario"}><strong>Contraseña</strong></Form.Label>
                                    <Form.Control type="password" className="inputFormularioOscuro" value={pwd} onChange={handleChangePwd}
                                    ></Form.Control>
                                    <Form.Text>
                                        <a href="/solicitudRestablecerContraseña"><strong>He olvidado mi contraseña</strong></a>
                                        </Form.Text>
                                </Form.Group>
                                
                            
                                <Form.Group className='seccionFormulario seccionBotonesFormulario margenTop30'>
                                    <Button variant="primary" className='botonConfirmacionFormulario' onClick={navegarARegistroUsuario}>
                                        Crear cuenta
                                    </Button>
                                    <Button variant="primary" className='botonConfirmacionFormulario' type="submit">
                                        Ingresar
                                    </Button>
                                </Form.Group>                            
                            </fieldset>
                        </Form>
                    </div>
                </div> 
            </div>

            <div className='derecha'>
                <div className='login-estilos'>

                </div>
            </div>
        </div>

        <InformacionFooter/>
    </div>
  )
}

export default Login