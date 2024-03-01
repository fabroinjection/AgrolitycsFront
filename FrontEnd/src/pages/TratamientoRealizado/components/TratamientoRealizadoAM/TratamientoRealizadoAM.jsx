// import components
import NavbarBootstrap from '../../../../components/Navbar/Navbar.components';
import FertilizanteCard from '../FertilizanteCard/FertilizanteCard';
import NuevoFertilizanteCard from '../NuevoFertilizanteCard/NuevoFertilizanteCard';
import { Form } from 'react-bootstrap';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import '../../../../components/Estilos/estilosFormulario.css';
import Error from '../../../../components/Modals/Error/Error';
import Confirm from '../../../../components/Modals/Confirm/Confirm';
import Select from 'react-select';
import SpinnerAgrolitycs from '../../../../components/Spinner/SpinnerAgrolitycs';

// import hooks
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

// import services
import { getAnalisisService } from '../../../../services/getanalisis.service';
import { renewToken } from '../../../../services/token.service';
import { getDiagnosticoByIdService, getCultivoService } from '../../../../services/diagnosticos.service';
import { datosRotuloService } from '../../../../services/toma_muestra.service';
import { registrarTratamientoService } from '../../services/tratamientoAlta.service';
import { getDiagnosticosTMService } from '../../services/consultarTratamiento.service';

// import utilities
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { crearObjetoParaSolicitud } from '../../utilities/crearObjetoSolicitud';

function TratamientoRealizadoAM({ idTomaMuestra }) {

    const [fertilizantes, setFertilizantes] = useState([]);
    const [cantidadFertilizantes, setCantidadFertilizantes] = useState(0);

    const { handleSubmit, reset } = useForm();

    let navigate = useNavigate();
    
    // estados para manejar los input de cada NuevoFertilizante
    const [ kgPerHaValues, setKgPerHaValues ] = useState({});
    const [ fertilizantesSel, setFertilizantesSel ] = useState({});

    // estado para guardar analisis
    const [ analisis, setAnalisis ] = useState();

    // estado para guardar el nombre lote y el id campo
    const [ nombreLote, setNombreLote ] = useState();
    const [ idCampo, setIdCampo ] = useState();

    // estado para guardar diagnostico
    const [ fertilizantesDiagnostico, setFertilizantesDiagnostico ] = useState();

    const [ listadoDiagnosticos, setListadoDiagnosticos ] = useState([]);
    const [ listadoDiagnosticosConCultivos, setListadoDiagnosticosConCultivos ] = useState([]);


    // estados para errores
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);
    const [ errorUsuarioNovalido, setErrorUsuarioNoValido ] = useState(false);
    const [ errorDiagnosticoNoEncontrado, setErrorDiagnosticoNoEncontrado ] = useState(false);
    const [ errorAnalisisNoEncontrado, setErrorAnalisisNoEncontrado ] = useState(false);
    const [ errorTMNoEncontrada, setErrorTMNoEncontrada ] = useState(false);
    const [ errorLoteNoEncontrado, setErrorLoteNoEncontrado ] = useState(false);
    const [ errorRegistro, setErrorRegistro ] = useState(false);

    // estado para el input de observaciones
    const [ observaciones, setObservaciones ] = useState("");

    // estado para el select de diagnostico
    const [ diagnosticoSeleccionado, setDiagnosticoSeleccionado ] = useState();

    // estado para informar que se registro el tratamiento
    const [ alertaTratamientoRegistrado, setAlertaTratamientoRegistrado ] = useState(false);

    // funcion toast para alerta fertilizantes extras mal ingresados
    const mostrarFertExtraError = () => {
        toast.error('Si agregó algun fertilizante, se debe ingresar el fertilizante aplicado y la cantidad.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }); 
    }

    // funcion toast para alerta diagnostico no seleccionado
    const mostrarErrorDiagnosticoNoSeleccionado = () => {
        toast.error('Se debe seleccionar un diagnóstico sobre el cual registrar el tratamiento.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }); 
    }

    // funcion toast para alerta kg/ha sin ingresar
    const mostrarErrorFertilizantesDiagnosticoSinValor = () => {
        toast.error('Se debe ingresar la cantidad de kg/ha aplicada de todos los fertilizantes recomendados por el diagnóstico.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }); 
    }

    // funcion toast para alerta fertilizantes repetidos
    const mostrarErrorFertilizantesRepetidos = () => {
        toast.error('No se puede ingresar fertilizantes repetidos.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }); 
    }

    const handleAgregarFertilizante = () => {
        const key = Date.now();
        setFertilizantes(prevFertilizantes => [...prevFertilizantes, { key }]);
        setKgPerHaValues(prevValues => ({ ...prevValues, [key]: 0 }));
    };

    const handleRemoveFertilizante = (cardKey) => {
        setFertilizantes(prevFertilizantes =>
            prevFertilizantes.filter(fertilizante => fertilizante.key !== cardKey)
        );
        setKgPerHaValues(prevValues => {
            const { [cardKey]: removedValue, ...rest } = prevValues;
            return rest;
        });
        setFertilizantesSel(prevValues => {
            const { [cardKey]: removedValue, ...rest } = prevValues;
            return rest;
        });
    };

    const handleKgPerHaChange = (cardKey, value) => {
        setKgPerHaValues(prevValues => ({ ...prevValues, [cardKey]: value }));
    };

    const handleFertilizanteSelChange = (cardKey, opcion) => {
        setFertilizantesSel(prevValues => ({ ...prevValues, [cardKey]: opcion }));
    }

    const handleSesionExpirada = () =>{
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
    }

    useEffect(() => {
        if (idTomaMuestra) {
            const fetchDiagnosticos = async () => {
                try {
                    const { data } = await getDiagnosticosTMService(idTomaMuestra);
                    setListadoDiagnosticos(data);
                } catch (error) {
                    //
                }
            }
            fetchDiagnosticos();
        }
    }, [idTomaMuestra])

    useEffect(() => {
        if (idTomaMuestra) {
            const fetchAnalisis = async () => {
                try {
                    const { data } = await getAnalisisService(idTomaMuestra);
                    setAnalisis(data);
                } catch (error) {
                    if(error.response && error.response.status === 401){
                        try {
                            await renewToken();
                            const { data } = await getAnalisisService(idTomaMuestra);
                            setAnalisis(data);
                        } catch (error) {
                            if(error.response && error.response.status === 401){
                                setMostrarErrorVencimientoToken(true);
                              }
                        }
                    }
                }
            }
            fetchAnalisis();
        }
    }, [idTomaMuestra])

    useEffect(() => {
        if (idTomaMuestra) {
            const fetchNombreLote = async () => {
                try {
                    const { data } = await datosRotuloService(idTomaMuestra);
                    setNombreLote(data.Lote_nombre);
                    setIdCampo(data.Campo_id);
                } catch (error) {
                    if(error.response && error.response.status === 401){
                        try {
                            await renewToken();
                            const { data } = await datosRotuloService(idTomaMuestra);
                            setNombreLote(data.Lote_nombre);
                            setIdCampo(data.Campo_id);
                        } catch (error) {
                            if(error.response && error.response.status === 401){
                                setMostrarErrorVencimientoToken(true);
                              }
                        }
                    }
                }
            }
            fetchNombreLote();
        }
    }, [idTomaMuestra])

    useEffect(() => {
        if (analisis && diagnosticoSeleccionado) {
            const fetchDiagnostico = async () => {
                try {
                    const { data } = await getDiagnosticoByIdService(analisis[0].id, diagnosticoSeleccionado.value);
                    setFertilizantesDiagnostico(data[0]);
                } catch (error) {
                    if(error.response && error.response.status === 401){
                        try {
                            renewToken();
                            const { data } = await getDiagnosticoByIdService(analisis[0].id, diagnosticoSeleccionado.value);
                            setFertilizantesDiagnostico(data[0]);
                        } catch (error) {
                            if(error.response && error.response.status === 401){
                                setMostrarErrorVencimientoToken(true);
                              }
                        }
                    }
                }
            }
            fetchDiagnostico();
        }
    }, [analisis, diagnosticoSeleccionado])

    const handleKgHaChange = (fertilizante, value) => {
        setFertilizantesDiagnostico(prevState => {
            const updatedDiagnostico = { ...prevState };
            updatedDiagnostico[fertilizante] = value;
            return updatedDiagnostico;
        });
    };

    const handleChangeObservaciones = (e) => {
        setObservaciones(e.target.value);
    }

    const registrarTratamiento = async () => {
        if (!diagnosticoSeleccionado) {
            mostrarErrorDiagnosticoNoSeleccionado();
            return false;
        }
        
        for (let fertilizante in fertilizantesDiagnostico) {
            if (isNaN(fertilizantesDiagnostico[fertilizante])) {
                mostrarErrorFertilizantesDiagnosticoSinValor();
                return false;
            }
        }

        let kgPerHaKeys = Object.keys(kgPerHaValues);
        let fertilizantesSelKeys = Object.keys(fertilizantesSel);

        // Verificar si las mismas claves existen en ambos objetos
        let tienenMismasClaves = kgPerHaKeys.every(key => fertilizantesSelKeys.includes(key));

        // Verificar si alguna clave tiene el valor 0
        let hasZeroValue = Object.values(kgPerHaValues).some(value => (value === 0 || value === ''));

        if (tienenMismasClaves && !hasZeroValue) {
            const tratamiento = await crearObjetoParaSolicitud(diagnosticoSeleccionado.value, observaciones, fertilizantesSel, kgPerHaValues, fertilizantesDiagnostico);
            if (tratamiento) {
                try {
                    await registrarTratamientoService(tratamiento);
                    setAlertaTratamientoRegistrado(true);
                } catch (error) {
                    if (error.response.status) {
                        let status = error.response.status;
                        if (status === 401) {
                            await renewToken();
                            try {
                                await registrarTratamientoService(tratamiento);
                                setAlertaTratamientoRegistrado(true);
                            } catch (error) {
                                if (error.response.status) {
                                    status = error.response.status;
                                    if (status === 402) {
                                        setErrorUsuarioNoValido(true);
                                    }
                                    else if (status === 403) {
                                        setErrorDiagnosticoNoEncontrado(true);
                                    }
                                    else if (status === 404) {
                                        setErrorAnalisisNoEncontrado(true);
                                    }
                                    else if (status === 405) {
                                        setErrorTMNoEncontrada(true);
                                    }
                                    else if (status === 406) {
                                        setErrorLoteNoEncontrado(true);
                                    }
                                    else {
                                        setErrorRegistro(true)
                                    }
                                }
                                else if (status === 402) {
                                    setErrorUsuarioNoValido(true);
                                }
                                else if (status === 403) {
                                    setErrorDiagnosticoNoEncontrado(true);
                                }
                                else if (status === 404) {
                                    setErrorAnalisisNoEncontrado(true);
                                }
                                else if (status === 405) {
                                    setErrorTMNoEncontrada(true);
                                }
                                else if (status === 406) {
                                    setErrorLoteNoEncontrado(true);
                                }
                                else {
                                    setErrorRegistro(true)
                                }
                            }
                        }
                    }
                }
            } else {
                mostrarErrorFertilizantesRepetidos();
            }          
        } else {
            mostrarFertExtraError();
        }

    }

    const handleCancelar = () => {
        reset();
        navigate(`/detalleCampo/${idCampo}`);
    }

    const handleCerrarAlertaTratamientoRegistrado = (e) => {
        if (e) {
            reset();
            setAlertaTratamientoRegistrado(false);
            navigate(`/detalleCampo/${idCampo}`);
        }
    }

    const handleChangeDiagnosticoSeleccionado = (opcion) => {
        setDiagnosticoSeleccionado(opcion);
    }

    useEffect(() => {
        // Cambiar el id por el nombre en el listado de diagnósticos
        const obtenerNombresCultivos = async () => {
            const nuevosDiagnosticos = [];
            
            for (const diagnostico of listadoDiagnosticos) {
                const { data } = await getCultivoService(diagnostico.cultivo_id);
                const nombreCultivo = data;
                const nuevoDiagnostico = {
                    ...diagnostico,
                    nombreCultivo 
                };
                nuevosDiagnosticos.push(nuevoDiagnostico);
            }
            
            setListadoDiagnosticosConCultivos(nuevosDiagnosticos);
        };

        if (listadoDiagnosticos.length > 0) {
            obtenerNombresCultivos();
        }
    }, [listadoDiagnosticos]);

    if(window.localStorage.getItem('loggedAgroUser') && Cookies.get()){
        if (analisis && listadoDiagnosticosConCultivos && nombreLote) {
            return (
                <>
                    <NavbarBootstrap></NavbarBootstrap>
        
                    {/* Registrar tratamiento realizado */}
                    <Form className='contenedorTratamiento' onSubmit={handleSubmit(registrarTratamiento)}>
                        <div className='contenedorTituloTratamiento'>
                            <h1>Tratamiento {nombreLote}</h1>
                        </div>

                        <Form.Group>
                            <Form.Label>Seleccione un Diagnóstico</Form.Label>
                            <Select 
                                value={diagnosticoSeleccionado}
                                onChange={handleChangeDiagnosticoSeleccionado}
                                options={
                                    listadoDiagnosticosConCultivos.map( diagn => ({label: diagn.nombreCultivo + " " + diagn.rendimiento_esperado + " kg/Ha", value: diagn.id}) )
                                }
                            />
                        </Form.Group>

                        <div>
                            <span>Indique la cantidad de cada fertilizante que se aplicó al lote.</span>
                        </div>
        
    
                        {/* Listado de fertlizantes recomendados por el diagnóstico */}
                        {
                            diagnosticoSeleccionado && fertilizantesDiagnostico &&
                            Object.entries(fertilizantesDiagnostico).map(([elemento, datos], indice) => (
                                datos !== 0 && 
                                <FertilizanteCard 
                                    key={indice} 
                                    fertilizante={elemento} 
                                    kgHa={datos.toFixed(2)}
                                    onKgHaChange={(value) => handleKgHaChange(elemento, value)}
                                    modo={'Registrar'} 
                                />
                            ))
                        }
                        
                        
        
                        {/* Agrega una fila por cada fertilizante nuevo que se quiera aplicar */}
                        {fertilizantes.map(fertilizante => (
                            <NuevoFertilizanteCard
                                key={fertilizante.key}
                                cardKey={fertilizante.key}
                                onRemove={handleRemoveFertilizante}
                                onKgPerHaChange={handleKgPerHaChange}
                                onFertilizanteChange={handleFertilizanteSelChange}
                            />
                        ))}
        
                        {/* Boton de agregar fertilizante */}
                        <div className='agregarFertilizante'>
                            <Stack direction="horizontal">
                                <div className='p-2'>
                                    <Button variant="link" className='botonAgregarFertilizante' onClick={handleAgregarFertilizante}>Agregar otro fertilizante</Button>
                                </div>
                            </Stack>
                        </div>
        
                        {/* Input Observaciones */}
                        <Form.Group>
                            <Form.Label>Observaciones</Form.Label>
                            <Form.Control as="textarea" className='inputObservaciones' value={observaciones} onChange={handleChangeObservaciones}></Form.Control>
                        </Form.Group>
        
                        {/* Botones */}
                        <Form.Group className="mb-3 seccionBotonesTratamiento">
                            <Button className="estiloBotonesTratamiento botonCancelarTratamiento" variant="secondary" onClick={handleCancelar}>
                                Cancelar
                            </Button>
                            <Button className="estiloBotonesTratamiento botonConfirmarTratamiento" variant="secondary"
                                type="submit">
                                Guardar
                            </Button>
                        </Form.Group>
                    </Form>
                    {
                        alertaTratamientoRegistrado &&
                        <Confirm texto={"El tratamiento ha sido registrado correctamente"} 
                        onConfirm={handleCerrarAlertaTratamientoRegistrado}/>
                    } 
                    {
                        mostrarErrorVencimientoToken &&
                        <Error texto={"Su sesión ha expirado"} 
                        onConfirm={handleSesionExpirada}/>
                    }
                    {
                        errorUsuarioNovalido &&
                        <Error texto={"El usuario no es válido."} 
                        onConfirm={() => setErrorUsuarioNoValido(false)}/>
                    }
                    {
                        errorDiagnosticoNoEncontrado &&
                        <Error texto={"El diagnóstico no fue encontrado."} 
                        onConfirm={() => setErrorDiagnosticoNoEncontrado(false)}/>
                    }
                    {
                        errorAnalisisNoEncontrado &&
                        <Error texto={"El análisis no fue encontrado."} 
                        onConfirm={() => setErrorAnalisisNoEncontrado(false)}/>
                    }
                    {
                        errorTMNoEncontrada &&
                        <Error texto={"La toma de muestra no fue encontrada."} 
                        onConfirm={() => setErrorTMNoEncontrada(false)}/>
                    }
                    {
                        errorLoteNoEncontrado &&
                        <Error texto={"El lote no fue encontrado."} 
                        onConfirm={() => setErrorLoteNoEncontrado(false)}/>
                    }
                    {
                        errorRegistro &&
                        <Error texto={"Ocurrió un error inesperado al registrar el tratamiento."} 
                        onConfirm={() => setErrorRegistro(false)}/>
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
                </>
            )
        }
    }
    
    
}

export default TratamientoRealizadoAM;
