//Estilos
import './LaboratorioAMC.css';
import '../../../../components/Estilos/estilosFormulario.css';

// import componentes
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import Select from 'react-select';
import Error from '../../../../components/Modals/Error/Error';
import Confirm from '../../../../components/Modals/Confirm/Confirm';

// import hooks
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// import services
import { provinciasService } from '../../../../services/provincias.service';
import { localidadesService } from '../../../../services/localidades.service';
import { renewToken } from '../../../../services/token.service';
import { registrarLaboratorioService, consultarLaboratorioService, modificarLaboratorioService } from '../../services/laboratorio.service';

// import utilities
import { toast } from 'react-toastify';

function LaboratorioAMC({ accionCancelar, accionConfirmar, modo, laboratorio = undefined }){

    const { handleSubmit, reset } = useForm();
    let navigate = useNavigate();

    //variables del formulario registrar
    const [ nombre, setNombre ] = useState("");
    const [ calle, setCalle ] = useState("");
    const [ altura, setAltura ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ provincia, setProvincia ] = useState();
    const [ localidad, setLocalidad ] = useState();
    const [ telefono, setTelefono ] = useState("");

    //variable para manejar el modo del componente
    const [ modoComponente, setModoComponente ] = useState(modo);

    //variables validacion
    const [ nombreVacio, setNombreVacio ] = useState(false);
    const [ calleVacio, setCalleVacio ] = useState(false);
    const [ alturaVacio, setAlturaVacio ] = useState(false);
    const [ provinciaVacio, setProvinciaVacio ] = useState(false);
    const [ localidadVacio, setLocalidadVacio ] = useState(false);
    const [ localidadIncorrecta, setLocalidadIncorrecta ] = useState(false);
    const [ emailNoValido, setEmailNoValido ] = useState(false);
    const [ telefonoNoValido, setTelefonoNoValido ] = useState(false);

    const [ provincias, setProvincias ] = useState([]);
    const [ localidades, setLocalidades ] = useState([]);

    // variable para guardar el laboratorio
    const [ laboratorioConsulta, setLaboratorioConsulta ] = useState();

    // manejo de errores con modals vencimiento token
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);

    // manejo de alertas de aviso de transacciones correctas
    const [ mostrarAlertaRegistroCorrecto, setMostrarAlertaRegistroCorrecto ] = useState(false);
    const [ mostrarAlertaModificacionCorrecta, setMostrarAlertaModificacionCorrecta ] = useState(false);


    // funcion toast para alerta nombre vacío
    const mostrarErrorNombreVacio = () => {
        toast.error('Se debe ingresar un nombre', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta calle vacío
    const mostrarErrorCalleVacio = () => {
        toast.error('Se debe ingresar una calle', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta altura vacío
    const mostrarErrorAlturaVacio = () => {
        toast.error('Se debe ingresar una altura', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta provincia vacío
    const mostrarErrorProvinciaVacio = () => {
        toast.error('Se debe ingresar una provincia', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta localidad vacío
    const mostrarErrorLocalidadVacio = () => {
        toast.error('Se debe ingresar una localidad', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta localidad incorrecta
    const mostrarErrorLocalidadIncorrecta = () => {
        toast.error('Se debe ingresar una localidad válida para la provincia seleccionada', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta email no válido
    const mostrarErrorEmailNoValido = () => {
        toast.error('Se debe ingresar un email válido', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta teléfono no válido
    const mostrarErrorTelefonoNoValido = () => {
        toast.error('Si ingresa un teléfono, el mismo debe contener 10 caracteres', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta error inesperado registro
    const mostrarErrorRegistroToast = () => {
        toast.error('Ha ocurrido un error registrando su laboratorio, intente nuevamente más tarde', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta error inesperado modificación
    const mostrarErrorModificacionToast = () => {
        toast.error('Ha ocurrido un error modificando su laboratorio, intente nuevamente más tarde', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta error usuario no encontrado
    const mostrarErrorUsuarioNoEncontrado = () => {
        toast.error('El usuario no se ha encontrado', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta error usuario no encontrado
    const mostrarErrorLaboratorioNoEncontrado = () => {
        toast.error('El laboratorio no se ha encontrado', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta error laboratorio existente
    const mostrarErrorLaboratorioExistente = () => {
        toast.error('El laboratorio que está ingresando ya existe entre sus laboratorios registrados', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const handleCancelar = () => {
        reset();
        accionCancelar();
    }

    const handleCancelarModificacion = () => {
        setModoComponente("Consultar");
    }

    const validarEmail = (texto) => {
        const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        return regex.test(texto);
    }

    const validarForm = () => {
        if (nombre === ""){
            setNombreVacio(true);
            mostrarErrorNombreVacio();
            return false;
        } else{
            setNombreVacio(false);
        }
        if (calle === "") {
            setCalleVacio(true);
            mostrarErrorCalleVacio();
            return false;
        } else {
            setCalleVacio(false);
        }
        if (altura === "") {
            setAlturaVacio(true);
            mostrarErrorAlturaVacio();
            return false;
        } else {
            setAlturaVacio(false);
        }
        if (!provincia) {
            setProvinciaVacio(true);
            mostrarErrorProvinciaVacio();
            return false;
        } else {
            setProvinciaVacio(false);
        }

        if (!localidad){
            setLocalidadVacio(true);
            mostrarErrorLocalidadVacio();
            return false;
        } else {
            if (localidad.data !== provincia.value) {
                setLocalidadVacio(false);
                setLocalidadIncorrecta(true);
                mostrarErrorLocalidadIncorrecta();
                return false;
            } else {
                setLocalidadIncorrecta(false);
                setLocalidadVacio(false);
            }
        }
        
        if (email !== "") {
            if (validarEmail(email)) {
                setEmailNoValido(false);
            } else {
                setEmailNoValido(true);
                mostrarErrorEmailNoValido();
                return false;
            }
        } else {
            setEmailNoValido(false);
        }

        if (telefono !== "") {
            if (telefono.length !== 10) {
                setTelefonoNoValido(true);
                mostrarErrorTelefonoNoValido();
                return false;
            } else {
                setTelefonoNoValido(false);
            }
        } else {
            setTelefonoNoValido(false);
        }

        return true;
    }

    const registrarLaboratorio = async () => {
        const validacion = validarForm();
        if(validacion){
            const labo = {
                nombre: nombre,
                calle: calle,
                numero: parseInt(altura, 10),
                provincia_id: provincia.value,
                localidad_id: localidad.value
            }
            if(email !== ""){
                labo.email = email;
            }
            if (telefono !== "") {
                labo.numero_telefono = telefono;
            }

            try {
                await registrarLaboratorioService(labo);
                setMostrarAlertaRegistroCorrecto(true);
            } catch (error) {
                if(error.response && error.response.status === 401){
                    try {
                        await renewToken();
                        await registrarLaboratorioService(labo);
                        setMostrarAlertaRegistroCorrecto(true);
                    } catch (error) {
                      if(error.response && error.response.status === 401){
                        setMostrarErrorVencimientoToken(true);
                      }
                      else if(error.response.status === 403){
                        mostrarErrorLaboratorioExistente();
                      }
                      else if(error.response.status === 404){
                        mostrarErrorUsuarioNoEncontrado();
                      }
                      else{
                        mostrarErrorRegistroToast();
                      }
                    }
                }
                else if(error.response.status === 403){
                    mostrarErrorLaboratorioExistente();
                }
                else if(error.response.status === 404){
                    mostrarErrorUsuarioNoEncontrado();
                }
                else{
                    mostrarErrorRegistroToast();
                }
            }

            
        }
       
    }

    const handleSesionExpirada = () =>{
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
      }

    const handleChangeNombre = (e) => {
        const { value } = e.target;
        setNombre(value);
    }

    const handleChangeCalle = (e) => {
        const { value } = e.target;
        setCalle(value);
    }

    const handleChangeAltura = (e) => {
        const { value } = e.target;
        
        // Eliminar comas de la cadena de entrada
        const cleanedValue = value.replace(/,/g, '');
    
        // Comprobar si el valor es un número entero
        if (/^\d+$/.test(cleanedValue) || cleanedValue === "") {
            setAltura(cleanedValue);
        }
    }

    const handleChangeEmail = (e) => {
        const { value } = e.target;
        setEmail(value);
    }
    

    const handleChangeTelefono = (e) => {
        const { value } = e.target;
        
        // Expresión regular para validar un número de teléfono con signo "+" y otros caracteres
        const telefonoRegex = /^[\d\s+\-()]*$/;
        
        if (telefonoRegex.test(value) || value === "") {
            setTelefono(value);
        }
    }

    const handleChangeProvincia = (opcion) => {
        setProvincia(opcion);
    }

    const handleChangeLocalidad = (opcion) => {
        setLocalidad(opcion);
    }

    useEffect(() => {
        if (modoComponente === "Registrar" || modoComponente === "Modificar"){
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
        }
    }, [modoComponente])

    useEffect(() => {
        if((modoComponente === "Registrar" || modoComponente === "Modificar") && provincia){
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
    }, [modoComponente, provincia])

    const handleConfirmarRegistroLaboratorio = (e) => {
        if(e){
            setMostrarAlertaRegistroCorrecto(false);
            reset();
            accionConfirmar();
        }
    }

    const handleConfirmarModificacionLaboratorio = (e) => {
        if(e){
            setMostrarAlertaModificacionCorrecta(false);
            reset();
            accionConfirmar();
        }
    }

    const habilitarEdicionLaboratorio = () => {
        setModoComponente("Modificar");
    }

    useEffect(() => {
        if(modoComponente === "Consultar" && laboratorio){
            const fetchLaboratorio = async () => {
                try {
                    const { data } = await consultarLaboratorioService(laboratorio.id);
                    setLaboratorioConsulta(data);
                } catch (error) {
                    if(error.response && error.response.status === 401){
                        try {
                          renewToken();
                          const { data } = await consultarLaboratorioService(laboratorio.id);
                          setLaboratorioConsulta(data);
                        } catch (error) {
                          if(error.response && error.response.status === 401){
                            setMostrarErrorVencimientoToken(true);
                          }
                          else if (error.response.status === 404){
                            mostrarErrorLaboratorioNoEncontrado();
                          }
                        }
                    }
                    else if (error.response.status === 404){
                        mostrarErrorLaboratorioNoEncontrado();
                    }
                }   
            }
            fetchLaboratorio();
        }
    }, [modoComponente, laboratorio]);

    useEffect(() => {
        if(modoComponente === "Modificar"){
            setNombre(laboratorioConsulta.nombre);
            setCalle(laboratorioConsulta.calle);
            setAltura(String(laboratorioConsulta.numero));
            setProvincia({label: laboratorioConsulta.provincia_nombre, value: laboratorioConsulta.provincia_id});
            setLocalidad({label: laboratorioConsulta.localidad_nombre, value: laboratorioConsulta.localidad_id, data: laboratorioConsulta.provincia_id});
            if(laboratorioConsulta.email){
                setEmail(laboratorioConsulta.email);
            }
            if(laboratorioConsulta.numero_telefono){
                setTelefono(String(laboratorioConsulta.numero_telefono));
            }

        }
    }, [modoComponente])

    const modificarLaboratorio = async () => {
        const validacion = validarForm();
        if(validacion){
            const labo = {
                nombre: nombre,
                calle: calle,
                numero: parseInt(altura, 10),
                provincia_id: provincia.value,
                localidad_id: localidad.value
            }
            if(email !== ""){
                labo.email = email;
            } 
            if (telefono !== "") {
                labo.numero_telefono = telefono;
            } 
            

            try {
                await modificarLaboratorioService(labo, laboratorioConsulta.id);
                setMostrarAlertaModificacionCorrecta(true);
            } catch (error) {
                if(error.response && error.response.status === 401){
                    try {
                        await renewToken();
                        await modificarLaboratorioService(labo);
                        setMostrarAlertaModificacionCorrecta(true);
                    } catch (error) {
                      if(error.response && error.response.status === 401){
                        setMostrarErrorVencimientoToken(true);
                      }
                      else if(error.response.status === 404) {
                        mostrarErrorUsuarioNoEncontrado();
                      }
                      else if(error.response.status === 406) {
                        mostrarErrorLaboratorioNoEncontrado();
                      }
                      else{
                        mostrarErrorModificacionToast();
                      }
                    }
                }
                else if(error.response.status === 403){
                    mostrarErrorLaboratorioExistente();
                }
                else if(error.response.status === 404) {
                    mostrarErrorUsuarioNoEncontrado();
                }
                else if(error.response.status === 406) {
                    mostrarErrorLaboratorioNoEncontrado();
                }
                else{
                    mostrarErrorModificacionToast();
                }
            }

            
        }
       
    }

    
    if(modoComponente === "Registrar"){
        return(
            <>
                {/* REGISTRAR LABORATORIO */}
                <div className="overlay">
                    <Form className="formulario-claro-alargado formCentrado" onSubmit={handleSubmit(registrarLaboratorio)}>
    
                        <div className="seccionTitulo">
                            <strong className="tituloForm">Nuevo Laboratorio</strong>
                        </div>
                                      
                        <div className='columnasLaboratorios'>
    
                            <div className='columnaUnoLaboratorio'>
    
                                {/* Input Nombre */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={nombreVacio && 'labelErrorCampo'}>Nombre</Form.Label>
                                    <Form.Control type="text" value={nombre}
                                    onChange={handleChangeNombre}/>
                                </Form.Group>
    
                                {/* Input Calle */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={calleVacio && 'labelErrorCampo'}>Calle</Form.Label>
                                    <Form.Control type="text" value={calle}
                                    onChange={handleChangeCalle}/>
                                </Form.Group>
    
                                {/* Input Altura */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={alturaVacio && 'labelErrorCampo'}>Altura</Form.Label>
                                    <Form.Control type="number" value={altura}
                                    onChange={handleChangeAltura}/>
                                </Form.Group>  
    
                                {/* Input Email */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={emailNoValido && 'labelErrorCampo'}>Email</Form.Label>
                                    <Form.Control type="email" value={email}
                                    onChange={handleChangeEmail}/>
                                </Form.Group> 
                            </div>
    
                            <div className="columanDosLaboratorio">
    
                                {/* Select Provincia */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={(provinciaVacio || localidadIncorrecta) && 'labelErrorCampo'}>Provincia</Form.Label>
                                    <Select
                                    value={provincia}
                                    onChange={handleChangeProvincia}
                                    options={
                                        provincias.map(prov => ({label: prov.nombre, value: prov.id}))
                                    }
                                    />
                                </Form.Group> 
    
                                {/* Select Localidad */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={(localidadVacio || localidadIncorrecta) && 'labelErrorCampo'}>Localidad</Form.Label>
                                    <Select
                                    value={localidad}
                                    onChange={handleChangeLocalidad}
                                    options={
                                        localidades.map(loc => ({label: loc.nombre, value: loc.id, data: loc.provincia_id}))
                                    }
                                    />
                                </Form.Group> 
    
    
                                {/* Input Telefono */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={telefonoNoValido && 'labelErrorCampo'}>Teléfono</Form.Label>
                                    <Form.Control type="text" value={telefono}
                                    onChange={handleChangeTelefono}/>
                                </Form.Group>   

                            </div>
                        </div>
                                        
                        
                        {/* Botones */}
                        <Form.Group className="seccionBotonesFormulario margenTop20" controlId="formBotones">
                            <Button className="botonCancelarFormulario" variant="secondary"
                            onClick={handleCancelar}>
                                Cancelar
                            </Button>
                            <Button className="botonConfirmacionFormulario" variant="secondary"
                                    type="submit">
                                Registrar
                            </Button>
                        </Form.Group>             
                    </Form>        
                </div>

                {
                    mostrarErrorVencimientoToken &&
                    <Error texto={"Su sesión ha expirado"} 
                    onConfirm={handleSesionExpirada}/>
                }

                {
                    mostrarAlertaRegistroCorrecto &&
                    <Confirm texto={"El Laboratorio ha sido registrado correctamente"}
                    onConfirm={handleConfirmarRegistroLaboratorio}/>
                }

            </>            
        );
    }
    else if(modoComponente === "Consultar" && laboratorioConsulta){
        return(
            <>
                {/* CONSULTAR LABORATORIO */}
                <div className="overlay">
                    <Form className="formulario-claro-alargado formCentrado" onSubmit={handleSubmit(habilitarEdicionLaboratorio)}>
    
                        <div className="seccionTitulo">
                            <strong className="tituloForm">Laboratorio</strong>
                        </div>
                                      
                        <div className='columnasLaboratorios'>
    
                            <div className='columnaUnoLaboratorio'>
    
                                {/* Input Nombre */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control type="text" value={laboratorioConsulta.nombre}
                                    disabled={true}/>
                                </Form.Group>
    
                                {/* Input Calle */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label>Calle</Form.Label>
                                    <Form.Control type="text" value={laboratorioConsulta.calle}
                                    disabled={true}/>
                                </Form.Group>
    
                                {/* Input Altura */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label>Altura</Form.Label>
                                    <Form.Control type="number" value={String(laboratorioConsulta.numero)}
                                    disabled={true}/>
                                </Form.Group>  
    
                                {/* Input Email */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" value={laboratorioConsulta.email == null ? "" : laboratorioConsulta.email }
                                    disabled={true}/>
                                </Form.Group> 
                            </div>
    
                            <div className="columanDosLaboratorio">
    
                                {/* Select Provincia */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label>Provincia</Form.Label>
                                    <Select
                                    value={{label: laboratorioConsulta.provincia_nombre, value: laboratorioConsulta.provincia_id}}
                                    isDisabled={true}
                                    />
                                </Form.Group> 
    
                                {/* Select Localidad */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label>Localidad</Form.Label>
                                    <Select
                                    defaultValue={{label: laboratorioConsulta.localidad_nombre, value: laboratorioConsulta.localidad_id, data: laboratorioConsulta.provincia_id}}
                                    isDisabled={true}
                                    />
                                </Form.Group> 
    
    
                                {/* Input Teléfono */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label>Teléfono</Form.Label>
                                    <Form.Control type="text" value={laboratorioConsulta.numero_telefono ? String(laboratorioConsulta.numero_telefono) : ""}
                                    disabled={true}/>
                                </Form.Group>   
                            </div>
                        </div>
                                        
                        
                        {/* Botones */}
                        <Form.Group className="seccionBotonesFormulario margenTop20" controlId="formBotones">
                            <Button className="botonCancelarFormulario" variant="secondary"
                            onClick={handleCancelar}>
                                Cancelar
                            </Button>
                            <Button className="botonConfirmacionFormulario" variant="secondary"
                                    type="submit">
                                Editar
                            </Button>
                        </Form.Group>             
                    </Form>        
                </div>

                {
                    mostrarErrorVencimientoToken &&
                    <Error texto={"Su sesión ha expirado"} 
                    onConfirm={handleSesionExpirada}/>
                }


            </>
        )
    }
    else if(modoComponente === "Modificar"){
        return(
            <>
                {/* MODIFICAR LABORATORIO */}
                <div className="overlay">
                    <Form className="formulario-claro-alargado formCentrado" onSubmit={handleSubmit(modificarLaboratorio)}>
    
                        <div className="seccionTitulo">
                            <strong className="tituloForm">Laboratorio</strong>
                        </div>
                                      
                        <div className='columnasLaboratorios'>
                            <div className='columnaUnoLaboratorio'>
    
                                {/* Input Nombre */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={nombreVacio && 'labelErrorCampo'}>Nombre</Form.Label>
                                    <Form.Control type="text" value={nombre}
                                    onChange={handleChangeNombre}/>
                                </Form.Group>
    
                                {/* Input Calle */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={calleVacio && 'labelErrorCampo'}>Calle</Form.Label>
                                    <Form.Control type="text" value={calle}
                                    onChange={handleChangeCalle}/>
                                </Form.Group>
    
                                {/* Input Altura */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={alturaVacio && 'labelErrorCampo'}>Altura</Form.Label>
                                    <Form.Control type="number" value={altura}
                                    onChange={handleChangeAltura}/>
                                </Form.Group>  
    
                                {/* Input Email */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={emailNoValido && 'labelErrorCampo'}>Email</Form.Label>
                                    <Form.Control type="email" value={email}
                                    onChange={handleChangeEmail}/>
                                </Form.Group> 
                            </div>
    
                            <div className="columanDosLaboratorio">
    
                                {/* Select Provincia */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={(provinciaVacio || localidadIncorrecta) && 'labelErrorCampo'}>Provincia</Form.Label>
                                    <Select
                                    value={provincia}
                                    onChange={handleChangeProvincia}
                                    options={
                                        provincias.map(prov => ({label: prov.nombre, value: prov.id}))
                                    }
                                    />
                                </Form.Group> 
    
                                {/* Select Localidad */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={(localidadVacio || localidadIncorrecta) && 'labelErrorCampo'}>Localidad</Form.Label>
                                    <Select
                                    value={localidad}
                                    onChange={handleChangeLocalidad}
                                    options={
                                        localidades.map(loc => ({label: loc.nombre, value: loc.id, data: loc.provincia_id}))
                                    }
                                    />
                                </Form.Group> 
    
    
                                {/* Input Telefono */}
                                <Form.Group className="mb-3 seccionFormulario seccion-ancho-300">
                                    <Form.Label className={telefonoNoValido && 'labelErrorCampo'}>Teléfono</Form.Label>
                                    <Form.Control type="text" value={telefono}
                                    onChange={handleChangeTelefono}/>
                                </Form.Group>


                            </div>
                        </div>
                                        
                        
                        {/* Botones */}
                        <Form.Group className="seccionBotonesFormulario margenTop20" controlId="formBotones">
                            <Button className="botonCancelarFormulario" variant="secondary"
                            onClick={handleCancelarModificacion}>
                                Cancelar
                            </Button>
                            <Button className="botonConfirmacionFormulario" variant="secondary"
                                    type="submit">
                                Aceptar
                            </Button>
                        </Form.Group>             
                    </Form>        
                </div>

                {
                    mostrarErrorVencimientoToken &&
                    <Error texto={"Su sesión ha expirado"} 
                    onConfirm={handleSesionExpirada}/>
                }

                {
                    mostrarAlertaModificacionCorrecta &&
                    <Confirm texto={"El Laboratorio ha sido modificado correctamente"}
                    onConfirm={handleConfirmarModificacionLaboratorio}/>
                }

            </>
        )
    }
   
}

export default LaboratorioAMC; 
