// importar estilos
import './estadisticas.css';
import '../../../components/Estilos/estilosFormulario.css';

//importar componentes
import NavbarBootstrap from '../../../components/Navbar/Navbar.components';
import Stack from 'react-bootstrap/Stack';
import { Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import Error from '../../../components/Modals/Error/Error';
import NoLogueado from '../../../components/Modals/NoLogueado/NoLogueado';

// importar hooks
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

// importar service
import { camposService } from '../../../services/campo.service';
import { renewToken } from '../../../services/token.service';
import { lotesCampoService } from '../../../services/lotes.service';
import { nutrientePorLoteService } from '../services/estadisticas.service';

// importar utilities
import { toast } from 'react-toastify';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Line } from 'react-chartjs-2';
import Cookies from 'js-cookie';
import moment from 'moment';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, Filler);

function NutrientesPorLote() {

    const { handleSubmit } = useForm();

    let navigate = useNavigate();

    //variable para el error de vencimiento token
    const [mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken] = useState(false);

    // error inesperado campos
    const [ errorCampos, setErrorCampos ] = useState(false);

    // error inesperado lotes
    const [ errorLotes, setErrorLotes ] = useState(false);

    // error nutrientes
    const [ errorNutrientes, setErrorNutrientes ] = useState(false);

    // variables para las opciones de los select
    const [ campos, setCampos ] = useState([]);
    const [ lotes, setLotes ] = useState([]);

    // variables para el form
    const [ campoSeleccionado, setCampoSeleccionado ] = useState();
    const [ loteSeleccionado, setLoteSeleccionado ] = useState();
    const [ nutrienteSeleccionado, setNutrienteSeleccionado ] = useState();

    const opcionesNutrientes = [
        {label: 'pH', value: 'ph'},
        {label: 'Materia Orgánica', value: 'materia_organica'},
        {label: 'Carbono Orgánico', value: 'carbono_organico'},
        {label: 'Nitrógeno Total', value: 'nitrogeno_total'},
        {label: 'Fósforo Extraible', value: 'fosforo_extraible'},
        {label: 'Calcio', value: 'calcio'},
        {label: 'Magnesio', value: 'magnesio'},
        {label: 'Sodio', value: 'sodio'},
        {label: 'Potasio', value: 'potasio'}
    ]

    const [ estadisticaGenerada, setEstadisticaGenerada ] = useState();
    const [ datosGrafico, setDatosGrafico ] = useState();

    // variables para el gráfico
    const opcionesGrafico = {
        responsive: true,
        animation: true,
        plugins: {
            legend: {
                display: false,
            }
        },
        scales: {
            y: {
                min: 0,
                title: {
                    display: true,
                    text: "Unidad",
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Fecha'
                }
            }
        }
    };

    // funcion toast para alerta campo no ingresado
    const mostrarErrorCampoVacio = () => {
        toast.error('Se debe ingresar un campo', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta campo error inesperado
    const mostrarErrorCampoInesperado = () => {
        toast.error('Ha ocurrido un error inesperado recuperando los campos', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta lote no ingresado
    const mostrarErrorLoteVacio = () => {
        toast.error('Se debe ingresar un lote', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta lote error inesperado
    const mostrarErrorLoteInesperado = () => {
        toast.error('Ha ocurrido un error inesperado recuperando los lotes', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta lote de otro campo
    const mostrarErrorLoteNoEsDelCampo = () => {
        toast.error('Se debe seleccionar un lote que pertenezca al campo seleccionado', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta nutriente no ingresado
    const mostrarErrorNutrienteVacio = () => {
        toast.error('Se debe ingresar un nutriente', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta usuario no válido (error 402)
    const mostrarErrorUsuarioNoValido = () => {
        toast.error('Ha ocurrido un error, el usuario no es válido', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta lote no encontrado (error 406)
    const mostrarErrorLoteNoEncontrado = () => {
        toast.error('Ha ocurrido un error, el lote no fue encontrado', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta campo no encontrado (error 407)
    const mostrarErrorCampoNoEncontrado = () => {
        toast.error('Ha ocurrido un error, el campo no fue encontrado', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta nutriente no válido (error 409)
    const mostrarErrorNutrienteNoValido = () => {
        toast.error('Ha ocurrido un error, el nutriente no es válido', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // Variable que cambia en base al tamaño de la pantalla
    const [anchoVentana, setAnchoVentana] = useState(window.innerWidth);

    const handleResize = () => {
        setAnchoVentana(window.innerWidth)
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return (() => {
            window.removeEventListener('resize', handleResize);
        })
    })

    useEffect(() => {
        const fetchCampos = async () => {
            try {
                const { data } = await camposService();
                setCampos(data);
            } catch (error) {
                if (error.response.status === 401) {
                    try {
                        await renewToken();
                        const { data } = await camposService();
                        setCampos(data);
                    } catch (error) {
                        if (error.response.status === 401) {
                            setMostrarErrorVencimientoToken(true);
                        } else {
                            mostrarErrorCampoInesperado();
                        }
                    }
                } else {
                    mostrarErrorCampoInesperado();
                }
            }
        }
        fetchCampos();
    }, []);

    useEffect(() => {
        if (campoSeleccionado) {
            const fetchLotes = async () => {
                try {
                    const { data } = await lotesCampoService(campoSeleccionado.value);
                    setLotes(data);
                } catch (error) {
                    if (error.response.status === 401) {
                        try {
                            await renewToken();
                            const { data } = await lotesCampoService(campoSeleccionado.value);
                            setLotes(data);
                        } catch (error) {
                            if (error.response.status === 401) {
                                setMostrarErrorVencimientoToken(true);
                            } else {
                                mostrarErrorLoteInesperado();
                            }
                        }
                    } else {
                        mostrarErrorLoteInesperado();
                    }
                }
            }
            fetchLotes();
        }
    }, [campoSeleccionado]);

    const handleChangeCampo = (opcion) => {
        setCampoSeleccionado(opcion);
    };

    const handleChangeLote = (opcion) => {
        setLoteSeleccionado(opcion);
    }

    const handleChangeNutriente = (opcion) => {
        setNutrienteSeleccionado(opcion);
    }

    const handleSesionExpirada = () => {
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
    }

    const validarForm = () => {
        if (!campoSeleccionado) {
            setErrorCampos(true);
            mostrarErrorCampoVacio();
            return false;
        } else {
            setErrorCampos(false);
        }

        if (!loteSeleccionado) {
            setErrorLotes(true);
            mostrarErrorLoteVacio();
            return false;
        } else if (loteSeleccionado.data !== campoSeleccionado.value) {
            setErrorLotes(true);
            setErrorCampos(true);
            mostrarErrorLoteNoEsDelCampo();
        } else {
            setErrorLotes(false);
            setErrorCampos(false);
        }

        if (!nutrienteSeleccionado) {
            setErrorNutrientes(true);
            mostrarErrorNutrienteVacio();
            return false;
        } else {
            setErrorNutrientes(false);
        }

        return true;
    }

    const generarEstadistica = async () => {
        if (validarForm()) {
            try {
                const { data } = await nutrientePorLoteService(campoSeleccionado.value, loteSeleccionado.value, nutrienteSeleccionado.value);
                setEstadisticaGenerada(data);
            } catch (error) {
                if (error.response.status === 401) {
                    try {
                        await renewToken();
                        const { data } = await nutrientePorLoteService(campoSeleccionado.value, loteSeleccionado.value, nutrienteSeleccionado.value);
                        setEstadisticaGenerada(data);
                    } catch (error) {
                        if (error.response.status === 401) {
                            setMostrarErrorVencimientoToken(true);
                        } else if (error.response.status === 402) {
                            mostrarErrorUsuarioNoValido();
                        } else if (error.response.status === 406) {
                            mostrarErrorLoteNoEncontrado();
                        } else if (error.response.status === 407) {
                            mostrarErrorCampoNoEncontrado();
                        } else if (error.response.status === 409) {
                            mostrarErrorNutrienteNoValido();
                        }
                    }
                } else if (error.response.status === 402) {
                    mostrarErrorUsuarioNoValido();
                } else if (error.response.status === 406) {
                    mostrarErrorLoteNoEncontrado();
                } else if (error.response.status === 407) {
                    mostrarErrorCampoNoEncontrado();
                } else if (error.response.status === 409) {
                    mostrarErrorNutrienteNoValido();
                }
            }
        }
    }

    useEffect(() => {
        if (estadisticaGenerada && estadisticaGenerada.length !== 0) {
            const datos = {
                labels: estadisticaGenerada.map(item => moment(item[2]).format('DD/MM/YYYY')),
                datasets: [{
                    label: estadisticaGenerada[0][0],
                    data: estadisticaGenerada.map(item => item[1]),
                    backgroundColor: 'rgba(97, 171, 64, 0.72)',
                    borderColor: 'rgba(97, 171, 64, 0.40)',
                }]
            }
            setDatosGrafico(datos);
        } else {
            setDatosGrafico();
        }
    }, [estadisticaGenerada]);

    if(window.localStorage.getItem('loggedAgroUser') && Cookies.get()){
        return (
            <>
                <NavbarBootstrap />
                <div className='contentedor-estadisticas'>
                    <div>
                        <span className='subtitulo'>Estadísticas de nutrientes por lote</span>
                        <p>Vea la evolución de los nutrientes de sus lotes en base a los tratamientos que realizó.</p>
                    </div>
                    <Form onSubmit={handleSubmit(generarEstadistica)}>
                        <Stack direction={(anchoVentana > 750) ? "horizontal" : "vertical"} gap={2} className='margen-bottom-20'>
                            <Form.Group className='p-2 misma-linea'>
                                <Form.Label className={errorCampos ? 'mr-8 labelErrorFormulario' : 'mr-8'}>Campo</Form.Label>
                                <Select 
                                    className='select-largo'
                                    value={campoSeleccionado}
                                    onChange={handleChangeCampo}
                                    options={
                                        campos.map(camp => ({label: camp.nombre, value: camp.id}))
                                    }
                                />
                            </Form.Group>
                            <Form.Group className='p-2 misma-linea'>
                                <Form.Label className={errorLotes ? 'mr-8 labelErrorFormulario' : 'mr-8'}>Lote</Form.Label>
                                <Select 
                                    className='select-largo'
                                    value={loteSeleccionado}
                                    onChange={handleChangeLote}
                                    options={
                                        lotes.map(lot => ({label: lot.nombre, value: lot.id, data: lot.campo_id}))
                                    }
                                />
                            </Form.Group>
                            <Form.Group className='p-2 misma-linea'>
                                <Form.Label className={errorNutrientes ? 'mr-8 labelErrorFormulario' : 'mr-8'}>Nutriente</Form.Label>
                                <Select 
                                    className='select-largo'
                                    value={nutrienteSeleccionado}
                                    onChange={handleChangeNutriente}
                                    options={opcionesNutrientes}
                                />
                            </Form.Group>
    
                            <Form.Group className='p-2 ms-auto'>
                                <Button className='botonConfirmacionFormulario' type='submit'>Generar</Button>
                            </Form.Group>
                        </Stack>
                    </Form>
    
                    {estadisticaGenerada && (
                        <div className='contenedor-grafico'>
                            {datosGrafico ? (
                                <Line data={datosGrafico} options={opcionesGrafico} />
                            ) : (
                                <div></div>
                            )}
                        </div>
                    )}

                </div>
                {
                    mostrarErrorVencimientoToken &&
                    <Error texto={"Su sesión ha expirado"} 
                    onConfirm={handleSesionExpirada}/>
                }
            </>
        );
    } else {
        return(<NoLogueado/>)
    }
       
    }
    



export default NutrientesPorLote;