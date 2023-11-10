//Estilos
import './LaboratorioAMC.css';

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

    const [ provincias, setProvincias ] = useState([]);
    const [ localidades, setLocalidades ] = useState([]);

    // variable para guardar el laboratorio
    const [ laboratorioConsulta, setLaboratorioConsulta ] = useState();

    // manejo de errores con modals vencimiento token
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);

    // manejo de alertas de aviso de transacciones correctas
    const [ mostrarAlertaRegistroCorrecto, setMostrarAlertaRegistroCorrecto ] = useState(false);
    const [ mostrarAlertaModificacionCorrecta, setMostrarAlertaModificacionCorrecta ] = useState(false);

    // manejo de alertas de aviso de error transacciones
    const [ errorRegistroLaboratorio, setErrorRegistroLaboratorio ] = useState(false);
    const [ errorModificacionLaboratorio, setErrorModificacionLaboratorio ] = useState(false);
    const [ errorLaboratorioExistente, setErrorLaboratorioExistente ] = useState(false);
    const [ errorUsuarioNoEncontrado, setErrorUsuarioNoEncontrado ] = useState(false);
    const [ errorLaboratorioNoEncontrado, setErrorLaboratorioNoEncontrado ] = useState(false);

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
            return false;
        } else{
            setNombreVacio(false);
        }
        if (calle === "") {
            setCalleVacio(true);
            return false;
        } else {
            setCalleVacio(false);
        }
        if (altura === "") {
            setAlturaVacio(true);
            return false;
        } else {
            setAlturaVacio(false);
        }
        if (provincia.length === 0) {
            setProvinciaVacio(true);
            return false;
        } else {
            setProvinciaVacio(false);
        }

        if (localidad.length === 0){
            setLocalidadVacio(true);
            return false;
        } else {
            if (localidad.data !== provincia.value) {
                setLocalidadVacio(false);
                setLocalidadIncorrecta(true);
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
                return false;
            }
        } else {
            setEmailNoValido(false);
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
                        setErrorLaboratorioExistente(true);
                      }
                      else if(error.response.status === 404){
                        setErrorUsuarioNoEncontrado(true);
                      }
                      else{
                        setErrorRegistroLaboratorio(true);
                      }
                    }
                }
                else if(error.response.status === 403){
                    setErrorLaboratorioExistente(true);
                }
                else if(error.response.status === 404){
                    setErrorUsuarioNoEncontrado(true);
                }
                else{
                    setErrorRegistroLaboratorio(true);
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
                            setErrorLaboratorioNoEncontrado(true);
                          }
                        }
                    }
                    else if (error.response.status === 404){
                        setErrorLaboratorioNoEncontrado(true);
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
                        setErrorUsuarioNoEncontrado(true);
                      }
                      else if(error.response.status === 406) {
                        setErrorLaboratorioNoEncontrado(true);
                      }
                      else{
                        setErrorModificacionLaboratorio(true);
                      }
                    }
                }
                else if(error.response.status === 403){
                    setErrorLaboratorioExistente(true);
                }
                else if(error.response.status === 404) {
                    setErrorUsuarioNoEncontrado(true);
                }
                else if(error.response.status === 406) {
                    setErrorLaboratorioNoEncontrado(true);
                }
                else{
                    setErrorModificacionLaboratorio(true);
                }
            }

            
        }
       
    }

    
    if(modoComponente === "Registrar"){
        return(
            <>
                {/* REGISTRAR LABORATORIO */}
                <div className="overlay">
                    <Form className="formLaboratorio formCentrado" onSubmit={handleSubmit(registrarLaboratorio)}>
    
                        <div className="formTituloLaboratorio">
                            <strong className="tituloFormLaboratorio">Nuevo Laboratorio</strong>
                        </div>
                                      
                        <div className='columnasLaboratorios'>
    
                            <div className='columnaUnoLaboratorio'>
    
                                {/* Input Nombre */}
                                <Form.Group className="mb-3 seccionNombreLab">
                                    <Form.Label className={nombreVacio && 'labelErrorCampo'}>Nombre</Form.Label>
                                    <Form.Control className="inputLaboratorios" type="text" value={nombre}
                                    onChange={handleChangeNombre}/>
                                </Form.Group>
    
                                {/* Input Calle */}
                                <Form.Group className="mb-3 seccionCalle">
                                    <Form.Label className={calleVacio && 'labelErrorCampo'}>Calle</Form.Label>
                                    <Form.Control className="inputLaboratorios" type="text" value={calle}
                                    onChange={handleChangeCalle}/>
                                </Form.Group>
    
                                {/* Input Altura */}
                                <Form.Group className="mb-3 seccionAltura">
                                    <Form.Label className={alturaVacio && 'labelErrorCampo'}>Altura</Form.Label>
                                    <Form.Control className="inputLaboratorios" type="number" value={altura}
                                    onChange={handleChangeAltura}/>
                                </Form.Group>  
    
                                {/* Input Email */}
                                <Form.Group className="mb-3 seccionEmail">
                                    <Form.Label className={emailNoValido && 'labelErrorCampo'}>Email</Form.Label>
                                    <Form.Control className="inputLaboratorios" type="email" value={email}
                                    onChange={handleChangeEmail}/>
                                </Form.Group> 
                            </div>
    
                            <div className="columanDosLaboratorio">
    
                                {/* Select Provincia */}
                                <Form.Group className="mb-3 seccionProvLaboratorio">
                                    <Form.Label className={(provinciaVacio || localidadIncorrecta) && 'labelErrorCampo'}>Provincia</Form.Label>
                                    <Select
                                    className="selectLaboratorio"
                                    value={provincia}
                                    onChange={handleChangeProvincia}
                                    options={
                                        provincias.map(prov => ({label: prov.nombre, value: prov.id}))
                                    }
                                    />
                                </Form.Group> 
    
                                {/* Select Localidad */}
                                <Form.Group className="mb-3 seccionLocLaboratorio">
                                    <Form.Label className={(localidadVacio || localidadIncorrecta) && 'labelErrorCampo'}>Localidad</Form.Label>
                                    <Select
                                    className="selectLaboratorio"
                                    value={localidad}
                                    onChange={handleChangeLocalidad}
                                    options={
                                        localidades.map(loc => ({label: loc.nombre, value: loc.id, data: loc.provincia_id}))
                                    }
                                    />
                                </Form.Group> 
    
    
                                {/* Input Telefono */}
                                <Form.Group className="mb-3 seccionTelefono">
                                    <Form.Label>Telefono</Form.Label>
                                    <Form.Control className="inputLaboratorios" type="text" value={telefono}
                                    onChange={handleChangeTelefono}/>
                                </Form.Group>   

                                {/* Mensaje de Faltan Campos */}
                                <Form.Group className="mb-3">
                                    {(nombreVacio || calleVacio || alturaVacio || provinciaVacio || localidadVacio) && <Form.Label className='labelErrorCampo'>*Se debe ingresar los campos en rojo</Form.Label>}
                                    {localidadIncorrecta && <Form.Label className='labelErrorCampo'>*Se debe ingresar una Localidad válida para la Provincia</Form.Label>}
                                    {emailNoValido && <Form.Label className='labelErrorCampo'>*Email en formato no válido</Form.Label>}
                                </Form.Group>
                            </div>
                        </div>
                                        
                        
                        {/* Botones */}
                        <Form.Group className="mb-3 seccionBotones" controlId="formBotones">
                            <Button className="estiloBotonesLaboratorio botonCancelarLaboratorio" variant="secondary"
                            onClick={handleCancelar}>
                                Cancelar
                            </Button>
                            <Button className="estiloBotonesLaboratorio botonConfirmarLaboratorio" variant="secondary"
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

                {
                    errorRegistroLaboratorio &&
                    <Error texto={"Ha ocurrido un error registrando su laboratorio, intente nuevamente más tarde"} 
                    onConfirm={() => setErrorRegistroLaboratorio(false)}/>
                }

                {
                    errorLaboratorioExistente &&
                    <Error texto={"El laboratorio que está ingresando ya existe entre sus laboratorios registrados."} 
                    onConfirm={() => setErrorLaboratorioExistente(false)}/>
                }

                {
                    errorUsuarioNoEncontrado &&
                    <Error texto={"El usuario no se ha encontrado."} 
                    onConfirm={() => setErrorUsuarioNoEncontrado(false)}/>
                }
            </>            
        );
    }
    else if(modoComponente === "Consultar" && laboratorioConsulta){
        return(
            <>
                {/* CONSULTAR LABORATORIO */}
                <div className="overlay">
                    <Form className="formLaboratorio formCentrado" onSubmit={handleSubmit(habilitarEdicionLaboratorio)}>
    
                        <div className="formTituloLaboratorio">
                            <strong className="tituloFormLaboratorio">Laboratorio</strong>
                        </div>
                                      
                        <div className='columnasLaboratorios'>
    
                            <div className='columnaUnoLaboratorio'>
    
                                {/* Input Nombre */}
                                <Form.Group className="mb-3 seccionNombreLab">
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control className="inputLaboratorios" type="text" value={laboratorioConsulta.nombre}
                                    disabled={true}/>
                                </Form.Group>
    
                                {/* Input Calle */}
                                <Form.Group className="mb-3 seccionCalle">
                                    <Form.Label>Calle</Form.Label>
                                    <Form.Control className="inputLaboratorios" type="text" value={laboratorioConsulta.calle}
                                    disabled={true}/>
                                </Form.Group>
    
                                {/* Input Altura */}
                                <Form.Group className="mb-3 seccionAltura">
                                    <Form.Label>Altura</Form.Label>
                                    <Form.Control className="inputLaboratorios" type="number" value={String(laboratorioConsulta.numero)}
                                    disabled={true}/>
                                </Form.Group>  
    
                                {/* Input Email */}
                                <Form.Group className="mb-3 seccionEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control className="inputLaboratorios" type="email" value={laboratorioConsulta.email == null ? "" : laboratorioConsulta.email }
                                    disabled={true}/>
                                </Form.Group> 
                            </div>
    
                            <div className="columanDosLaboratorio">
    
                                {/* Select Provincia */}
                                <Form.Group className="mb-3 seccionProvLaboratorio">
                                    <Form.Label>Provincia</Form.Label>
                                    <Select
                                    className="selectLaboratorio"
                                    value={{label: laboratorioConsulta.provincia_nombre, value: laboratorioConsulta.provincia_id}}
                                    isDisabled={true}
                                    />
                                </Form.Group> 
    
                                {/* Select Localidad */}
                                <Form.Group className="mb-3 seccionLocLaboratorio">
                                    <Form.Label>Localidad</Form.Label>
                                    <Select
                                    className="selectLaboratorio"
                                    defaultValue={{label: laboratorioConsulta.localidad_nombre, value: laboratorioConsulta.localidad_id, data: laboratorioConsulta.provincia_id}}
                                    isDisabled={true}
                                    />
                                </Form.Group> 
    
    
                                {/* Input Telefono */}
                                <Form.Group className="mb-3 seccionTelefono">
                                    <Form.Label>Telefono</Form.Label>
                                    <Form.Control className="inputLaboratorios" type="text" value={laboratorioConsulta.numero_telefono ? String(laboratorioConsulta.numero_telefono) : ""}
                                    disabled={true}/>
                                </Form.Group>   
                            </div>
                        </div>
                                        
                        
                        {/* Botones */}
                        <Form.Group className="mb-3 seccionBotones" controlId="formBotones">
                            <Button className="estiloBotonesLaboratorio botonCancelarLaboratorio" variant="secondary"
                            onClick={handleCancelar}>
                                Cancelar
                            </Button>
                            <Button className="estiloBotonesLaboratorio botonConfirmarLaboratorio" variant="secondary"
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

                {
                    errorLaboratorioNoEncontrado &&
                    <Error texto={"El laboratorio que está consultado no ha sido encontrado."} 
                    onConfirm={() => setErrorLaboratorioNoEncontrado(false)}/>
                }

            </>
        )
    }
    else if(modoComponente === "Modificar"){
        return(
            <>
                {/* MODIFICAR LABORATORIO */}
                <div className="overlay">
                    <Form className="formLaboratorio formCentrado" onSubmit={handleSubmit(modificarLaboratorio)}>
    
                        <div className="formTituloLaboratorio">
                            <strong className="tituloFormLaboratorio">Laboratorio</strong>
                        </div>
                                      
                        <div className='columnasLaboratorios'>
    
                            <div className='columnaUnoLaboratorio'>
    
                                {/* Input Nombre */}
                                <Form.Group className="mb-3 seccionNombreLab">
                                    <Form.Label className={nombreVacio && 'labelErrorCampo'}>Nombre</Form.Label>
                                    <Form.Control className="inputLaboratorios" type="text" value={nombre}
                                    onChange={handleChangeNombre}/>
                                </Form.Group>
    
                                {/* Input Calle */}
                                <Form.Group className="mb-3 seccionCalle">
                                    <Form.Label className={calleVacio && 'labelErrorCampo'}>Calle</Form.Label>
                                    <Form.Control className="inputLaboratorios" type="text" value={calle}
                                    onChange={handleChangeCalle}/>
                                </Form.Group>
    
                                {/* Input Altura */}
                                <Form.Group className="mb-3 seccionAltura">
                                    <Form.Label className={alturaVacio && 'labelErrorCampo'}>Altura</Form.Label>
                                    <Form.Control className="inputLaboratorios" type="number" value={altura}
                                    onChange={handleChangeAltura}/>
                                </Form.Group>  
    
                                {/* Input Email */}
                                <Form.Group className="mb-3 seccionEmail">
                                    <Form.Label className={emailNoValido && 'labelErrorCampo'}>Email</Form.Label>
                                    <Form.Control className="inputLaboratorios" type="email" value={email}
                                    onChange={handleChangeEmail}/>
                                </Form.Group> 
                            </div>
    
                            <div className="columanDosLaboratorio">
    
                                {/* Select Provincia */}
                                <Form.Group className="mb-3 seccionProvLaboratorio">
                                    <Form.Label className={(provinciaVacio || localidadIncorrecta) && 'labelErrorCampo'}>Provincia</Form.Label>
                                    <Select
                                    className="selectLaboratorio"
                                    value={provincia}
                                    onChange={handleChangeProvincia}
                                    options={
                                        provincias.map(prov => ({label: prov.nombre, value: prov.id}))
                                    }
                                    />
                                </Form.Group> 
    
                                {/* Select Localidad */}
                                <Form.Group className="mb-3 seccionLocLaboratorio">
                                    <Form.Label className={(localidadVacio || localidadIncorrecta) && 'labelErrorCampo'}>Localidad</Form.Label>
                                    <Select
                                    className="selectLaboratorio"
                                    value={localidad}
                                    onChange={handleChangeLocalidad}
                                    options={
                                        localidades.map(loc => ({label: loc.nombre, value: loc.id, data: loc.provincia_id}))
                                    }
                                    />
                                </Form.Group> 
    
    
                                {/* Input Telefono */}
                                <Form.Group className="mb-3 seccionTelefono">
                                    <Form.Label>Telefono</Form.Label>
                                    <Form.Control className="inputLaboratorios" type="text" value={telefono}
                                    onChange={handleChangeTelefono}/>
                                </Form.Group>

                                {/* Mensaje de Faltan Campos */}
                                <Form.Group className="mb-3">
                                    {(nombreVacio || calleVacio || alturaVacio || provinciaVacio || localidadVacio) && <Form.Label className='labelErrorCampo'>*Se debe ingresar los campos en rojo</Form.Label>}
                                    {localidadIncorrecta && <Form.Label className='labelErrorCampo'>*Se debe ingresar una Localidad válida para la Provincia</Form.Label>}
                                    {emailNoValido && <Form.Label className='labelErrorCampo'>*Email en formato no válido</Form.Label>}
                                </Form.Group>

                            </div>
                        </div>
                                        
                        
                        {/* Botones */}
                        <Form.Group className="mb-3 seccionBotones" controlId="formBotones">
                            <Button className="estiloBotonesLaboratorio botonCancelarLaboratorio" variant="secondary"
                            onClick={handleCancelarModificacion}>
                                Cancelar
                            </Button>
                            <Button className="estiloBotonesLaboratorio botonConfirmarLaboratorio" variant="secondary"
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

                {
                    errorModificacionLaboratorio &&
                    <Error texto={"Ha ocurrido un error modificando su laboratorio, intente nuevamente más tarde"} 
                    onConfirm={() => setErrorModificacionLaboratorio(false)}/>
                }

                {
                    errorLaboratorioExistente &&
                    <Error texto={"El laboratorio que está ingresando ya existe entre sus laboratorios registrados."} 
                    onConfirm={() => setErrorLaboratorioExistente(false)}/>
                }

                {
                    errorLaboratorioNoEncontrado &&
                    <Error texto={"El laboratorio que está consultado no ha sido encontrado."} 
                    onConfirm={() => setErrorLaboratorioNoEncontrado(false)}/>
                }

                {
                    errorUsuarioNoEncontrado &&
                    <Error texto={"El usuario no se ha encontrado."} 
                    onConfirm={() => setErrorUsuarioNoEncontrado(false)}/>
                }
            </>
        )
    }
   
}

export default LaboratorioAMC; 
