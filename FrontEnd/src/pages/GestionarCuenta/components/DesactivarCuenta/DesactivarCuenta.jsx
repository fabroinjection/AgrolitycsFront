import '../GestionarCuenta/GestionarCuenta.css';
import '../../../../components/Estilos/estilosFormulario.css';

// import componentes
import { Button } from "react-bootstrap";
import NavbarBootstrap from '../../../../components/Navbar/Navbar.components';
import { Form } from "react-bootstrap";
import Alerta from '../../../../components/Modals/Alerta/Alerta';
import Confirm from '../../../../components/Modals/Confirm/Confirm';
import Error from '../../../../components/Modals/Error/Error';

// import hooks
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

// import utilities
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

// import services
import { desactivarCuentaService } from '../../services/gestionarCuentaService';
import { renewToken } from '../../../../services/token.service';

function DesactivarCuenta({ accionCancelar }){

    const { handleSubmit, reset } = useForm();

    let navigate = useNavigate();

    const [ contraseña, setContraseña ] = useState("");
    const [ mostrarAlertaDesactivacionUsuario, setMostrarAlertaDesactivacionUsuario ] = useState(false);
    const [ mostrarAlertaCuentaDesactivada, setMostrarAlertaCuentaDesactivada ] = useState(false);

    // errores
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);
    const [ mostrarErrorUsuarioNoEncontrado, setMostrarErrorUsuarioNoEncontrado ] = useState(false);
    const [ mostrarErrorDesactivacion, setMostrarErrorDesactivacion ] = useState(false);
    const [ errorPassword, setErrorPassword ] = useState(false);

    const [ contraseñaVacia, setContraseñaVacia ] = useState(false);

    // funcion toast para alerta contraseña vacía
    const mostrarErrorContraseñaVacia = () => {
        toast.error('Se debe ingresar la contraseña para desactivar tu cuenta', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta contraseña incorrecta
    const mostrarErrorContraseña = () => {
        toast.error('La contraseña ingresada es incorrecta', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const handleChangeContraseña = (e) => {
        const { value } = e.target;
        setContraseña(value);
    }

    const validarForm = () => {
        if (contraseña === "") {
            setContraseñaVacia(true);
            mostrarErrorContraseñaVacia();
            return false;
        } else {
            setContraseñaVacia(false);
        }
        return true;
    }

    const eliminarTokenYCookies = () => {
        window.localStorage.removeItem('loggedAgroUser');
        Cookies.remove('email');
        Cookies.remove('username');
        Cookies.remove("idLoteSeleccionadoAConsultar");
        Cookies.remove("nombreLoteSeleccionadoAConsultar");
        Cookies.remove("haLoteSeleccionadoAConsultar");
        Cookies.remove("idLoteAModificar");
        Cookies.remove("nombreLoteAModificar");
        navigate("/");
    }

    const desactivarCuenta = async (confirm) => {
        if (confirm) {
            const validacion = validarForm();
            setMostrarAlertaDesactivacionUsuario(false);
            if (validacion) {
                try {
                    await desactivarCuentaService(contraseña);
                    setMostrarAlertaCuentaDesactivada(true);
                } catch (error) {
                    if (error.response) {
                        if (error.response.status === 401) {
                            try {
                                await renewToken();
                                await desactivarCuentaService(contraseña);
                                setMostrarAlertaCuentaDesactivada(true);
                            } catch (error) {
                                if (error.response.status === 401) {
                                    setMostrarErrorVencimientoToken(true);
                                }
                                else if (error.response.status === 403) {
                                    setErrorPassword(true);
                                    mostrarErrorContraseña();
                                }
                                else if (error.response.status === 404) {
                                    setMostrarErrorUsuarioNoEncontrado(true);
                                }
                                else {
                                    setMostrarErrorDesactivacion(true);
                                }        
                            }
                        }
                        else if (error.response.status === 403) {
                            setErrorPassword(true);
                            mostrarErrorContraseña();
                        }
                        else if (error.response.status === 404) {
                            setMostrarErrorUsuarioNoEncontrado(true);
                        }
                        else {
                            setMostrarErrorDesactivacion(true);
                        }
                    }
                }
            }    
        } else {
            setMostrarAlertaDesactivacionUsuario(false);
        }
        
    }

    const solicitarConfirmacion = () => {
        setMostrarAlertaDesactivacionUsuario(true);
    }

    const finalizacionDesactivacionUsuario = (confirm) => {
        if (confirm) {
            reset();
            setMostrarAlertaDesactivacionUsuario(false);
            eliminarTokenYCookies(); 
        }
    }

    const handleSesionExpirada = () =>{
        setMostrarErrorVencimientoToken(false);
        window.localStorage.removeItem('loggedAgroUser');
        navigate("/");
      }

    return(
        <>
            <NavbarBootstrap/>
            <div className='contenedorGestionarCuenta'>
                <div>
                    <span className='tituloForm'>Desactivar Cuenta</span>
                </div>

                <div className='seccionGestionUsuario'>
                    <p>Estás a punto de desactivar tu cuenta en Agrolitycs. Queremos informarte de algunos detalles importantes:</p>

                    <ol>
                        <li><strong>Almacenamiento Seguro:</strong> Toda tu información será almacenada de forma segura en nuestros servidores, incluso después de la desactivación de tu cuenta.</li>
                        <li><strong>Reactivación futura:</strong> Si decides volver, simplemente inicia sesión nuevamente en Agrolitycs. Será necesario que confirmes tu decisión para garantizar la seguridad de tu cuenta.</li>
                    </ol>

                    <p>Gracias por ser parte de Agrolitycs. Si tienes preguntas o necesitas asistencia escríbenos a <a href="mailto:agrolitycs@gmail.com">agrolitycs@gmail.com</a>, estamos aquí para ayudarte.</p>

                    <p>Esperamos verte de nuevo pronto.</p>
                </div>

                <span className='titulo-contenedor-gestion-cuenta'>Confirmación</span>
                <Form className='formularioGestionCuenta' onSubmit={handleSubmit(solicitarConfirmacion)}>
                    <Form.Group>
                        <Form.Label className={(contraseñaVacia || errorPassword ) ? 'labelErrorFormulario' : ''}>Contraseña</Form.Label>
                        <Form.Control 
                            type='password'
                            value={contraseña}
                            onChange={handleChangeContraseña}
                            />
                    </Form.Group>

                    <div className='contenedorBotonesGestionCuenta'>
                        <Button variant='outline-secondary' className='botonGestionUsuario' onClick={() => accionCancelar()}>Cancelar</Button>
                        <Button variant='outline-danger' className='botonGestionUsuario' type='submit'>Desactivar Cuenta</Button>
                    </div>

                </Form>
            </div>

            {mostrarAlertaDesactivacionUsuario && 
                <Alerta 
                    texto="¿Está seguro de Desactivar su Cuenta?" 
                    nombreBoton="Desactivar" 
                    onConfirm={desactivarCuenta}
                />
            }

            {mostrarAlertaCuentaDesactivada && 
                <Confirm
                    texto="Su Usuario ha sido desactivado correctamente" 
                    onConfirm={finalizacionDesactivacionUsuario}
                />
            }

            {mostrarErrorUsuarioNoEncontrado &&
                <Error 
                    texto={"El usuario que desea desactivar no existe."} 
                    onConfirm={() => setMostrarErrorUsuarioNoEncontrado(false)}
                />
            }

            {mostrarErrorDesactivacion &&
                <Error 
                    texto={"Ocurrió un error desactivando el usuario."} 
                    onConfirm={() => setMostrarErrorDesactivacion(false)}
                />
            }

            {mostrarErrorVencimientoToken && 
                <Error 
                    texto={"Su sesión ha expirado"} 
                    onConfirm={handleSesionExpirada}
                />
            }


        </>
    );
}

export default DesactivarCuenta;