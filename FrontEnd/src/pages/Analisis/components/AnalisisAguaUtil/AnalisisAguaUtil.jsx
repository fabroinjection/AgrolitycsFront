// Importar estilos
import '../../components/Analisis.css';
import './AnalisisAguaUtil.css';

// Importar componentes
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import { Button } from "react-bootstrap";
import Error from '../../../../components/Modals/Error/Error';
import Confirm from '../../../../components/Modals/Confirm/Confirm';
import DatePicker from "react-datepicker";

// Importar hooks
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

// Importar services
import { registrarNuevoAnalisisAguautil, modificarAnalisisAguaService } from '../../services/analisis.service';
import { renewToken } from '../../../../services/token.service';
import { laboratoriosService } from '../../../../services/laboratorios.service';
import { consultarLaboratorio } from '../../../../services/laboratorios.service';

function AnalisisAguaUtil({ tomaDeMuestra, analisisAguaUtil = undefined, fechaTomaMuestra = undefined}) {

    const { handleSubmit, reset } = useForm();

    //variable para manejar estado peticiones en botones
    const [ estaEnPeticion, setEstaEnPeticion ] = useState(false);

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
    const [ unidadAlcalinidadVacio, setUnidadAlcalinidadVacio ] = useState(false);
    const [ unidadDurezaVacio, setUnidadDurezaVacio ] = useState(false);

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


    const handleChangePH = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 14)){setPH(value);}
    }

    const handleChangeConductividadElectrica = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setConductividadElectrica(value);}
    }

    const handleChangeUnidadCondElect = (opcion) => {
        setUnidadConductividadElectrica(opcion);
    }

    const handleChangeRas = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setRas(value);}
    }

    const handleChangeCsr = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setCsr(value);}
    }

    const handleChangecloruros = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setcloruros(value);}
    }

    const handleChangeUnidadCloro = (opcion) => {
        setUnidadcloruroseleccionada(opcion);
    }

    const handleChangeNitratos = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setNitratos(value);}
    }

    const handleChangeUnidadNitratos = (opcion) => {
        setUnidadNitratosSeleccionada(opcion);
    }

    const handleChangeFosfatos = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setFosfatos(value);}
    }

    const handleChangeUnidadFosfatos = (opcion) => {
        setUnidadFosfatoSeleccionada(opcion);
    }

    const handleChangeMagnesio = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setMagnesio(value);}
    }

    const handleChangeCalcio = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setCalcio(value);}
    }

    const handleChangeUnidadBasica = (unidad) => {
        setUnidadBasicaSeleccionada(unidad);
    }

    const handleChangeSodio = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setSodio(value);}
    }

    const handleChangePotasio = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setPotasio(value);}
    }

    const handleChangeCarbonatos = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setCarbonatos(value);}
    }

    const handleChangeUnidadCarbonatos = (opcion) => {
        setUnidadCarbonatosSeleccionada(opcion);
    }

    const handleChangeBicarbonatos = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setBicarbonatos(value);}
    }

    const handleChangeUnidadBicarbonatos = (opcion) => {
        setUnidadBicarbonatosSeleccionada(opcion);
    }

    const handleChangeResiduoSeco = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setResiduoSeco(value);}
    }

    const handleChangeUnidadResiduoSeco = (opcion) => {
        setUnidadResiduoSecoSeleccionada(opcion);
    }

    const handleChangeDureza = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setDureza(value);}
    }

    const handleChangeUnidadDureza = (opcion) => {
        setUnidadDurezaSeleccionada(opcion);
    }

    const handleChangeAlcalinidad = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setAlcalinidad(value);}
    }

    const handleChangeUnidadAlcalinidad = (opcion) => {
        setUnidadAlcalinidadSeleccionada(opcion);
    }

    const handleChangeSulfatos = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setSulfatos(value);}
    }

    const handleChangeBoro = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setBoro(value);}
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
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setDensidadAparente(value);}
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
                setEstaEnPeticion(false);
                return false;
            }
            else{
                setFechaVacio(false);
            }
        }
        else{
            if(startDate == undefined){
                setFechaVacio(true);
                setEstaEnPeticion(false);
                return false;
            }
            else{
                setFechaVacio(false);
            }
    
        }
        
        if (laboratorioSeleccionado.value === 0) {
            setLaboratorioVacio(true);
            setEstaEnPeticion(false);
            return false;
        } else {
            setLaboratorioVacio(false);
        }

        if(pH === "") {
            setPHVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setPHVacio(false);
        }

        if(conductividadElectrica === ""){
            setConductividadElectricaVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setConductividadElectricaVacio(false);
        }

        if(unidadConductividadElectrica === undefined){
            setUnidadConductividadElectricaVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setUnidadConductividadElectricaVacio(false);
        }

        if(ras === ""){
            setRasVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setRasVacio(false);
        }

        if(cloruros === ""){
            setclorurosVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setclorurosVacio(false);
        }

        if(unidadcloruroseleccionada === undefined){
            setUnidadclorurosVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setUnidadclorurosVacio(false);
        }

        if(calcio === "") {
            setCalcioVacio(true);
            setEstaEnPeticion(false);
            return false;
        } else {
            setCalcioVacio(false);
        }

        if (magnesio === "") {
            setMagnesioVacio(true);
            setEstaEnPeticion(false);
            return false;
        } else {
            setMagnesioVacio(false);
        }

        if(nitratos !== ""){
            if(unidadNitratosSeleccionada === undefined){
                setUnidadNitratosVacio(true);
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
        

        if(sodio === "") {
            setSodioVacio(true);
            setEstaEnPeticion(false);
            return false;
        } else {
            setSodioVacio(false);
        }

        if(potasio === "") {
            setPotasioVacio(true);
            setEstaEnPeticion(false);
            return false;
        } else {
            setPotasioVacio(false);
        }

        if(unidadBasicaSeleccionada === undefined){
            setUnidadBasicaSeleccionadaVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setUnidadBasicaSeleccionadaVacio(false);
        }

        if(carbonatos !== ""){
            if(unidadCarbonatosSeleccionada === undefined){
                setUnidadCarbonatosSeleccionadaVacio(true);
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
                setUnidadSulfatosVacio(true);
                setEstaEnPeticion(false);
                return false;
            } else {
                setUnidadSulfatosVacio(false);
            }
        } else {
            setUnidadSulfatosVacio(false);
        }

        if (dureza !== "") {
            if (unidadDurezaSeleccionada === undefined) {
                setUnidadDurezaVacio(true);
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
                setEstaEnPeticion(false);
                return false;
            } else {
                setUnidadAlcalinidadVacio(false);
            }
        } else {
            setUnidadAlcalinidadVacio(false);
        }

        if (densidadAparente === "") {
            setDensidadVacio(true);
            setEstaEnPeticion(false);
            return false;
        } else {
            setDensidadVacio(false);
        }

        if (unidadDensidad === undefined) {
            setUnidadDensidadVacio(true);
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
                setLaboratorios(data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    try {
                        await renewToken();
                        const { data } = await laboratoriosService();
                        setLaboratorios(data);
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
        if(modo === "modificar"){
            setStartDateModificacion(moment(analisisAguaUtil.fecha_analisis, "YYYY-MM-DD").toDate());
            setLaboratorioSeleccionado({label: laboratorioAnalisis[0].nombre, value: laboratorioAnalisis[0].id});
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

            modificacionAnalisisAguaUtil.fecha_analisis = moment(startDate).format("YYYY-MM-DD");
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

    if(analisisAguaUtil){
        if(laboratorioAnalisis){
            if(modo === "modificar"){
                return(
                    <>
                        {/* MODIFICAR ANÁLISIS COMPLETO */}

                        {/* contenedor */}
                        <div className="contenedorAnalisisCompleto">

                            {/* título contenedor */}
                            <div className='contenedorTituloAnalisisCompleto'>
                                <span className='tituloAnalisisCompleto'>Análisis Químico del Suelo - Agua Útil</span> 
                            </div>

                            {/* formulario análisis */}
                            <Form className='formularioAnalisisAguaUtil' onSubmit={handleSubmit(modificarAnalisisAguaUtil)}>

                                {/* Encabezado análisis */}
                                <div className='encabezado'>

                                    {/* Fecha de análisis */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormEncabezado'>Fecha</Form.Label>
                                        <DatePicker 
                                        className='fechaAnalisis'
                                        dateFormat="dd/MM/yyyy"
                                        selected={startDateModificacion}
                                        onChange={(date) => setStartDateModificacion(date)}
                                        minDate={moment(fechaTomaMuestra, "YYYY-MM-DD").toDate()}
                                        maxDate={new Date()}
                                        />
                                    </Form.Group>

                                    {/* Select Laboratorio */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormEncabezado'>Laboratorio</Form.Label>
                                        <Select className='selectLaboratorio'
                                            value={laboratorioSeleccionado}
                                            defaultValue={{label: 'Seleccione un Laboratorio', value: 0}}
                                            onChange={handleChangeLaboratorio}
                                            options={
                                                laboratorios.map( labo => ({label: labo.nombre, value: labo.id}))
                                            }>    
                                        </Select>
                                    </Form.Group>
                                </div>

                                {/* columna 1 */}
                                <div className="columnaUno">

                                    {/* Campo pH*/}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>pH</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={pH} onChange={handleChangePH}/>
                                    </Form.Group>    


                                    {/* Campo Conductividad Eléctrica */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={conductividadElectricaVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Conductividad Eléctrica</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={conductividadElectrica} onChange={handleChangeConductividadElectrica}/>
                                        <Select className='selectForm'
                                        options={unidadesConductividadElectrica}
                                        value={unidadConductividadElectrica}
                                        onChange={handleChangeUnidadCondElect}>

                                        </Select>
                                    </Form.Group>

                                    {/* Campo RAS */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={rasVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>RAS</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={ras} onChange={handleChangeRas}/>
                                    </Form.Group>

                                    {/* Campo CSR */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={'labelFormIzquierdo'}>CSR</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={csr} onChange={handleChangeCsr}/>
                                    </Form.Group> 

                                    {/* Campo Cloruros */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={clorurosVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Cloruros</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={cloruros} onChange={handleChangecloruros}/>
                                        <Select className='selectForm'
                                        options={unidadesBasico}
                                        value={unidadcloruroseleccionada}
                                        onChange={handleChangeUnidadCloro}>

                                        </Select>
                                    </Form.Group>

                                    {/* Campo Nitratos */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={'labelFormIzquierdo'}>Nitratos</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={nitratos} onChange={handleChangeNitratos}/>
                                        <Select className='selectForm'
                                        options={unidadesBasico}
                                        value={unidadNitratosSeleccionada}
                                        onChange={handleChangeUnidadNitratos}>

                                        </Select>
                                    </Form.Group>

                                    {/* Campo Fosfatos */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={'labelFormIzquierdo'}>Fosfatos</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={fosfatos} onChange={handleChangeFosfatos}/>
                                        <Select className='selectForm'
                                        options={unidadesBasico}
                                        value={unidadFosfatoSeleccionada}
                                        onChange={handleChangeUnidadFosfatos}>

                                        </Select>
                                    </Form.Group>

                                </div>
                                
                                {/* columna 2 */}
                                <div className="columnaDos">

                                    {/* Campo calcio */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={calcioVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Calcio</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={calcio} onChange={handleChangeCalcio}/>
                                        <Select className='selectForm'
                                        options={unidadesBasico}
                                        value={unidadBasicaSeleccionada}
                                        onChange={handleChangeUnidadBasica}>

                                        </Select>
                                    </Form.Group> 

                                    {/* Campo Magnesio */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={magnesioVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Magnesio</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={magnesio} onChange={handleChangeMagnesio}/>
                                        <Select className='selectForm'
                                        options={unidadesBasico}
                                        value={unidadBasicaSeleccionada}
                                        onChange={handleChangeUnidadBasica}>

                                        </Select>
                                    </Form.Group> 

                                    {/* Campo Sodio */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={sodioVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Sodio</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={sodio} onChange={handleChangeSodio}/>
                                        <Select className='selectForm'
                                        options={unidadesBasico}
                                        value={unidadBasicaSeleccionada}
                                        onChange={handleChangeUnidadBasica}>

                                        </Select>
                                    </Form.Group> 

                                    {/* Campo Potasio */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Potasio</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={potasio} onChange={handleChangePotasio}/>
                                        <Select className='selectForm'
                                        options={unidadesBasico}
                                        value={unidadBasicaSeleccionada}
                                        onChange={handleChangeUnidadBasica}>

                                        </Select>
                                    </Form.Group> 

                                    {/* Campo Carbonatos */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Carbonatos</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={carbonatos} onChange={handleChangeCarbonatos}/>
                                        <Select className='selectForm'
                                        options={unidadesBasico}
                                        value={unidadCarbonatosSeleccionada}
                                        onChange={handleChangeUnidadCarbonatos}>

                                        </Select>
                                    </Form.Group> 

                                    {/* Campo Bicarbonatos */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Bicarbonatos</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={bicarbonatos} onChange={handleChangeBicarbonatos}/>
                                        <Select className='selectForm'
                                        options={unidadesBasico}
                                        value={unidadBicarbonatosSeleccionada}
                                        onChange={handleChangeUnidadBicarbonatos}>

                                        </Select>
                                    </Form.Group> 




                                </div>

                                {/* columna 3 */}
                                <div className='columnaTres'>

                                    {/* campo Residuo Seco */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Residuo Seco</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={residuoSeco} onChange={handleChangeResiduoSeco}/>
                                        <Select className='selectForm'
                                        options={unidadesResiduoSeco}
                                        value={unidadResiduoSecoSeleccionada}
                                        onChange={handleChangeUnidadResiduoSeco}>

                                        </Select>
                                    </Form.Group>

                                    {/* campo dureza total */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Dureza Total</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={dureza} onChange={handleChangeDureza}/>
                                        <Select className='selectForm'
                                        options={unidadesDurezaAlcalinidad}
                                        value={unidadDurezaSeleccionada}
                                        onChange={handleChangeUnidadDureza}>

                                        </Select>
                                    </Form.Group>

                                    {/* campo Alcalinidad Total */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Alcalinidad Total</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={alcalinidad} onChange={handleChangeAlcalinidad}/>
                                        <Select className='selectForm'
                                        options={unidadesDurezaAlcalinidad}
                                        value={unidadAlcalinidadSeleccionada}
                                        onChange={handleChangeUnidadAlcalinidad}>

                                        </Select>
                                    </Form.Group>

                                    {/* Campo Humedad Gravimétrica */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Humedad Gravimétrica</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={humedad} onChange={handleChangeHumedad}/>
                                        <Form.Label className='labelForm'>%</Form.Label>
                                    </Form.Group> 

                                    {/* campo Sulfatos */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Sulfatos</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={sulfatos} onChange={handleChangeSulfatos}/>
                                        <Select className='selectForm'
                                        options={unidadesBasico}
                                        value={unidadSulfatosSeleccionada}
                                        onChange={handleChangeUnidadSulfatos}>

                                        </Select>
                                    </Form.Group>

                                    {/* campo Boro */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Boro</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={boro} onChange={handleChangeBoro}/>
                                        <Select className='selectForm'
                                        options={unidadesBasico}
                                        value={unidadBoroSeleccionada}
                                        onChange={handleChangeUnidadBoro}>
                                        </Select>
                                    </Form.Group>

                                    {/* campo Densidad Aparente */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Densidad Aparente</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={densidadAparente} onChange={handleChangeDensidadAparente}/>
                                        <Select className='selectForm'
                                        options={unidadesDensidad}
                                        value={unidadDensidad}
                                        onChange={handleChangeUnidadDensidad}>

                                        </Select>
                                    </Form.Group>

                                    {/* Mensaje de Faltan Campos */}
                                    <Form.Group className='grupoForm'>
                                        {(pHVacio || conductividadElectricaVacio || rasVacio || clorurosVacio || calcioVacio || magnesioVacio || densidadVacio
                                            || sodioVacio || potasioVacio) && <Form.Label className='labelFormError'>*Los campos en rojo no están completos</Form.Label>}
                                        {( unidadConductividadElectricaVacio || unidadclorurosVacio || unidadNitratosVacio || unidadFosfatosVacio || unidadDensidadVacio || unidadSulfatosVacio || unidadAlcalinidadVacio || unidadDurezaVacio
                                        || unidadBasicaSeleccionadaVacio || unidadCarbonatosSeleccionadaVacio || unidadBicarbonatosSeleccionadaVacio) && <Form.Label className='labelFormError'>*Debe seleccionar una unidad</Form.Label>}
                                        {fechaVacio && <Form.Label className='labelFormError'>*Debe seleccionar una fecha</Form.Label>}
                                        {laboratorioVacio && <Form.Label className='labelFormError'>*Debe seleccionar un laboratorio</Form.Label>}
                                    </Form.Group> 

                                </div>

                                {/* Botones formulario */}
                                <div className="botonesFormAnalisis botonesFormAnalisisAguaUtil">
                                    <Button className="estiloBotonesFormAnalisis btnCancelarAnalisis" variant="secondary" onClick={handleCancelarEdicion}>
                                        Cancelar
                                    </Button>

                                    <Button className="estiloBotonesFormAnalisis btnConfirmarAnalisis" variant="secondary" type="submit"
                                    disabled={estaEnPeticion}>
                                        Aceptar
                                    </Button>                    
                                </div>
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
                        </div>
                    </>
                )
            }
            else{
                return(
                    <>

                    {/* CONSULTAR ANÁLISIS COMPLETO */}

                    {/* contenedor */}
                    <div className="contenedorAnalisisCompleto">

                        {/* título contenedor */}
                        <div className='contenedorTituloAnalisisCompleto'>
                            <span className='tituloAnalisisCompleto'>Análisis Químico del Suelo - Agua Útil</span> 
                        </div>

                        {/* formulario análisis */}
                        <Form className='formularioAnalisisAguaUtil'>

                        {/* Encabezado análisis */}
                        <div className='encabezado'>

                            {/* Fecha de análisis */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormEncabezado'>Fecha</Form.Label>
                                <DatePicker 
                                className='fechaAnalisis'
                                dateFormat="dd/MM/yyyy"
                                value={moment(analisisAguaUtil.fecha_analisis).format('DD/MM/YYYY')}
                                disabled={true}
                                />
                            </Form.Group>

                            {/* Select Laboratorio */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormEncabezado'>Laboratorio</Form.Label>
                                <Select className='selectLaboratorio'
                                value={{label: laboratorioAnalisis[0].nombre, value: laboratorioAnalisis[0].id}}
                                isDisabled={true}
                                >    
                                </Select>
                            </Form.Group>
                        </div>

                        {/* columna 1 */}
                        <div className="columnaUno">

                            {/* Campo pH*/}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>pH</Form.Label>
                                <Form.Control className='inputForm' type='text' value={analisisAguaUtil.ph}
                                disabled={true}/>
                            </Form.Group>    



                            {/* Campo Conductividad Eléctrica */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>Conductividad Eléctrica</Form.Label>
                                <Form.Control className='inputForm' type='text' value={analisisAguaUtil.conductividad_electrica} disabled={true}/>
                                <Form.Label className='labelForm'>dS/m</Form.Label>
                            </Form.Group>

                            {/* Campo RAS */}
                                <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>RAS</Form.Label>
                                <Form.Control className='inputForm' type='text' value={analisisAguaUtil.relacion_absorcion_sodio} disabled={true}/>
                            </Form.Group> 

                            {/* Campo CSR */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>CSR</Form.Label>
                                <Form.Control className='inputForm' type='text' value={analisisAguaUtil.csr === null ? "" : analisisAguaUtil.csr} 
                                disabled={true}/>
                            </Form.Group> 

                            {/* Campo Cloruros */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>Cloruros</Form.Label>
                                <Form.Control className='inputForm' type='text' value={analisisAguaUtil.cloruros} disabled={true}/>
                                <Form.Label className='labelForm'>mg/L</Form.Label>
                            </Form.Group>

                            {/* Campo Nitratos */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>Nitratos</Form.Label>
                                <Form.Control className='inputForm' type='text' value={analisisAguaUtil.nitratos === null ? "" : analisisAguaUtil.nitratos} 
                                disabled={true}/>
                                <Form.Label className='labelForm'>mg/L</Form.Label>
                            </Form.Group>

                            {/* Campo Fosfatos */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>Fosfatos</Form.Label>
                                <Form.Control className='inputForm' type='text' value={analisisAguaUtil.fosfatos === null ? "" : analisisAguaUtil.fosfatos} 
                                disabled={true}/>
                                <Form.Label className='labelForm'>mg/L</Form.Label>
                            </Form.Group>

                        </div>
                        
                        {/* columna 2 */}
                        <div className="columnaDos">


                            {/* Campo calcio */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>Calcio</Form.Label>
                                <Form.Control className='inputForm' type='text' value={analisisAguaUtil.calcio} disabled={true}/>
                                <Form.Label className='labelForm'>mg/L</Form.Label>
                            </Form.Group> 

                            {/* Campo Magnesio */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>Magnesio</Form.Label>
                                <Form.Control className='inputForm' type='text' value={analisisAguaUtil.magnesio} disabled={true}/>
                                <Form.Label className='labelForm'>mg/L</Form.Label>
                            </Form.Group> 

                            {/* Campo Sodio */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>Sodio</Form.Label>
                                <Form.Control className='inputForm' type='text' value={analisisAguaUtil.sodio} disabled={true}/>
                                <Form.Label className='labelForm'>mg/L</Form.Label>
                            </Form.Group> 

                            {/* Campo Potasio */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>Potasio</Form.Label>
                                <Form.Control className='inputForm' type='text' value={analisisAguaUtil.potasio} disabled={true}/>
                                <Form.Label className='labelForm'>mg/L</Form.Label>
                            </Form.Group> 

                            {/* Campo Carbonatos */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>Carbonatos</Form.Label>
                                <Form.Control className='inputForm' type='text' value={analisisAguaUtil.carbonatos === null ? "" : analisisAguaUtil.carbonatos}
                                disabled={true}/>
                                <Form.Label className='labelForm'>mg/L</Form.Label>
                            </Form.Group> 

                            {/* Campo Bicarbonatos */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>Bicarbonatos</Form.Label>
                                <Form.Control className='inputForm' type='text' value={analisisAguaUtil.bicarbonatos === null ? "" : analisisAguaUtil.bicarbonatos}
                                disabled={true}/>
                                <Form.Label className='labelForm'>mg/L</Form.Label>
                            </Form.Group> 




                        </div>

                            {/* columna 3 */}
                            <div className='columnaTres'>

                                {/* Titulo Textura del Suelo */}
                                {/* <div className='contenedorCationesIntercambio'>
                                    <span className='tituloCationesIntercambio'>Textura del Suelo</span> 
                                </div> */}

                                {/* campo Residuo Seco */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className='labelFormIzquierdo'>Residuo Seco</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisAguaUtil.residuo_seco === null ? "" : analisisAguaUtil.residuo_seco}
                                    disabled={true}/>
                                    <Form.Label className='labelForm'>mg/L</Form.Label>
                                </Form.Group>

                                {/* campo Dureza Total */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className='labelFormIzquierdo'>Dureza Total</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisAguaUtil.dureza_total === null ? "" : analisisAguaUtil.dureza_total}
                                    disabled={true}/>
                                    <Form.Label className='labelForm'>mg/L CaCO3</Form.Label>
                                </Form.Group>

                                {/* campo Alcalinidad Total */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className='labelFormIzquierdo'>Alcalinidad Total</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisAguaUtil.alcalinidad_total === null ? "" : analisisAguaUtil.alcalinidad_total}
                                    disabled={true}/>
                                    <Form.Label className='labelForm'>mg/L CaCO3</Form.Label>
                                </Form.Group>

                                {/* Campo Humedad Gravimétrica */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className='labelFormIzquierdo'>Humedad Gravimétrica</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisAguaUtil.humedad_gravimetrica === null ? "" : analisisAguaUtil.humedad_gravimetrica}
                                    disabled={true}/>
                                    <Form.Label className='labelForm'>%</Form.Label>
                                </Form.Group> 

                                {/* Campo Sulfatos */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className='labelFormIzquierdo'>Sulfatos</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisAguaUtil.sulfatos === null ? "" : analisisAguaUtil.sulfatos}
                                    disabled={true}/>
                                    <Form.Label className='labelForm'>mg/L</Form.Label>
                                </Form.Group> 

                                {/* Campo Boro */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className='labelFormIzquierdo'>Boro</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisAguaUtil.boro === null ? "" : analisisAguaUtil.boro} 
                                    disabled={true}/>
                                    <Form.Label className='labelForm'>mg/L</Form.Label>
                                </Form.Group> 

                                {/* Campo Densidad Aparente */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className='labelFormIzquierdo'>Densidad Aparente</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisAguaUtil.humedad_gravimetrica === null ? "" : analisisAguaUtil.humedad_gravimetrica}
                                    disabled={true}/>
                                    <Form.Label className='labelForm'>gr/cm3</Form.Label>
                                </Form.Group> 

                            </div>
                        </Form>

                        {/* Botones formulario */}
                        <div className="botonesFormAnalisis botonesFormAnalisisAguaUtil">
                            <Button className="estiloBotonesFormAnalisis btnCancelarAnalisis" variant="secondary" onClick={handleCancelar}>
                                Cancelar
                            </Button>

                            <Button className="estiloBotonesFormAnalisis btnConfirmarAnalisis" variant="secondary" onClick={handleHabilitarEdicion}>
                                Editar
                            </Button>                    
                    </div>
                </div>

                {
                    mostrarAlertaAnalisisDiagnosticado && 
                    <Error texto={"No puede modificar un análisis que ya tiene un Diagnóstico efectuado."}
                    onConfirm={() => {setMostrarAlertaAnalisisDiagnosticado(false)}}/>
                }
            </>
                )
            }
        }
        else{
            return(<div>Cargando...</div>)
        }
    }
    else if (laboratorios !== undefined && analisisAguaUtil === undefined){
        return(
        <>

            {/* REGISTRAR ANÁLISIS COMPLETO */}

            {/* contenedor */}
            <div className="contenedorAnalisisCompleto">

                {/* título contenedor */}
                <div className='contenedorTituloAnalisisCompleto'>
                    <span className='tituloAnalisisCompleto'>Análisis Químico del Suelo - Agua Útil</span> 
                </div>

                {/* formulario análisis */}
                <Form className='formularioAnalisisAguaUtil' onSubmit={handleSubmit(registrarAnalisisAguaUtil)}>

                    {/* Encabezado análisis */}
                    <div className='encabezado'>

                        {/* Fecha de análisis */}
                        <Form.Group className='grupoForm'>
                            <Form.Label className='labelFormEncabezado'>Fecha</Form.Label>
                            <DatePicker 
                            className='fechaAnalisis'
                            dateFormat="dd/MM/yyyy"
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            minDate={moment(fechaTomaMuestra, "YYYY-MM-DD").toDate()}
                            maxDate={new Date()}
                            />
                        </Form.Group>

                        {/* Select Laboratorio */}
                        <Form.Group className='grupoForm'>
                            <Form.Label className='labelFormEncabezado'>Laboratorio</Form.Label>
                            <Select className='selectLaboratorio'
                                value={laboratorioSeleccionado}
                                defaultValue={{label: 'Seleccione un Laboratorio', value: 0}}
                                onChange={handleChangeLaboratorio}
                                options={
                                    laboratorios.map( labo => ({label: labo.nombre, value: labo.id}))
                                }>    
                            </Select>
                        </Form.Group>
                    </div>

                    {/* columna 1 */}
                    <div className="columnaUno">

                        {/* Campo pH*/}
                        <Form.Group className='grupoForm'>
                            <Form.Label className='labelFormIzquierdo'>pH</Form.Label>
                            <Form.Control className='inputForm' type='text' value={pH} onChange={handleChangePH}/>
                        </Form.Group>    


                        {/* Campo Conductividad Eléctrica */}
                        <Form.Group className='grupoForm'>
                            <Form.Label className={conductividadElectricaVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Conductividad Eléctrica</Form.Label>
                            <Form.Control className='inputForm' type='text' value={conductividadElectrica} onChange={handleChangeConductividadElectrica}/>
                            <Select className='selectForm'
                            options={unidadesConductividadElectrica}
                            value={unidadConductividadElectrica}
                            onChange={handleChangeUnidadCondElect}>

                            </Select>
                        </Form.Group>

                        {/* Campo RAS */}
                        <Form.Group className='grupoForm'>
                            <Form.Label className={rasVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>RAS</Form.Label>
                            <Form.Control className='inputForm' type='text' value={ras} onChange={handleChangeRas}/>
                        </Form.Group>

                        {/* Campo CSR */}
                        <Form.Group className='grupoForm'>
                            <Form.Label className={'labelFormIzquierdo'}>CSR</Form.Label>
                            <Form.Control className='inputForm' type='text' value={csr} onChange={handleChangeCsr}/>
                        </Form.Group> 

                        {/* Campo Cloruros */}
                        <Form.Group className='grupoForm'>
                            <Form.Label className={clorurosVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Cloruros</Form.Label>
                            <Form.Control className='inputForm' type='text' value={cloruros} onChange={handleChangecloruros}/>
                            <Select className='selectForm'
                            options={unidadesBasico}
                            value={unidadcloruroseleccionada}
                            onChange={handleChangeUnidadCloro}>

                            </Select>
                        </Form.Group>

                        {/* Campo Nitratos */}
                        <Form.Group className='grupoForm'>
                            <Form.Label className={'labelFormIzquierdo'}>Nitratos</Form.Label>
                            <Form.Control className='inputForm' type='text' value={nitratos} onChange={handleChangeNitratos}/>
                            <Select className='selectForm'
                            options={unidadesBasico}
                            value={unidadNitratosSeleccionada}
                            onChange={handleChangeUnidadNitratos}>

                            </Select>
                        </Form.Group>

                        {/* Campo Fosfatos */}
                        <Form.Group className='grupoForm'>
                            <Form.Label className={'labelFormIzquierdo'}>Fosfatos</Form.Label>
                            <Form.Control className='inputForm' type='text' value={fosfatos} onChange={handleChangeFosfatos}/>
                            <Select className='selectForm'
                            options={unidadesBasico}
                            value={unidadFosfatoSeleccionada}
                            onChange={handleChangeUnidadFosfatos}>

                            </Select>
                        </Form.Group>

                    </div>
                    
                    {/* columna 2 */}
                    <div className="columnaDos">

                        {/* Campo calcio */}
                        <Form.Group className='grupoForm'>
                            <Form.Label className={calcioVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Calcio</Form.Label>
                            <Form.Control className='inputForm' type='text' value={calcio} onChange={handleChangeCalcio}/>
                            <Select className='selectForm'
                            options={unidadesBasico}
                            value={unidadBasicaSeleccionada}
                            onChange={handleChangeUnidadBasica}>

                            </Select>
                        </Form.Group> 

                        {/* Campo Magnesio */}
                        <Form.Group className='grupoForm'>
                            <Form.Label className={magnesioVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Magnesio</Form.Label>
                            <Form.Control className='inputForm' type='text' value={magnesio} onChange={handleChangeMagnesio}/>
                            <Select className='selectForm'
                            options={unidadesBasico}
                            value={unidadBasicaSeleccionada}
                            onChange={handleChangeUnidadBasica}>

                            </Select>
                        </Form.Group> 

                        {/* Campo Sodio */}
                        <Form.Group className='grupoForm'>
                            <Form.Label className={sodioVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Sodio</Form.Label>
                            <Form.Control className='inputForm' type='text' value={sodio} onChange={handleChangeSodio}/>
                            <Select className='selectForm'
                            options={unidadesBasico}
                            value={unidadBasicaSeleccionada}
                            onChange={handleChangeUnidadBasica}>

                            </Select>
                        </Form.Group> 

                        {/* Campo Potasio */}
                        <Form.Group className='grupoForm'>
                            <Form.Label className='labelFormIzquierdo'>Potasio</Form.Label>
                            <Form.Control className='inputForm' type='text' value={potasio} onChange={handleChangePotasio}/>
                            <Select className='selectForm'
                            options={unidadesBasico}
                            value={unidadBasicaSeleccionada}
                            onChange={handleChangeUnidadBasica}>

                            </Select>
                        </Form.Group> 

                        {/* Campo Carbonatos */}
                        <Form.Group className='grupoForm'>
                            <Form.Label className='labelFormIzquierdo'>Carbonatos</Form.Label>
                            <Form.Control className='inputForm' type='text' value={carbonatos} onChange={handleChangeCarbonatos}/>
                            <Select className='selectForm'
                            options={unidadesBasico}
                            value={unidadCarbonatosSeleccionada}
                            onChange={handleChangeUnidadCarbonatos}>

                            </Select>
                        </Form.Group> 

                        {/* Campo Bicarbonatos */}
                        <Form.Group className='grupoForm'>
                            <Form.Label className='labelFormIzquierdo'>Bicarbonatos</Form.Label>
                            <Form.Control className='inputForm' type='text' value={bicarbonatos} onChange={handleChangeBicarbonatos}/>
                            <Select className='selectForm'
                            options={unidadesBasico}
                            value={unidadBicarbonatosSeleccionada}
                            onChange={handleChangeUnidadBicarbonatos}>

                            </Select>
                        </Form.Group> 




                    </div>

                    {/* columna 3 */}
                    <div className='columnaTres'>

                        {/* campo Residuo Seco */}
                        <Form.Group className='grupoForm'>
                            <Form.Label className='labelFormIzquierdo'>Residuo Seco</Form.Label>
                            <Form.Control className='inputForm' type='text' value={residuoSeco} onChange={handleChangeResiduoSeco}/>
                            <Select className='selectForm'
                            options={unidadesResiduoSeco}
                            value={unidadResiduoSecoSeleccionada}
                            onChange={handleChangeUnidadResiduoSeco}>

                            </Select>
                        </Form.Group>

                        {/* campo dureza total */}
                        <Form.Group className='grupoForm'>
                            <Form.Label className='labelFormIzquierdo'>Dureza Total</Form.Label>
                            <Form.Control className='inputForm' type='text' value={dureza} onChange={handleChangeDureza}/>
                            <Select className='selectForm'
                            options={unidadesDurezaAlcalinidad}
                            value={unidadDurezaSeleccionada}
                            onChange={handleChangeUnidadDureza}>

                            </Select>
                        </Form.Group>

                        {/* campo Alcalinidad Total */}
                        <Form.Group className='grupoForm'>
                            <Form.Label className='labelFormIzquierdo'>Alcalinidad Total</Form.Label>
                            <Form.Control className='inputForm' type='text' value={alcalinidad} onChange={handleChangeAlcalinidad}/>
                            <Select className='selectForm'
                            options={unidadesDurezaAlcalinidad}
                            value={unidadAlcalinidadSeleccionada}
                            onChange={handleChangeUnidadAlcalinidad}>

                            </Select>
                        </Form.Group>

                        {/* Campo Humedad Gravimétrica */}
                        <Form.Group className='grupoForm'>
                            <Form.Label className='labelFormIzquierdo'>Humedad Gravimétrica</Form.Label>
                            <Form.Control className='inputForm' type='text' value={humedad} onChange={handleChangeHumedad}/>
                            <Form.Label className='labelForm'>%</Form.Label>
                        </Form.Group> 

                        {/* campo Sulfatos */}
                        <Form.Group className='grupoForm'>
                            <Form.Label className='labelFormIzquierdo'>Sulfatos</Form.Label>
                            <Form.Control className='inputForm' type='text' value={sulfatos} onChange={handleChangeSulfatos}/>
                            <Select className='selectForm'
                            options={unidadesBasico}
                            value={unidadSulfatosSeleccionada}
                            onChange={handleChangeUnidadSulfatos}>

                            </Select>
                        </Form.Group>

                        {/* campo Boro */}
                        <Form.Group className='grupoForm'>
                            <Form.Label className='labelFormIzquierdo'>Boro</Form.Label>
                            <Form.Control className='inputForm' type='text' value={boro} onChange={handleChangeBoro}/>
                            <Select className='selectForm'
                            options={unidadesBasico}
                            value={unidadBoroSeleccionada}
                            onChange={handleChangeUnidadBoro}>
                            </Select>
                        </Form.Group>

                        {/* campo Densidad Aparente */}
                        <Form.Group className='grupoForm'>
                            <Form.Label className='labelFormIzquierdo'>Densidad Aparente</Form.Label>
                            <Form.Control className='inputForm' type='text' value={densidadAparente} onChange={handleChangeDensidadAparente}/>
                            <Select className='selectForm'
                            options={unidadesDensidad}
                            value={unidadDensidad}
                            onChange={handleChangeUnidadDensidad}>

                            </Select>
                        </Form.Group>

                        {/* Mensaje de Faltan Campos */}
                        <Form.Group className='grupoForm'>
                            {(pHVacio || conductividadElectricaVacio || rasVacio || clorurosVacio || calcioVacio || magnesioVacio || densidadVacio
                                || sodioVacio || potasioVacio) && <Form.Label className='labelFormError'>*Los campos en rojo no están completos</Form.Label>}
                            {( unidadConductividadElectricaVacio || unidadclorurosVacio || unidadNitratosVacio || unidadFosfatosVacio || unidadDensidadVacio || unidadSulfatosVacio || unidadAlcalinidadVacio || unidadDurezaVacio
                            || unidadBasicaSeleccionadaVacio || unidadCarbonatosSeleccionadaVacio || unidadBicarbonatosSeleccionadaVacio) && <Form.Label className='labelFormError'>*Debe seleccionar una unidad</Form.Label>}
                            {fechaVacio && <Form.Label className='labelFormError'>*Debe seleccionar una fecha</Form.Label>}
                            {laboratorioVacio && <Form.Label className='labelFormError'>*Debe seleccionar un laboratorio</Form.Label>}
                        </Form.Group> 

                    </div>

                    {/* Botones formulario */}
                    <div className="botonesFormAnalisis botonesFormAnalisisAguaUtil">
                        <Button className="estiloBotonesFormAnalisis btnCancelarAnalisis" variant="secondary" onClick={handleCancelar}>
                            Cancelar
                        </Button>

                        <Button className="estiloBotonesFormAnalisis btnConfirmarAnalisis" variant="secondary" type="submit"
                        disabled={estaEnPeticion}>
                            Registrar
                        </Button>                    
                    </div>
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
                <div>Cargando...</div>
            </>
        )
    }

    }
    


export default AnalisisAguaUtil;