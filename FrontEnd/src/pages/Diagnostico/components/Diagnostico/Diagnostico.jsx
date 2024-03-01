
// importar estilos
import './Diagnostico.css';
import '../../../../components/Estilos/estilosFormulario.css';

// import componentes
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import Select from 'react-select';
import Error from '../../../../components/Modals/Error/Error';
import Cookies from 'js-cookie';

// import hooks
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

// import services
import { getCultivosService } from '../../../../services/diagnosticos.service';
import { renewToken } from '../../../../services/token.service';

// import Context
import { ModoPDFContext } from '../../../../context/ModoPDFContext';

// import utilities
import { toast } from 'react-toastify';


function Diagnostico({accionCancelar, idTomaMuestra}){

    const { handleSubmit, reset } = useForm();

    //variables
    const [ rendimiento, setRendimiento ] = useState("");
    const [ cultivos, setCultivos ] = useState();
    const [ cultivoSeleccionado, setCultivoSeleccionado ] = useState({label: "Cultivo a sembrar", value: 0});

    // state para manejar el rojo en los labels
    const [ errorCampos, setErrorCampos ] = useState(false);
    const [ rendimientoNoValido, setRendimientoNoValido ] = useState(false);

    let navigate = useNavigate();

    //variable para setear el modo del pdf
    const [ , setModoPDF ] = useContext(ModoPDFContext);

    // variable para manejar que se muestre el error
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);

    //expresion regular para que el número sea real, separado con coma
    const numeroRealRegExpr = /^-?\d*([,]?\d{0,2})?$/;

    // funcion toast para alerta nombre vacío
    const mostrarErrorCamposVacios = () => {
        toast.error('Debe completar todos los campos', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta 50 de rendimiento máximo
    const mostrarErrorRendimientoMaximo = () => {
        toast.error('El rendimiento ingresado debe ser menor o igual a 150 Ton/ha', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta 50 de rendimiento mínimo
    const mostrarErrorRendimientoMinimo = () => {
        toast.error('El rendimiento ingresado debe ser mayor a 0 Ton/ha', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para error inesperado
    const mostrarErrorInesperado = () => {
        toast.error('Ocurrió un error inesperado', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const handleChangeRendimiento = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setRendimiento(value);}
    }

    useEffect(() => {
        const fetchCultivos = async () => {
            try {
                const { data } = await getCultivosService();
                setCultivos(data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    try {
                        await renewToken();
                        const { data } = await getCultivosService();
                        setCultivos(data);
                    } catch (error) {
                        if (error.response && error.response.status === 401) {
                            setMostrarErrorVencimientoToken(true);
                        } else {
                            mostrarErrorInesperado();
                        }
                    }
                } else {
                    mostrarErrorInesperado();
                }
            }
        }
        fetchCultivos();
    }, [])

    const handleSesionExpirada = () => {
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
    }

    const handleChangeCultivo = (opcion) => {
        setCultivoSeleccionado(opcion);
    }

    const validarCampos = () => {
        if (rendimiento === "" || cultivoSeleccionado.value === 0){
            mostrarErrorCamposVacios();
            setRendimientoNoValido(false);
            setErrorCampos(true);
            return false
        } else if (rendimiento > 150) {
            mostrarErrorRendimientoMaximo();
            setErrorCampos(false);
            setRendimientoNoValido(true);
            return false;
        } else if (rendimiento < 0.01) {
            mostrarErrorRendimientoMinimo();
            setErrorCampos(false);
            setRendimientoNoValido(true);
        } else {
            setRendimientoNoValido(false);
            setErrorCampos(false);
            return true;
        }
    }

    const handleGenerarDiagnostico = () => {
        const validacion = validarCampos();
        if(validacion){
            setModoPDF("diagnostico");
            Cookies.set("Rendimiento", parseFloat(rendimiento.replace(",",".")));
            Cookies.set("Cultivo", cultivoSeleccionado.value);
            navigate(`/verPDF/${idTomaMuestra}`);
        }
        
    }

    const handleCancelar = () => {
        reset();
        accionCancelar();
    }

    if(cultivos){
        return(
            <>
            <div className="overlay">
    
                {/* Formulario Diagnóstico */}
                <Form className='formularioClaro formCentrado' onSubmit={handleSubmit(handleGenerarDiagnostico)}>
    
                {/* Título formulario */}
                    <div className='seccionTitulo'>
                        <strong className='tituloForm'>
                        Diagnóstico
                        </strong>
                    </div>
    
                    {/* Select de cultivo */}
                    <Form.Group className='mb-3 seccionCultivo'>
                        <Form.Label className={errorCampos && 'labelErrorFormulario'}>Cultivo a sembrar</Form.Label>
                        <Select className='selectCultivo' 
                        value={cultivoSeleccionado}
                        defaultValue={{label: "Cultivo a sembrar", value: 0}}
                        onChange={handleChangeCultivo}
                        options={
                            cultivos.map( cult => ({label: cult.nombre, value: cult.id}) )
                        }/>
                    </Form.Group>
    
                    {/* Input de rendimiento esperado */}
                    <Form.Group className='mb-3 seccionRendimiento'>
                        <Form.Label className={(rendimientoNoValido || errorCampos) && 'labelErrorFormulario'}>Rendimiento esperado</Form.Label>
                        <div className='inputContainer'>
                            <Form.Control type="text" placeholder="Ingrese Valor"
                            value={rendimiento} onChange={handleChangeRendimiento}/>
                            <Form.Label>Ton/ha.</Form.Label>
                        </div>
    
                    </Form.Group>
    
                    {/* Botones */}
                    <Form.Group className="mb-3 seccionFormulario seccionBotonesFormulario">
                        <Button className="botonCancelarFormulario" variant="secondary" onClick={handleCancelar}>
                            Cancelar
                        </Button>
    
                        <Button className="botonConfirmacionFormulario" variant="secondary"
                                type="submit">
                            Generar
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
        );
    
    }
    else{
        return(<></>)
    }
    }

export default Diagnostico;

