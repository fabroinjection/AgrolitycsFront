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
import { fertilizantePorLoteService } from '../services/estadisticas.service';

// importar utilities
import { toast } from 'react-toastify';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from 'react-chartjs-2';
import Cookies from 'js-cookie';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend);

function PorcentajeFertilizantesLote() {

    const colorsForPorcentajeFertilizantesLote = [
    '#c3ca92',
    '#d0872b',
    '#a4b17b',
    '#4c453f',
    '#859864',
    '#697e50',
    '#4e653d',
    '#354c2b',
    '#20331b',
    ];

    let navigate = useNavigate();
    
    const { handleSubmit } = useForm();

    //variable para el error de vencimiento token
    const [mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken] = useState(false);

    // error inesperado campos
    const [ errorCampos, setErrorCampos ] = useState(false);

    // error inesperado lotes
    const [ errorLotes, setErrorLotes ] = useState(false);

    // variables para las opciones de los select
    const [ campos, setCampos ] = useState([]);
    const [ lotes, setLotes ] = useState([]);

    // variables para el form
    const [ campoSeleccionado, setCampoSeleccionado ] = useState();
    const [ loteSeleccionado, setLoteSeleccionado ] = useState();

    //variables para el gráfico
    const [ optionsGrafico, setOptionsGrafico ] = useState();
    const [ estadisticaGenerada, setEstadisticaGenerada ] = useState(false);
    const [ datosGrafico, setDatosGrafico ] = useState();
    
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

    // funcion toast para alerta usuario no válido (error 402)
    const mostrarErrorUsuarioNoValido = () => {
        toast.error('Ha ocurrido un error, el usuario no es válido', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta toma de muestra no encontrada (error 405)
    const mostrarErrorTMNoEncontrada = () => {
        toast.error('Ha ocurrido un error, la toma de muestra no fue encontrada', {
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

    // funcion toast para alerta no hay permisos (error 408)
    const mostrarErrorNoPermisos = () => {
        toast.error('Ha ocurrido un error, no tiene permisos para consultar el tratamiento', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta no hay tratamientos (error 409)
    const mostrarErrorNoTieneTratamientosAsociados = () => {
        toast.error('El lote seleccionado no tiene tratamientos asociados', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

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

        return true;
    }

    const generarEstadistica = async () => {
        setDatosGrafico();
        if (validarForm()) {
            try {
                const { data } = await fertilizantePorLoteService(campoSeleccionado.value, loteSeleccionado.value);
                setEstadisticaGenerada(data);
            } catch (error) {
                if (error.response.status === 401) {
                    try {
                        await renewToken();
                        const { data } = await fertilizantePorLoteService(campoSeleccionado.value, loteSeleccionado.value);
                        setEstadisticaGenerada(data);
                    } catch (error) {
                        if (error.response.status === 401) {
                            setMostrarErrorVencimientoToken();
                        } else if (error.response.status === 402) {
                            mostrarErrorUsuarioNoValido();
                        } else if (error.response.status === 405) {
                            mostrarErrorTMNoEncontrada();
                        } else if (error.response.status === 406) {
                            mostrarErrorLoteNoEncontrado();
                        } else if (error.response.status === 407) {
                            mostrarErrorCampoNoEncontrado();
                        } else if (error.response.status === 408) {
                            mostrarErrorNoPermisos();
                        } else if (error.response.status === 409) {
                            mostrarErrorNoTieneTratamientosAsociados();
                        }
                    }
                } else if (error.response.status === 402) {
                    mostrarErrorUsuarioNoValido();
                } else if (error.response.status === 405) {
                    mostrarErrorTMNoEncontrada();
                } else if (error.response.status === 406) {
                    mostrarErrorLoteNoEncontrado();
                } else if (error.response.status === 407) {
                    mostrarErrorCampoNoEncontrado();
                } else if (error.response.status === 408) {
                    mostrarErrorNoPermisos();
                } else if (error.response.status === 409) {
                    mostrarErrorNoTieneTratamientosAsociados();
                }
            }
        }
    }

    useEffect(() => {
        if (estadisticaGenerada) {
            const labels = Object.keys(estadisticaGenerada);
            const data = labels.map(label => estadisticaGenerada[label]);
    
            const dataRedondeada = data.map(value => (Math.round(value * 100) / 100).toFixed(2));
    
            if (!ChartJS.defaults.plugins.datalabels) {
                ChartJS.register(ChartDataLabels);
                ChartJS.defaults.plugins.datalabels = {
                    formatter: (value) => {
                        const sum = data.reduce((a, b) => a + b, 0);
                        const percentage = (value / sum) * 100;
                        return `${percentage.toFixed(2)}%`;
                    },
                    color: '#fff',
                    anchor: 'end',
                    align: 'start',
                };
            }

            const optionsGrafico = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        align: 'center',
                    },
                    datalabels: {
                        formatter: (value) => {
                            const sum = data.reduce((a, b) => a + b, 0);
                            const percentage = (value / sum) * 100;
                            return `${percentage.toFixed(2)}%`;
                        },
                        color: '#fff',
                        anchor: 'end',
                        align: 'start',
                    },
                },
                elements: {
                    arc: {
                        backgroundColor: colorsForPorcentajeFertilizantesLote,
                        borderColor: '#fff',
                        borderWidth: 2,
                    },
                },
            };
    
            const nuevoDatosGrafico = {
                labels: labels,
                datasets: [
                    {
                        data: dataRedondeada,
                        borderColor: '#fff',
                        borderWidth: 2,
                        datalabels: {
                            display: true,
                        },
                    },
                ],
            };
    
            setDatosGrafico(nuevoDatosGrafico);
            setOptionsGrafico(optionsGrafico)
        } else {
            setDatosGrafico();
            setOptionsGrafico();
        }
    }, [estadisticaGenerada]);

    if(window.localStorage.getItem('loggedAgroUser') && Cookies.get()){
        return (
            <>
                <NavbarBootstrap />
                <div className='contentedor-estadisticas'>
                    <div>
                        <span className='subtitulo'>Porcentaje de fertilizantes aplicados por lote</span>
                        <p>Vea el procentaje de fertilizantes que aplicó en su lote en todos los tratamientos le realizó al lote.</p>
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
        
                            <Form.Group className='p-2 ms-auto'>
                                <Button className='botonConfirmacionFormulario' type='submit'>Generar</Button>
                            </Form.Group>
                        </Stack>
                    </Form>
                    {estadisticaGenerada && (
                        <div className='contenedor-grafico'>
                            {(datosGrafico && optionsGrafico) ? (
                                <Pie data={datosGrafico} options={optionsGrafico} />
                            ) : (
                                <div></div>
                            )}
                        </div>
                    )}
        
                </div>
        
                {mostrarErrorVencimientoToken && (
                    <Error texto={"Su sesión ha expirado"} onConfirm={handleSesionExpirada} />
                )}
            
            </>
        );
    } else {
        return(<NoLogueado/>)
    }
        
    
    }


export default PorcentajeFertilizantesLote;