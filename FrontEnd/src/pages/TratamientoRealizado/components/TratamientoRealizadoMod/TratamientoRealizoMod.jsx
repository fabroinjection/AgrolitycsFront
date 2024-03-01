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
import SpinnerAgrolitycs from '../../../../components/Spinner/SpinnerAgrolitycs';

// import hooks
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

// import services
import { renewToken } from '../../../../services/token.service';
import { datosRotuloService } from '../../../../services/toma_muestra.service';
import { modificarTratamientoService } from '../../services/tratamientoModif.service';

// import utilities
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { crearObjetoParaSolicitudModificacion } from '../../utilities/crearObjetoSolicitudModificacion';

function TratamientoRealizadoMod({ idTomaMuestra, tratamiento, onCancelar, onModificar }) {

    const [fertilizantes, setFertilizantes] = useState([]);

    const { handleSubmit, reset } = useForm();

    let navigate = useNavigate();
    
    // estados para manejar los input de cada NuevoFertilizante
    const [ kgPerHaValues, setKgPerHaValues ] = useState({});
    const [ fertilizantesSel, setFertilizantesSel ] = useState({});

    // estado para guardar el nombre lote y el id campo
    const [ nombreLote, setNombreLote ] = useState();
    const [ idCampo, setIdCampo ] = useState();

    // estado para guardar fertilizantesTratamiento
    const [ fertilizantesTratamiento, setFertilizantesTratamiento ] = useState(tratamiento.fertilizantes_aplicados);

    // estados para errores
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);
    const [ errorUsuarioNovalido, setErrorUsuarioNoValido ] = useState(false);
    const [ errorTratamientoNoEncontrado, setErrorTratamientoNoEncontrado ] = useState(false);
    const [ errorModificacion, setErrorModificacion ] = useState(false);

    // estado para el input de observaciones
    const [ observaciones, setObservaciones ] = useState(tratamiento.observaciones);


    // estado para informar que se registro el tratamiento
    const [ alertaTratamientoModificado, setAlertaTratamientoModificado ] = useState(false);

    // funcion toast para alerta fertilizantes extras mal ingresados
    const mostrarFertExtraError = () => {
        toast.error('Si agregó algun fertilizante, se debe ingresar el fertilizante aplicado y la cantidad.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
          }); 
    }

    // funcion toast para alerta kg/ha sin ingresar
    const mostrarErrorFertilizantesTratamientoSinValor = () => {
        toast.error('Se debe ingresar la cantidad de kg/ha aplicada de todos los fertilizantes del tratamiento.', {
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

    const handleKgHaChange = (fertilizanteId, value) => {
        setFertilizantesTratamiento(prevState => {
            
            // Copia profunda del array de fertilizantes tratamientos
            const updatedFertilizantes = prevState.map(fertilizante => {
                if (fertilizante.fertilizante_id === fertilizanteId) {
                    
                    // Retornar un nuevo objeto con el kgPorHa actualizado
                    return {
                        ...fertilizante,
                        kgPorHa: value
                    };
                }
                return fertilizante; 
            });
    
            return updatedFertilizantes;
        });
    };

    const handleChangeObservaciones = (e) => {
        setObservaciones(e.target.value);
    }

    const modificarTratamiento = async () => {
        for (let fertilizante in fertilizantesTratamiento) {
            if (isNaN(fertilizantesTratamiento[fertilizante].kgPorHa)) {
                mostrarErrorFertilizantesTratamientoSinValor();
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
            const tratamientoModificado = crearObjetoParaSolicitudModificacion(tratamiento.diagnostico_id, observaciones, fertilizantesSel, kgPerHaValues, fertilizantesTratamiento);
            if (tratamientoModificado) {
                try {
                    await modificarTratamientoService(tratamiento.id, tratamientoModificado);
                    setAlertaTratamientoModificado(true);
                } catch (error) {
                    if (error.response.status) {
                        let status = error.response.status;
                        if (status === 401) {
                            await renewToken();
                            try {
                                await modificarTratamientoService(tratamiento.id, tratamientoModificado);
                                setAlertaTratamientoModificado(true);
                            } catch (error) {
                                if (error.response.status) {
                                    status = error.response.status;
                                    if (status === 402) {
                                        setErrorUsuarioNoValido(true);
                                    }
                                    else if (status === 404) {
                                        setErrorTratamientoNoEncontrado(true);
                                    }
                                    else {
                                        setErrorModificacion(true)
                                    }
                                }
                                else if (status === 402) {
                                    setErrorUsuarioNoValido(true);
                                }
                                else if (status === 404) {
                                    setErrorTratamientoNoEncontrado(true);
                                }
                                else {
                                    setErrorModificacion(true)
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
        onCancelar();
    }

    const handleCerrarAlertaTratamientoModificado = (e) => {
        if (e) {
            reset();
            setAlertaTratamientoModificado(false);
            onModificar();
        }
    }


    if(window.localStorage.getItem('loggedAgroUser') && Cookies.get()){
        if (nombreLote) {
            return (
                <>
                
                    <NavbarBootstrap></NavbarBootstrap>
        
                    {/* Registrar tratamiento realizado */}
                    <Form className='contenedorTratamiento' onSubmit={handleSubmit(modificarTratamiento)}>
                        <div className='contenedorTituloTratamiento'>
                            <h1>Tratamiento {nombreLote}</h1>
                        </div>

                        <div>
                            <span>Indique la cantidad de cada fertilizante que se aplicó al lote.</span>
                        </div>
        
    
                        {/* Listado de fertlizantes tratamiento */}
                        {
                            fertilizantesTratamiento.map((fertilizante, indice) => (
                                <FertilizanteCard 
                                    key={indice} 
                                    fertilizante={fertilizante.nombre_fertilizante} 
                                    kgHa={fertilizante.kgPorHa}
                                    onKgHaChange={(value) => handleKgHaChange(fertilizante.fertilizante_id, value)}
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
                        alertaTratamientoModificado &&
                        <Confirm texto={"El tratamiento ha sido modificado correctamente"} 
                        onConfirm={handleCerrarAlertaTratamientoModificado}/>
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
                        errorTratamientoNoEncontrado &&
                        <Error texto={"El tratamiento no fue encontrado."} 
                        onConfirm={() => setErrorTratamientoNoEncontrado(false)}/>
                    }
                    {
                        errorModificacion &&
                        <Error texto={"Ocurrió un error inesperado al modificar el tratamiento."} 
                        onConfirm={() => setErrorModificacion(false)}/>
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

export default TratamientoRealizadoMod;
