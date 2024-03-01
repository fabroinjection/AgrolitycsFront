//importar estilos
import './GestionarCuenta.css';
import '../../../../components/Estilos/estilosFormulario.css';

// import componentes
import { Button } from "react-bootstrap";
import NavbarBootstrap from '../../../../components/Navbar/Navbar.components';
import ConsultarUsuario from '../ConsultarUsuario/ConsultarUsuario';
import ModificarUsuario from '../ModificarUsuario/ModificarUsuario';
import DesactivarCuenta from '../DesactivarCuenta/DesactivarCuenta';
import ModificarPassword from '../ModificarContraseña/ModificarPassword';
import EliminarCuenta from '../EliminarCuenta/EliminarCuenta';
import NoLogueado from '../../../../components/Modals/NoLogueado/NoLogueado';
import SpinnerAgrolitycs from '../../../../components/Spinner/SpinnerAgrolitycs';

// import utilities
import Cookies from 'js-cookie';

// import hooks
import { useState } from 'react';

function GestionarCuenta(){

    const [ estaEnEdicion, setEstaEnEdicion ] = useState(false);
    const [ modo, setModo ] = useState();

    const [ email, setEmail ] = useState("Cargando...");
     
    if(window.localStorage.getItem('loggedAgroUser') && Cookies.get()){
        if (modo === "Desactivar Cuenta") {
            return(
                <DesactivarCuenta accionCancelar={setModo} accionConfirmar={setModo}/>
            )
        }
        else if (modo === "Modificar Contraseña") {
            return(
                <ModificarPassword accionCancelar={setModo} accionConfirmar={setModo}/>
            )
        }
        else if (modo === "Eliminar Cuenta") {
            return(
                <EliminarCuenta accionCancelar={setModo} accionConfirmar={setModo}/>
            )
        }
        else {
            return(
                <>
                <div className='contenedorPaginaScroll'>
        
                    <NavbarBootstrap/>
        
                    <div className="contenedorGestionarCuenta">
                        <div>
                            <span className='tituloForm'>Gestiona tu cuenta</span>
                        </div>
        
        
                        <div className='seccionGestionUsuario'>
                            <span className='titulo-contenedor-gestion-cuenta'>Acerca de ti</span>
                            {estaEnEdicion ? 
                                <ModificarUsuario
                                    deshabilitarEdicion={() => setEstaEnEdicion(false)}
                                    setEmail={setEmail}
                                />
                                : 
                                <ConsultarUsuario
                                    habilitarEdicion={() => setEstaEnEdicion(true)}
                                    setEmail={setEmail}    
                                />   
                            }
                        </div>
        
                        <div className='seccionGestionUsuario'>
                            <span className='titulo-contenedor-gestion-cuenta'>Contacto</span>
                            <div className='contenedorContacto'>
                                <span className='subtitulo-contenedor-gestion-cuenta'>Dirección de correo electrónico</span>
                                <span className='correoElectronico'>{email}</span>
                            </div>
                        </div>
        
        
                        <div className='contenedorBotonesGestionCuenta'>
                            <Button variant='outline-primary' className='botonGestionUsuario' onClick={() => setModo("Modificar Contraseña")}>Modificar Contraseña</Button>
                            <div className='contenedorBotonesDesactivacion'>
                            <Button variant='outline-secondary' className='botonGestionUsuario' onClick={() => setModo("Desactivar Cuenta")}>Desactivar Cuenta</Button>
                            <Button variant='outline-danger' className='botonGestionUsuario' onClick={() => setModo("Eliminar Cuenta")}>Eliminar Cuenta</Button>
                            </div>
        
                        </div>
        
                    </div>
                </div>
                </>
            );
        }
    }
    else{
        return(<NoLogueado/>)
    }

    
}

export default GestionarCuenta;