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
import { darDeBajaUsuarioService } from '../../services/gestionarCuentaService';
import { renewToken } from '../../../../services/token.service';

function EliminarCuenta({ accionCancelar }){

    const [ contraseña, setContraseña ] = useState("");

    const { handleSubmit, reset } = useForm();

    let navigate = useNavigate();

    const [ contraseñaVacia, setContraseñaVacia ] = useState(false);

    const [ mostrarAlertaEliminacionUsuario, setMostrarAlertaEliminacionUsuario ] = useState(false);
    const [ mostrarAlertaCuentaEliminada, setMostrarAlertaCuentaEliminada ] = useState(false);
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);
    const [ mostrarErrorHistorialNoEncontrado, setMostrarErrorHistorialNoEncontrado ] = useState(false);
    const [ contraseñaIncorrecta, setContraseñaIncorrecta ] = useState(false);
    const [ mostrarErrorUsuarioNoEncontrado, setMostrarErrorUsuarioNoEncontrado ] = useState(false);
    const [ mostrarErrorPerfilNoEncontrado, setMostrarErrorPerfilNoEncontrado ] = useState(false);
    const [ mostrarErrorEliminacionUsuario, setMostrarErrorEliminacionUsuario ] = useState(false)


    // funcion toast para alerta contraseña vacía
    const mostrarErrorContraseñaVacia = () => {
        toast.error('Se debe ingresar la contraseña para eliminar el usuario', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta contraseña incorrecta
    const mostrarErrorContraseñaIncorrecta = () => {
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

    const handleSesionExpirada = () =>{
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
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

    const eliminarUsuario = async (confirm) => {
        if (confirm) {
            const validacion = validarForm();
            setMostrarAlertaEliminacionUsuario(false);
            if (validacion) {
                try {
                    await darDeBajaUsuarioService(contraseña);
                    setMostrarAlertaCuentaEliminada(true);
                } catch (error) {
                    if (error.response) {
                        if (error.response.status === 401) {
                            try {
                                await renewToken();
                                await darDeBajaUsuarioService(contraseña);
                                setMostrarAlertaCuentaEliminada(true)
                              } catch (error) {
                                if(error.response && error.response.status === 401){
                                    setMostrarErrorVencimientoToken(true);
                                }
                                else if (error.response.status === 402) {
                                    setMostrarErrorHistorialNoEncontrado(true);
                                }
                                else if (error.response.status === 403) {
                                    setMostrarErrorPerfilNoEncontrado(true);
                                }
                                else if (error.response.status === 404) {
                                    setMostrarErrorUsuarioNoEncontrado(true);
                                }
                                else if (error.response.status === 405) {
                                    setContraseñaIncorrecta(true);
                                    mostrarErrorContraseñaIncorrecta();
                                }
                                else {
                                    setMostrarErrorEliminacionUsuario(true);
                                }
                              }
                        }
                        else if (error.response.status === 402) {
                            setMostrarErrorHistorialNoEncontrado(true);
                        }
                        else if (error.response.status === 403) {
                            setMostrarErrorPerfilNoEncontrado(true);
                        }
                        else if (error.response.status === 404) {
                            setMostrarErrorUsuarioNoEncontrado(true);
                        }
                        else if (error.response.status === 405) {
                            setContraseñaIncorrecta(true);
                            mostrarErrorContraseñaIncorrecta();
                        }
                        else {
                            setMostrarErrorEliminacionUsuario(true);
                        }
                    }
                }
            }
        } else {
            setMostrarAlertaEliminacionUsuario(false);
        }
        
    }

    const finalizacionEliminacionUsuario = (confirm) => {
        if (confirm) {
            reset();
            setMostrarAlertaEliminacionUsuario(false);
            eliminarTokenYCookies(); 
        }
    }

    const solicitarConfirmacion = () => {
        setMostrarAlertaEliminacionUsuario(true);
    }

    return(
        <>
            <NavbarBootstrap/>
            <div className='contenedorGestionarCuenta'>
                <div>
                    <span className='tituloForm'>Eliminar Cuenta</span>
                </div>

                <div className='seccionGestionUsuario'>
                    <p>Estás a punto de eliminar tu cuenta en Agrolitycs. Queremos informarte de algunos detalles importantes:</p>

                    <ol>
                        <li><strong>Eliminación Permanente:</strong> Este proceso borrará todos tus datos y configuraciones asociados a tu cuenta. No podrás recuperar esta información una vez completada la eliminación.</li>
                        <li><strong>Información No Recuperable:</strong> Tus registros, configuraciones y cualquier otro dato vinculado a tu cuenta se perderán de forma irreversible.</li>
                        <li><strong>Proceso de Eliminación:</strong> Después de confirmar esta acción, tu cuenta será eliminada inmediatamente.</li>
                    </ol>

                    <p>Si tienes preguntas o necesitas asistencia escríbenos a <a href="mailto:agrolitycs@gmail.com">agrolitycs@gmail.com</a>, estamos aquí para ayudarte.</p>

                    <p>Lamentamos verte partir y agradecemos tu tiempo con nosotros.</p>
                </div>

                <span className='titulo-contenedor-gestion-cuenta'>Confirmación</span>
                <Form className='formularioGestionCuenta' onSubmit={handleSubmit(solicitarConfirmacion)}>
                    <Form.Group>
                        <Form.Label className={(contraseñaVacia || contraseñaIncorrecta) ? 'labelErrorFormulario' : ''}>Contraseña</Form.Label>
                        <Form.Control 
                            type='password'
                            value={contraseña}
                            onChange={handleChangeContraseña}
                            />
                    </Form.Group>

                    <div className='contenedorBotonesGestionCuenta'>
                        <Button variant='outline-secondary' className='botonGestionUsuario' onClick={() => accionCancelar()}>Cancelar</Button>
                        <Button variant='outline-danger' className='botonGestionUsuario' type='submit'>Eliminar Cuenta</Button>
                    </div>

                </Form>

            </div>

            {mostrarAlertaEliminacionUsuario && 
                <Alerta 
                    texto="¿Está seguro de Eliminar su Usuario?" 
                    nombreBoton="Eliminar" 
                    onConfirm={eliminarUsuario}
                />
            }

            {mostrarAlertaCuentaEliminada && 
                <Confirm
                    texto="Su Usuario ha sido eliminado correctamente" 
                    onConfirm={finalizacionEliminacionUsuario}
                />
            }

            {mostrarErrorVencimientoToken &&
                <Error texto={"Su sesión ha expirado"} 
                onConfirm={handleSesionExpirada}/>
            }

            {mostrarErrorUsuarioNoEncontrado &&
                <Error 
                    texto={"El usuario que desea eliminar no se ha encontrado"} 
                    onConfirm={() => {setMostrarErrorUsuarioNoEncontrado(false)}}
                />
            }

            {mostrarErrorPerfilNoEncontrado &&
                <Error 
                    texto={"El perfil que desea eliminar no se ha encontrado"} 
                    onConfirm={() => {setMostrarErrorPerfilNoEncontrado(false)}}
                />
            }

            {mostrarErrorHistorialNoEncontrado &&
                <Error 
                    texto={"Hubo un error con el historial de sus estados"} 
                    onConfirm={() => {setMostrarErrorHistorialNoEncontrado(false)}}
                />
            }

            {mostrarErrorEliminacionUsuario &&
                <Error 
                    texto={"Hubo un error inesperado al eliminar su usuario, intente nuevamente más tarde"} 
                    onConfirm={() => {setMostrarErrorEliminacionUsuario(false)}}
                />
            }
        </>
    );
}

export default EliminarCuenta;