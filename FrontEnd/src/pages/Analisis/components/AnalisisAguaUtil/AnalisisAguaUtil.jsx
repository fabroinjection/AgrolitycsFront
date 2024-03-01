// Importar estilos
import '../../components/Analisis.css';
import '../../../../components/Estilos/estilosFormulario.css';

// Importar componentes
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import { Button } from "react-bootstrap";
import Error from '../../../../components/Modals/Error/Error';
import Confirm from '../../../../components/Modals/Confirm/Confirm';
import Alerta from '../../../../components/Modals/Alerta/Alerta';
import DatePicker from "react-datepicker";
import SpinnerAgrolitycs from "../../../../components/Spinner/SpinnerAgrolitycs";

// Importar hooks
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

// import utilities
import { toast } from 'react-toastify';
import moment from 'moment';

// Importar services
import { registrarNuevoAnalisisAguautil, modificarAnalisisAguaService } from '../../services/analisis.service';
import { renewToken } from '../../../../services/token.service';
import { laboratoriosService } from '../../../../services/laboratorios.service';
import { consultarLaboratorio } from '../../../../services/laboratorios.service';
import { darDeBajaAnalisisService } from '../../services/analisis.service';

function AnalisisAguaUtil({ tomaDeMuestra, analisisAguaUtil = undefined, fechaTomaMuestra = undefined}) {

    const { handleSubmit, reset } = useForm();

    //variable para manejar estado peticiones en botones
    const [ estaEnPeticion, setEstaEnPeticion ] = useState(false);

    const [ seteado, setSeteado ] = useState(false);

    let navigate = useNavigate();

    const [ startDate, setStartDate ] = useState();
    const [ pH, setPH ] = useState("");
    const [ conductividadElectrica, setConductividadElectrica ] = useState("");
    const [ ras, setRas ] = useState("");
    const [ csr, setCsr ] = useState("");
    const [ cloruros, setcloruros ] = useState("");
    const [ nitratos, setNitratos ] = useState("");
    const [ fosfatos, setFosfatos ] = useState("");
    const [ calcio, setCalcio ] = useState("");
    const [ magnesio, setMagnesio ] = useState("");
    const [ sodio, setSodio ] = useState("");
    const [ potasio, setPotasio ] = useState("");
    const [ carbonatos, setCarbonatos ] = useState("");
    const [ bicarbonatos, setBicarbonatos ] = useState("");
    const [ residuoSeco, setResiduoSeco ] = useState("");
    const [ dureza, setDureza ] = useState("");
    const [ alcalinidad, setAlcalinidad ] = useState("");
    const [ humedad, setHumedad ] = useState("");
    const [ sulfatos, setSulfatos ] = useState("");
    const [ boro, setBoro ] = useState("");
    const [ densidadAparente, setDensidadAparente ] = useState("1,25");

    const [ fechaVacio, setFechaVacio ] = useState(false);
    const [ pHVacio, setPHVacio ] = useState(false);
    const [ conductividadElectricaVacio, setConductividadElectricaVacio ] = useState(false);
    const [ unidadConductividadElectricaVacio, setUnidadConductividadElectricaVacio ] = useState(false);
    const [ rasVacio, setRasVacio ] = useState(false);
    const [ clorurosVacio, setclorurosVacio ] = useState(false);
    const [ unidadclorurosVacio, setUnidadclorurosVacio ] = useState(false);
    const [ calcioVacio, setCalcioVacio ] = useState(false);
    const [ magnesioVacio, setMagnesioVacio ] = useState(false);
    const [ unidadNitratosVacio, setUnidadNitratosVacio ] = useState(false);
    const [ unidadFosfatosVacio, setUnidadFosfatosVacio ] = useState(false);
    const [ potasioVacio, setPotasioVacio ] = useState(false);
    const [ sodioVacio, setSodioVacio ] = useState(false);
    const [ densidadVacio, setDensidadVacio ] = useState(false);
    const [ unidadBasicaSeleccionadaVacio, setUnidadBasicaSeleccionadaVacio ] = useState(false);
    const [ unidadCarbonatosSeleccionadaVacio, setUnidadCarbonatosSeleccionadaVacio ] = useState(false);
    const [ unidadBicarbonatosSeleccionadaVacio, setUnidadBicarbonatosSeleccionadaVacio ] = useState(false);
    const [ unidadDensidadVacio, setUnidadDensidadVacio ] = useState(false);
    const [ unidadSulfatosVacio, setUnidadSulfatosVacio ] = useState(false);
    const [ unidadResiduoSecoVacio, setUnidadResiduoSecoVacio ] = useState(false);
    const [ unidadAlcalinidadVacio, setUnidadAlcalinidadVacio ] = useState(false);
    const [ unidadDurezaVacio, setUnidadDurezaVacio ] = useState(false);
    const [ unidadBoroVacio, setUnidadBoroVacio ] = useState(false);

    const unidadesBasico = [ {label: "ppm", value: 0},
                        {label: "meq/L", value: 1},
                        {label: "mg/L", value: 2}];

    const unidadesDurezaAlcalinidad = [ {label: "ppm CaCO3", value: 0},
                                    {label: "meq/L CaCO3", value: 1},
                                    {label: "mg/L CaCO3", value: 2}];

    const unidadesConductividadElectrica = [{label: "mS/cm", value: 0},
                                            {label: "dS/m", value: 1},
                                            {label: "µS/cm", value: 2}];
    
    const unidadesDensidad = [{label: "gr/cm3", value: 0},
                                {label: "Mg/m3", value: 1},
                                {label: "Ton/m3", value: 2}];
    
    const unidadesResiduoSeco = [ {label: "ppm", value: 0},
                                {label: "mg/L", value: 1}];

    
    const [ laboratorios, setLaboratorios ] = useState();

    const [ laboratorioSeleccionado, setLaboratorioSeleccionado ] = useState({label: "Seleccione Laboratorio",
                                                                            value: 0});
    const [ laboratorioVacio, setLaboratorioVacio ] = useState(false);
    
    // variable para guardar el laboratorio del análisis consultado
    const [ laboratorioAnalisis, setLaboratorioAnalisis ] = useState();

    // variables extra para el modo modificar
    const [ modo, setModo ] = useState();
    const [ startDateModificacion, setStartDateModificacion ] = useState();

    const handleChangeLaboratorio = (laboratorio) => {
        setLaboratorioSeleccionado({label: laboratorio.label, value: laboratorio.value});
    }

    const [ unidadConductividadElectrica, setUnidadConductividadElectrica ] = useState();
    const [ unidadcloruroseleccionada, setUnidadcloruroseleccionada ] = useState();
    const [ unidadFosfatoSeleccionada, setUnidadFosfatoSeleccionada ] = useState();
    const [ unidadBasicaSeleccionada, setUnidadBasicaSeleccionada ] = useState();
    const [ unidadNitratosSeleccionada, setUnidadNitratosSeleccionada ] = useState();
    const [ unidadCarbonatosSeleccionada, setUnidadCarbonatosSeleccionada ] = useState();
    const [ unidadBicarbonatosSeleccionada, setUnidadBicarbonatosSeleccionada ] = useState();
    const [ unidadResiduoSecoSeleccionada, setUnidadResiduoSecoSeleccionada ] = useState();
    const [ unidadDurezaSeleccionada, setUnidadDurezaSeleccionada ] = useState();
    const [ unidadDensidad, setUnidadDensidad ] = useState({label: "gr/cm3", value: 0});
    const [ unidadAlcalinidadSeleccionada, setUnidadAlcalinidadSeleccionada ] = useState();
    const [ unidadSulfatosSeleccionada, setUnidadSulfatosSeleccionada ] = useState();
    const [ unidadBoroSeleccionada, setUnidadBoroSeleccionada ] = useState();
    
    //expresion regular para que el número sea real, separado con coma
    const numeroRealRegExpr = /^-?\d*([,]?\d{0,4})?$/;
    
    // variable para manejar que se muestre el error
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);
    const [ mostrarAlertaAnalisisDiagnosticado , setMostrarAlertaAnalisisDiagnosticado ] = useState(false);

    // variable para mostrar que se creo correctamente el análisis
    const [ mostrarAnalisisRegistrado, setMostrarAnalisisRegistrado ] = useState(false);
    const [ mostrarAnalisisModificado, setMostrarAnalisisModificado ] = useState(false);
    const [ mostrarAnalisisEliminado, setMostrarAnalisisEliminado ] = useState(false);

    // variables para solicitar confirmacion usuario en la eliminacion
    const [ mostrarConfirmEliminacion, setMostrarConfirmEliminacion ] = useState(false);

    // variable para manejar la muestra de errores en la eliminacion
    const [ mostrarErrorEstadoAnterior, setMostrarErrorEstadoAnterior ] = useState(false);
    const [ mostrarErrorUsuarioNoEncontrado, setMostrarErrorUsuarioNoEncontrado ] = useState(false);
    const [ mostrarErrorTMNoEncontrada, setMostrarErrorTMNoEncontrada ] = useState(false);
    const [ mostrarErrorLoteNoEncontrado, setMostrarErrorLoteNoEncontrado ] = useState(false);
    const [ mostrarErrorCampoNoEncontrado, setMostrarErrorCampoNoEncontrado ] = useState(false);
    const [ mostrarErrorProductorNoEncontrado, setMostrarErrorProductorNoEncontrado ] = useState(false);
    const [ mostrarErrorPermisos, setMostrarErrorPermisos ] = useState(false);
    const [ mostrarErrorDiagnosticoAsociado, setMostrarErrorDiagnosticoAsociado ] = useState(false);
    const [ mostrarErrorAnalisisNoEncontrado, setMostrarErrorAnalisisNoEncontrado ] = useState(false);
    const [ mostrarErrorEstadoNoEncontrado, setMostrarErrorEstadoNoEncontrado ] = useState(false);
    const [ mostrarErrorEliminacion, setMostrarErrorEliminacion ] = useState(false);
    const [ errorLaboratoriosNoRegistrados, setErrorLaboratoriosNoRegistrados ] = useState(false);

    const mostrarErrorFechaVacia = () => {
        toast.error('Se debe ingresar una fecha', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorLaboratorioVacio = () => {
        toast.error('Se debe ingresar un laboratorio', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorPhVacio = () => {
        toast.error('Se debe ingresar el nutriente pH', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorConductividadVacio = () => {
        toast.error('Se debe ingresar el nutriente conductividad eléctrica', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorRASVacio = () => {
        toast.error('Se debe ingresar el nutriente RAS', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorClorurosVacio = () => {
        toast.error('Se debe ingresar el nutriente cloruros', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }


    const mostrarErrorCalcioVacio = () => {
        toast.error('Se debe ingresar el nutriente calcio', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }


    const mostrarErrorMagnesioVacio = () => {
        toast.error('Se debe ingresar el nutriente magnesio', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorSodioVacio = () => {
        toast.error('Se debe ingresar el nutriente sodio', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorPotasioVacio = () => {
        toast.error('Se debe ingresar el nutriente potasio', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorDensidadVacio = () => {
        toast.error('Se debe ingresar el nutriente densidad', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorUnidadVacio = () => {
        toast.error('Se debe ingresar una unidad para el calcio, sodio, magnesio y potasio', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorUnidadConductividadVacio = () => {
        toast.error('Se debe ingresar una unidad para la conductividad eléctrica', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorUnidadClorurosVacio = () => {
        toast.error('Se debe ingresar una unidad para los cloruros', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorUnidadDensidadVacio = () => {
        toast.error('Se debe ingresar una unidad para la densidad', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorUnidadNitratosVacio = () => {
        toast.error('Se debe ingresar una unidad para los nitratos', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorUnidadFosfatosVacio = () => {
        toast.error('Se debe ingresar una unidad para los fosfatos', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorUnidadCarbonatosVacio = () => {
        toast.error('Se debe ingresar una unidad para los carbonatos', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorUnidadBicarbonatosVacio = () => {
        toast.error('Se debe ingresar una unidad para los bicarbonatos', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorUnidadResiduoSecoVacio = () => {
        toast.error('Se debe ingresar una unidad para los residuos secos', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorUnidadDurezaTotalVacio = () => {
        toast.error('Se debe ingresar una unidad para la dureza total', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorUnidadAlcalinidadVacio = () => {
        toast.error('Se debe ingresar una unidad para la alcalinidad', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorUnidadSulfatosVacio = () => {
        toast.error('Se debe ingresar una unidad para los sulfatos', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorUnidadBoroVacio = () => {
        toast.error('Se debe ingresar una unidad para el boro', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const handleChangePH = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 14)){setPH(value);}
    }

    const handleChangeConductividadElectrica = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setConductividadElectrica(value);}
    }

    const handleChangeUnidadCondElect = (opcion) => {
        setUnidadConductividadElectrica(opcion);
    }

    const handleChangeRas = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setRas(value);}
    }

    const handleChangeCsr = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setCsr(value);}
    }

    const handleChangecloruros = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setcloruros(value);}
    }

    const handleChangeUnidadCloro = (opcion) => {
        setUnidadcloruroseleccionada(opcion);
    }

    const handleChangeNitratos = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setNitratos(value);}
    }

    const handleChangeUnidadNitratos = (opcion) => {
        setUnidadNitratosSeleccionada(opcion);
    }

    const handleChangeFosfatos = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setFosfatos(value);}
    }

    const handleChangeUnidadFosfatos = (opcion) => {
        setUnidadFosfatoSeleccionada(opcion);
    }

    const handleChangeMagnesio = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setMagnesio(value);}
    }

    const handleChangeCalcio = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setCalcio(value);}
    }

    const handleChangeUnidadBasica = (unidad) => {
        setUnidadBasicaSeleccionada(unidad);
    }

    const handleChangeSodio = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setSodio(value);}
    }

    const handleChangePotasio = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setPotasio(value);}
    }

    const handleChangeCarbonatos = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setCarbonatos(value);}
    }

    const handleChangeUnidadCarbonatos = (opcion) => {
        setUnidadCarbonatosSeleccionada(opcion);
    }

    const handleChangeBicarbonatos = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setBicarbonatos(value);}
    }

    const handleChangeUnidadBicarbonatos = (opcion) => {
        setUnidadBicarbonatosSeleccionada(opcion);
    }

    const handleChangeResiduoSeco = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setResiduoSeco(value);}
    }

    const handleChangeUnidadResiduoSeco = (opcion) => {
        setUnidadResiduoSecoSeleccionada(opcion);
    }

    const handleChangeDureza = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setDureza(value);}
    }

    const handleChangeUnidadDureza = (opcion) => {
        setUnidadDurezaSeleccionada(opcion);
    }

    const handleChangeAlcalinidad = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setAlcalinidad(value);}
    }

    const handleChangeUnidadAlcalinidad = (opcion) => {
        setUnidadAlcalinidadSeleccionada(opcion);
    }

    const handleChangeSulfatos = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setSulfatos(value);}
    }

    const handleChangeBoro = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setBoro(value);}
    }

    const handleChangeUnidadBoro = (opcion) => {
        setUnidadBoroSeleccionada(opcion);
    }

    const handleChangeUnidadSulfatos = (opcion) => {
        setUnidadSulfatosSeleccionada(opcion);
    }

    const handleChangeHumedad = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 100)){setHumedad(value);}
    }

    const handleChangeDensidadAparente = (e) => {
        const { value } = e.target;
        if(value == "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setDensidadAparente(value);}
    }

    const handleChangeUnidadDensidad = (opcion) => {
        setUnidadDensidad(opcion);
    }

    const handleCancelar = () => {
        reset();
        navigate(-1);
    }

    const validarCampos = () => {
        if(modo === "modificar"){
            if(startDateModificacion == undefined){
                setFechaVacio(true);
                mostrarErrorFechaVacia();
                setEstaEnPeticion(false);
                return false;
            }
            else{
                setFechaVacio(false);
            }
        }
        else {
            if(startDate == undefined){
                setFechaVacio(true);
                mostrarErrorFechaVacia();
                setEstaEnPeticion(false);
                return false;
            }
            else{
                setFechaVacio(false);
            }
    
        }
        
        if (laboratorioSeleccionado.value === 0) {
            setLaboratorioVacio(true);
            mostrarErrorLaboratorioVacio();
            setEstaEnPeticion(false);
            return false;
        } else {
            setLaboratorioVacio(false);
        }

        if(pH === "") {
            setPHVacio(true);
            mostrarErrorPhVacio();
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setPHVacio(false);
        }

        if(conductividadElectrica === ""){
            setConductividadElectricaVacio(true);
            mostrarErrorConductividadVacio();
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setConductividadElectricaVacio(false);
        }

        if(unidadConductividadElectrica === undefined){
            setUnidadConductividadElectricaVacio(true);
            mostrarErrorUnidadConductividadVacio();
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setUnidadConductividadElectricaVacio(false);
        }

        if(ras === ""){
            setRasVacio(true);
            mostrarErrorRASVacio();
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setRasVacio(false);
        }

        if(cloruros === ""){
            setclorurosVacio(true);
            mostrarErrorClorurosVacio();
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setclorurosVacio(false);
        }

        if(unidadcloruroseleccionada === undefined){
            setUnidadclorurosVacio(true);
            mostrarErrorUnidadClorurosVacio();
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setUnidadclorurosVacio(false);
        }

        if(nitratos !== ""){
            if(unidadNitratosSeleccionada === undefined){
                setUnidadNitratosVacio(true);
                mostrarErrorUnidadNitratosVacio();
                setEstaEnPeticion(false);
                return false;
            }
            else{
                setUnidadNitratosVacio(false);
            }
        }
        else{
            setUnidadNitratosVacio(false);
        }
        
        if(fosfatos !== ""){
            if(unidadFosfatoSeleccionada === undefined){
                setUnidadFosfatosVacio(true);
                mostrarErrorUnidadFosfatosVacio();
                setEstaEnPeticion(false);
                return false;
            }
            else{
                setUnidadFosfatosVacio(false);
            }
        }
        else{
            setUnidadFosfatosVacio(false);
        }

        if(calcio === "") {
            setCalcioVacio(true);
            mostrarErrorCalcioVacio();
            setEstaEnPeticion(false);
            return false;
        } else {
            setCalcioVacio(false);
        }

        if (magnesio === "") {
            setMagnesioVacio(true);
            mostrarErrorMagnesioVacio();
            setEstaEnPeticion(false);
            return false;
        } else {
            setMagnesioVacio(false);
        }


        if(sodio === "") {
            setSodioVacio(true);
            mostrarErrorSodioVacio();
            setEstaEnPeticion(false);
            return false;
        } else {
            setSodioVacio(false);
        }

        if(potasio === "") {
            setPotasioVacio(true);
            mostrarErrorPotasioVacio();
            setEstaEnPeticion(false);
            return false;
        } else {
            setPotasioVacio(false);
        }

        if(unidadBasicaSeleccionada === undefined){
            setUnidadBasicaSeleccionadaVacio(true);
            mostrarErrorUnidadVacio();
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setUnidadBasicaSeleccionadaVacio(false);
        }

        if(carbonatos !== ""){
            if(unidadCarbonatosSeleccionada === undefined){
                setUnidadCarbonatosSeleccionadaVacio(true);
                mostrarErrorUnidadCarbonatosVacio();
                setEstaEnPeticion(false);
                return false;
            }
            else{
                setUnidadCarbonatosSeleccionadaVacio(false);
            }
        }
        else{
            setUnidadCarbonatosSeleccionadaVacio(false);
        }

        if(bicarbonatos !== ""){
            if(unidadBicarbonatosSeleccionada === undefined){
                setUnidadBicarbonatosSeleccionadaVacio(true);
                mostrarErrorUnidadBicarbonatosVacio();
                setEstaEnPeticion(false);
                return false;
            }
            else{
                setUnidadBicarbonatosSeleccionadaVacio(false);
            }
        }
        else{
            setUnidadBicarbonatosSeleccionadaVacio(false);
        }

        if (sulfatos !== "") {
            if (unidadSulfatosSeleccionada === undefined) {
                setUnidadSulfatosVacio(true);
                mostrarErrorUnidadSulfatosVacio();
                setEstaEnPeticion(false);
                return false;
            } else {
                setUnidadSulfatosVacio(false);
            }
        } else {
            setUnidadSulfatosVacio(false);
        }

        if (residuoSeco !== "") {
            if (unidadResiduoSecoSeleccionada === undefined) {
                setUnidadResiduoSecoVacio(true);
                mostrarErrorUnidadResiduoSecoVacio();
                setEstaEnPeticion(false);
                return false;
            } else {
                setUnidadResiduoSecoVacio(false);
            }
        } else {
            setUnidadResiduoSecoVacio(false);
        }

        if (dureza !== "") {
            if (unidadDurezaSeleccionada === undefined) {
                setUnidadDurezaVacio(true);
                mostrarErrorUnidadDurezaTotalVacio();
                setEstaEnPeticion(false);
                return false;
            } else {
                setUnidadDurezaVacio(false);
            }
        } else {
            setUnidadDurezaVacio(false);
        }

        if (alcalinidad !== "") {
            if (unidadAlcalinidadSeleccionada === undefined) {
                setUnidadAlcalinidadVacio(true);
                mostrarErrorUnidadAlcalinidadVacio();
                setEstaEnPeticion(false);
                return false;
            } else {
                setUnidadAlcalinidadVacio(false);
            }
        } else {
            setUnidadAlcalinidadVacio(false);
        }

        if (boro !== "") {
            if (unidadBoroSeleccionada === undefined) {
                setUnidadBoroVacio(true);
                mostrarErrorUnidadBoroVacio();
                setEstaEnPeticion(false);
                return false;
            } else {
                setUnidadBoroVacio(false);
            }
        } else {
            setUnidadBoroVacio(false);
        }

        if (densidadAparente === "") {
            setDensidadVacio(true);
            mostrarErrorDensidadVacio();
            setEstaEnPeticion(false);
            return false;
        } else {
            setDensidadVacio(false);
        }

        if (unidadDensidad === undefined) {
            setUnidadDensidadVacio(true);
            mostrarErrorUnidadDensidadVacio();
            setEstaEnPeticion(false);
            return false;
        } else {
            setUnidadDensidadVacio(false);
        }

        return true;
    }

    const registrarAnalisisAguaUtil = async () => {
        setEstaEnPeticion(true);
        const validacion = validarCampos();
        if(validacion){
            const nuevoAnalisisAguaUtil = {
                ph: parseFloat(pH.replace(",",".")),
                conductividad_electrica: parseFloat(conductividadElectrica.replace(",",".")),
                conductividad_electrica_unidad: unidadConductividadElectrica.label,
                relacion_absorcion_sodio: parseFloat(ras.replace(",",".")),
                cloruros: parseFloat(cloruros.replace(",",".")),
                cloruros_unidad: unidadcloruroseleccionada.label,
                calcio: parseFloat(calcio.replace(",",".")),
                calcio_unidad: unidadBasicaSeleccionada.label,
                magnesio: parseFloat(magnesio.replace(",",".")),
                magnesio_unidad: unidadBasicaSeleccionada.label,
            }
            
            if (nitratos !== "") {
                nuevoAnalisisAguaUtil.nitratos = parseFloat(nitratos.replace(",","."));
                nuevoAnalisisAguaUtil.nitratos_unidad = unidadNitratosSeleccionada.label;
            } else {
                nuevoAnalisisAguaUtil.nitratos = null;
                nuevoAnalisisAguaUtil.nitratos_unidad = "";
            }

            if (fosfatos !== "") {
                nuevoAnalisisAguaUtil.fosfatos = parseFloat(fosfatos.replace(",","."));
                nuevoAnalisisAguaUtil.fosfatos_unidad = unidadFosfatoSeleccionada.label;
            } else {
                nuevoAnalisisAguaUtil.fosfatos = null;
                nuevoAnalisisAguaUtil.fosfatos_unidad = "";
            }

            nuevoAnalisisAguaUtil.potasio = parseFloat(potasio.replace(",","."));
            nuevoAnalisisAguaUtil.potasio_unidad = unidadBasicaSeleccionada.label;
            nuevoAnalisisAguaUtil.sodio = parseFloat(sodio.replace(",","."));
            nuevoAnalisisAguaUtil.sodio_unidad = unidadBasicaSeleccionada.label;

            nuevoAnalisisAguaUtil.fecha_analisis = moment(startDate).format("YYYY-MM-DD");
            nuevoAnalisisAguaUtil.laboratorio_id = laboratorioSeleccionado.value;


            if(carbonatos !== ""){
                nuevoAnalisisAguaUtil.carbonatos = parseFloat(carbonatos.replace(",","."));
                nuevoAnalisisAguaUtil.carbonatos_unidad = unidadCarbonatosSeleccionada.label;
            }
            else{
                nuevoAnalisisAguaUtil.carbonatos = null;
                nuevoAnalisisAguaUtil.carbonatos_unidad = "";
            }

            if(bicarbonatos !== ""){
                nuevoAnalisisAguaUtil.bicarbonatos = parseFloat(bicarbonatos.replace(",","."));
                nuevoAnalisisAguaUtil.bicarbonatos_unidad = unidadBicarbonatosSeleccionada.label;
            }
            else{
                nuevoAnalisisAguaUtil.bicarbonatos = null;
                nuevoAnalisisAguaUtil.bicarbonatos_unidad = "";
            }

            if(humedad !== ""){
                nuevoAnalisisAguaUtil.humedad_gravimetrica = parseFloat(humedad.replace(",","."));
            }
            else{
                nuevoAnalisisAguaUtil.humedad_gravimetrica = null;
            }

            if (csr !== "") {
                nuevoAnalisisAguaUtil.csr = parseFloat(csr.replace(",","."));
            } else {
                nuevoAnalisisAguaUtil.csr = null;
            }

            if (sulfatos !== "") {
                nuevoAnalisisAguaUtil.sulfatos = parseFloat(sulfatos.replace(",","."));
                nuevoAnalisisAguaUtil.sulfatos_unidad = unidadSulfatosSeleccionada.label;
            } else {
                nuevoAnalisisAguaUtil.sulfatos = null;
                nuevoAnalisisAguaUtil.sulfatos_unidad = "";
            }

            if (residuoSeco !== "") {
                nuevoAnalisisAguaUtil.residuo_seco = parseFloat(residuoSeco.replace(",","."));
                nuevoAnalisisAguaUtil.residuo_seco_unidad = unidadResiduoSecoSeleccionada.label;
            } else {
                nuevoAnalisisAguaUtil.residuo_seco = null;
                nuevoAnalisisAguaUtil.residuo_seco_unidad = "";
            }

            if (dureza !== "") {
                nuevoAnalisisAguaUtil.dureza_total = parseFloat(dureza.replace(",","."));
                nuevoAnalisisAguaUtil.dureza_total_unidad = unidadDurezaSeleccionada.label;
            } else {
                nuevoAnalisisAguaUtil.dureza_total = null;
                nuevoAnalisisAguaUtil.dureza_total_unidad = "";
            }

            if (alcalinidad !== "") {
                nuevoAnalisisAguaUtil.alcalinidad_total = parseFloat(alcalinidad.replace(",","."));
                nuevoAnalisisAguaUtil.alcalinidad_total_unidad = unidadAlcalinidadSeleccionada.label;
            } else {
                nuevoAnalisisAguaUtil.alcalinidad_total = null;
                nuevoAnalisisAguaUtil.alcalinidad_total_unidad = "";
            }

            if (boro !== "") {
                nuevoAnalisisAguaUtil.boro = parseFloat(boro.replace(",","."));
                nuevoAnalisisAguaUtil.boro_unidad = unidadBoroSeleccionada.label;
            } else {
                nuevoAnalisisAguaUtil.boro = null;
                nuevoAnalisisAguaUtil.boro_unidad = "";
            }

            nuevoAnalisisAguaUtil.densidad_aparente = parseFloat(densidadAparente.replace(",","."));
            nuevoAnalisisAguaUtil.densidad_aparente_unidad = unidadDensidad.label;

            try {
                await registrarNuevoAnalisisAguautil(tomaDeMuestra.id, nuevoAnalisisAguaUtil);
                setMostrarAnalisisRegistrado(true);
            } catch (error) {
                if(error.response && error.response.status === 401){
                    try {
                        await renewToken();
                        await registrarNuevoAnalisisAguautil(tomaDeMuestra.id, nuevoAnalisisAguaUtil);
                        setMostrarAnalisisRegistrado(true);
                    } catch (error) {
                      if(error.response && error.response.status === 401){
                        setMostrarErrorVencimientoToken(true);
                      }
                    }
                  }
            }
        }
    }

    const handleConfirmarAnalisis = (e) => {
        if(e){
            setMostrarAnalisisRegistrado(false);
            reset();
            navigate(-1);
        }
    }

    const handleConfirmarAnalisisModificado = (e) => {
        if(e){
            setMostrarAnalisisModificado(false);
            reset();
            navigate(-1);
        }
    }

    const handleSesionExpirada = () =>{
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
      }

      useEffect(() => {
        const fetchLaboratorios = async () => {
            try {
                const { data } = await laboratoriosService();
                if (data.length === 0) {
                    setErrorLaboratoriosNoRegistrados(true);
                } else {
                    setLaboratorios(data);
                }
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    try {
                        await renewToken();
                        const { data } = await laboratoriosService();
                        if (data.length === 0) {
                            setErrorLaboratoriosNoRegistrados(true);
                        } else {
                            setLaboratorios(data);
                        }
                    } catch (error) {
                        if (error.response && error.response.status === 401) {
                            setMostrarErrorVencimientoToken(true);
                        }
                    }
                }
            }
        };
    
        fetchLaboratorios();
    }, []);

    useEffect(() => {
        if(analisisAguaUtil){
            const fetchLaboratorio = async () => {
                try {
                    const { data } = await consultarLaboratorio(analisisAguaUtil.laboratorio_id);
                    setLaboratorioAnalisis(data);
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        try {
                            await renewToken();
                            const { data } = await consultarLaboratorio(analisisAguaUtil.laboratorio_id);
                            setLaboratorioAnalisis(data);
                        } catch (error) {
                            if (error.response && error.response.status === 401) {
                                setMostrarErrorVencimientoToken(true);
                            }
                        }
                    }
                }
            };
            fetchLaboratorio();
        }
    }, [analisisAguaUtil]);

    useEffect(() => {
        if(modo === "modificar" && !seteado){
            setStartDateModificacion(moment(analisisAguaUtil.fecha_analisis, "YYYY-MM-DD").toDate());
            setLaboratorioSeleccionado({label: laboratorioAnalisis.nombre, value: laboratorioAnalisis.id});
            setPH(String(analisisAguaUtil.ph).replace(".", ","));
            setConductividadElectrica(String(analisisAguaUtil.conductividad_electrica));
            setUnidadConductividadElectrica({label:"dS/m", value: 1});
            setRas(String(analisisAguaUtil.relacion_absorcion_sodio).replace(".", ","));
            if(analisisAguaUtil.csr){
                setCsr(String(analisisAguaUtil.csr).replace(".", ","));
            }
            setcloruros(String(analisisAguaUtil.cloruros).replace(".", ","))
            setUnidadcloruroseleccionada({label: "mg/L", value: 2});
            if(analisisAguaUtil.nitratos){
                setNitratos(String(analisisAguaUtil.nitratos).replace(".", ","));
                setUnidadNitratosSeleccionada({label: "mg/L", value: 2});
            }
            if(analisisAguaUtil.fosfatos){
                setFosfatos(String(analisisAguaUtil.fosfatos).replace(".", ","));
                setUnidadFosfatoSeleccionada({label: "mg/L", value: 2});
            }
            setCalcio(String(analisisAguaUtil.calcio).replace(".", ","));
            setMagnesio(String(analisisAguaUtil.magnesio).replace(".", ","));
            setSodio(String(analisisAguaUtil.sodio).replace(".", ","));
            setPotasio(String(analisisAguaUtil.potasio).replace(".", ","));
            setUnidadBasicaSeleccionada({label: "mg/L", value: 2})
            if(analisisAguaUtil.carbonatos){
                setCarbonatos(String(analisisAguaUtil.carbonatos).replace(".", ","));
                setUnidadCarbonatosSeleccionada({label: "mg/L", value: 2});
            }
            if(analisisAguaUtil.bicarbonatos){
                setBicarbonatos(String(analisisAguaUtil.bicarbonatos).replace(".", ","));
                setUnidadBicarbonatosSeleccionada({label: "mg/L", value: 2});
            }
            if(analisisAguaUtil.residuo_seco){
                setResiduoSeco(String(analisisAguaUtil.residuo_seco).replace(".", ","));
                setUnidadResiduoSecoSeleccionada({label: "mg/L", value: 2});
            }
            if(analisisAguaUtil.dureza_total){
                setDureza(String(analisisAguaUtil.dureza_total).replace(".", ","));
                setUnidadDurezaSeleccionada({label: "mg/L CaCO3", value: 2});
            }
            if(analisisAguaUtil.alcalinidad_total){
                setAlcalinidad(String(analisisAguaUtil.alcalinidad_total).replace(".", ","));
                setUnidadAlcalinidadSeleccionada({label: "mg/L CaCO3", value: 2});
            }
            if(analisisAguaUtil.humedad_gravimetrica){
                setHumedad(String(analisisAguaUtil.humedad_gravimetrica).replace(".", ","));
            }
            if(analisisAguaUtil.sulfatos){
                setSulfatos(String(analisisAguaUtil.sulfatos).replace(".", ","));
                setUnidadSulfatosSeleccionada({label: "mg/L", value: 2});
            }
            if(analisisAguaUtil.boro){
                setBoro(String(analisisAguaUtil.boro).replace(".", ","));
                setUnidadBoroSeleccionada({label: "mg/L", value: 2});
            }
            setDensidadAparente(String(analisisAguaUtil.densidad_aparente).replace(".",","));
            setSeteado(true);
        }
    }, [modo])

    const handleHabilitarEdicion = () => {
        if(tomaDeMuestra.estado_toma_de_muestra_id === "Diagnosticada"){
            setMostrarAlertaAnalisisDiagnosticado(true);
        }
        else{
            setModo("modificar");
        }
        
    }

    const handleCancelarEdicion = () => {
        setModo();
    }

    const modificarAnalisisAguaUtil = async () => {
        setEstaEnPeticion(true);
        const validacionModificacion = validarCampos();
        if(validacionModificacion){
            const modificacionAnalisisAguaUtil = {
                ph: parseFloat(pH.replace(",",".")),
                conductividad_electrica: parseFloat(conductividadElectrica.replace(",",".")),
                conductividad_electrica_unidad: unidadConductividadElectrica.label,
                relacion_absorcion_sodio: parseFloat(ras.replace(",",".")),
                cloruros: parseFloat(cloruros.replace(",",".")),
                cloruros_unidad: unidadcloruroseleccionada.label,
                calcio: parseFloat(calcio.replace(",",".")),
                calcio_unidad: unidadBasicaSeleccionada.label,
                magnesio: parseFloat(magnesio.replace(",",".")),
                magnesio_unidad: unidadBasicaSeleccionada.label,
            }
            
            if (nitratos !== "") {
                modificacionAnalisisAguaUtil.nitratos = parseFloat(nitratos.replace(",","."));
                modificacionAnalisisAguaUtil.nitratos_unidad = unidadNitratosSeleccionada.label;
            } else {
                modificacionAnalisisAguaUtil.nitratos = null;
                modificacionAnalisisAguaUtil.nitratos_unidad = "";
            }

            if (fosfatos !== "") {
                modificacionAnalisisAguaUtil.fosfatos = parseFloat(fosfatos.replace(",","."));
                modificacionAnalisisAguaUtil.fosfatos_unidad = unidadFosfatoSeleccionada.label;
            } else {
                modificacionAnalisisAguaUtil.fosfatos = null;
                modificacionAnalisisAguaUtil.fosfatos_unidad = "";
            }

            modificacionAnalisisAguaUtil.potasio = parseFloat(potasio.replace(",","."));
            modificacionAnalisisAguaUtil.potasio_unidad = unidadBasicaSeleccionada.label;
            modificacionAnalisisAguaUtil.sodio = parseFloat(sodio.replace(",","."));
            modificacionAnalisisAguaUtil.sodio_unidad = unidadBasicaSeleccionada.label;

            modificacionAnalisisAguaUtil.fecha_analisis = moment(startDateModificacion).format("YYYY-MM-DD");
            modificacionAnalisisAguaUtil.laboratorio_id = laboratorioSeleccionado.value;

            if(carbonatos !== ""){
                modificacionAnalisisAguaUtil.carbonatos = parseFloat(carbonatos.replace(",","."));
                modificacionAnalisisAguaUtil.carbonatos_unidad = unidadCarbonatosSeleccionada.label;
            }
            else{
                modificacionAnalisisAguaUtil.carbonatos = null;
                modificacionAnalisisAguaUtil.carbonatos_unidad = "";
            }

            if(bicarbonatos !== ""){
                modificacionAnalisisAguaUtil.bicarbonatos = parseFloat(bicarbonatos.replace(",","."));
                modificacionAnalisisAguaUtil.bicarbonatos_unidad = unidadBicarbonatosSeleccionada.label;
            }
            else{
                modificacionAnalisisAguaUtil.bicarbonatos = null;
                modificacionAnalisisAguaUtil.bicarbonatos_unidad = "";
            }

            if(humedad !== ""){
                modificacionAnalisisAguaUtil.humedad_gravimetrica = parseFloat(humedad.replace(",","."));
            }
            else{
                modificacionAnalisisAguaUtil.humedad_gravimetrica = null;
            }

            if (csr !== "") {
                modificacionAnalisisAguaUtil.csr = parseFloat(csr.replace(",","."));
            } else {
                modificacionAnalisisAguaUtil.csr = null;
            }

            if (sulfatos !== "") {
                modificacionAnalisisAguaUtil.sulfatos = parseFloat(sulfatos.replace(",","."));
                modificacionAnalisisAguaUtil.sulfatos_unidad = unidadSulfatosSeleccionada.label;
            } else {
                modificacionAnalisisAguaUtil.sulfatos = null;
                modificacionAnalisisAguaUtil.sulfatos_unidad = "";
            }

            if (residuoSeco !== "") {
                modificacionAnalisisAguaUtil.residuo_seco = parseFloat(residuoSeco.replace(",","."));
                modificacionAnalisisAguaUtil.residuo_seco_unidad = unidadResiduoSecoSeleccionada.label;
            } else {
                modificacionAnalisisAguaUtil.residuo_seco = null;
                modificacionAnalisisAguaUtil.residuo_seco_unidad = "";
            }

            if (dureza !== "") {
                modificacionAnalisisAguaUtil.dureza_total = parseFloat(dureza.replace(",","."));
                modificacionAnalisisAguaUtil.dureza_total_unidad = unidadDurezaSeleccionada.label;
            } else {
                modificacionAnalisisAguaUtil.dureza_total = null;
                modificacionAnalisisAguaUtil.dureza_total_unidad = "";
            }

            if (alcalinidad !== "") {
                modificacionAnalisisAguaUtil.alcalinidad_total = parseFloat(alcalinidad.replace(",","."));
                modificacionAnalisisAguaUtil.alcalinidad_total_unidad = unidadAlcalinidadSeleccionada.label;
            } else {
                modificacionAnalisisAguaUtil.alcalinidad_total = null;
                modificacionAnalisisAguaUtil.alcalinidad_total_unidad = "";
            }

            if (boro !== "") {
                modificacionAnalisisAguaUtil.boro = parseFloat(boro.replace(",","."));
                modificacionAnalisisAguaUtil.boro_unidad = unidadBoroSeleccionada.label;
            } else {
                modificacionAnalisisAguaUtil.boro = null;
                modificacionAnalisisAguaUtil.boro_unidad = "";
            }

            modificacionAnalisisAguaUtil.densidad_aparente = parseFloat(densidadAparente.replace(",","."));
            modificacionAnalisisAguaUtil.densidad_aparente_unidad = unidadDensidad.label;


            try {
                await modificarAnalisisAguaService(analisisAguaUtil.id, modificacionAnalisisAguaUtil);
                setMostrarAnalisisModificado(true);
            } catch (error) {
                if(error.response && error.response.status === 401){
                    try {
                        await renewToken();
                        await modificarAnalisisAguaService(analisisAguaUtil.id, modificacionAnalisisAguaUtil);
                        setMostrarAnalisisModificado(true);
                    } catch (error) {
                      if(error.response && error.response.status === 401){
                        setMostrarErrorVencimientoToken(true);
                      }
                    }
                  }
            }
        }

    }

    const solicitarConfirmacionEliminacion = () => {
        setMostrarConfirmEliminacion(true);
    }

    const eliminarAnalisis = async (e) => {
        //Si el usuario confirma (e), se procede a eliminar el analisis
        setMostrarConfirmEliminacion(false);
        if (e) {
            try {
                await darDeBajaAnalisisService(analisisAguaUtil.id);
                setMostrarAnalisisEliminado(true);
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        try {
                            await renewToken();
                            await darDeBajaAnalisisService(analisisAguaUtil.id);
                            setMostrarAnalisisEliminado(true);
                        } catch (error) {
                            if (error.response.status === 400) {
                                setMostrarErrorEstadoAnterior(true);
                            }
                            else if (error.response.status === 404) {
                                setMostrarErrorUsuarioNoEncontrado(true);
                            }
                            else if (error.response.status === 405) {
                                setMostrarErrorTMNoEncontrada(true);
                            }
                            else if (error.response.status === 406) {
                                setMostrarErrorLoteNoEncontrado(true);
                            }
                            else if (error.response.status === 407) {
                                setMostrarErrorCampoNoEncontrado(true);
                            }
                            else if (error.response.status === 408) {
                                setMostrarErrorProductorNoEncontrado(true);
                            }
                            else if (error.response.status === 409) {
                                setMostrarErrorPermisos(true);
                            }
                            else if (error.response.status === 410) {
                                setMostrarErrorDiagnosticoAsociado(true);
                            }
                            else if (error.response.status === 411) {
                                setMostrarErrorEstadoNoEncontrado(true);
                            }
                            else if (error.response.status === 412) {
                                setMostrarErrorAnalisisNoEncontrado(true);
                            }
                            else {
                                setMostrarErrorEliminacion(true);
                            }
                        }
                    }
                    else if (error.response.status === 400) {
                        setMostrarErrorEstadoAnterior(true);
                    }
                    else if (error.response.status === 404) {
                        setMostrarErrorUsuarioNoEncontrado(true);
                    }
                    else if (error.response.status === 405) {
                        setMostrarErrorTMNoEncontrada(true);
                    }
                    else if (error.response.status === 406) {
                        setMostrarErrorLoteNoEncontrado(true);
                    }
                    else if (error.response.status === 407) {
                        setMostrarErrorCampoNoEncontrado(true);
                    }
                    else if (error.response.status === 408) {
                        setMostrarErrorProductorNoEncontrado(true);
                    }
                    else if (error.response.status === 409) {
                        setMostrarErrorPermisos(true);
                    }
                    else if (error.response.status === 410) {
                        setMostrarErrorDiagnosticoAsociado(true);
                    }
                    else if (error.response.status === 411) {
                        setMostrarErrorEstadoNoEncontrado(true);
                    }
                    else if (error.response.status === 412) {
                        setMostrarErrorAnalisisNoEncontrado(true);
                    }
                    else {
                        setMostrarErrorEliminacion(true);
                    }
                }
            }
        }
    }

    const handleConfirmarEliminacion = (e) => {
        if(e){
            setMostrarAnalisisEliminado(false);
            navigate(-1);
        }
    }

    if(analisisAguaUtil){
        if(laboratorioAnalisis){
            if(modo === "modificar"){
                return(
                    <>
                    {console.log()}
                        {/* MODIFICAR ANÁLISIS AGUA ÚTIL */}
                        {/* contenedor */}
                        <div className="contenedor-analisis">

                            {/* título contenedor */}
                            <div className='seccion-titulo-analisis'>
                                <span className='tituloForm'>Análisis Químico de Agua Útil</span> 
                            </div>

                            {/* formulario análisis */}
                            <Form className='formulario-analisis' onSubmit={handleSubmit(modificarAnalisisAguaUtil)}>

                                {/* columna 1 */}
                                <div className="columna-uno">

                                    {/* Fecha de análisis */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={fechaVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Fecha*</Form.Label>
                                        <DatePicker 
                                        className='estilos-datepikcer'
                                        dateFormat="dd/MM/yyyy"
                                        selected={startDateModificacion}
                                        onChange={(date) => setStartDateModificacion(date)}
                                        minDate={moment(fechaTomaMuestra, "YYYY-MM-DD").toDate()}
                                        maxDate={new Date()}
                                        />
                                    </Form.Group>

                                    {/* Select Laboratorio */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={laboratorioVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Laboratorio*</Form.Label>
                                        <Select
                                            value={laboratorioSeleccionado}
                                            onChange={handleChangeLaboratorio}
                                            options={
                                                laboratorios.map( labo => ({label: labo.nombre, value: labo.id}))
                                            }>    
                                        </Select>
                                    </Form.Group>

                                    {/* Campo pH*/}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={pHVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>pH*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={pH} onChange={handleChangePH}/>
                                    </Form.Group>    


                                    {/* Campo Conductividad Eléctrica */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={(conductividadElectricaVacio || unidadConductividadElectricaVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Conductividad Eléctrica*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={conductividadElectrica} onChange={handleChangeConductividadElectrica}/>
                                        <Select
                                        options={unidadesConductividadElectrica}
                                        value={unidadConductividadElectrica}
                                        onChange={handleChangeUnidadCondElect}>

                                        </Select>
                                    </Form.Group>

                                    {/* Campo RAS */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={rasVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>RAS*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={ras} onChange={handleChangeRas}/>
                                    </Form.Group>

                                    {/* Campo CSR */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={'label-izquierdo'}>CSR</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={csr} onChange={handleChangeCsr}/>
                                    </Form.Group> 

                                    {/* Campo Cloruros */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={(clorurosVacio || unidadclorurosVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Cloruros*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={cloruros} onChange={handleChangecloruros}/>
                                        <Select
                                        options={unidadesBasico}
                                        value={unidadcloruroseleccionada}
                                        onChange={handleChangeUnidadCloro}>

                                        </Select>
                                    </Form.Group>

                                    {/* Campo Nitratos */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={unidadNitratosVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Nitratos</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={nitratos} onChange={handleChangeNitratos}/>
                                        <Select
                                        options={unidadesBasico}
                                        value={unidadNitratosSeleccionada}
                                        onChange={handleChangeUnidadNitratos}>

                                        </Select>
                                    </Form.Group>

                                    {/* Campo Fosfatos */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={unidadFosfatosVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Fosfatos</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={fosfatos} onChange={handleChangeFosfatos}/>
                                        <Select
                                        options={unidadesBasico}
                                        value={unidadFosfatoSeleccionada}
                                        onChange={handleChangeUnidadFosfatos}>

                                        </Select>
                                    </Form.Group>

                                    {/* Campo Carbonatos */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={unidadCarbonatosSeleccionadaVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Carbonatos</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={carbonatos} onChange={handleChangeCarbonatos}/>
                                        <Select
                                        options={unidadesBasico}
                                        value={unidadCarbonatosSeleccionada}
                                        onChange={handleChangeUnidadCarbonatos}>

                                        </Select>
                                    </Form.Group> 

                                    {/* Campo Bicarbonatos */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={unidadBicarbonatosSeleccionadaVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Bicarbonatos</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={bicarbonatos} onChange={handleChangeBicarbonatos}/>
                                        <Select
                                        options={unidadesBasico}
                                        value={unidadBicarbonatosSeleccionada}
                                        onChange={handleChangeUnidadBicarbonatos}>

                                        </Select>
                                    </Form.Group>

                                </div>
                                
                                {/* columna 2 */}
                                <div className="columna-dos">

                                    {/* Campo calcio */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={(calcioVacio || unidadBasicaSeleccionadaVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Calcio*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={calcio} onChange={handleChangeCalcio}/>
                                        <Select
                                        options={unidadesBasico}
                                        value={unidadBasicaSeleccionada}
                                        onChange={handleChangeUnidadBasica}>

                                        </Select>
                                    </Form.Group> 

                                    {/* Campo Magnesio */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={(magnesioVacio || unidadBasicaSeleccionadaVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Magnesio*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={magnesio} onChange={handleChangeMagnesio}/>
                                        <Select
                                        options={unidadesBasico}
                                        value={unidadBasicaSeleccionada}
                                        onChange={handleChangeUnidadBasica}>

                                        </Select>
                                    </Form.Group> 

                                    {/* Campo Sodio */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={(sodioVacio || unidadBasicaSeleccionadaVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Sodio*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={sodio} onChange={handleChangeSodio}/>
                                        <Select
                                        options={unidadesBasico}
                                        value={unidadBasicaSeleccionada}
                                        onChange={handleChangeUnidadBasica}>

                                        </Select>
                                    </Form.Group> 

                                    {/* Campo Potasio */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={(potasioVacio || unidadBasicaSeleccionadaVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Potasio*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={potasio} onChange={handleChangePotasio}/>
                                        <Select
                                        options={unidadesBasico}
                                        value={unidadBasicaSeleccionada}
                                        onChange={handleChangeUnidadBasica}>

                                        </Select>
                                    </Form.Group>  

                                    {/* campo Residuo Seco */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={unidadResiduoSecoVacio ? 'label-izquierdo-formulario' : 'label-izquierdo'}>Residuo Seco</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={residuoSeco} onChange={handleChangeResiduoSeco}/>
                                        <Select
                                        options={unidadesResiduoSeco}
                                        value={unidadResiduoSecoSeleccionada}
                                        onChange={handleChangeUnidadResiduoSeco}>

                                        </Select>
                                    </Form.Group>

                                    {/* campo dureza total */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={unidadDurezaVacio ? 'label-izquierdo-formulario' : 'label-izquierdo'}>Dureza Total</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={dureza} onChange={handleChangeDureza}/>
                                        <Select
                                        options={unidadesDurezaAlcalinidad}
                                        value={unidadDurezaSeleccionada}
                                        onChange={handleChangeUnidadDureza}>

                                        </Select>
                                    </Form.Group>

                                    {/* campo Alcalinidad Total */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={unidadAlcalinidadVacio ? 'label-izquierdo-formulario' : 'label-izquierdo'}>Alcalinidad Total</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={alcalinidad} onChange={handleChangeAlcalinidad}/>
                                        <Select
                                        options={unidadesDurezaAlcalinidad}
                                        value={unidadAlcalinidadSeleccionada}
                                        onChange={handleChangeUnidadAlcalinidad}>

                                        </Select>
                                    </Form.Group>

                                    {/* Campo Humedad Gravimétrica */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className='label-izquierdo'>Humedad Gravimétrica</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={humedad} onChange={handleChangeHumedad}/>
                                        <Form.Label className='label-derecho'>%</Form.Label>
                                    </Form.Group> 

                                    {/* campo Sulfatos */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={unidadSulfatosVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Sulfatos</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={sulfatos} onChange={handleChangeSulfatos}/>
                                        <Select
                                        options={unidadesBasico}
                                        value={unidadSulfatosSeleccionada}
                                        onChange={handleChangeUnidadSulfatos}>

                                        </Select>
                                    </Form.Group>

                                    {/* campo Boro */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={unidadBoroVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Boro</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={boro} onChange={handleChangeBoro}/>
                                        <Select
                                        options={unidadesBasico}
                                        value={unidadBoroSeleccionada}
                                        onChange={handleChangeUnidadBoro}>
                                        </Select>
                                    </Form.Group>

                                    {/* campo Densidad Aparente */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={(densidadVacio || unidadDensidadVacio) ? 'label-izquierdo-formulario' : 'label-izquierdo'}>Densidad Aparente</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={densidadAparente} onChange={handleChangeDensidadAparente}/>
                                        <Select
                                        options={unidadesDensidad}
                                        value={unidadDensidad}
                                        onChange={handleChangeUnidadDensidad}>

                                        </Select>
                                    </Form.Group>

                                </div>

                                {/* Botones formulario */}
                                <Form.Group className='seccionBotonesFormulario margenTop20 seccion-botones-analisis'>
                                    <Button className="botonCancelarFormulario" variant="secondary" onClick={handleCancelarEdicion}>
                                        Cancelar
                                    </Button>

                                    <Button className="botonConfirmacionFormulario" variant="secondary" type="submit"
                                    disabled={estaEnPeticion}>
                                        Aceptar
                                    </Button>  
                                </Form.Group>
                            </Form>

                            {
                                mostrarAnalisisModificado &&
                                <Confirm texto={"Su Análisis ha sido modificado correctamente"}
                                onConfirm={handleConfirmarAnalisisModificado}/>
                            }

                            {
                                mostrarErrorVencimientoToken &&
                                <Error texto={"Su sesión ha expirado"} 
                                onConfirm={handleSesionExpirada}/>
                            }
                            
                            {
                                errorLaboratoriosNoRegistrados &&
                                <Error texto={"Para continuar con el proceso, es necesario registrar al menos un laboratorio antes de cargar un análisis."} 
                                onConfirm={() => {navigate('/laboratorios')}}/>
                            }
                        </div>
                    </>
                )
            }
            else{
                return(
                    <>
                    {/* CONSULTAR ANÁLISIS AGUA ÚTIL */}
                    {/* contenedor */}
                    <div className="contenedor-analisis">
                        {/* título contenedor */}
                        <div className='seccion-titulo-analisis'>
                            <span className='tituloForm'>Análisis Químico de Agua Útil</span> 
                        </div>

                        {/* formulario análisis */}
                        <Form className='formulario-analisis'>

                            {/* columna 1 */}
                            <div className="columna-uno">

                                {/* Fecha de análisis */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className={fechaVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Fecha</Form.Label>
                                    <DatePicker
                                    className='estilos-datepikcer'
                                    dateFormat="dd/MM/yyyy"
                                    value={moment(analisisAguaUtil.fecha_analisis).format('DD/MM/YYYY')}
                                    disabled={true}
                                    />
                                </Form.Group>

                                {/* Select Laboratorio */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className={laboratorioVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Laboratorio</Form.Label>
                                    <Select
                                    value={{label: laboratorioAnalisis.nombre, value: laboratorioAnalisis.id}}
                                    isDisabled={true}
                                    >    
                                    </Select>
                                </Form.Group>

                                {/* Campo pH*/}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className={pHVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>pH</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisAguaUtil.ph}
                                    disabled={true}/>
                                </Form.Group>    

                                {/* Campo Conductividad Eléctrica */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Conductividad Eléctrica</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisAguaUtil.conductividad_electrica} disabled={true}/>
                                    <Form.Label className='label-derecho'>dS/m</Form.Label>
                                </Form.Group>

                                {/* Campo RAS */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>RAS</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisAguaUtil.relacion_absorcion_sodio} disabled={true}/>
                                </Form.Group> 

                                {/* Campo CSR */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>CSR</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisAguaUtil.csr === null ? "" : analisisAguaUtil.csr} 
                                    disabled={true}/>
                                </Form.Group> 

                                {/* Campo Cloruros */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Cloruros</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisAguaUtil.cloruros} disabled={true}/>
                                    <Form.Label className='label-derecho'>mg/L</Form.Label>
                                </Form.Group>

                                {/* Campo Nitratos */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Nitratos</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisAguaUtil.nitratos === null ? "" : analisisAguaUtil.nitratos} 
                                    disabled={true}/>
                                    <Form.Label className='label-derecho'>mg/L</Form.Label>
                                </Form.Group>

                                {/* Campo Fosfatos */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Fosfatos</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisAguaUtil.fosfatos === null ? "" : analisisAguaUtil.fosfatos} 
                                    disabled={true}/>
                                    <Form.Label className='label-derecho'>mg/L</Form.Label>
                                </Form.Group>

                                {/* Campo Carbonatos */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Carbonatos</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisAguaUtil.carbonatos === null ? "" : analisisAguaUtil.carbonatos}
                                    disabled={true}/>
                                    <Form.Label className='label-derecho'>mg/L</Form.Label>
                                </Form.Group> 

                                {/* Campo Bicarbonatos */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Bicarbonatos</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisAguaUtil.bicarbonatos === null ? "" : analisisAguaUtil.bicarbonatos}
                                    disabled={true}/>
                                    <Form.Label className='label-derecho'>mg/L</Form.Label>
                                </Form.Group> 

                            </div>
                            
                            {/* columna 2 */}
                            <div className="columna-dos">

                                {/* Campo calcio */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Calcio</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisAguaUtil.calcio} disabled={true}/>
                                    <Form.Label className='label-derecho'>mg/L</Form.Label>
                                </Form.Group> 

                                {/* Campo Magnesio */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Magnesio</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisAguaUtil.magnesio} disabled={true}/>
                                    <Form.Label className='label-derecho'>mg/L</Form.Label>
                                </Form.Group> 

                                {/* Campo Sodio */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Sodio</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisAguaUtil.sodio} disabled={true}/>
                                    <Form.Label className='label-derecho'>mg/L</Form.Label>
                                </Form.Group> 

                                {/* Campo Potasio */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Potasio</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisAguaUtil.potasio} disabled={true}/>
                                    <Form.Label className='label-derecho'>mg/L</Form.Label>
                                </Form.Group> 

                                {/* Campo Residuo Seco */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Residuo Seco</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisAguaUtil.residuo_seco === null ? "" : analisisAguaUtil.residuo_seco} disabled={true}/>
                                    <Form.Label className='label-derecho'>mg/L</Form.Label>
                                </Form.Group> 

                                {/* campo Dureza Total */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Dureza Total</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisAguaUtil.dureza_total === null ? "" : analisisAguaUtil.dureza_total}
                                    disabled={true}/>
                                    <Form.Label className='label-derecho'>mg/L CaCO3</Form.Label>
                                </Form.Group>

                                {/* campo Alcalinidad Total */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Alcalinidad Total</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisAguaUtil.alcalinidad_total === null ? "" : analisisAguaUtil.alcalinidad_total}
                                    disabled={true}/>
                                    <Form.Label className='label-derecho'>mg/L CaCO3</Form.Label>
                                </Form.Group>

                                {/* Campo Humedad Gravimétrica */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Humedad Gravimétrica</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisAguaUtil.humedad_gravimetrica === null ? "" : analisisAguaUtil.humedad_gravimetrica}
                                    disabled={true}/>
                                    <Form.Label className='label-derecho'>%</Form.Label>
                                </Form.Group> 

                                {/* Campo Sulfatos */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Sulfatos</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisAguaUtil.sulfatos === null ? "" : analisisAguaUtil.sulfatos}
                                    disabled={true}/>
                                    <Form.Label className='label-derecho'>mg/L</Form.Label>
                                </Form.Group> 

                                {/* Campo Boro */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Boro</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisAguaUtil.boro === null ? "" : analisisAguaUtil.boro} 
                                    disabled={true}/>
                                    <Form.Label className='label-derecho'>mg/L</Form.Label>
                                </Form.Group> 

                                {/* Campo Densidad Aparente */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Densidad Aparente</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisAguaUtil.densidad_aparente}
                                    disabled={true}/>
                                    <Form.Label className='label-derecho'>gr/cm3</Form.Label>
                                </Form.Group> 
                            </div>

                            {/* Botones Formulario */}
                            <Form.Group className='seccionBotonesFormulario margenTop20 seccion-botones-analisis'>
                                <Button className="botonCancelarFormulario" variant="secondary" onClick={handleCancelar}>
                                    Cerrar
                                </Button>

                                <Button className="botonConfirmacionFormulario" variant="secondary" onClick={handleHabilitarEdicion}>
                                    Editar
                                </Button>

                                <Button className="botonCancelarFormulario" variant="secondary" onClick={solicitarConfirmacionEliminacion}>
                                    Eliminar
                                </Button> 
                            </Form.Group>
                        </Form>
                    </div>

                {
                    mostrarAlertaAnalisisDiagnosticado && 
                    <Error texto={"No puede modificar un análisis que ya tiene un Diagnóstico efectuado."}
                    onConfirm={() => {setMostrarAlertaAnalisisDiagnosticado(false)}}/>
                }

                {
                    mostrarConfirmEliminacion && 
                    <Alerta 
                        texto="¿Está seguro de Eliminar el Resultado de Laboratorio?" 
                        nombreBoton="Eliminar" 
                        onConfirm={eliminarAnalisis}
                    />
                }

                {
                    mostrarAnalisisEliminado &&
                    <Confirm texto={"Su Análisis ha sido eliminado correctamente"}
                    onConfirm={handleConfirmarEliminacion}/>
                }

                {
                    mostrarErrorVencimientoToken &&
                    <Error texto={"Su sesión ha expirado"} 
                    onConfirm={handleSesionExpirada}/>
                }

                {
                    mostrarErrorEstadoAnterior &&
                    <Error texto={"No se ha encontrado el estado anterior del análisis"} 
                    onConfirm={() => setMostrarErrorEstadoAnterior(false)}/>
                }

                {
                    mostrarErrorUsuarioNoEncontrado &&
                    <Error texto={"No se ha encontrado el usuario asociado"} 
                    onConfirm={() => setMostrarErrorUsuarioNoEncontrado(false)}/>
                }

                {
                    mostrarErrorTMNoEncontrada &&
                    <Error texto={"No se ha encontrado la TM asociada"} 
                    onConfirm={() => setMostrarErrorTMNoEncontrada(false)}/>
                }

                {
                    mostrarErrorLoteNoEncontrado &&
                    <Error texto={"No se ha encontrado el lote asociado"} 
                    onConfirm={() => setMostrarErrorLoteNoEncontrado(false)}/>
                }

                {
                    mostrarErrorCampoNoEncontrado &&
                    <Error texto={"No se ha encontrado el campo asociado"} 
                    onConfirm={() => setMostrarErrorCampoNoEncontrado(false)}/>
                }

                {
                    mostrarErrorProductorNoEncontrado &&
                    <Error texto={"No se ha encontrado el productor asociado"} 
                    onConfirm={() => setMostrarErrorProductorNoEncontrado(false)}/>
                }

                {
                    mostrarErrorPermisos &&
                    <Error texto={"No tiene permisos para eliminar este análisis"} 
                    onConfirm={() => setMostrarErrorPermisos(false)}/>
                }

                {
                    mostrarErrorDiagnosticoAsociado &&
                    <Error texto={"No se puede eliminar el análisis porque tiene diagnósticos asociados"} 
                    onConfirm={() => setMostrarErrorDiagnosticoAsociado(false)}/>
                }

                {
                    mostrarErrorAnalisisNoEncontrado &&
                    <Error texto={"No se ha encontrado el análisis"} 
                    onConfirm={() => setMostrarErrorAnalisisNoEncontrado(false)}/>
                }

                {
                    mostrarErrorEstadoNoEncontrado &&
                    <Error texto={"No se ha encontrado el estado de la toma de muestra asociada"} 
                    onConfirm={() => setMostrarErrorEstadoNoEncontrado(false)}/>
                }

                {
                    mostrarErrorEliminacion &&
                    <Error texto={"Ocurrió un error inesperado al eliminar el usuario"} 
                    onConfirm={() => setMostrarErrorEliminacion(false)}/>
                }
            </>
                )
            }
        }
        else{
            return(
                <SpinnerAgrolitycs/>
            )
        }
    }
    else if (laboratorios !== undefined && analisisAguaUtil === undefined){
        return(
        <>
            {/* REGISTRAR ANÁLISIS AGUA ÚTIL */}

            {/* contenedor */}
            <div className="contenedor-analisis">

                {/* título contenedor */}
                <div className='seccion-titulo-analisis'>
                    <span className='tituloForm'>Análisis Químico de Agua Útil</span> 
                </div>

                {/* formulario análisis */}
                <Form className='formulario-analisis' onSubmit={handleSubmit(registrarAnalisisAguaUtil)}>

                    {/* columna 1 */}
                    <div className="columna-uno">

                        {/* Fecha de análisis */}
                        <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={fechaVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Fecha*</Form.Label>
                            <DatePicker 
                            placeholderText='dd/mm/aaaa'
                            className='estilos-datepikcer'
                            dateFormat="dd/MM/yyyy"
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            minDate={moment(fechaTomaMuestra, "YYYY-MM-DD").toDate()}
                            maxDate={new Date()}
                            />
                        </Form.Group>

                        {/* Select Laboratorio */}
                        <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={laboratorioVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Laboratorio*</Form.Label>
                            <Select
                                value={laboratorioSeleccionado}
                                onChange={handleChangeLaboratorio}
                                options={
                                    laboratorios.map( labo => ({label: labo.nombre, value: labo.id}))
                                }>    
                            </Select>
                        </Form.Group>

                        {/* Campo pH*/}
                        <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={pHVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>pH*</Form.Label>
                            <Form.Control className='input-analisis' type='text' value={pH} onChange={handleChangePH}/>
                        </Form.Group>    


                        {/* Campo Conductividad Eléctrica */}
                        <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={(conductividadElectricaVacio || unidadConductividadElectricaVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Conductividad Eléctrica*</Form.Label>
                            <Form.Control className='input-analisis' type='text' value={conductividadElectrica} onChange={handleChangeConductividadElectrica}/>
                            <Select
                            options={unidadesConductividadElectrica}
                            value={unidadConductividadElectrica}
                            onChange={handleChangeUnidadCondElect}>

                            </Select>
                        </Form.Group>

                        {/* Campo RAS */}
                        <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={rasVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>RAS*</Form.Label>
                            <Form.Control className='input-analisis' type='text' value={ras} onChange={handleChangeRas}/>
                        </Form.Group>

                        {/* Campo CSR */}
                        <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={'label-izquierdo'}>CSR</Form.Label>
                            <Form.Control className='input-analisis' type='text' value={csr} onChange={handleChangeCsr}/>
                        </Form.Group> 

                        {/* Campo Cloruros */}
                        <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={(clorurosVacio || unidadclorurosVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Cloruros*</Form.Label>
                            <Form.Control className='input-analisis' type='text' value={cloruros} onChange={handleChangecloruros}/>
                            <Select
                            options={unidadesBasico}
                            value={unidadcloruroseleccionada}
                            onChange={handleChangeUnidadCloro}>

                            </Select>
                        </Form.Group>

                        {/* Campo Nitratos */}
                        <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={unidadNitratosVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Nitratos</Form.Label>
                            <Form.Control className='input-analisis' type='text' value={nitratos} onChange={handleChangeNitratos}/>
                            <Select
                            options={unidadesBasico}
                            value={unidadNitratosSeleccionada}
                            onChange={handleChangeUnidadNitratos}>

                            </Select>
                        </Form.Group>

                        {/* Campo Fosfatos */}
                        <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={unidadFosfatosVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Fosfatos</Form.Label>
                            <Form.Control className='input-analisis' type='text' value={fosfatos} onChange={handleChangeFosfatos}/>
                            <Select
                            options={unidadesBasico}
                            value={unidadFosfatoSeleccionada}
                            onChange={handleChangeUnidadFosfatos}>

                            </Select>
                        </Form.Group>

                        {/* Campo Carbonatos */}
                        <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={unidadCarbonatosSeleccionadaVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Carbonatos</Form.Label>
                            <Form.Control className='input-analisis' type='text' value={carbonatos} onChange={handleChangeCarbonatos}/>
                            <Select
                            options={unidadesBasico}
                            value={unidadCarbonatosSeleccionada}
                            onChange={handleChangeUnidadCarbonatos}>

                            </Select>
                        </Form.Group> 

                        {/* Campo Bicarbonatos */}
                        <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={unidadBicarbonatosSeleccionadaVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Bicarbonatos</Form.Label>
                            <Form.Control className='input-analisis' type='text' value={bicarbonatos} onChange={handleChangeBicarbonatos}/>
                            <Select
                            options={unidadesBasico}
                            value={unidadBicarbonatosSeleccionada}
                            onChange={handleChangeUnidadBicarbonatos}>

                            </Select>
                        </Form.Group> 

                    </div>
                    
                    {/* columna 2 */}
                    <div className="columna-dos">

                        {/* Campo calcio */}
                        <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={(calcioVacio || unidadBasicaSeleccionadaVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Calcio*</Form.Label>
                            <Form.Control className='input-analisis' type='text' value={calcio} onChange={handleChangeCalcio}/>
                            <Select
                            options={unidadesBasico}
                            value={unidadBasicaSeleccionada}
                            onChange={handleChangeUnidadBasica}>

                            </Select>
                        </Form.Group> 

                        {/* Campo Magnesio */}
                        <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={(magnesioVacio || unidadBasicaSeleccionadaVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Magnesio*</Form.Label>
                            <Form.Control className='input-analisis' type='text' value={magnesio} onChange={handleChangeMagnesio}/>
                            <Select
                            options={unidadesBasico}
                            value={unidadBasicaSeleccionada}
                            onChange={handleChangeUnidadBasica}>

                            </Select>
                        </Form.Group> 

                        {/* Campo Sodio */}
                        <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={(sodioVacio || unidadBasicaSeleccionadaVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Sodio*</Form.Label>
                            <Form.Control className='input-analisis' type='text' value={sodio} onChange={handleChangeSodio}/>
                            <Select
                            options={unidadesBasico}
                            value={unidadBasicaSeleccionada}
                            onChange={handleChangeUnidadBasica}>

                            </Select>
                        </Form.Group> 

                        {/* Campo Potasio */}
                        <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={(potasioVacio || unidadBasicaSeleccionadaVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Potasio*</Form.Label>
                            <Form.Control className='input-analisis' type='text' value={potasio} onChange={handleChangePotasio}/>
                            <Select
                            options={unidadesBasico}
                            value={unidadBasicaSeleccionada}
                            onChange={handleChangeUnidadBasica}>

                            </Select>
                        </Form.Group>

                        {/* campo Residuo Seco */}
                        <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={unidadResiduoSecoVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Residuo Seco</Form.Label>
                            <Form.Control className='input-analisis' type='text' value={residuoSeco} onChange={handleChangeResiduoSeco}/>
                            <Select
                            options={unidadesResiduoSeco}
                            value={unidadResiduoSecoSeleccionada}
                            onChange={handleChangeUnidadResiduoSeco}>

                            </Select>
                        </Form.Group>

                        {/* campo dureza total */}
                        <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={unidadDurezaVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Dureza Total</Form.Label>
                            <Form.Control className='input-analisis' type='text' value={dureza} onChange={handleChangeDureza}/>
                            <Select
                            options={unidadesDurezaAlcalinidad}
                            value={unidadDurezaSeleccionada}
                            onChange={handleChangeUnidadDureza}>

                            </Select>
                        </Form.Group>

                        {/* campo Alcalinidad Total */}
                        <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={unidadAlcalinidadVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Alcalinidad Total</Form.Label>
                            <Form.Control className='input-analisis' type='text' value={alcalinidad} onChange={handleChangeAlcalinidad}/>
                            <Select
                            options={unidadesDurezaAlcalinidad}
                            value={unidadAlcalinidadSeleccionada}
                            onChange={handleChangeUnidadAlcalinidad}>

                            </Select>
                        </Form.Group>

                        {/* Campo Humedad Gravimétrica */}
                        <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className='label-izquierdo'>Humedad Gravimétrica</Form.Label>
                            <Form.Control className='input-analisis' type='text' value={humedad} onChange={handleChangeHumedad}/>
                            <Form.Label className='label-derecho'>%</Form.Label>
                        </Form.Group> 

                        {/* campo Sulfatos */}
                        <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={unidadSulfatosVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Sulfatos</Form.Label>
                            <Form.Control className='input-analisis' type='text' value={sulfatos} onChange={handleChangeSulfatos}/>
                            <Select
                            options={unidadesBasico}
                            value={unidadSulfatosSeleccionada}
                            onChange={handleChangeUnidadSulfatos}>

                            </Select>
                        </Form.Group>

                        {/* campo Boro */}
                        <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={unidadBoroVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Boro</Form.Label>
                            <Form.Control className='input-analisis' type='text' value={boro} onChange={handleChangeBoro}/>
                            <Select
                            options={unidadesBasico}
                            value={unidadBoroSeleccionada}
                            onChange={handleChangeUnidadBoro}>
                            </Select>
                        </Form.Group>

                        {/* campo Densidad Aparente */}
                        <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={(densidadVacio || unidadDensidadVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Densidad Aparente</Form.Label>
                            <Form.Control className='input-analisis' type='text' value={densidadAparente} onChange={handleChangeDensidadAparente}/>
                            <Select
                            options={unidadesDensidad}
                            value={unidadDensidad}
                            onChange={handleChangeUnidadDensidad}>

                            </Select>
                        </Form.Group>
                    </div>

                    {/* Botones formulario */}
                    <Form.Group className='seccionBotonesFormulario margenTop20 seccion-botones-analisis'>
                        <Button className="botonCancelarFormulario" variant="secondary" onClick={handleCancelar}>
                            Cancelar
                        </Button>

                        <Button className="botonConfirmacionFormulario" variant="secondary" type="submit"
                        disabled={estaEnPeticion}>
                            Registrar
                        </Button> 
                    </Form.Group>                    
                </Form>

                {
                    mostrarAnalisisRegistrado &&
                    <Confirm texto={"Su Análisis ha sido registrado correctamente"}
                    onConfirm={handleConfirmarAnalisis}/>
                }

                {
                    mostrarErrorVencimientoToken &&
                    <Error texto={"Su sesión ha expirado"} 
                    onConfirm={handleSesionExpirada}/>
                }  

                
                
            </div>
        </>
        )
    }
    else{
        return(
            <>
                {
                    errorLaboratoriosNoRegistrados &&
                    <Error texto={"Para continuar con el proceso, es necesario registrar al menos un laboratorio antes de cargar un análisis."} 
                    onConfirm={() => {navigate('/laboratorios')}}/>
                } 
            </>
        )
    }

    }
    


export default AnalisisAguaUtil;