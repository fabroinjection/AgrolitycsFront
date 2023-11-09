
// importar estilos
import './Diagnostico.css';

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


function Diagnostico({accionCancelar, idTomaMuestra}){

    const { handleSubmit, reset } = useForm();

    //variables
    const [ rendimiento, setRendimiento ] = useState("");
    const [ cultivos, setCultivos ] = useState();
    const [ cultivoSeleccionado, setCultivoSeleccionado ] = useState({label: "Cultivo a sembrar", value: 0});

    //variable para validación
    const [ camposVacios, setCamposVacios ] = useState(false);

    let navigate = useNavigate();

    //variable para setear el modo del pdf
    const [ , setModoPDF ] = useContext(ModoPDFContext);

    // variable para manejar que se muestre el error
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);

    //expresion regular para que el número sea real, separado con coma
    const numeroRealRegExpr = /^-?\d*([,]?\d{0,2})?$/;

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
                        }
                    }
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
            setCamposVacios(true);
            return false
        }
        else{
            setCamposVacios(false);
            return true;
        }
    }

    const handleGenerarDiagnostico = () => {
        const validacion = validarCampos();
        if(validacion){
            setModoPDF("diagnostico");
            Cookies.set("Rendimiento", rendimiento)
            Cookies.set("Cultivo", cultivoSeleccionado.value)
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
            <div className="capa">
    
                {/* Formulario Diagnóstico */}
                <Form className='formDiagnostico' onSubmit={handleSubmit(handleGenerarDiagnostico)}>
    
                {/* Título formulario */}
                    <div className='tituloFormDiagnostico'>
                        <strong className='tituloDiagnostico'>
                        Diagnóstico
                        </strong>
                    </div>
    
                    {/* Select de cultivo */}
                    <Form.Group className='mb-3 seccionCultivo'>
                        <Form.Label>Cultivo a sembrar</Form.Label>
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
                        <Form.Label>Rendimiento esperado</Form.Label>
                        <div className='inputContainer'>
                            <Form.Control type="text" placeholder="Ingrese Valor" className='inputRendimiento' 
                            value={rendimiento} onChange={handleChangeRendimiento}/>
                            <Form.Label>Ton/ha.</Form.Label>
                        </div>
    
                    </Form.Group>

                    {/* Mensaje de Faltan Campos */}
                    <Form.Group className='grupoForm'>
                        {camposVacios && <Form.Label className='labelFormError'>*Debe completar todos los campos</Form.Label>}
                    </Form.Group>
    
    
                    {/* Botones */}
                    <Form.Group className="mb-3 seccionBotonesDiagnostico">
                        <Button className="estiloBotonesDiagnostico botonCancelarDiagnostico" variant="secondary" onClick={handleCancelar}>
                            Cancelar
                        </Button>
    
                        <Button className="estiloBotonesDiagnostico botonConfirmarDiagnostico" variant="secondary"
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

