// import assets
import '../GestionarCuenta/GestionarCuenta.css';
import '../../../../components/Estilos/estilosFormulario.css';
import iconoVerificacionNegro from '../../../../assets/iconoVerificacionNegro.png';
import iconoCerrar from '../../../../assets/iconoCerrar.png';

// import componentes
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import Select from 'react-select';
import Error from '../../../../components/Modals/Error/Error';
import Confirm from '../../../../components/Modals/Confirm/Confirm';
import SpinnerAgrolitycs from '../../../../components/Spinner/SpinnerAgrolitycs';

// import hooks
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// import services
import { renewToken } from '../../../../services/token.service';
import { consultarUsuarioService, modificarUsuarioService } from '../../services/gestionarCuentaService';
import { provinciasService } from '../../../../services/provincias.service';
import { localidadesService } from '../../../../services/localidades.service';

// import utilities
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

function ModificarUsuario({ deshabilitarEdicion, setEmail }) {

    const { handleSubmit, reset } = useForm();

    let navigate = useNavigate();

    const [ usuario, setUsuario ] = useState();
    const [ provincias, setProvincias ] = useState([]);
    const [ localidades, setLocalidades ] = useState([]);
    
    // variables para el form
    const [ nombre, setNombre ] = useState("");
    const [ apellido, setApellido ] = useState("");
    const [ provincia, setProvincia ] = useState();
    const [ localidad, setLocalidad ] = useState();

    // variables para validacion del form
    const [ nombreVacio, setNombreVacio ] = useState(false);
    const [ apellidoVacio, setApellidoVacio ] = useState(false);
    const [ provinciaVacio, setProvinciaVacio ] = useState(false);
    const [ localidadVacio, setLocalidadVacio ] = useState(false);
    const [ localidadNoValida, setLocalidadNoValida ] = useState(false);
    
    // manejo de errores con modals
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);
    const [ mostrarErrorUsuarioNoEncontrado, setMostrarErrorUsuarioNoEncontrado ] = useState(false);
    const [ mostrarErrorPerfilNoEncontrado, setMostrarErrorPerfilNoEncontrado ] = useState(false);
    const [ mostrarErrorLocalidadNoEncontrada, setMostrarErrorLocalidadNoEncontrada ] = useState(false);
    const [ mostrarErrorProvinciaNoEncontrada, setMostrarErrorProvinciaNoEncontrada ] = useState(false);
    const [ mostrarErrorTipoPerfilNoEncontrado, setMostrarErrorTipoPerfilNoEncontrado ] = useState(false);
    const [ mostrarErrorConsultaUsuario, setMostrarErrorConsultaUsuario ] = useState(false);
    const [ mostrarErrorModificarUsuario, setMostrarErrorModificarUsuario ] = useState(false);

    // modal modificacion correcta
    const [ usuarioModificadoCorrectamente, setUsuarioModificadoCorrectamente ] = useState(false);

    // funcion toast para alerta nombre vacío
    const mostrarErrorNombre = () => {
        toast.error('Se debe ingresar un nombre', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }); 
    }

    // funcion toast para alerta apellido vacío
    const mostrarErrorApellido = () => {
        toast.error('Se debe ingresar un apellido', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }); 
    }

    // funcion toast para alerta provincia vacía
    const mostrarErrorProvinciaVacia = () => {
        toast.error('Se debe ingresar una provincia', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }); 
    }

    // funcion toast para alerta localidad vacía
    const mostrarErrorLocalidadVacia = () => {
        toast.error('Se debe ingresar una localidad', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }); 
    }

    // funcion toast para alerta localidad no válida
    const mostrarErrorLocalidadNoValida = () => {
        toast.error('Se debe ingresar una localidad válida para la provincia ingresada', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }); 
    }
    
    const cancelar = () => {
        reset();
        deshabilitarEdicion();
    }

    const modificarUsuario = async () => {
        const validacion = validarForm();
        if (validacion) {
            const usuarioModificado = {
                nombre: nombre,
                apellido: apellido,
                tipo_perfil: usuario.tipo_perfil_id,
                localidad_id: localidad.value
            }
            
            try {
                await modificarUsuarioService(usuario.email, usuarioModificado);
                

                //Calculo fecha y hora para la duración de 7 dias de la Cookie
                let currentDate = new Date();
                let expirationDate = new Date(currentDate.getTime() + (7 * 24 * 60 * 60 * 1000));
                Cookies.set('username', nombre + ' ' + apellido, {expires: expirationDate});

                setUsuarioModificadoCorrectamente(true);
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
                            setMostrarErrorModificarUsuario(true);
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
                        setMostrarErrorModificarUsuario(true);
                    }
                }
            }
        }
    }

    const handleSesionExpirada = () =>{
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
    }

    useEffect(() => {
        const fetchProvincias = async () => {
            try {
                const { data } = await provinciasService();
                setProvincias(data);
            } catch (error) {
                if(error.response && error.response.status === 401){
                    try {
                      renewToken();
                      const { data } = await provinciasService();
                      setProvincias(data);
                    } catch (error) {
                      if(error.response && error.response.status === 401){
                        setMostrarErrorVencimientoToken(true);
                      }
                    }
                  }
            }   
        }
        fetchProvincias();
    }, [])

    useEffect(() => {
        if (usuario) {
          setEmail(usuario.email);
        }
      }, [usuario, setEmail]);

    useEffect(() => {
        if(provincia){
            const fetchLocalidades = async () => {
                try {
                    const { data } = await localidadesService(provincia.value);
                    setLocalidades(data);
                } catch (error) {
                    if(error.response && error.response.status === 401){
                        try {
                          renewToken();
                          const { data } = await localidadesService(provincia.value);
                          setLocalidades(data);
                        } catch (error) {
                          if(error.response && error.response.status === 401){
                            setMostrarErrorVencimientoToken(true);
                          }
                        }
                      }
                }   
            }
            fetchLocalidades();
        }
    }, [provincia])

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
            setNombre(usuario.nombre);
            setApellido(usuario.apellido);
            setProvincia({label: usuario.provincia, value: usuario.provincia_id});
            setLocalidad({label: usuario.localidad, value: usuario.localidad_id, data: usuario.provincia_id});
        }
    }, [usuario])

    const handleChangeNombre = (e) => {
        const { value } = e.target;

        // Verificar si el valor contiene solo letras y espacios, incluyendo caracteres acentuados
        if (/^[A-Za-záéíóúÁÉÍÓÚñÑçÇ\s]+$/.test(value) || value === "") {
          setNombre(value);
        }
      }
      
    const handleChangeApellido = (e) => {
        const { value } = e.target;

        // Verificar si el valor contiene solo letras y espacios, incluyendo caracteres acentuados
        if (/^[A-Za-záéíóúÁÉÍÓÚñÑçÇ\s]+$/.test(value) || value === "") {
            setApellido(value);
        }
    }

    const handleChangeProvincia = (opcion) => {
        setProvincia(opcion)
    }

    const handleChangeLocalidad = (opcion) => {
        setLocalidad(opcion)
    }

    const validarForm = () => {
        if (nombre === "") {
            setNombreVacio(true);
            mostrarErrorNombre();
            return false;
        } else {
            setNombreVacio(false);
        }

        if (apellido === "") {
            setApellidoVacio(true);
            mostrarErrorApellido();
            return false;
        } else {
            setApellidoVacio(false);
        }

        if (provincia) {
            setProvinciaVacio(false);
        } else {
            setProvinciaVacio(true);
            mostrarErrorProvinciaVacia();
            return false;
        }

        if (localidad) {
            setLocalidadVacio(false);
        } else {
            setLocalidadVacio(true);
            mostrarErrorLocalidadVacia();
            return false;
        }

        if (localidad.data !== provincia.value) {
            setLocalidadNoValida(true);
            mostrarErrorLocalidadNoValida();
            return false;
        } else {
            setLocalidadNoValida(false);
        }

        return true;
    }

    const handleAlertaModificacionCorrecta = (e) => {
        if (e) {
            setUsuarioModificadoCorrectamente(false);
            reset();
            deshabilitarEdicion();
        }
    }

    if (usuario) {
        return(
            <>
                    {/* Formulario para modificar usuario */}
                    <Form className='formularioGestionCuenta' onSubmit={handleSubmit(modificarUsuario)}>
                        <Form.Group>
                            <Form.Label className={nombreVacio ? 'labelErrorFormulario' : ''}>Nombres</Form.Label>
                            <Form.Control 
                                type='text' 
                                value={nombre}
                                onChange={handleChangeNombre}
                                maxLength={30}
                                />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className={apellidoVacio ? 'labelErrorFormulario' : ''}>Apellidos</Form.Label>
                            <Form.Control 
                                type='text'
                                value={apellido}
                                onChange={handleChangeApellido}
                                maxLength={30}
                                />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className={provinciaVacio ? 'labelErrorFormulario' : ''}>Provincia</Form.Label>
                            <Select 
                                value={provincia}
                                onChange={handleChangeProvincia}
                                options={
                                    provincias.map(prov => ({label: prov.nombre, value: prov.id}))
                                }
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className={(localidadVacio || localidadNoValida) ? 'labelErrorFormulario' : ''}>Localidad</Form.Label>
                            <Select
                                value={localidad}
                                onChange={handleChangeLocalidad}
                                options={
                                    localidades.map(loc => ({label: loc.nombre, value: loc.id, data: loc.provincia_id}))
                                }
                            />
                        </Form.Group>
    
                        <div className='seccion-boton-gestion botones-separados'>
                            <Button variant='secondary' className='botonCancelarFormulario' onClick={cancelar}>
                                Cerrar
                            </Button>
                            <Button variant='secondary' className='botonConfirmacionFormulario' type='submit'>
                                Guardar
                            </Button>
                        </div>
                    </Form>

                {
                    mostrarErrorVencimientoToken &&
                    <Error texto={"Su sesión ha expirado"} 
                    onConfirm={handleSesionExpirada}/>
                }
                {
                    mostrarErrorLocalidadNoEncontrada &&
                    <Error texto={"No se ha encontrado la localidad ingresada"} 
                    onConfirm={() => setMostrarErrorLocalidadNoEncontrada(false)}/>
                }
                {
                    mostrarErrorPerfilNoEncontrado &&
                    <Error texto={"No se han encontrado tus datos personales"} 
                    onConfirm={() => setMostrarErrorPerfilNoEncontrado(false)}/>
                }
                {
                    mostrarErrorProvinciaNoEncontrada &&
                    <Error texto={"No se ha encontrado la provincia ingresada"} 
                    onConfirm={() => setMostrarErrorProvinciaNoEncontrada(false)}/>
                }
                {
                    mostrarErrorUsuarioNoEncontrado &&
                    <Error texto={"No se han encontrado tus datos de usuario"} 
                    onConfirm={() => setMostrarErrorUsuarioNoEncontrado(false)}/>
                }
                {
                    mostrarErrorTipoPerfilNoEncontrado &&
                    <Error texto={"No se ha encontrado el rol seleccionado"} 
                    onConfirm={() => setMostrarErrorTipoPerfilNoEncontrado(false)}/>
                }
                {
                    mostrarErrorModificarUsuario &&
                    <Error texto={"Ha ocurrido un error modificando tu usuario"} 
                    onConfirm={() => setMostrarErrorModificarUsuario(false)}/>
                }
                {
                    usuarioModificadoCorrectamente &&
                    <Confirm texto={"El Usuario ha sido modificado correctamente"}
                    onConfirm={handleAlertaModificacionCorrecta}/>
                }

            </>
        );
    } else {
        return(
            <>
                <SpinnerAgrolitycs/>
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

export default ModificarUsuario;