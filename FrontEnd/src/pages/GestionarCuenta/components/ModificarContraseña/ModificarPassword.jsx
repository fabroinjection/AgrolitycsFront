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
import { useForm } from 'react-hook-form';
import { useState } from 'react';

// import utilities
import { toast } from 'react-toastify';

// import services
import { modificarPasswordService } from '../../services/gestionarCuentaService';

function ModificarPassword({ accionCancelar, accionConfirmar }){

    // variables para el form
    const [ contraseñaActual, setContraseñaActual ] = useState("");
    const [ contraseñaNueva, setContraseñaNueva ] = useState("");
    const [ contraseñaRepetida, setContraseñaRepetida ] = useState("");

    // variables para validar el form
    const [ contraseñaActualVacia, setContraseñaActualVacia ] = useState(false);
    const [ contraseñaNuevaVacia, setContraseñaNuevaVacia ] = useState(false);
    const [ contraseñaRepetidaVacia, setContraseñaRepetidaVacia ] = useState(false);
    const [ contraseñaInsegura, setContraseñaInsegura ] = useState(false);
    const [ contraseñasDistintas, setContraseñasDistintas ] = useState(false);

    // manejo de errores del back
    const [ mostrarErrorAutenticacion, setMostrarErrorAutenticacion ] = useState(false);
    const [ mostrarErrorUsuarioNoEncontrado, setMostrarErrorUsuarioNoEncontrado ] = useState(false);
    const [ mostrarErrorModificacion, setMostrarErrorModificacion ] = useState(false);
    const [ errorPassword, setErrorPassword ] = useState(false);

    const [ mostrarAlertaModificacionPassword, setMostrarAlertaModificacionPassword ] = useState(false);
    const [ mostrarAlertaContraseñaModificada, setMostrarAlertaContraseñaModifcada ] = useState(false);

    //regex para validaciones de contraseña segura
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /\d/;
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

    // funcion toast para alerta contraseña actual vacía
    const mostrarErrorContraseñaActualVacia = () => {
        toast.error('Se debe ingresar la contraseña actual', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta contraseña nueva vacía
    const mostrarErrorContraseñaNuevaVacia = () => {
        toast.error('Se debe ingresar una contraseña nueva', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta contraseña repetida vacía
    const mostrarErrorContraseñaRepetidaVacia = () => {
        toast.error('Se debe repetir la contraseña nueva', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta contraseñas distintas
    const mostrarErrorContraseñasDistintas = () => {
        toast.error('Las contraseñas ingresadas no son iguales', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }
    
    // funcion toast para alerta contraseña insegura
    const mostrarErrorContraseñaInsegura = () => {
        toast.error('La contraseña debe tener al menos 8 caracteres, mayúsculas, minúsculas, números' +
        ' y caracteres especiales.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta contraseña incorrecta
    const mostrarErrorContraseña = () => {
        toast.error('La contraseña ingresada no es válida', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const { handleSubmit, reset } = useForm();

    const validarForm = () => {
        const esOchoCaracteres = contraseñaNueva.length >= 8;
        const siTieneMayuscula = uppercaseRegex.test(contraseñaNueva);
        const siTieneMinuscula = lowercaseRegex.test(contraseñaNueva);
        const siTieneNumero = numberRegex.test(contraseñaNueva);
        const siTieneCarEspecial = specialCharRegex.test(contraseñaNueva);

        if (contraseñaActual === "") {
            setContraseñaActualVacia(true);
            mostrarErrorContraseñaActualVacia();
            return false;
        } else {
            setContraseñaActualVacia(false);
        }

        if (contraseñaNueva === "") {
            setContraseñaNuevaVacia(true);
            mostrarErrorContraseñaNuevaVacia();
            return false;
        } else {
            setContraseñaNuevaVacia(false);
        }

        if (contraseñaRepetida === "") {
            setContraseñaRepetidaVacia(true);
            mostrarErrorContraseñaRepetidaVacia();
            return false;            
        } else {
            setContraseñaRepetidaVacia(false);
        }

        if (!esOchoCaracteres || !siTieneMayuscula || !siTieneMinuscula || !siTieneNumero || !siTieneCarEspecial) {
            setContraseñaInsegura(true);
            mostrarErrorContraseñaInsegura();
            return false
        } else {
            setContraseñaInsegura(false);
        }
        
        if (contraseñaNueva !== contraseñaRepetida) {
            setContraseñasDistintas(true);
            mostrarErrorContraseñasDistintas();
            return false;
        } else {
            setContraseñasDistintas(false);
        }

        return true;
    }
    
    const modificarContraseña = async (confirm) => {
        if (confirm) {
            const validacion = validarForm();
            if (validacion) {
                setMostrarAlertaModificacionPassword(false);
                try {
                    await modificarPasswordService(contraseñaActual, contraseñaNueva);
                    setMostrarAlertaContraseñaModifcada(true);
                } catch (error) {
                    if (error.response) {
                        if (error.response.status === 401) {
                            setMostrarErrorAutenticacion(true);
                        }
                        else if (error.response.status === 403) {
                            setErrorPassword(true);
                            mostrarErrorContraseña();
                        }
                        else if (error.response.status === 404) {
                            setMostrarErrorUsuarioNoEncontrado(true);
                        }
                        else {
                            setMostrarErrorModificacion(true);
                        }
                    }
                }
            }
        } else {
            setMostrarAlertaModificacionPassword(false);
        }
        
    }

    const finalizacionModificarContraseña = (confirm) => {
        if (confirm) {
            reset();
            setMostrarAlertaContraseñaModifcada(false);
            accionConfirmar();
        }
    }

    const handleChangeContraseñaActual = (e) => {
        const { value } = e.target;
        setContraseñaActual(value);
    }

    const handleChangeContraseñaNueva = (e) => {
        const { value } = e.target;
        setContraseñaNueva(value);
    }

    const handleChangeContraseñaRepetida = (e) => {
        const { value } = e.target;
        setContraseñaRepetida(value);
    }

    const solicitarConfirmacion = () => {
        setMostrarAlertaModificacionPassword(true);
    }

    return (
        <>
            <NavbarBootstrap/>
            <div className="contenedorPaginaScroll">
                <div className='contenedorGestionarCuenta'>
                    <div>
                        <span className='tituloForm'>Modificar Contraseña</span>
                    </div>

                    <div className='seccionGestionUsuario'>
                        <span className='titulo-contenedor-gestion-cuenta'>Contraseña</span>
                        <Form className='formularioGestionCuenta' onSubmit={handleSubmit(solicitarConfirmacion)}>
                            <Form.Group>
                                <Form.Label className={(contraseñaActualVacia || errorPassword) ? 'labelErrorFormulario' : ''}>Contraseña actual</Form.Label>
                                <Form.Control 
                                    type='password'
                                    value={contraseñaActual}
                                    onChange={handleChangeContraseñaActual}
                                    />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className={(contraseñaNuevaVacia || contraseñaInsegura || contraseñasDistintas) ? 'labelErrorFormulario' : ''}>Nueva contraseña</Form.Label>
                                <Form.Control 
                                    type='password'
                                    value={contraseñaNueva}
                                    onChange={handleChangeContraseñaNueva}
                                    />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label className={(contraseñaRepetidaVacia || contraseñaInsegura || contraseñasDistintas) ? 'labelErrorFormulario' : ''}>Confirmar contraseña</Form.Label>
                                <Form.Control 
                                    type='password'
                                    value={contraseñaRepetida}
                                    onChange={handleChangeContraseñaRepetida}
                                    />
                            </Form.Group>

                            <div className='contenedorBotonesGestionCuenta'>
                                <Button variant='outline-primary' className='botonGestionUsuario' type='submit'>Modificar Contraseña</Button>
                                <Button variant='outline-danger' className='botonGestionUsuario' onClick={() => accionCancelar()}>Cancelar</Button>
                            </div>
                        </Form>
                    </div>

                </div>
            </div>

            {mostrarAlertaModificacionPassword && 
                <Alerta 
                    texto="¿Está seguro de Modificar su Contraseña?" 
                    nombreBoton="Modificar" 
                    onConfirm={modificarContraseña}
                />
            }

            {mostrarAlertaContraseñaModificada && 
                <Confirm
                    texto="Su contraseña ha sido modificada correctamente" 
                    onConfirm={finalizacionModificarContraseña}
                />
            }

            {mostrarErrorAutenticacion &&
                <Error 
                    texto={"Usted no se encuentra autorizado para modificar este usuario."} 
                    onConfirm={() => setMostrarErrorAutenticacion(false)}
                />
            }

            {mostrarErrorUsuarioNoEncontrado &&
                <Error 
                    texto={"El usuario al que desea modificar la contraseña no existe."} 
                    onConfirm={() => setMostrarErrorUsuarioNoEncontrado(false)}
                />
            }

            {mostrarErrorModificacion &&
                <Error 
                    texto={"Ocurrió un error modificando el usuario."} 
                    onConfirm={() => setMostrarErrorModificacion(false)}
                />
            }
        </>
    );
}

export default ModificarPassword;