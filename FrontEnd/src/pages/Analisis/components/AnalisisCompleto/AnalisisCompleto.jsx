// Importar estilos
import '../../components/Analisis.css';
import './AnalisisCompleto.css';

// Importar componentes
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import { Button } from "react-bootstrap";
import Error from '../../../../components/Modals/Error/Error';
import Confirm from '../../../../components/Modals/Confirm/Confirm';
import DatePicker from "react-datepicker";

// Importar hooks
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import moment from 'moment/moment';
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";

// Importar services
import { registrarNuevoAnalisisCompleto, modificarAnalisisCompletoService } from '../../services/analisis.service';
import { renewToken } from '../../../../services/token.service';
import { laboratoriosService } from '../../../../services/laboratorios.service';
import { consultarLaboratorio } from '../../../../services/laboratorios.service';

function AnalisisCompleto({tomaDeMuestra, analisisCompleto = undefined, fechaTomaMuestra = undefined}) {

    const { handleSubmit, reset } = useForm();

    let navigate = useNavigate();

    const [ estaEnPeticion, setEstaEnPeticion ] = useState(false);

    // modo del componente
    const [ modo, setModo ] = useState();

    // variables para los valores del análisis
    const [ materiaOrganica, setMateriaOrganica ] = useState("");
    const [ carbono, setCarbono ] = useState("");
    const [ nitrogeno, setNitrogeno ] = useState("");
    const [ relacionCN, setRelacionCN ] = useState("");
    const [ nan, setNan ] = useState("");
    const [ nitratos, setNitratos ] = useState("");
    const [ pH, setPH ] = useState("");
    const [ conductividadElectrica, setConductividadElectrica ] = useState("");
    const [ azufre, setAzufre ] = useState("");
    const [ fosforo, setFosforo ] = useState("");
    const [ calcio, setCalcio ] = useState("");
    const [ magnesio, setMagnesio ] = useState("");
    const [ sodio, setSodio ] = useState("");
    const [ potasio, setPotasio ] = useState("");
    const [ saturacion, setSaturacion ] = useState("");
    const [ cic, setCic ] = useState("");
    const [ valorInsat, setValorInsat ] = useState("");
    const [ psi, setPsi ] = useState("");
    const [ aluminio, setAluminio ] = useState("");
    const [ arcilla, setArcilla ] = useState("");
    const [ limo, setLimo ] = useState("");
    const [ arena, setArena ] = useState("");
    const [ humedad, setHumedad ] = useState("");
    const [ densidad, setDensidad ] = useState("1,25");

    // variables para los errores de campo vacio
    const [ fechaVacio, setFechaVacio ] = useState(false);
    const [ materiaOrganicaVacio, setMateriaOrganicaVacio ] = useState(false);
    const [ carbonoVacio, setCarbonoVacio ] = useState(false);
    const [ nitrogenoVacio, setNitrogenoVacio ] = useState(false);
    const [ pHVacio, setPHVacio ] = useState(false);
    const [ calcioVacio, setCalcioVacio ] = useState(false);
    const [ magnesioVacio, setMagnesioVacio ] = useState(false);
    const [ sodioVacio, setSodioVacio ] = useState(false);
    const [ potasioVacio, setPotasioVacio ] = useState(false);
    const [ cicVacio, setCicVacio ] = useState(false);
    const [ densidadVacio, setDensidadVacio ] = useState(false);
    const [ unidadBasicaVacio, setUnidadBasicaVacio ] = useState(false);
    const [ unidadCEVacio, setUnidadCEVacio ] = useState(false);
    const [ unidadNanVacio, setUnidadNanVacio ] = useState(false);
    const [ unidadCicVacio, setUnidadCicVacio ] = useState(false);
    const [ unidadAluminioVacio, setUnidadAluminioVacio ] = useState(false);
    const [ unidadDensidadVacio, setUnidadDensidadVacio ] = useState(false);

    const [ texturaNo100, setTexturaNo100 ] = useState(false);

    const unidadesBasico = [{label: "cmol(+)/Kg", value: 0}, 
                        {label: "ppm", value: 1},
                        {label: "meq/100g", value: 2}];
    
    const unidadesCIC = [{label: "cmol(+)/Kg", value: 0},
                        {label: "meq/100g", value: 1}]

    const unidadesNan = [{label: "ppm", value: 0},
                        {label:"meq/100g", value: 1}];

    const unidadesConductividadElectrica = [{label: "mS/cm", value: 0},
                                            {label: "dS/m", value: 1}];
    
    const unidadesDensidad = [{label: "gr/cm3", value: 0},
                                {label: "Mg/m3", value: 1},
                                {label: "Ton/m3", value: 2}];   

    const [ unidadBasicaSeleccionada, setUnidadBasicaSeleccionada ] = useState();
    const [ unidadCicSeleccionada, setUnidadCicSeleccionada ] = useState();
    const [ unidadNanSeleccionada, setUnidadNanSeleccionada ] = useState();
    const [ unidadConductividadElectrica, setUnidadConductividadElectrica ] = useState();
    const [ unidadAluminioSeleccionada, setUnidadAluminioSeleccionada ] = useState();
    const [ unidadDensidadSeleccionada, setUnidadDensidadSeleccionada ] = useState({label: "gr/cm3", value: 0});

    const [ laboratorios, setLaboratorios ] = useState();

    const [ laboratorioSeleccionado, setLaboratorioSeleccionado ] = useState({label: "Seleccione Laboratorio",
                                                                            value: 0});
    const [ laboratorioVacio, setLaboratorioVacio ] = useState(false);

    // variable para guardar el laboratorio del análisis consultado
    const [ laboratorioAnalisis, setLaboratorioAnalisis ] = useState();

    // variable para guardar el laboratorio del análisis modificado
    const [ laboratorioAnalisisModificado, setLaboratorioAnalisisModificado ] = useState();

    const handleChangeLaboratorio = (laboratorio) => {
        setLaboratorioSeleccionado({label: laboratorio.label, value: laboratorio.value});
    }

    //variable que toma el valor de la fecha.
    const [startDate, setStartDate] = useState();
    const [ startDateModoModificar, setStartDateModoModificar ] = useState();

    //expresion regular para que el número sea real, separado con coma
    const numeroRealRegExpr = /^-?\d*([,]?\d{0,4})?$/;
    
    // variable para manejar que se muestre el error
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);
    const [ mostrarAlertaAnalisisDiagnosticado , setMostrarAlertaAnalisisDiagnosticado ] = useState(false);

    // variable para mostrar que se creo correctamente el análisis
    const [ mostrarAnalisisRegistrado, setMostrarAnalisisRegistrado ] = useState(false);
    const [ mostrarAnalisisModificado, setMostrarAnalisisModificado ] = useState(false);

    const handleChangeMateriaOrganica = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 100)){setMateriaOrganica(value);}
    }

    const handleChangeCarbono = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 100)){setCarbono(value);}
    }

    const handleChangeNitrogeno = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 100)){setNitrogeno(value);}
    }

    useEffect(() => {
      if(carbono !== "" && nitrogeno !== ""){
        let carb = parseFloat(carbono.replace(",","."));
        let nit = parseFloat(nitrogeno.replace(",","."));
        setRelacionCN((carb / nit).toString());
      }
      else{
        setRelacionCN("");
      } 
    }, [carbono, nitrogeno])

    const handleChangeNan = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setNan(value);}
    }

    const handleChangeUnidadNan = (opcion) => {
        setUnidadNanSeleccionada(opcion);
    }

    const handleChangeNitratos = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setNitratos(value);}
    }

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

    const handleChangeAzufre = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setAzufre(value);}
    }

    const handleChangeFosforo = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setFosforo(value);}
    }

    const handleChangeUnidadBasica = (unidad) => {
        setUnidadBasicaSeleccionada(unidad);
    }

    const handleChangeMagnesio = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setMagnesio(value);}
    }

    const handleChangeCalcio = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setCalcio(value);}
    }

    const handleChangeSodio = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setSodio(value);}
    }

    const handleChangePotasio = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setPotasio(value);}
    }

    useEffect(() => {
        if(calcio !== "" && magnesio !== "" && sodio !== "" && potasio !== "" && unidadBasicaSeleccionada){
            let calc = parseFloat(calcio.replace(",","."));
            let magn = parseFloat(magnesio.replace(",","."));
            let sod = parseFloat(sodio.replace(",","."));
            let pot = parseFloat(potasio.replace(",","."));
            setSaturacion((calc + magn + sod + pot).toString());
        }
        else{
            setSaturacion("");
        }
    }, [calcio, magnesio, sodio, potasio, unidadBasicaSeleccionada])

    const handleChangeCic = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setCic(value);}
    }

    const handleChangeUnidadCic = (opcion) => {
        setUnidadCicSeleccionada(opcion);
    }

    const handleChangeValorInsat = (e) =>{
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setValorInsat(value);}
    }

    useEffect(() => {
        if(sodio !== "" && cic !== "" && unidadCicSeleccionada && unidadBasicaSeleccionada){
            let sod = parseFloat(sodio.replace(",","."));
            let capInt = parseFloat(cic.replace(",","."));
            if(unidadBasicaSeleccionada.value === 1){
                setPsi((100 * (sod * 0.00435) / capInt).toString());
            }
            else {
                setPsi((100 * sod / capInt).toString());
            }
          
        }
        else{
          setPsi("");
        } 
      }, [sodio, cic, unidadBasicaSeleccionada, unidadCicSeleccionada])

    const handleChangeAluminio = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setAluminio(value);}
    }

    const handleChangeUnidadAluminio = (opcion) => {
        setUnidadAluminioSeleccionada(opcion);
    }

    const handleChangeArcilla = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 100)){setArcilla(value);}
    }

    const handleChangeLimo = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 100)){setLimo(value);}
    }

    const handleChangeArena = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 100)){setArena(value);}
    }

    const handleChangeHumedad = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 100)){setHumedad(value);}
    }

    const handleChangeDensidad = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setDensidad(value);}
    }

    const handleChangeUnidadDensidad = (opcion) => {
        setUnidadDensidadSeleccionada(opcion);
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
 

    const handleCancelar = () => {
        reset();
        navigate(-1);
    }

    const validarCampos = () => {
        if(startDate == undefined){
            setFechaVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setFechaVacio(false);
        }
        
        if (laboratorioSeleccionado.value === 0) {
            setLaboratorioVacio(true);
            setEstaEnPeticion(false);
            return false;
        } else {
            setLaboratorioVacio(false);
        }

        if(materiaOrganica === ""){
            setMateriaOrganicaVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setMateriaOrganicaVacio(false);
        }

        if (carbono === "") {
            setCarbonoVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setCarbonoVacio(false);
        }

        if(nitrogeno === ""){
            setNitrogenoVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setNitrogenoVacio(false);
        }

        if(pH === "") {
            setPHVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setPHVacio(false);
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

        if (cic === "") {
            setCicVacio(true);
            setEstaEnPeticion(false);
            return false;
        } else {
            setCicVacio(false);
        }

        if (densidad === "") {
            setDensidadVacio(true);
            setEstaEnPeticion(false);
            return false
        } else {
           setDensidadVacio(false) 
        }

        if(unidadBasicaSeleccionada === undefined){
            setUnidadBasicaVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setUnidadBasicaVacio(false);
        }

        if(unidadCicSeleccionada === undefined){
            setUnidadCicVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setUnidadCicVacio(false);
        }

        if(nan !== ""){
            if(unidadNanSeleccionada === undefined){
                setUnidadNanVacio(true);
                setEstaEnPeticion(false);
                return false;
            }
            else{
                setUnidadNanVacio(false);
            }
        }
        else{
            setUnidadNanVacio(false);
        }        

        if(conductividadElectrica !== ""){
            if(unidadConductividadElectrica === undefined){
                setUnidadCEVacio(true);
                setEstaEnPeticion(false);
                return false;
            }
            else{
                setUnidadCEVacio(false);
            }
        }
        else{
            setUnidadCEVacio(false);
        }          

        if (aluminio !== "") {
            if (unidadAluminioSeleccionada === undefined) {
                setUnidadAluminioVacio(true);
                setEstaEnPeticion(false);
                return false;
            } else {
                setUnidadAluminioVacio(false);
            }
        } else {
            setUnidadAluminioVacio(false);
        }

        if (densidad === ""){
            setDensidadVacio(true);
            setEstaEnPeticion(false);
            return false;
        } else {
            setDensidadVacio(false);
        }

        if (unidadDensidadSeleccionada === undefined) {
            setUnidadDensidadVacio(true);
            setEstaEnPeticion(false);
            return false;
        } else {
            setUnidadDensidadVacio(false);
        }

        let valorArcilla;
        let valorLimo;
        let valorArena;
        if(arcilla !== "" && limo !== "" && arena !== ""){
            valorArcilla = parseFloat(arcilla.replace(",","."));
            valorLimo = parseFloat(limo.replace(",","."));
            valorArena = parseFloat(arena.replace(",","."));
            if((valorArcilla + valorLimo + valorArena) == 100){
                setTexturaNo100(false);
            }
            else{
                setTexturaNo100(true);
                setEstaEnPeticion(false);
                return false;
            }
        }
        else if(arcilla !== "" && limo !== "" && arena === ""){
            valorArcilla = parseFloat(arcilla.replace(",","."));
            valorLimo = parseFloat(limo.replace(",","."));
            if((valorArcilla + valorLimo) == 100){
                setTexturaNo100(false);
            }
            else{
                setTexturaNo100(true);
                setEstaEnPeticion(false);
                return false;
            }
        }
        else if(arcilla !== "" && limo === "" && arena !== ""){
            valorArcilla = parseFloat(arcilla.replace(",","."));
            valorArena = parseFloat(arena.replace(",","."));
            if((valorArcilla + valorArena) == 100){
                setTexturaNo100(false);
            }
            else{
                setTexturaNo100(true);
                setEstaEnPeticion(false);
                return false;
            }
        }
        else if(arcilla !== "" && limo === "" && arena === ""){
            valorArcilla = parseFloat(arcilla.replace(",","."));
            if((valorArcilla) == 100){
                setTexturaNo100(false);
            }
            else{
                setTexturaNo100(true);
                setEstaEnPeticion(false);
                return false;
            }
        }
        else if(arcilla === "" && limo !== "" && arena !== ""){
            valorLimo = parseFloat(limo.replace(",","."));
            valorArena = parseFloat(arena.replace(",","."));
            if((valorArena + valorLimo) == 100){
                setTexturaNo100(false);
            }
            else{
                setTexturaNo100(true);
                setEstaEnPeticion(false);
                return false;
            }
        }
        else if(arcilla === "" && limo === "" && arena !== ""){
            valorArena = parseFloat(arena.replace(",","."));
            if((valorArena) == 100){
                setTexturaNo100(false);
            }
            else{
                setTexturaNo100(true);
                setEstaEnPeticion(false);
                return false;
            }
        }
        else if(arcilla === "" && limo !== "" && arena === ""){
            valorLimo = parseFloat(limo.replace(",","."));
            if((valorLimo) == 100){
                setTexturaNo100(false);
            }
            else{
                setTexturaNo100(true);
                setEstaEnPeticion(false);
                return false;
            }
        }
        else if(arcilla === "" && limo === "" && arena === ""){
            setTexturaNo100(false);
        }
        

        return true;
    }

    const registrarAnalisisCompleto = async () => {
        const validacion = validarCampos();
        if(validacion){
            const nuevoAnalisisCompleto = {
                materia_organica: parseFloat(materiaOrganica.replace(",",".")),
                carbono_organico: parseFloat(carbono.replace(",",".")),
                nitrogeno_total: parseFloat(nitrogeno.replace(",",".")),
                ph: parseFloat(pH.replace(",",".")),
                calcio: parseFloat(calcio.replace(",",".")),
                calcio_unidad: unidadBasicaSeleccionada.label,
                magnesio: parseFloat(magnesio.replace(",",".")),
                magnesio_unidad: unidadBasicaSeleccionada.label,
                sodio: parseFloat(sodio.replace(",",".")),
                sodio_unidad: unidadBasicaSeleccionada.label,
                potasio: parseFloat(potasio.replace(",",".")),
                potasio_unidad: unidadBasicaSeleccionada.label,
                fecha_analisis: moment(startDate).format("YYYY-MM-DD"),
                laboratorio_id: laboratorioSeleccionado.value,
                capacidad_intercambio_cationica: parseFloat(cic.replace(",", ".")),
                capacidad_intercambio_cationica_unidad: unidadCicSeleccionada.label
            }
            
            if(nitratos !== ""){
                nuevoAnalisisCompleto.nitratos = parseFloat(nitratos.replace(",","."));
            }
            else{
                nuevoAnalisisCompleto.nitratos = null;
            }

            if(fosforo !== ""){
                nuevoAnalisisCompleto.fosforo_extraible = parseFloat(fosforo.replace(",","."));
            }
            else{
                nuevoAnalisisCompleto.fosforo_extraible = null;
            }

            if(conductividadElectrica !== "" && unidadConductividadElectrica){
                nuevoAnalisisCompleto.conductividad_electrica = parseFloat(conductividadElectrica.replace(",","."));
                nuevoAnalisisCompleto.conductividad_electrica_unidad = unidadConductividadElectrica.label;
            }
            else{
                nuevoAnalisisCompleto.conductividad_electrica = null;
                nuevoAnalisisCompleto.conductividad_electrica_unidad = "";
            }

            if(nan !== "" && unidadNanSeleccionada){
                nuevoAnalisisCompleto.nitrogeno_anaerobico = parseFloat(nan.replace(",","."));
                nuevoAnalisisCompleto.nitrogeno_anaerobico_unidad = unidadNanSeleccionada.label;
            }
            else{
                nuevoAnalisisCompleto.nitrogeno_anaerobico = null;
                nuevoAnalisisCompleto.nitrogeno_anaerobico_unidad = "";
            }

            if(azufre !== ""){
                nuevoAnalisisCompleto.azufre = parseFloat(azufre.replace(",","."));
            }
            else{
                nuevoAnalisisCompleto.azufre = null;
            }

            if(valorInsat !== ""){
                nuevoAnalisisCompleto.valor_insaturacion = parseFloat(valorInsat.replace(",","."));
            }
            else{
                nuevoAnalisisCompleto.valor_insaturacion = null;
            }

            if(humedad !== ""){
                nuevoAnalisisCompleto.humedad_gravimetrica = parseFloat(humedad.replace(",","."));
            }
            else{
                nuevoAnalisisCompleto.humedad_gravimetrica = null;
            }

            if(arcilla !== ""){
                nuevoAnalisisCompleto.arcilla = parseFloat(arcilla.replace(",","."));
            }
            else{
                nuevoAnalisisCompleto.arcilla = null;
            }

            if(limo !== ""){
                nuevoAnalisisCompleto.limo = parseFloat(limo.replace(",","."));
            }
            else{
                nuevoAnalisisCompleto.limo = null;
            }

            if(arena !== ""){
                nuevoAnalisisCompleto.arena = parseFloat(arena.replace(",","."));
            }
            else{
                nuevoAnalisisCompleto.arena = null;
            }

            nuevoAnalisisCompleto.densidad_aparente = parseFloat(densidad.replace(",","."));
            nuevoAnalisisCompleto.densidad_aparente_unidad = unidadDensidadSeleccionada.label;

            if(aluminio !== ""){
                nuevoAnalisisCompleto.aluminio = parseFloat(aluminio.replace(",","."));
                nuevoAnalisisCompleto.aluminio_unidad = unidadAluminioSeleccionada. label;
            } else {
                nuevoAnalisisCompleto.aluminio = null;
                nuevoAnalisisCompleto.aluminio_unidad = "";
            }

            try {
                await registrarNuevoAnalisisCompleto(tomaDeMuestra.id, nuevoAnalisisCompleto);
                setMostrarAnalisisRegistrado(true);
            } catch (error) {
                if(error.response && error.response.status === 401){
                    try {
                        await renewToken();
                        await registrarNuevoAnalisisCompleto(tomaDeMuestra.id, nuevoAnalisisCompleto);
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
        if(analisisCompleto){
            const fetchLaboratorio = async () => {
                try {
                    const { data } = await consultarLaboratorio(analisisCompleto.laboratorio_id);
                    setLaboratorioAnalisis(data);
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        try {
                            await renewToken();
                            const { data } = await consultarLaboratorio(analisisCompleto.laboratorio_id);
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
    }, [analisisCompleto]);

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

    useEffect(() => {
        if(modo === "modificar"){
            setStartDateModoModificar(moment(analisisCompleto.fecha_analisis, "YYYY-MM-DD").toDate());
            setLaboratorioAnalisisModificado({label: laboratorioAnalisis[0].nombre, value: laboratorioAnalisis[0].id});
            setMateriaOrganica(String(analisisCompleto.materia_organica).replace(".", ","));
            setCarbono(String(analisisCompleto.carbono_organico).replace(".", ","));
            setNitrogeno(String(analisisCompleto.nitrogeno_total).replace(".", ","));
            setRelacionCN(analisisCompleto.carbono_organico / analisisCompleto.nitrogeno_total);
            if(analisisCompleto.nitrogeno_anaerobico){
                setNan(String(analisisCompleto.nitrogeno_anaerobico).replace(".", ","));
                setUnidadNanSeleccionada({label: "ppm", value: 1});
            }
            if(analisisCompleto.nitratos){
                setNitratos(String(analisisCompleto.nitratos).replace(".", ","));
            }
            setPH(String(analisisCompleto.ph).replace(".", ","));
            setFosforo(String(analisisCompleto.fosforo_extraible).replace(".", ","));
            if(analisisCompleto.aluminio){
                setAluminio(String(analisisCompleto.aluminio).replace(".", ","));
                setUnidadAluminioSeleccionada({label: "ppm", value: 1});
            }
            if(analisisCompleto.conductividad_electrica){
                setConductividadElectrica(String(analisisCompleto.conductividad_electrica).replace(".", ","));
                setUnidadConductividadElectrica({label: "mS/cm", value: 1});
            }
            setCalcio(String(analisisCompleto.calcio).replace(".", ","));
            setMagnesio(String(analisisCompleto.magnesio).replace(".", ","));
            setSodio(String(analisisCompleto.sodio).replace(".", ","));
            setPotasio(String(analisisCompleto.potasio).replace(".", ","));
            setUnidadBasicaSeleccionada({label: "ppm", value: 1});
            setCic(String(analisisCompleto.capacidad_intercambio_cationica).replace(".", ","));
            setUnidadCicSeleccionada({label: "meq/100g", value: 1})
            if(analisisCompleto.valor_insaturacion){
                setValorInsat(String(analisisCompleto.valor_insaturacion).replace(".", ","));
            }
            if(analisisCompleto.azufre){
                setAzufre(String(analisisCompleto.azufre).replace(".", ","));
            }
            if(analisisCompleto.arcilla){
                setArcilla(String(analisisCompleto.arcilla).replace(".", ","));
            }
            if(analisisCompleto.limo){
                setLimo(String(analisisCompleto.limo).replace(".", ","));
            }
            if(analisisCompleto.arena){
                setArena(String(analisisCompleto.arena).replace(".", ","));
            }
            if(analisisCompleto.humedad_gravimetrica){
                setHumedad(String(analisisCompleto.humedad_gravimetrica).replace(".", ","));
            }
            setDensidad(String(analisisCompleto.densidad_aparente).replace(".", ","));
        }
    }, [modo])

    const handleChangeLaboratorioModificado = (laboratorio) => {
        setLaboratorioAnalisisModificado(laboratorio);
    }

    const validarCamposModificacion = () => {
        if(startDateModoModificar == undefined){
            setFechaVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setFechaVacio(false);
        }
        
        if(materiaOrganica === ""){
            setMateriaOrganicaVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setMateriaOrganicaVacio(false);
        }

        if (carbono === "") {
            setCarbonoVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setCarbonoVacio(false);
        }

        if(nitrogeno === ""){
            setNitrogenoVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setNitrogenoVacio(false);
        }

        if(pH === "") {
            setPHVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setPHVacio(false);
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

        if(sodio === "") {
            setSodioVacio(true);
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

        if (cic === "") {
            setCicVacio(true);
            setEstaEnPeticion(false);
            return false;
        } else {
            setCicVacio(false);
        }

        if(unidadCicSeleccionada === undefined){
            setUnidadCicVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setUnidadCicVacio(false);
        }

        if (densidad === "") {
            setDensidadVacio(true);
            setEstaEnPeticion(false);
            return false
        } else {
           setDensidadVacio(false) 
        }

        if(unidadBasicaSeleccionada === undefined){
            setUnidadBasicaVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setUnidadBasicaVacio(false);
        }

        if(nan !== ""){
            if(unidadNanSeleccionada === undefined){
                setUnidadNanVacio(true);
                setEstaEnPeticion(false);
                return false;
            }
            else{
                setUnidadNanVacio(false);
            }
        }
        else{
            setUnidadNanVacio(false);
        }        

        if(conductividadElectrica !== ""){
            if(unidadConductividadElectrica === undefined){
                setUnidadCEVacio(true);
                setEstaEnPeticion(false);
                return false;
            }
            else{
                setUnidadCEVacio(false);
            }
        }
        else{
            setUnidadCEVacio(false);
        }          

        if (aluminio !== "") {
            if (unidadAluminioSeleccionada === undefined) {
                setUnidadAluminioVacio(true);
                setEstaEnPeticion(false);
                return false;
            } else {
                setUnidadAluminioVacio(false);
            }
        } else {
            setUnidadAluminioVacio(false);
        }

        if (densidad === ""){
            setDensidadVacio(true);
            setEstaEnPeticion(false);
            return false;
        } else {
            setDensidadVacio(false);
        }

        if (unidadDensidadSeleccionada === undefined) {
            setUnidadDensidadVacio(true);
            setEstaEnPeticion(false);
            return false;
        } else {
            setUnidadDensidadVacio(false);
        }

        let valorArcilla;
        let valorLimo;
        let valorArena;
        if(arcilla !== "" && limo !== "" && arena !== ""){
            valorArcilla = parseFloat(arcilla.replace(",","."));
            valorLimo = parseFloat(limo.replace(",","."));
            valorArena = parseFloat(arena.replace(",","."));
            if((valorArcilla + valorLimo + valorArena) == 100){
                setTexturaNo100(false);
            }
            else{
                setTexturaNo100(true);
                setEstaEnPeticion(false);
                return false;
            }
        }
        else if(arcilla !== "" && limo !== "" && arena === ""){
            valorArcilla = parseFloat(arcilla.replace(",","."));
            valorLimo = parseFloat(limo.replace(",","."));
            if((valorArcilla + valorLimo) == 100){
                setTexturaNo100(false);
            }
            else{
                setTexturaNo100(true);
                setEstaEnPeticion(false);
                return false;
            }
        }
        else if(arcilla !== "" && limo === "" && arena !== ""){
            valorArcilla = parseFloat(arcilla.replace(",","."));
            valorArena = parseFloat(arena.replace(",","."));
            if((valorArcilla + valorArena) == 100){
                setTexturaNo100(false);
            }
            else{
                setTexturaNo100(true);
                setEstaEnPeticion(false);
                return false;
            }
        }
        else if(arcilla !== "" && limo === "" && arena === ""){
            valorArcilla = parseFloat(arcilla.replace(",","."));
            if((valorArcilla) == 100){
                setTexturaNo100(false);
            }
            else{
                setTexturaNo100(true);
                setEstaEnPeticion(false);
                return false;
            }
        }
        else if(arcilla === "" && limo !== "" && arena !== ""){
            valorLimo = parseFloat(limo.replace(",","."));
            valorArena = parseFloat(arena.replace(",","."));
            if((valorArena + valorLimo) == 100){
                setTexturaNo100(false);
            }
            else{
                setTexturaNo100(true);
                setEstaEnPeticion(false);
                return false;
            }
        }
        else if(arcilla === "" && limo === "" && arena !== ""){
            valorArena = parseFloat(arena.replace(",","."));
            if((valorArena) == 100){
                setTexturaNo100(false);
            }
            else{
                setTexturaNo100(true);
                setEstaEnPeticion(false);
                return false;
            }
        }
        else if(arcilla === "" && limo !== "" && arena === ""){
            valorLimo = parseFloat(limo.replace(",","."));
            if((valorLimo) == 100){
                setTexturaNo100(false);
            }
            else{
                setTexturaNo100(true);
                setEstaEnPeticion(false);
                return false;
            }
        }
        else if(arcilla === "" && limo === "" && arena === ""){
            setTexturaNo100(false);
        }
        

        return true;
    }

    const modificarAnalisisCompleto = async () => {
        const validacionModificacion = validarCamposModificacion();
        if(validacionModificacion){
            const analisisCompletoModificado = {
                materia_organica: parseFloat(materiaOrganica.replace(",",".")),
                carbono_organico: parseFloat(carbono.replace(",",".")),
                nitrogeno_total: parseFloat(nitrogeno.replace(",",".")),
                ph: parseFloat(pH.replace(",",".")),
                calcio: parseFloat(calcio.replace(",",".")),
                calcio_unidad: unidadBasicaSeleccionada.label,
                magnesio: parseFloat(magnesio.replace(",",".")),
                magnesio_unidad: unidadBasicaSeleccionada.label,
                sodio: parseFloat(sodio.replace(",",".")),
                sodio_unidad: unidadBasicaSeleccionada.label,
                potasio: parseFloat(potasio.replace(",",".")),
                potasio_unidad: unidadBasicaSeleccionada.label,
                fecha_analisis: moment(startDateModoModificar).format("YYYY-MM-DD"),
                laboratorio_id: laboratorioAnalisisModificado.value,
                capacidad_intercambio_cationica: parseFloat(cic.replace(",", ".")),
                capacidad_intercambio_cationica_unidad: unidadCicSeleccionada.label
            }
            
            if(nitratos !== ""){
                analisisCompletoModificado.nitratos = parseFloat(nitratos.replace(",","."));
            }
            else{
                analisisCompletoModificado.nitratos = null;
            }

            if(fosforo !== ""){
                analisisCompletoModificado.fosforo_extraible = parseFloat(fosforo.replace(",","."));
            }
            else{
                analisisCompletoModificado.fosforo_extraible = null;
            }

            if(conductividadElectrica !== "" && unidadConductividadElectrica){
                analisisCompletoModificado.conductividad_electrica = parseFloat(conductividadElectrica.replace(",","."));
                analisisCompletoModificado.conductividad_electrica_unidad = unidadConductividadElectrica.label;
            }
            else{
                analisisCompletoModificado.conductividad_electrica = null;
                analisisCompletoModificado.conductividad_electrica_unidad = "";
            }

            if(nan !== "" && unidadNanSeleccionada){
                analisisCompletoModificado.nitrogeno_anaerobico = parseFloat(nan.replace(",","."));
                analisisCompletoModificado.nitrogeno_anaerobico_unidad = unidadNanSeleccionada.label;
            }
            else{
                analisisCompletoModificado.nitrogeno_anaerobico = null;
                analisisCompletoModificado.nitrogeno_anaerobico_unidad = "";
            }

            if(azufre !== ""){
                analisisCompletoModificado.azufre = parseFloat(azufre.replace(",","."));
            }
            else{
                analisisCompletoModificado.azufre = null;
            }

            if(valorInsat !== ""){
                analisisCompletoModificado.valor_insaturacion = parseFloat(valorInsat.replace(",","."));
            }
            else{
                analisisCompletoModificado.valor_insaturacion = null;
            }

            if(humedad !== ""){
                analisisCompletoModificado.humedad_gravimetrica = parseFloat(humedad.replace(",","."));
            }
            else{
                analisisCompletoModificado.humedad_gravimetrica = null;
            }

            if(arcilla !== ""){
                analisisCompletoModificado.arcilla = parseFloat(arcilla.replace(",","."));
            }
            else{
                analisisCompletoModificado.arcilla = null;
            }

            if(limo !== ""){
                analisisCompletoModificado.limo = parseFloat(limo.replace(",","."));
            }
            else{
                analisisCompletoModificado.limo = null;
            }

            if(arena !== ""){
                analisisCompletoModificado.arena = parseFloat(arena.replace(",","."));
            }
            else{
                analisisCompletoModificado.arena = null;
            }

            analisisCompletoModificado.densidad_aparente = parseFloat(densidad.replace(",","."));
            analisisCompletoModificado.densidad_aparente_unidad = unidadDensidadSeleccionada.label;

            if(aluminio !== ""){
                analisisCompletoModificado.aluminio = parseFloat(aluminio.replace(",","."));
                analisisCompletoModificado.aluminio_unidad = unidadAluminioSeleccionada. label;
            } else {
                analisisCompletoModificado.aluminio = null;
                analisisCompletoModificado.aluminio_unidad = "";
            }

            try {
                await modificarAnalisisCompletoService(analisisCompleto.id, analisisCompletoModificado);
                setMostrarAnalisisModificado(true);
            } catch (error) {
                if(error.response && error.response.status === 401){
                    try {
                        await renewToken();
                        await modificarAnalisisCompletoService(analisisCompleto.id, analisisCompletoModificado);
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


    if(analisisCompleto){
        if(laboratorioAnalisis && laboratorios){
            if(modo === "modificar"){
                return(
                    <>
                        {/* MODIFICAR ANÁLISIS COMPLETO */}
                        {/* contenedor */}
                        <div className="contenedorAnalisisCompleto">
        
                            {/* título contenedor */}
                            <div className='contenedorTituloAnalisisCompleto'>
                                <span className='tituloAnalisisCompleto'>Análisis Químico del Suelo - Completo</span> 
                            </div>

                            {/* formulario análisis */}
                            <Form className='formularioAnalisisCompleto' onSubmit={handleSubmit(modificarAnalisisCompleto)}>

                                {/* Encabezado análisis */}
                                <div className='encabezado'>

                                    {/* Fecha de análisis */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormEncabezado'>Fecha</Form.Label>
                                        <DatePicker 
                                        className='fechaAnalisis'
                                        dateFormat="dd/MM/yyyy"
                                        selected={startDateModoModificar}
                                        onChange={(date) => setStartDateModoModificar(date)}
                                        minDate={moment(fechaTomaMuestra, "YYYY-MM-DD").toDate()}
                                        maxDate={new Date()}
                                        />
                                    </Form.Group>

                                    {/* Select Laboratorio */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormEncabezado'>Laboratorio</Form.Label>
                                        <Select className='selectLaboratorio'
                                        value={laboratorioAnalisisModificado}
                                        onChange={handleChangeLaboratorioModificado}
                                        options={
                                            laboratorios.map( labo => ({label: labo.nombre, value: labo.id}))
                                        }>    
                                        </Select>
                                    </Form.Group>
                                </div>

                                {/* columna 1 */}
                                <div className="columnaUno">

                                    {/* campo materia organica */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={materiaOrganicaVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Materia Orgánica</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={materiaOrganica} 
                                            onChange={handleChangeMateriaOrganica}/>
                                        <Form.Label className='labelForm'>%</Form.Label>
                                    </Form.Group>

                                    {/* campo carbono orgánico */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={carbonoVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Carbono Orgánico</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={carbono}
                                            onChange={handleChangeCarbono}/>
                                        <Form.Label className='labelForm'>%</Form.Label>
                                    </Form.Group>     

                                    {/* campo nitrógeno total */}
                                    <Form.Group className='grupoForm'>
                                    <Form.Label className={nitrogenoVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Nitrógeno Total</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={nitrogeno}
                                            onChange={handleChangeNitrogeno}/>
                                        <Form.Label className='labelForm'>%</Form.Label>
                                    </Form.Group>          

                                    {/* campo relación C/N */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Relación C/N</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={relacionCN} disabled={true}/>
                                    </Form.Group>           

                                    {/* Campo Nitrógeno Anaeróbico */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Nan</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={nan}
                                        onChange={handleChangeNan}/>
                                        <Select className='selectForm'
                                        options={unidadesNan}
                                        value={unidadNanSeleccionada}
                                        onChange={handleChangeUnidadNan}>

                                        </Select>
                                    </Form.Group>

                                    {/* campo nitratos */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Nitratos</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={nitratos}
                                        onChange={handleChangeNitratos}/>
                                        <Form.Label className='labelForm'>ppm</Form.Label>
                                    </Form.Group>   

                                    {/* fósforo extraíble */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Fósforo Extraíble</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={fosforo}
                                        onChange={handleChangeFosforo}/>
                                        <Form.Label className='labelForm'>ppm</Form.Label>
                                    </Form.Group>  

                                    {/* Campo pH */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={pHVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>pH</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={pH}
                                        onChange={handleChangePH}/>
                                    </Form.Group>

                                    {/* Campo conductividad eléctrica */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Conductividad Eléctrica</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={conductividadElectrica}
                                        onChange={handleChangeConductividadElectrica}/>
                                        <Select className='selectForm'
                                        options={unidadesConductividadElectrica}
                                        value={unidadConductividadElectrica}
                                        onChange={handleChangeUnidadCondElect}>

                                        </Select>
                                    </Form.Group>

                                    {/* campo azufre */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Azufre</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={azufre}
                                        onChange={handleChangeAzufre}/>
                                        <Form.Label className='labelForm'>ppm</Form.Label>
                                    </Form.Group>   

                                </div>
                                
                                {/* columna 2 */}
                                <div className="columnaDos">

                                    {/* Titulo Cationes de Intercambio */}
                                    <div className='contenedorCationesIntercambio'>
                                        <span className='tituloCationesIntercambio'>Cationes de Intercambio</span> 
                                    </div>

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
                                        <Form.Label className={potasioVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Potasio</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={potasio} onChange={handleChangePotasio}/>
                                        <Select className='selectForm'
                                        options={unidadesBasico}
                                        value={unidadBasicaSeleccionada}
                                        onChange={handleChangeUnidadBasica}>
                
                                        </Select>
                                    </Form.Group> 

                                    {/* Campo Saturación Bases S */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Saturación Bases S</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={saturacion} disabled={true}/>
                                        <Form.Label className='labelForm'>
                                            {unidadBasicaSeleccionada === undefined ? unidadBasicaSeleccionada : unidadBasicaSeleccionada.label}
                                        </Form.Label>
                                    </Form.Group> 

                                    {/* Campo CIC */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={cicVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>CIC</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={cic}
                                        onChange={handleChangeCic}/>
                                        <Select className='selectForm'
                                        options={unidadesCIC}
                                        value={unidadCicSeleccionada}
                                        onChange={handleChangeUnidadCic}>

                                        </Select>
                                    </Form.Group> 

                                    {/* Campo Valor de Insaturación */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Valor de Insaturación</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={valorInsat}
                                        onChange={handleChangeValorInsat}/>
                                        <Form.Label className='labelForm'>cmol/Kg</Form.Label>
                                    </Form.Group> 

                                    {/* Campo PSI */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>PSI</Form.Label>
                                        {/* <Form.Control className='inputForm' type='text' value={psi}
                                        onChange={handleChangePsi}/> */}
                                        <Form.Control className='inputForm' type='text' value={psi} disabled={true}/>
                                        <Form.Label className='labelForm'>%</Form.Label>
                                    </Form.Group> 

                                    {/* Campo Aluminio */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Aluminio</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={aluminio}
                                        onChange={handleChangeAluminio}/>
                                        <Select className='selectForm'
                                        options={unidadesBasico}
                                        value={unidadAluminioSeleccionada}
                                        onChange={handleChangeUnidadAluminio}>
                                        </Select>
                                    </Form.Group> 

                                    {/* Mensaje de Faltan Campos */}
                                    <Form.Group className='grupoForm'>
                                    {(materiaOrganicaVacio || carbonoVacio || nitrogenoVacio || pHVacio || calcioVacio
                                    || magnesioVacio || sodioVacio || potasioVacio || cicVacio || densidadVacio) && <Form.Label className='labelFormError'>*Los campos en rojo no están completos</Form.Label>}
                                    {(unidadBasicaVacio || unidadCEVacio || unidadNanVacio 
                                        || unidadAluminioVacio || unidadDensidadVacio) && <Form.Label className='labelFormError'>*Debe seleccionar una unidad</Form.Label>}
                                    {unidadCicVacio && <Form.Label className='labelFormError'>*Debe seleccionar una unidad para el CIC</Form.Label>}
                                    {texturaNo100 && <Form.Label className='labelFormError'>*La suma de arcilla, arena y limo debe ser igual a 100</Form.Label>}
                                    {fechaVacio && <Form.Label className='labelFormError'>*Debe ingresar una fecha</Form.Label>}
                                    {laboratorioVacio && <Form.Label className='labelFormError'>*Debe ingresar un laboratorio</Form.Label>}
                                    </Form.Group> 

                                </div>

                                {/* columna 3 */}
                                <div className='columnaTres'>

                                    {/* Titulo Cationes de Intercambio */}
                                    <div className='contenedorCationesIntercambio'>
                                        <span className='tituloCationesIntercambio'>Textura del Suelo</span> 
                                    </div>

                                    {/* campo Arcilla */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Arcilla</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={arcilla}
                                        onChange={handleChangeArcilla}/>
                                        <Form.Label className='labelForm'>%</Form.Label>
                                    </Form.Group>

                                    {/* campo limo */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Limo</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={limo}
                                        onChange={handleChangeLimo}/>
                                        <Form.Label className='labelForm'>%</Form.Label>
                                    </Form.Group>

                                    
                                    {/* campo arena */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Arena</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={arena}
                                        onChange={handleChangeArena}/>
                                        <Form.Label className='labelForm'>%</Form.Label>
                                    </Form.Group>

                                    {/* campo humedad gravimétrica */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Humedad Gravimétrica</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={humedad}
                                        onChange={handleChangeHumedad}/>
                                        <Form.Label className='labelForm'>%</Form.Label>
                                    </Form.Group>

                                    {/* Campo Densidad Aparente */}
                                    <Form.Group className='grupoForm'>
                                    <Form.Label className={densidadVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Densidad Aparente</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={densidad} onChange={handleChangeDensidad}/>
                                        <Select className='selectForm'
                                        options={unidadesDensidad}
                                        value={unidadDensidadSeleccionada}
                                        onChange={handleChangeUnidadDensidad}>

                                        </Select>
                                    </Form.Group> 

                                </div>

                                {/* Botones formulario */}
                                <div className="botonesFormAnalisis">
                                    <Button className="estiloBotonesFormAnalisis btnCancelarAnalisis" variant="secondary" onClick={handleCancelarEdicion}>
                                        Cancelar
                                    </Button>

                                    <Button className="estiloBotonesFormAnalisis btnConfirmarAnalisis" variant="secondary" type='submit' disabled={estaEnPeticion}>
                                        Aceptar
                                    </Button>                    
                                </div>

                            </Form>
                        </div>

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
                    </>
        )
            }
            else{
                return(
                    <>
                    {/* CONSULTAR ANÁLISIS COMPLETO */}
                    {console.log()}
                    {/* contenedor */}
                    <div className="contenedorAnalisisCompleto">
        
                        {/* título contenedor */}
                        <div className='contenedorTituloAnalisisCompleto'>
                            <span className='tituloAnalisisCompleto'>Análisis Químico del Suelo - Completo</span> 
                        </div>
        
                        {/* formulario análisis */}
                        <Form className='formularioAnalisisCompleto'>
        
                            {/* Encabezado análisis */}
                            <div className='encabezado'>
        
                                {/* Fecha de análisis */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className='labelFormEncabezado'>Fecha</Form.Label>
                                    <DatePicker 
                                    className='fechaAnalisis'
                                    value={moment(analisisCompleto.fecha_analisis).format('DD/MM/YYYY')}
                                    disabled={true}
                                    />
                                </Form.Group>
        
                                {/* Select Laboratorio */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className='labelFormEncabezado'>Laboratorio</Form.Label>
                                    <Select className='selectLaboratorio'
                                    value={{label: laboratorioAnalisis[0].nombre, value: laboratorioAnalisis[0].id}}
                                    isDisabled={true}>    
                                    </Select>
                                </Form.Group>
                            </div>
        
                            {/* columna 1 */}
                            <div className="columnaUno">
        
                                {/* campo materia organica */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className={'labelFormIzquierdo'}>Materia Orgánica</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisCompleto.materia_organica} disabled={true}/>
                                    <Form.Label className='labelForm'>%</Form.Label>
                                </Form.Group>
        
                                 {/* campo carbono orgánico */}
                                 <Form.Group className='grupoForm'>
                                    <Form.Label className={carbonoVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Carbono Orgánico</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisCompleto.carbono_organico} disabled={true}/>
                                    <Form.Label className='labelForm'>%</Form.Label>
                                </Form.Group>     
        
                                 {/* campo nitrógeno total */}
                                 <Form.Group className='grupoForm'>
                                 <Form.Label className={nitrogenoVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Nitrógeno Total</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisCompleto.nitrogeno_total} disabled={true}/>
                                    <Form.Label className='labelForm'>%</Form.Label>
                                </Form.Group>          
        
                                 {/* campo relación C/N */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className='labelFormIzquierdo'>Relación C/N</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisCompleto.carbono_organico / analisisCompleto.nitrogeno_total} disabled={true}/>
                                </Form.Group>           
        
                                {/* Campo Nitrógeno Anaeróbico */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className='labelFormIzquierdo'>Nan</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisCompleto.nitrogeno_anaerobico === null ? "" : analisisCompleto.nitrogeno_anaerobico}
                                    disabled={true}/>
                                    <Form.Label className='labelForm'>ppm</Form.Label>
                                </Form.Group>
        
                                 {/* campo nitratos */}
                                 <Form.Group className='grupoForm'>
                                    <Form.Label className='labelFormIzquierdo'>Nitratos</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisCompleto.nitratos === null ? "" : analisisCompleto.nitratos}
                                    disabled={true}/>
                                    <Form.Label className='labelForm'>ppm</Form.Label>
                                </Form.Group>   
        
                                 {/* fósforo extraíble */}
                                 <Form.Group className='grupoForm'>
                                    <Form.Label className='labelFormIzquierdo'>Fósforo Extraíble</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisCompleto.fosforo_extraible === null ? "" : analisisCompleto.fosforo_extraible}
                                    disabled={true}/>
                                    <Form.Label className='labelForm'>ppm</Form.Label>
                                </Form.Group>  
        
                                {/* Campo pH */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className={pHVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>pH</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisCompleto.ph}
                                    disabled={true}/>
                                </Form.Group>
        
                                {/* Campo conductividad eléctrica */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className='labelFormIzquierdo'>Conductividad Eléctrica</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisCompleto.conductividad_electrica === null ? "" : analisisCompleto.conductividad_electrica}
                                    disabled={true}/>
                                    <Form.Label className='labelForm'>dS/m</Form.Label>
                                </Form.Group>
        
                                 {/* campo azufre */}
                                 <Form.Group className='grupoForm'>
                                    <Form.Label className='labelFormIzquierdo'>Azufre</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisCompleto.azufre === null ? "" : analisisCompleto.azufre}
                                    disabled={true}/>
                                    <Form.Label className='labelForm'>ppm</Form.Label>
                                </Form.Group>   
        
                            </div>
                            
                            {/* columna 2 */}
                            <div className="columnaDos">
        
                                {/* Titulo Cationes de Intercambio */}
                                <div className='contenedorCationesIntercambio'>
                                    <span className='tituloCationesIntercambio'>Cationes de Intercambio</span> 
                                </div>
        
                                {/* Campo calcio */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className={calcioVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Calcio</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisCompleto.calcio} disabled={true}/>
                                    <Form.Label className='labelForm'>ppm</Form.Label>
                                </Form.Group> 
        
                                {/* Campo Magnesio */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className={magnesioVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Magnesio</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisCompleto.magnesio} disabled={true}/>
                                    <Form.Label className='labelForm'>ppm</Form.Label>
                                </Form.Group> 
        
                                {/* Campo Sodio */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className={sodioVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Sodio</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisCompleto.sodio} disabled={true}/>
                                    <Form.Label className='labelForm'>ppm</Form.Label>
                                </Form.Group> 
        
                                {/* Campo Potasio */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className={potasioVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Potasio</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisCompleto.potasio} disabled={true}/>
                                    <Form.Label className='labelForm'>ppm</Form.Label>
                                </Form.Group> 
        
                                {/* Campo Saturación Bases S */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className='labelFormIzquierdo'>Saturación Bases S</Form.Label>
                                    <Form.Control className='inputForm' type='text' 
                                    value={analisisCompleto.calcio + analisisCompleto.magnesio + analisisCompleto.sodio + analisisCompleto.potasio} 
                                    disabled={true}/>
                                    <Form.Label className='labelForm'>ppm</Form.Label>
                                </Form.Group> 
        
                                {/* Campo CIC */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className={cicVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>CIC</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisCompleto.capacidad_intercambio_cationica === null ? "" : analisisCompleto.capacidad_intercambio_cationica}
                                    disabled={true}/>
                                    <Form.Label className='labelForm'>meq/100g</Form.Label>
                                </Form.Group> 
        
                                {/* Campo Valor de Insaturación */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className='labelFormIzquierdo'>Valor de Insaturación</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisCompleto.valor_insaturacion === null ? "" : analisisCompleto.valor_insaturacion}
                                    disabled={true}/>
                                    <Form.Label className='labelForm'>cmol/Kg</Form.Label>
                                </Form.Group> 
        
                                {/* Campo PSI */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className='labelFormIzquierdo'>PSI</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisCompleto.capacidad_intercambio_cationica === null ? ""
                                    : (100 * ((analisisCompleto.sodio * 0.00435) / analisisCompleto.capacidad_intercambio_cationica))} disabled={true}/>
                                    <Form.Label className='labelForm'>%</Form.Label>
                                </Form.Group>
        
                                {/* Campo Aluminio*/}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className='labelFormIzquierdo'>Aluminio</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisCompleto.aluminio === null ? "" : analisisCompleto.aluminio}
                                    disabled={true}/>
                                    <Form.Label className='labelForm'>ppm</Form.Label>
                                </Form.Group> 
        
                            </div>
        
                            {/* columna 3 */}
                            <div className='columnaTres'>
        
                                {/* Titulo Cationes de Intercambio */}
                                <div className='contenedorCationesIntercambio'>
                                    <span className='tituloCationesIntercambio'>Textura del Suelo</span> 
                                </div>
        
                                {/* campo Arcilla */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className='labelFormIzquierdo'>Arcilla</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisCompleto.arcilla === null ? "" : analisisCompleto.arcilla}
                                    disabled={true}/>
                                    <Form.Label className='labelForm'>%</Form.Label>
                                </Form.Group>
        
                                {/* campo limo */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className='labelFormIzquierdo'>Limo</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisCompleto.limo === null ? "" : analisisCompleto.limo}
                                    disabled={true}/>
                                    <Form.Label className='labelForm'>%</Form.Label>
                                </Form.Group>
        
                                
                                {/* campo arena */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className='labelFormIzquierdo'>Arena</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisCompleto.arena === null ? "" : analisisCompleto.arena}
                                    disabled={true}/>
                                    <Form.Label className='labelForm'>%</Form.Label>
                                </Form.Group>
        
                                {/* campo humedad gravimétrica */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className='labelFormIzquierdo'>Humedad Gravimétrica</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisCompleto.humedad_gravimetrica === null ? "" : analisisCompleto.humedad_gravimetrica}
                                    disabled={true}/>
                                    <Form.Label className='labelForm'>%</Form.Label>
                                </Form.Group>
        
                                {/* campo Densidad Aparente */}
                                <Form.Group className='grupoForm'>
                                    <Form.Label className='labelFormIzquierdo'>Densidad Aparente</Form.Label>
                                    <Form.Control className='inputForm' type='text' value={analisisCompleto.densidad_aparente}
                                    disabled={true}/>
                                    <Form.Label className='labelForm'>gr/cm3</Form.Label>
                                </Form.Group>
        
                            </div>
        
                                {/* Botones formulario */}
                                <div className="botonesFormAnalisis">
                                    <Button className="estiloBotonesFormAnalisis btnCancelarAnalisis" variant="secondary" onClick={handleCancelar}>
                                        Cancelar
                                    </Button>
        
                                    <Button className="estiloBotonesFormAnalisis btnConfirmarAnalisis" variant="secondary" onClick={handleHabilitarEdicion}>
                                        Editar
                                    </Button>                     
                                </div>
        
                        </Form>
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
        
    }
    else if (laboratorios !== undefined){
        return(
            <>
                {/* REGISTRAR ANÁLISIS COMPLETO */}

                {/* contenedor */}
                <div className="contenedorAnalisisCompleto">
    
                    {/* título contenedor */}
                    <div className='contenedorTituloAnalisisCompleto'>
                        <span className='tituloAnalisisCompleto'>Análisis Químico del Suelo - Completo</span> 
                    </div>
    
                    {/* formulario análisis */}
                    <Form className='formularioAnalisisCompleto' onSubmit={handleSubmit(registrarAnalisisCompleto)}>
    
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
    
                            {/* campo materia organica */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className={materiaOrganicaVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Materia Orgánica</Form.Label>
                                <Form.Control className='inputForm' type='text' value={materiaOrganica} 
                                    onChange={handleChangeMateriaOrganica}/>
                                <Form.Label className='labelForm'>%</Form.Label>
                            </Form.Group>
    
                             {/* campo carbono orgánico */}
                             <Form.Group className='grupoForm'>
                                <Form.Label className={carbonoVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Carbono Orgánico</Form.Label>
                                <Form.Control className='inputForm' type='text' value={carbono}
                                    onChange={handleChangeCarbono}/>
                                <Form.Label className='labelForm'>%</Form.Label>
                            </Form.Group>     
    
                             {/* campo nitrógeno total */}
                             <Form.Group className='grupoForm'>
                             <Form.Label className={nitrogenoVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Nitrógeno Total</Form.Label>
                                <Form.Control className='inputForm' type='text' value={nitrogeno}
                                    onChange={handleChangeNitrogeno}/>
                                <Form.Label className='labelForm'>%</Form.Label>
                            </Form.Group>          
    
                             {/* campo relación C/N */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>Relación C/N</Form.Label>
                                <Form.Control className='inputForm' type='text' value={relacionCN} disabled={true}/>
                            </Form.Group>           
    
                            {/* Campo Nitrógeno Anaeróbico */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>Nan</Form.Label>
                                <Form.Control className='inputForm' type='text' value={nan}
                                onChange={handleChangeNan}/>
                                <Select className='selectForm'
                                options={unidadesNan}
                                value={unidadNanSeleccionada}
                                onChange={handleChangeUnidadNan}>
    
                                </Select>
                            </Form.Group>
    
                             {/* campo nitratos */}
                             <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>Nitratos</Form.Label>
                                <Form.Control className='inputForm' type='text' value={nitratos}
                                onChange={handleChangeNitratos}/>
                                <Form.Label className='labelForm'>ppm</Form.Label>
                            </Form.Group>   
    
                             {/* fósforo extraíble */}
                             <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>Fósforo Extraíble</Form.Label>
                                <Form.Control className='inputForm' type='text' value={fosforo}
                                onChange={handleChangeFosforo}/>
                                <Form.Label className='labelForm'>ppm</Form.Label>
                            </Form.Group>  
    
                            {/* Campo pH */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className={pHVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>pH</Form.Label>
                                <Form.Control className='inputForm' type='text' value={pH}
                                onChange={handleChangePH}/>
                            </Form.Group>
    
                            {/* Campo conductividad eléctrica */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>Conductividad Eléctrica</Form.Label>
                                <Form.Control className='inputForm' type='text' value={conductividadElectrica}
                                onChange={handleChangeConductividadElectrica}/>
                                <Select className='selectForm'
                                options={unidadesConductividadElectrica}
                                value={unidadConductividadElectrica}
                                onChange={handleChangeUnidadCondElect}>
    
                                </Select>
                            </Form.Group>
    
                             {/* campo azufre */}
                             <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>Azufre</Form.Label>
                                <Form.Control className='inputForm' type='text' value={azufre}
                                onChange={handleChangeAzufre}/>
                                <Form.Label className='labelForm'>ppm</Form.Label>
                            </Form.Group>   
    
                        </div>
                        
                        {/* columna 2 */}
                        <div className="columnaDos">
    
                            {/* Titulo Cationes de Intercambio */}
                            <div className='contenedorCationesIntercambio'>
                                <span className='tituloCationesIntercambio'>Cationes de Intercambio</span> 
                            </div>
    
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
                                <Form.Label className={potasioVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Potasio</Form.Label>
                                <Form.Control className='inputForm' type='text' value={potasio} onChange={handleChangePotasio}/>
                                <Select className='selectForm'
                                options={unidadesBasico}
                                value={unidadBasicaSeleccionada}
                                onChange={handleChangeUnidadBasica}>
        
                                </Select>
                            </Form.Group> 
    
                            {/* Campo Saturación Bases S */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>Saturación Bases S</Form.Label>
                                <Form.Control className='inputForm' type='text' value={saturacion} disabled={true}/>
                                <Form.Label className='labelForm'>
                                    {unidadBasicaSeleccionada === undefined ? unidadBasicaSeleccionada : unidadBasicaSeleccionada.label}
                                </Form.Label>
                            </Form.Group> 
    
                            {/* Campo CIC */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className={cicVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>CIC</Form.Label>
                                <Form.Control className='inputForm' type='text' value={cic}
                                onChange={handleChangeCic}/>
                                <Select className='selectForm'
                                options={unidadesCIC}
                                value={unidadCicSeleccionada}
                                onChange={handleChangeUnidadCic}>
    
                                </Select>
                            </Form.Group> 
    
                            {/* Campo Valor de Insaturación */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>Valor de Insaturación</Form.Label>
                                <Form.Control className='inputForm' type='text' value={valorInsat}
                                onChange={handleChangeValorInsat}/>
                                <Form.Label className='labelForm'>cmol/Kg</Form.Label>
                            </Form.Group> 
    
                            {/* Campo PSI */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>PSI</Form.Label>
                                {/* <Form.Control className='inputForm' type='text' value={psi}
                                onChange={handleChangePsi}/> */}
                                <Form.Control className='inputForm' type='text' value={psi} disabled={true}/>
                                <Form.Label className='labelForm'>%</Form.Label>
                            </Form.Group> 

                            {/* Campo Aluminio */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>Aluminio</Form.Label>
                                <Form.Control className='inputForm' type='text' value={aluminio}
                                onChange={handleChangeAluminio}/>
                                <Select className='selectForm'
                                options={unidadesBasico}
                                value={unidadAluminioSeleccionada}
                                onChange={handleChangeUnidadAluminio}>
                                </Select>
                            </Form.Group> 
    
                            {/* Mensaje de Faltan Campos */}
                            <Form.Group className='grupoForm'>
                            {(materiaOrganicaVacio || carbonoVacio || nitrogenoVacio || pHVacio || calcioVacio
                            || magnesioVacio || sodioVacio || potasioVacio || cicVacio || densidadVacio) && <Form.Label className='labelFormError'>*Los campos en rojo no están completos</Form.Label>}
                            {(unidadBasicaVacio || unidadCEVacio || unidadNanVacio 
                                || unidadAluminioVacio || unidadDensidadVacio) && <Form.Label className='labelFormError'>*Debe seleccionar una unidad</Form.Label>}
                            {unidadCicVacio && <Form.Label className='labelFormError'>*Debe seleccionar una unidad para el CIC</Form.Label>}
                            {texturaNo100 && <Form.Label className='labelFormError'>*La suma de arcilla, arena y limo debe ser igual a 100</Form.Label>}
                            {fechaVacio && <Form.Label className='labelFormError'>*Debe ingresar una fecha</Form.Label>}
                            {laboratorioVacio && <Form.Label className='labelFormError'>*Debe ingresar un laboratorio</Form.Label>}
                            </Form.Group> 
    
                        </div>
    
                        {/* columna 3 */}
                        <div className='columnaTres'>
    
                            {/* Titulo Cationes de Intercambio */}
                            <div className='contenedorCationesIntercambio'>
                                <span className='tituloCationesIntercambio'>Textura del Suelo</span> 
                            </div>
    
                            {/* campo Arcilla */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>Arcilla</Form.Label>
                                <Form.Control className='inputForm' type='text' value={arcilla}
                                onChange={handleChangeArcilla}/>
                                <Form.Label className='labelForm'>%</Form.Label>
                            </Form.Group>
    
                            {/* campo limo */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>Limo</Form.Label>
                                <Form.Control className='inputForm' type='text' value={limo}
                                onChange={handleChangeLimo}/>
                                <Form.Label className='labelForm'>%</Form.Label>
                            </Form.Group>
    
                            
                            {/* campo arena */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>Arena</Form.Label>
                                <Form.Control className='inputForm' type='text' value={arena}
                                onChange={handleChangeArena}/>
                                <Form.Label className='labelForm'>%</Form.Label>
                            </Form.Group>
    
                            {/* campo humedad gravimétrica */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>Humedad Gravimétrica</Form.Label>
                                <Form.Control className='inputForm' type='text' value={humedad}
                                onChange={handleChangeHumedad}/>
                                <Form.Label className='labelForm'>%</Form.Label>
                            </Form.Group>

                            {/* Campo Densidad Aparente */}
                            <Form.Group className='grupoForm'>
                            <Form.Label className={densidadVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Densidad Aparente</Form.Label>
                                <Form.Control className='inputForm' type='text' value={densidad} onChange={handleChangeDensidad}/>
                                <Select className='selectForm'
                                options={unidadesDensidad}
                                value={unidadDensidadSeleccionada}
                                onChange={handleChangeUnidadDensidad}>
    
                                </Select>
                            </Form.Group> 
    
                        </div>
    
                        {/* Botones formulario */}
                        <div className="botonesFormAnalisis">
                            <Button className="estiloBotonesFormAnalisis btnCancelarAnalisis" variant="secondary" onClick={handleCancelar}>
                                Cancelar
                            </Button>
    
                            <Button className="estiloBotonesFormAnalisis btnConfirmarAnalisis" variant="secondary" type='submit' disabled={estaEnPeticion}>
                                Registrar
                            </Button>                    
                        </div>
    
                    </Form>
                </div>

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
            </>
        );
    }
    else{
        return(
            <div>Cargando...</div>
        )
    }
    
}

export default AnalisisCompleto;
