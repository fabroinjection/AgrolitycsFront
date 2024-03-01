// importar estilos
import '../../../../components/Estilos/estilosListados.css';
import '../../../../components/Estilos/estilosFormulario.css';

// importar componentes
import NavbarBootstrap from '../../../../components/Navbar/Navbar.components';
import { Form, Stack, Button } from 'react-bootstrap';
import Select from 'react-select';
import TratamientoCard from '../TratamientoCard/TratamientoCard';
import NoLogueado from '../../../../components/Modals/NoLogueado/NoLogueado';
import Error from '../../../../components/Modals/Error/Error';
import HelpButton from '../../../../components/Ayuda/HelpButton';

// importar utilities
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

// importar services
import { camposService } from '../../../../services/campo.service';
import { renewToken } from '../../../../services/token.service';
import { lotesCampoService } from '../../../../services/lotes.service';
import { listadoTratamientoService } from '../../services/tratamientos.service';

// importar hooks
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function ListadoTratamientos() {

    let navigate = useNavigate();

    const { handleSubmit } = useForm();

    // variables para las opciones del select
    const [ campos, setCampos ] = useState([]);
    const [ lotes, setLotes ] = useState([]);

    // variable para los tratamientos
    const [ tratamientos, setTratamientos ] = useState([]);

    // variables para el form
    const [ campoSeleccionado, setCampoSeleccionado ] = useState();
    const [ loteSeleccionado, setLoteSeleccionado ] = useState();

    // variable para manejar estado de eliminacion de un tratamiento
    const [ eliminacion, setEliminacion ] = useState(false);

    // variable para manejar estado de no hay tratamientos
    const [ noTratamientos, setNoTratamientos ] = useState(false);

    //variables para manejar el renderizado de alertas de error
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);

    // variables para manejar el rojo de los labels
    const [ errorCampos, setErrorCampos ] = useState(false);
    const [ errorLotes, setErrorLotes ] = useState(false);

    const [anchoVentana, setAnchoVentana] = useState(window.innerWidth);

    // funcion toast para alerta consulta campos fallida
    const mostrarErrorCamposInesperado = () => {
        toast.error('Ocurrió un error inesperado al buscar sus campos, intente nuevamente más tarde.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta consulta lotes fallida
    const mostrarErrorLotesInesperado = () => {
        toast.error('Ocurrió un error inesperado al buscar sus lotes, intente nuevamente más tarde.', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta campo no ingresado
    const mostrarErrorCampoVacio = () => {
        toast.error('Se debe ingresar un campo', {
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

    // funcion toast para alerta lote de otro campo
    const mostrarErrorLoteNoEsDelCampo = () => {
        toast.error('Se debe seleccionar un lote que pertenezca al campo seleccionado', {
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
                            mostrarErrorCamposInesperado();
                        }
                    }
                } else {
                    mostrarErrorCamposInesperado();
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
                                mostrarErrorLotesInesperado();
                            }
                        }
                    } else {
                        mostrarErrorLotesInesperado();
                    }
                }
            }
            fetchLotes();
        }
    }, [campoSeleccionado]);

    const handleResize = () => {
        setAnchoVentana(window.innerWidth)
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return (() => {
            window.removeEventListener('resize', handleResize);
        })
    })


    const handleSesionExpirada = () => {
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
    }

    const handleChangeCampo = (opcion) => {
        setCampoSeleccionado(opcion);
    }

    const handleChangeLote = (opcion) => {
        setLoteSeleccionado(opcion);
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

    const consultarTratamientos = async () => {
        if (validarForm()) {
            try {
                const { data } = await listadoTratamientoService(loteSeleccionado.value);
                if (data.length === 0) {
                    setNoTratamientos(true);
                } else {
                    setNoTratamientos(false);
                }
                setTratamientos(data);
            } catch (error) {
                if (error.response.status === 401) {
                    try {
                        await renewToken();
                        const { data } = await listadoTratamientoService(loteSeleccionado.value);
                        setTratamientos(data);
                    } catch (error) {
                        if (error.response.status === 401) {
                            setMostrarErrorVencimientoToken(true);
                        } else if (error.response.status === 405) {
                            setNoTratamientos(true);
                        } else {
                            mostrarErrorLotesInesperado();
                        }
                    }
                } else if (error.response.status === 405) {
                    setNoTratamientos(true);
                } else {
                    mostrarErrorLotesInesperado();
                }
            }
        }
    }

    useEffect(() => {
        if (eliminacion) {
            consultarTratamientos();
        }
    }, [eliminacion]);

    const actualizarLista = () => {
        setEliminacion(true);
    }

    const resetearEliminacion = () => {
        setEliminacion(false);
    }

    if(window.localStorage.getItem('loggedAgroUser') && Cookies.get()){
        return (
            <>
                <NavbarBootstrap />
                <div className='contenedor-listado'>
                    <div className='sector-titulo-listado'>
                        <div>
                            <strong className='titulo-listado'>Tratamientos realizados</strong>
                        </div>
                        <div>
                            <strong>Seleccione un campo y lote para visualizar los tratamientos realizados.</strong>
                        </div>                
                    </div>
                    <Form onSubmit={handleSubmit(consultarTratamientos)}>
                            <Stack direction={ (anchoVentana > 750) ? "horizontal" : "vertical"} gap={2} className='margen-bottom-20'>
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
                                    <Button className='botonConfirmacionFormulario' type='submit'>Buscar</Button>
                                </Form.Group>
                            </Stack>
                        </Form>
                        <div className='listado-contenedor'>
                            <div className='listado-scroll'>
                                {tratamientos.map((trat)=>(
                                    <TratamientoCard key={trat.id} tratamiento={trat} onEliminar={actualizarLista} postEliminar={resetearEliminacion}/>
                                ))}
                                {noTratamientos && 
                                    <div>No tienes tratamientos asociados a tu lote.</div>
                                }
                            </div>
                        </div>
                </div>
                <HelpButton/>

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

export default ListadoTratamientos;