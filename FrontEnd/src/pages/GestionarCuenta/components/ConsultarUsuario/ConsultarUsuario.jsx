import '../GestionarCuenta/GestionarCuenta.css';
import '../../../../components/Estilos/estilosFormulario.css';

// import componentes
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import Error from '../../../../components/Modals/Error/Error';
import SpinnerAgrolitcys from '../../../../components/Spinner/SpinnerAgrolitycs';

// import assets
import iconoEditar from '../../../../assets/iconoEditar.png';

// import hooks
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// import services
import { consultarUsuarioService } from '../../services/gestionarCuentaService';
import { renewToken } from '../../../../services/token.service';

// import utilities
import Cookies from 'js-cookie';


function ConsultarUsuario({ habilitarEdicion, setEmail }){
    
    const { handleSubmit } = useForm();

    let navigate = useNavigate();

    //variables para el form
    const [ usuario, setUsuario ] = useState();

    // manejo de errores con modals
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);
    const [ mostrarErrorUsuarioNoEncontrado, setMostrarErrorUsuarioNoEncontrado ] = useState(false);
    const [ mostrarErrorPerfilNoEncontrado, setMostrarErrorPerfilNoEncontrado ] = useState(false);
    const [ mostrarErrorLocalidadNoEncontrada, setMostrarErrorLocalidadNoEncontrada ] = useState(false);
    const [ mostrarErrorProvinciaNoEncontrada, setMostrarErrorProvinciaNoEncontrada ] = useState(false);
    const [ mostrarErrorTipoPerfilNoEncontrado, setMostrarErrorTipoPerfilNoEncontrado ] = useState(false);
    const [ mostrarErrorConsultaUsuario, setMostrarErrorConsultaUsuario ] = useState(false);


    const habilitarEditar = () => {
        habilitarEdicion();
    }

    useEffect(() => {
        const fetchConsultarUsuario = async () => {
            try {
                const { data } = await consultarUsuarioService(Cookies.get('email'));
                setUsuario(data);
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        try {
                            await renewToken();
                            const { data } = await consultarUsuarioService(Cookies.get('email'));
                            setUsuario(data);
                        } catch (error) {
                          if(error.response && error.response.status === 401){
                            setMostrarErrorVencimientoToken(true);
                          }
                          else if(error.response.status === 402){
                            setMostrarErrorLocalidadNoEncontrada(true);
                          }
                          else if(error.response.status === 403){
                            setMostrarErrorPerfilNoEncontrado(true);
                          }
                          else if(error.response.status === 404){
                            setMostrarErrorUsuarioNoEncontrado(true);
                          }
                          else if(error.response.status === 405){
                            setMostrarErrorProvinciaNoEncontrada(true);
                          }
                          else if(error.response.status === 406){
                            setMostrarErrorTipoPerfilNoEncontrado(true);
                          }
                          else{
                            setMostrarErrorConsultaUsuario(true);
                          }
                        }
                    }
                    else if(error.response.status === 402){
                        setMostrarErrorLocalidadNoEncontrada(true);
                      }
                    else if(error.response.status === 403){
                        setMostrarErrorPerfilNoEncontrado(true);
                    }
                    else if(error.response.status === 404){
                        setMostrarErrorUsuarioNoEncontrado(true);
                    }
                    else if(error.response.status === 405){
                        setMostrarErrorProvinciaNoEncontrada(true);
                    }
                    else if(error.response.status === 406){
                        setMostrarErrorPerfilNoEncontrado(true);
                    }
                    else{
                        setMostrarErrorConsultaUsuario(true);
                    }
                }
            }
  
        }
        fetchConsultarUsuario();
    }, [])

    useEffect(() => {
        if (usuario) {
          setEmail(usuario.email);
        }
      }, [usuario, setEmail]);

    const handleSesionExpirada = () =>{
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
    }

    if (usuario) {
        return(
            <>
                {/* Formulario para consultar usuario */}
                <Form className='formularioGestionCuenta' onSubmit={handleSubmit(habilitarEditar)}>
                    <Form.Group>
                        <Form.Label className='subtitulo-contenedor-gestion-cuenta'>Nombres</Form.Label>
                        <Form.Control 
                            type='text' 
                            disabled
                            value={usuario.nombre}
                            className='inputGestionCuenta'
                            />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className='subtitulo-contenedor-gestion-cuenta'>Apellidos</Form.Label>
                        <Form.Control 
                            type='text'
                            disabled
                            value={usuario.apellido}
                            className='inputGestionCuenta'
                            />
                    </Form.Group>
                    <Form.Group>
                        <div className="contenedorProvLoc">
                            <Form.Label className='subtitulo-contenedor-gestion-cuenta'>Provincia</Form.Label>
                            <span className='provinciaUsuario'>{usuario.provincia}</span>
                        </div>
                    </Form.Group>
                    <Form.Group>
                        <div className="contenedorProvLoc">
                            <Form.Label className='subtitulo-contenedor-gestion-cuenta'>Localidad</Form.Label>
                            <span className='provinciaUsuario'>{usuario.localidad}</span>
                        </div>
                    </Form.Group>

                    <div className='seccion-boton-gestion'>
                        <Button variant='secondary' className='botonConfirmacionFormulario' type='submit'>
                            Editar
                        </Button>
                    </div>
                </Form>

                    
            </>
        );
    } else {
        return(
            <>
                <SpinnerAgrolitcys/>
                {
                    mostrarErrorVencimientoToken &&
                    <Error texto={"Su sesión ha expirado"} 
                    onConfirm={handleSesionExpirada}/>
                }
                {
                    mostrarErrorLocalidadNoEncontrada &&
                    <Error texto={"No se ha encontrado la localidad a la que perteneces"} 
                    onConfirm={() => setMostrarErrorLocalidadNoEncontrada(false)}/>
                }
                {
                    mostrarErrorPerfilNoEncontrado &&
                    <Error texto={"No se han encontrado tus datos personales"} 
                    onConfirm={() => setMostrarErrorPerfilNoEncontrado(false)}/>
                }
                {
                    mostrarErrorProvinciaNoEncontrada &&
                    <Error texto={"No se ha encontrado la provincia a la que perteneces"} 
                    onConfirm={() => setMostrarErrorProvinciaNoEncontrada(false)}/>
                }
                {
                    mostrarErrorUsuarioNoEncontrado &&
                    <Error texto={"No se han encontrado tus datos de usuario"} 
                    onConfirm={() => setMostrarErrorUsuarioNoEncontrado(false)}/>
                }
                {
                    mostrarErrorTipoPerfilNoEncontrado &&
                    <Error texto={"No se ha encontrado tu rol como usuario"} 
                    onConfirm={() => setMostrarErrorTipoPerfilNoEncontrado(false)}/>
                }
                {
                    mostrarErrorConsultaUsuario &&
                    <Error texto={"Ha ocurrido un error consultando tu usuario"} 
                    onConfirm={() => setMostrarErrorConsultaUsuario(false)}/>
                }
            </>
            
        )
    }
   
}

export default ConsultarUsuario;