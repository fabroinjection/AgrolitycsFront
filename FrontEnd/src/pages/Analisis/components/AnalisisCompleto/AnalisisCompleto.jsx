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

// Importar hooks
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

// import utilities
import { toast } from 'react-toastify';
import moment from 'moment/moment';
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";

// Importar services
import { registrarNuevoAnalisisCompleto, modificarAnalisisCompletoService, darDeBajaAnalisisService } from '../../services/analisis.service';
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

    const mostrarErrorMateriaOrganicaVacio = () => {
        toast.error('Se debe ingresar el nutriente materia orgánica', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorCarbonoVacio = () => {
        toast.error('Se debe ingresar el nutriente carbono', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorNitrogenoVacio = () => {
        toast.error('Se debe ingresar el nutriente nitrógeno', {
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

    const mostrarErrorCalcioVacio = () => {
        toast.error('Se debe ingresar el nutriente calcio', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorFosforoVacio = () => {
        toast.error('Se debe ingresar el nutriente fosforo', {
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

    const mostrarErrorCicVacio = () => {
        toast.error('Se debe ingresar el nutriente CIC', {
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

    const mostrarErrorUnidadCicVacio = () => {
        toast.error('Se debe ingresar una unidad para el CIC', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorUnidadNanVacio = () => {
        toast.error('Se debe ingresar una unidad para el nan', {
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

    const mostrarErrorUnidadDensidadVacio = () => {
        toast.error('Se debe ingresar una unidad para la densidad', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorUnidadAluminioVacio = () => {
        toast.error('Se debe ingresar una unidad para el aluminio', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const mostrarErrorNo100Textura = () => {
        toast.error('La suma de arcilla, arena y limo debe ser igual a 100', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }


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
        if (nit != 0) {
            let relacionCNValue = (carb / nit).toFixed(2);
            setRelacionCN((relacionCNValue).toString());
        } else {
            setRelacionCN("");
        }
      }
      else{
        setRelacionCN("");
      } 
    }, [carbono, nitrogeno])

    const handleChangeNan = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setNan(value);}
    }

    const handleChangeUnidadNan = (opcion) => {
        setUnidadNanSeleccionada(opcion);
    }

    const handleChangeNitratos = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setNitratos(value);}
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

    const handleChangeAzufre = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setAzufre(value);}
    }

    const handleChangeFosforo = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setFosforo(value);}
    }

    const handleChangeUnidadBasica = (unidad) => {
        setUnidadBasicaSeleccionada(unidad);
    }

    const handleChangeMagnesio = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setMagnesio(value);}
    }

    const handleChangeCalcio = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setCalcio(value);}
    }

    const handleChangeSodio = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setSodio(value);}
    }

    const handleChangePotasio = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setPotasio(value);}
    }

    useEffect(() => {
        if(calcio !== "" && magnesio !== "" && sodio !== "" && potasio !== "" && unidadBasicaSeleccionada){
            let calc = parseFloat(calcio.replace(",","."));
            let magn = parseFloat(magnesio.replace(",","."));
            let sod = parseFloat(sodio.replace(",","."));
            let pot = parseFloat(potasio.replace(",","."));
            const sat = (calc + magn + sod + pot).toFixed(2)
            setSaturacion(sat.toString());
        }
        else{
            setSaturacion("");
        }
    }, [calcio, magnesio, sodio, potasio, unidadBasicaSeleccionada])

    const handleChangeCic = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setCic(value);}
    }

    const handleChangeUnidadCic = (opcion) => {
        setUnidadCicSeleccionada(opcion);
    }

    const handleChangeValorInsat = (e) =>{
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setValorInsat(value);}
    }

    useEffect(() => {
        if (sodio !== "" && cic !== "" && unidadCicSeleccionada && unidadBasicaSeleccionada) {
          let sod = parseFloat(sodio.replace(",", "."));
          let capInt = parseFloat(cic.replace(",", "."));
      
          let psiValue;
      
          if (unidadBasicaSeleccionada.value === 1) {
            psiValue = (100 * (sod * 0.00435) / capInt).toFixed(2);
          } else {
            psiValue = (100 * sod / capInt).toFixed(2);
          }
      
          setPsi(psiValue);
        } else {
          setPsi("");
        }
      }, [sodio, cic, unidadBasicaSeleccionada, unidadCicSeleccionada]);
      

    const handleChangeAluminio = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setAluminio(value);}
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
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setDensidad(value);}
    }

    const handleChangeUnidadDensidad = (opcion) => {
        setUnidadDensidadSeleccionada(opcion);
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
 

    const handleCancelar = () => {
        reset();
        navigate(-1);
    }

    const validarCampos = () => {
        if(startDate == undefined){
            setFechaVacio(true);
            mostrarErrorFechaVacia();
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setFechaVacio(false);
        }
        
        if (laboratorioSeleccionado.value === 0) {
            setLaboratorioVacio(true);
            mostrarErrorLaboratorioVacio();
            setEstaEnPeticion(false);
            return false;
        } else {
            setLaboratorioVacio(false);
        }

        if(materiaOrganica === ""){
            setMateriaOrganicaVacio(true);
            mostrarErrorMateriaOrganicaVacio();
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setMateriaOrganicaVacio(false);
        }

        if (carbono === "") {
            setCarbonoVacio(true);
            mostrarErrorCarbonoVacio();
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setCarbonoVacio(false);
        }

        if(nitrogeno === ""){
            setNitrogenoVacio(true);
            mostrarErrorNitrogenoVacio();
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setNitrogenoVacio(false);
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

        if (cic === "") {
            setCicVacio(true);
            mostrarErrorCicVacio();
            setEstaEnPeticion(false);
            return false;
        } else {
            setCicVacio(false);
        }

        if (densidad === "") {
            setDensidadVacio(true);
            mostrarErrorDensidadVacio();
            setEstaEnPeticion(false);
            return false
        } else {
           setDensidadVacio(false) 
        }

        if(unidadBasicaSeleccionada === undefined){
            setUnidadBasicaVacio(true);
            mostrarErrorUnidadVacio();
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setUnidadBasicaVacio(false);
        }

        if(unidadCicSeleccionada === undefined){
            setUnidadCicVacio(true);
            mostrarErrorUnidadCicVacio();
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setUnidadCicVacio(false);
        }

        if(nan !== ""){
            if(unidadNanSeleccionada === undefined){
                setUnidadNanVacio(true);
                mostrarErrorUnidadNanVacio();
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
                mostrarErrorUnidadConductividadVacio();
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
                mostrarErrorUnidadAluminioVacio();
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
            mostrarErrorDensidadVacio();
            setEstaEnPeticion(false);
            return false;
        } else {
            setDensidadVacio(false);
        }

        if (unidadDensidadSeleccionada === undefined) {
            setUnidadDensidadVacio(true);
            mostrarErrorUnidadDensidadVacio();
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
                mostrarErrorNo100Textura();
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
                mostrarErrorNo100Textura();
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
                mostrarErrorNo100Textura();
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
                mostrarErrorNo100Textura();
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
                mostrarErrorNo100Textura();
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
                mostrarErrorNo100Textura();
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
                mostrarErrorNo100Textura();
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
            setLaboratorioAnalisisModificado({label: laboratorioAnalisis.nombre, value: laboratorioAnalisis.id});
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

    const solicitarConfirmacionEliminacion = () => {
        setMostrarConfirmEliminacion(true);
    }

    const eliminarAnalisis = async (e) => {
        //Si el usuario confirma (e), se procede a eliminar el analisis
        setMostrarConfirmEliminacion(false);
        if (e) {
            try {
                await darDeBajaAnalisisService(analisisCompleto.id);
                setMostrarAnalisisEliminado(true);
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        try {
                            await renewToken();
                            await darDeBajaAnalisisService(analisisCompleto.id);
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

    if(analisisCompleto){
        if(laboratorioAnalisis && laboratorios){
            if(modo === "modificar"){
                return(
                    <>
                        {/* MODIFICAR ANÁLISIS COMPLETO */}
                        {/* contenedor */}
                        <div className="contenedor-analisis">
        
                            {/* título contenedor */}
                            <div className='seccion-titulo-analisis'>
                                <span className='tituloForm'>Análisis Químico del Suelo - Completo</span> 
                            </div>

                            {/* formulario análisis */}
                            <Form className='formulario-analisis' onSubmit={handleSubmit(modificarAnalisisCompleto)}>

                                {/* columna 1 */}
                                <div className="columna-uno">

                                    {/* Fecha de análisis */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={fechaVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Fecha*</Form.Label>
                                        <DatePicker 
                                        className='estilos-datepikcer'
                                        dateFormat="dd/MM/yyyy"
                                        selected={startDateModoModificar}
                                        onChange={(date) => setStartDateModoModificar(date)}
                                        minDate={moment(fechaTomaMuestra, "YYYY-MM-DD").toDate()}
                                        maxDate={new Date()}
                                        />
                                    </Form.Group>

                                    {/* Select Laboratorio */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={laboratorioVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Laboratorio*</Form.Label>
                                        <Select
                                        value={laboratorioAnalisisModificado}
                                        onChange={handleChangeLaboratorioModificado}
                                        options={
                                            laboratorios.map( labo => ({label: labo.nombre, value: labo.id}))
                                        }>    
                                        </Select>
                                    </Form.Group>

                                    {/* campo materia organica */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={materiaOrganicaVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Materia Orgánica*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={materiaOrganica} 
                                            onChange={handleChangeMateriaOrganica}/>
                                        <Form.Label className='label-derecho'>%</Form.Label>
                                    </Form.Group>

                                    {/* campo carbono orgánico */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={carbonoVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Carbono Orgánico*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={carbono}
                                            onChange={handleChangeCarbono}/>
                                        <Form.Label className='label-derecho'>%</Form.Label>
                                    </Form.Group>     

                                    {/* campo nitrógeno total */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className={nitrogenoVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Nitrógeno Total*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={nitrogeno}
                                            onChange={handleChangeNitrogeno}/>
                                        <Form.Label className='label-derecho'>%</Form.Label>
                                    </Form.Group>          

                                    {/* campo relación C/N */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className='label-izquierdo'>Relación C/N</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={relacionCN} disabled={true}/>
                                    </Form.Group>           

                                    {/* Campo Nitrógeno Anaeróbico */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={unidadNanVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Nan</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={nan}
                                        onChange={handleChangeNan}/>
                                        <Select
                                        options={unidadesNan}
                                        value={unidadNanSeleccionada}
                                        onChange={handleChangeUnidadNan}>

                                        </Select>
                                    </Form.Group>

                                    {/* campo nitratos */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className='label-izquierdo'>Nitratos</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={nitratos}
                                        onChange={handleChangeNitratos}/>
                                        <Form.Label className='label-form'>ppm</Form.Label>
                                    </Form.Group>   

                                    {/* fósforo extraíble */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className='label-izquierdo'>Fósforo Extraíble</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={fosforo}
                                        onChange={handleChangeFosforo}/>
                                        <Form.Label className='label-derecho'>ppm</Form.Label>
                                    </Form.Group>  

                                    {/* Campo pH */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={pHVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>pH*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={pH}
                                        onChange={handleChangePH}/>
                                    </Form.Group>

                                    {/* Campo conductividad eléctrica */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={unidadCEVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Conductividad Eléctrica</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={conductividadElectrica}
                                        onChange={handleChangeConductividadElectrica}/>
                                        <Select
                                        options={unidadesConductividadElectrica}
                                        value={unidadConductividadElectrica}
                                        onChange={handleChangeUnidadCondElect}>

                                        </Select>
                                    </Form.Group>

                                    {/* campo azufre */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className='label-izquierdo'>Azufre</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={azufre}
                                        onChange={handleChangeAzufre}/>
                                        <Form.Label className='label-derecho'>ppm</Form.Label>
                                    </Form.Group>   
                                
                                    {/* campo humedad gravimétrica */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className='label-izquierdo'>Humedad Gravimétrica</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={humedad}
                                        onChange={handleChangeHumedad}/>
                                        <Form.Label className='label-derecho'>%</Form.Label>
                                    </Form.Group>

                                    {/* Campo Densidad Aparente */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className={(densidadVacio || unidadDensidadVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Densidad Aparente*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={densidad} onChange={handleChangeDensidad}/>
                                        <Select
                                        options={unidadesDensidad}
                                        value={unidadDensidadSeleccionada}
                                        onChange={handleChangeUnidadDensidad}>

                                        </Select>
                                    </Form.Group>
                                </div>
                                
                                {/* columna 2 */}
                                <div className="columna-dos">

                                    {/* Titulo Cationes de Intercambio */}
                                    <div className='contenedorCationesIntercambio'>
                                        <span className='tituloCationesIntercambio'>Cationes de Intercambio</span> 
                                    </div>

                                    {/* Campo calcio */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className={(calcioVacio || unidadBasicaVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Calcio*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={calcio} onChange={handleChangeCalcio}/>
                                        <Select
                                        options={unidadesBasico}
                                        value={unidadBasicaSeleccionada}
                                        onChange={handleChangeUnidadBasica}>
                                        </Select>
                                    </Form.Group> 

                                    {/* Campo Magnesio */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className={(magnesioVacio || unidadBasicaVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Magnesio*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={magnesio} onChange={handleChangeMagnesio}/>
                                        <Select
                                        options={unidadesBasico}
                                        value={unidadBasicaSeleccionada}
                                        onChange={handleChangeUnidadBasica}>
                
                                        </Select>
                                    </Form.Group> 

                                    {/* Campo Sodio */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className={(sodioVacio || unidadBasicaVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Sodio*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={sodio} onChange={handleChangeSodio}/>
                                        <Select
                                        options={unidadesBasico}
                                        value={unidadBasicaSeleccionada}
                                        onChange={handleChangeUnidadBasica}>
                
                                        </Select>
                                    </Form.Group> 

                                    {/* Campo Potasio */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={(potasioVacio || unidadBasicaVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Potasio*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={potasio} onChange={handleChangePotasio}/>
                                        <Select
                                        options={unidadesBasico}
                                        value={unidadBasicaSeleccionada}
                                        onChange={handleChangeUnidadBasica}>
                
                                        </Select>
                                    </Form.Group> 

                                    {/* Campo Saturación Bases S */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className='label-izquierdo'>Saturación Bases S</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={saturacion} disabled={true}/>
                                        <Form.Label className='label-derecho'>
                                            {unidadBasicaSeleccionada === undefined ? unidadBasicaSeleccionada : unidadBasicaSeleccionada.label}
                                        </Form.Label>
                                    </Form.Group> 

                                    {/* Campo CIC */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={(cicVacio || unidadCicVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>CIC*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={cic}
                                        onChange={handleChangeCic}/>
                                        <Select
                                        options={unidadesCIC}
                                        value={unidadCicSeleccionada}
                                        onChange={handleChangeUnidadCic}>

                                        </Select>
                                    </Form.Group> 

                                    {/* Campo Valor de Insaturación */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className='label-izquierdo'>Valor de Insaturación</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={valorInsat}
                                        onChange={handleChangeValorInsat}/>
                                        <Form.Label className='label-derecho'>cmol/Kg</Form.Label>
                                    </Form.Group> 

                                    {/* Campo PSI */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className='label-izquierdo'>PSI</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={psi} disabled={true}/>
                                        <Form.Label className='label-derecho'>%</Form.Label>
                                    </Form.Group> 

                                    {/* Campo Aluminio */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={unidadAluminioVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Aluminio</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={aluminio}
                                        onChange={handleChangeAluminio}/>
                                        <Select
                                        options={unidadesBasico}
                                        value={unidadAluminioSeleccionada}
                                        onChange={handleChangeUnidadAluminio}>
                                        </Select>
                                    </Form.Group> 

                                    {/* Titulo Cationes de Intercambio */}
                                    <div className='contenedorCationesIntercambio'>
                                        <span className='tituloCationesIntercambio'>Textura del Suelo</span> 
                                    </div>

                                    {/* campo Arcilla */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={texturaNo100 ? 'label-izquierdo-error' : 'label-izquierdo'}>Arcilla</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={arcilla}
                                        onChange={handleChangeArcilla}/>
                                        <Form.Label className='label-derecho'>%</Form.Label>
                                    </Form.Group>

                                    {/* campo limo */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={texturaNo100 ? 'label-izquierdo-error' : 'label-izquierdo'}>Limo</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={limo}
                                        onChange={handleChangeLimo}/>
                                        <Form.Label className='label-derecho'>%</Form.Label>
                                    </Form.Group>

                                    
                                    {/* campo arena */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={texturaNo100 ? 'label-izquierdo-error' : 'label-izquierdo'}>Arena</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={arena}
                                        onChange={handleChangeArena}/>
                                        <Form.Label className='label-derecho'>%</Form.Label>
                                    </Form.Group>
                                </div>

                                <Form.Group className='seccionBotonesFormulario margenTop20 seccion-botones-analisis'>
                                    <Button className="botonCancelarFormulario" variant="secondary" onClick={handleCancelarEdicion}>
                                        Cancelar
                                    </Button>

                                    <Button className="botonConfirmacionFormulario" variant="secondary" type='submit' disabled={estaEnPeticion}>
                                        Aceptar
                                    </Button> 
                                </Form.Group>
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

                        {
                            errorLaboratoriosNoRegistrados &&
                            <Error texto={"Para continuar con el proceso, es necesario registrar al menos un laboratorio antes de cargar un análisis."} 
                            onConfirm={() => {navigate('/laboratorios')}}/>
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
                    <div className="contenedor-analisis">
        
                        {/* título contenedor */}
                        <div className='seccion-titulo-analisis'>
                            <span className='tituloForm'>Análisis Químico del Suelo - Completo</span> 
                        </div>
        
                        {/* formulario análisis */}
                        <Form className='formulario-analisis'>
        
                            {/* columna 1 */}
                            <div className="columna-uno">

                                {/* Fecha de análisis */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Fecha</Form.Label>
                                    <DatePicker 
                                    className='estilos-datepikcer'
                                    value={moment(analisisCompleto.fecha_analisis).format('DD/MM/YYYY')}
                                    disabled={true}
                                    />
                                </Form.Group>

                                {/* Select Laboratorio */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Laboratorio</Form.Label>
                                    <Select
                                    value={{label: laboratorioAnalisis.nombre, value: laboratorioAnalisis.id}}
                                    isDisabled={true}>    
                                    </Select>
                                </Form.Group>
        
                                {/* campo materia organica */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className={'label-izquierdo'}>Materia Orgánica</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisCompleto.materia_organica} disabled={true}/>
                                    <Form.Label className='label-derecho'>%</Form.Label>
                                </Form.Group>
        
                                 {/* campo carbono orgánico */}
                                 <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className={carbonoVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Carbono Orgánico</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisCompleto.carbono_organico} disabled={true}/>
                                    <Form.Label className='label-derecho'>%</Form.Label>
                                </Form.Group>     
        
                                 {/* campo nitrógeno total */}
                                 <Form.Group className='mb-3 seccion-form-analisis'>
                                 <Form.Label className={nitrogenoVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Nitrógeno Total</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisCompleto.nitrogeno_total} disabled={true}/>
                                    <Form.Label className='label-derecho'>%</Form.Label>
                                </Form.Group>          
        
                                 {/* campo relación C/N */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Relación C/N</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisCompleto.carbono_organico / analisisCompleto.nitrogeno_total} disabled={true}/>
                                </Form.Group>           
        
                                {/* Campo Nitrógeno Anaeróbico */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Nan</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisCompleto.nitrogeno_anaerobico === null ? "" : analisisCompleto.nitrogeno_anaerobico}
                                    disabled={true}/>
                                    <Form.Label className='label-derecho'>ppm</Form.Label>
                                </Form.Group>
        
                                 {/* campo nitratos */}
                                 <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Nitratos</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisCompleto.nitratos === null ? "" : analisisCompleto.nitratos}
                                    disabled={true}/>
                                    <Form.Label className='label-derecho'>ppm</Form.Label>
                                </Form.Group>   
        
                                 {/* fósforo extraíble */}
                                 <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Fósforo Extraíble</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisCompleto.fosforo_extraible === null ? "" : analisisCompleto.fosforo_extraible}
                                    disabled={true}/>
                                    <Form.Label className='label-derecho'>ppm</Form.Label>
                                </Form.Group>  
        
                                {/* Campo pH */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className={pHVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>pH</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisCompleto.ph}
                                    disabled={true}/>
                                </Form.Group>
        
                                {/* Campo conductividad eléctrica */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Conductividad Eléctrica</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisCompleto.conductividad_electrica === null ? "" : analisisCompleto.conductividad_electrica}
                                    disabled={true}/>
                                    <Form.Label className='label-derecho'>dS/m</Form.Label>
                                </Form.Group>
        
                                 {/* campo azufre */}
                                 <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Azufre</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisCompleto.azufre === null ? "" : analisisCompleto.azufre}
                                    disabled={true}/>
                                    <Form.Label className='label-derecho'>ppm</Form.Label>
                                </Form.Group>   
                    
                                {/* campo humedad gravimétrica */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Humedad Gravimétrica</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisCompleto.humedad_gravimetrica === null ? "" : analisisCompleto.humedad_gravimetrica}
                                    disabled={true}/>
                                    <Form.Label className='label-derecho'>%</Form.Label>
                                </Form.Group>
        
                                {/* campo Densidad Aparente */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Densidad Aparente</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisCompleto.densidad_aparente}
                                    disabled={true}/>
                                    <Form.Label className='label-derecho'>gr/cm3</Form.Label>
                                </Form.Group>        
                            </div>
                            
                            {/* columna 2 */}
                            <div className="columna-dos">
        
                                {/* Titulo Cationes de Intercambio */}
                                <div className='contenedorCationesIntercambio'>
                                    <span className='tituloCationesIntercambio'>Cationes de Intercambio</span> 
                                </div>
        
                                {/* Campo calcio */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className={calcioVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Calcio</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisCompleto.calcio} disabled={true}/>
                                    <Form.Label className='label-derecho'>ppm</Form.Label>
                                </Form.Group> 
        
                                {/* Campo Magnesio */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className={magnesioVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Magnesio</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisCompleto.magnesio} disabled={true}/>
                                    <Form.Label className='label-derecho'>ppm</Form.Label>
                                </Form.Group> 
        
                                {/* Campo Sodio */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className={sodioVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Sodio</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisCompleto.sodio} disabled={true}/>
                                    <Form.Label className='label-derecho'>ppm</Form.Label>
                                </Form.Group> 
        
                                {/* Campo Potasio */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className={potasioVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Potasio</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisCompleto.potasio} disabled={true}/>
                                    <Form.Label className='label-derecho'>ppm</Form.Label>
                                </Form.Group> 
        
                                {/* Campo Saturación Bases S */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Saturación Bases S</Form.Label>
                                    <Form.Control className='input-analisis' type='text' 
                                    value={analisisCompleto.calcio + analisisCompleto.magnesio + analisisCompleto.sodio + analisisCompleto.potasio} 
                                    disabled={true}/>
                                    <Form.Label className='label-derecho'>ppm</Form.Label>
                                </Form.Group> 
        
                                {/* Campo CIC */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className={cicVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>CIC</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisCompleto.capacidad_intercambio_cationica === null ? "" : analisisCompleto.capacidad_intercambio_cationica}
                                    disabled={true}/>
                                    <Form.Label className='label-derecho'>meq/100g</Form.Label>
                                </Form.Group> 
        
                                {/* Campo Valor de Insaturación */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Valor de Insaturación</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisCompleto.valor_insaturacion === null ? "" : analisisCompleto.valor_insaturacion}
                                    disabled={true}/>
                                    <Form.Label className='label-derecho'>cmol/Kg</Form.Label>
                                </Form.Group> 
        
                                {/* Campo PSI */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>PSI</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisCompleto.capacidad_intercambio_cationica === null ? ""
                                    : (100 * ((analisisCompleto.sodio * 0.00435) / analisisCompleto.capacidad_intercambio_cationica))} disabled={true}/>
                                    <Form.Label className='label-derecho'>%</Form.Label>
                                </Form.Group>
        
                                {/* Campo Aluminio*/}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Aluminio</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisCompleto.aluminio === null ? "" : analisisCompleto.aluminio}
                                    disabled={true}/>
                                    <Form.Label className='label-derecho'>ppm</Form.Label>
                                </Form.Group> 
        
                                {/* Titulo Cationes de Intercambio */}
                                <div className='contenedorCationesIntercambio'>
                                    <span className='tituloCationesIntercambio'>Textura del Suelo</span> 
                                </div>
        
                                {/* campo Arcilla */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Arcilla</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisCompleto.arcilla === null ? "" : analisisCompleto.arcilla}
                                    disabled={true}/>
                                    <Form.Label className='label-derecho'>%</Form.Label>
                                </Form.Group>
        
                                {/* campo limo */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Limo</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisCompleto.limo === null ? "" : analisisCompleto.limo}
                                    disabled={true}/>
                                    <Form.Label className='label-derecho'>%</Form.Label>
                                </Form.Group>
        
                                
                                {/* campo arena */}
                                <Form.Group className='mb-3 seccion-form-analisis'>
                                    <Form.Label className='label-izquierdo'>Arena</Form.Label>
                                    <Form.Control className='input-analisis' type='text' value={analisisCompleto.arena === null ? "" : analisisCompleto.arena}
                                    disabled={true}/>
                                    <Form.Label className='label-derecho'>%</Form.Label>
                                </Form.Group>        
                            </div>

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
        
                                {/* Botones formulario */}
                                <div className="botonesFormAnalisis">
                     
                                </div>
        
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
        
    }
    else if (laboratorios !== undefined){
        return(
            <>
                {/* REGISTRAR ANÁLISIS COMPLETO */}

                {/* contenedor */}
                <div className="contenedor-analisis">
    
                    {/* título contenedor */}
                    <div className='seccion-titulo-analisis'>
                        <span className='tituloForm'>Análisis Químico del Suelo - Completo</span> 
                    </div>
    
                    {/* formulario análisis */}
                    <Form className='formulario-analisis' onSubmit={handleSubmit(registrarAnalisisCompleto)}>

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
                                defaultValue={{label: 'Seleccione un Laboratorio', value: 0}}
                                onChange={handleChangeLaboratorio}
                                options={
                                    laboratorios.map( labo => ({label: labo.nombre, value: labo.id}))
                                }>    
                                </Select>
                            </Form.Group>
    
                            {/* campo materia organica */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className={materiaOrganicaVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Materia Orgánica*</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={materiaOrganica} 
                                    onChange={handleChangeMateriaOrganica}/>
                                <Form.Label className='label-derecho'>%</Form.Label>
                            </Form.Group>
    
                             {/* campo carbono orgánico */}
                             <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className={carbonoVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Carbono Orgánico*</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={carbono}
                                    onChange={handleChangeCarbono}/>
                                <Form.Label className='label-derecho'>%</Form.Label>
                            </Form.Group>     
    
                             {/* campo nitrógeno total */}
                             <Form.Group className='mb-3 seccion-form-analisis'>
                             <Form.Label className={nitrogenoVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Nitrógeno Total*</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={nitrogeno}
                                    onChange={handleChangeNitrogeno}/>
                                <Form.Label className='label-derecho'>%</Form.Label>
                            </Form.Group>          
    
                             {/* campo relación C/N */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className='label-izquierdo'>Relación C/N</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={relacionCN} disabled={true}/>
                            </Form.Group>           
    
                            {/* Campo Nitrógeno Anaeróbico */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className={unidadNanVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Nan</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={nan}
                                onChange={handleChangeNan}/>
                                <Select
                                options={unidadesNan}
                                value={unidadNanSeleccionada}
                                onChange={handleChangeUnidadNan}>
    
                                </Select>
                            </Form.Group>
    
                             {/* campo nitratos */}
                             <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className='label-izquierdo'>Nitratos</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={nitratos}
                                onChange={handleChangeNitratos}/>
                                <Form.Label className='label-derecho'>ppm</Form.Label>
                            </Form.Group>   
    
                             {/* fósforo extraíble */}
                             <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className='label-izquierdo'>Fósforo Extraíble</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={fosforo}
                                onChange={handleChangeFosforo}/>
                                <Form.Label className='label-derecho'>ppm</Form.Label>
                            </Form.Group>  
    
                            {/* Campo pH */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className={pHVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>pH*</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={pH}
                                onChange={handleChangePH}/>
                            </Form.Group>
    
                            {/* Campo conductividad eléctrica */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className={unidadCEVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Conductividad Eléctrica</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={conductividadElectrica}
                                onChange={handleChangeConductividadElectrica}/>
                                <Select
                                options={unidadesConductividadElectrica}
                                value={unidadConductividadElectrica}
                                onChange={handleChangeUnidadCondElect}>
    
                                </Select>
                            </Form.Group>
    
                             {/* campo azufre */}
                             <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className='label-izquierdo'>Azufre</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={azufre}
                                onChange={handleChangeAzufre}/>
                                <Form.Label className='label-derecho'>ppm</Form.Label>
                            </Form.Group>   

                            {/* campo humedad gravimétrica */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className='label-izquierdo'>Humedad Gravimétrica</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={humedad}
                                onChange={handleChangeHumedad}/>
                                <Form.Label className='label-derecho'>%</Form.Label>
                            </Form.Group>


                            {/* Campo Densidad Aparente */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={(densidadVacio || unidadDensidadVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Densidad Aparente*</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={densidad} onChange={handleChangeDensidad}/>
                                <Select
                                options={unidadesDensidad}
                                value={unidadDensidadSeleccionada}
                                onChange={handleChangeUnidadDensidad}>
    
                                </Select>
                            </Form.Group> 
    
                        </div>
                        
                        {/* columna 2 */}
                        <div className="columna-dos">
    
                            {/* Titulo Cationes de Intercambio */}
                            <div className='contenedorCationesIntercambio'>
                                <span className='tituloCationesIntercambio'>Cationes de Intercambio</span> 
                            </div>
    
                            {/* Campo calcio */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={(calcioVacio || unidadBasicaVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Calcio*</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={calcio} onChange={handleChangeCalcio}/>
                                <Select
                                options={unidadesBasico}
                                value={unidadBasicaSeleccionada}
                                onChange={handleChangeUnidadBasica}>
    
                                </Select>
                            </Form.Group> 
    
                            {/* Campo Magnesio */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={(magnesioVacio || unidadBasicaVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Magnesio*</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={magnesio} onChange={handleChangeMagnesio}/>
                                <Select
                                options={unidadesBasico}
                                value={unidadBasicaSeleccionada}
                                onChange={handleChangeUnidadBasica}>
        
                                </Select>
                            </Form.Group> 
    
                            {/* Campo Sodio */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                            <Form.Label className={(sodioVacio || unidadBasicaVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Sodio*</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={sodio} onChange={handleChangeSodio}/>
                                <Select
                                options={unidadesBasico}
                                value={unidadBasicaSeleccionada}
                                onChange={handleChangeUnidadBasica}>
        
                                </Select>
                            </Form.Group> 
    
                            {/* Campo Potasio */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className={(potasioVacio || unidadBasicaVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Potasio*</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={potasio} onChange={handleChangePotasio}/>
                                <Select
                                options={unidadesBasico}
                                value={unidadBasicaSeleccionada}
                                onChange={handleChangeUnidadBasica}>
        
                                </Select>
                            </Form.Group> 
    
                            {/* Campo Saturación Bases S */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className='label-izquierdo'>Saturación Bases S</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={saturacion} disabled={true}/>
                                <Form.Label className='label-derecho'>
                                    {unidadBasicaSeleccionada === undefined ? unidadBasicaSeleccionada : unidadBasicaSeleccionada.label}
                                </Form.Label>
                            </Form.Group> 
    
                            {/* Campo CIC */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className={(cicVacio || unidadCicVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>CIC*</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={cic}
                                onChange={handleChangeCic}/>
                                <Select
                                options={unidadesCIC}
                                value={unidadCicSeleccionada}
                                onChange={handleChangeUnidadCic}>
    
                                </Select>
                            </Form.Group> 
    
                            {/* Campo Valor de Insaturación */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className='label-izquierdo'>Valor de Insaturación</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={valorInsat}
                                onChange={handleChangeValorInsat}/>
                                <Form.Label className='label-derecho'>cmol/Kg</Form.Label>
                            </Form.Group> 
    
                            {/* Campo PSI */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className='label-izquierdo'>PSI</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={psi} disabled={true}/>
                                <Form.Label className='label-derecho'>%</Form.Label>
                            </Form.Group> 

                            {/* Campo Aluminio */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className={unidadAluminioVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Aluminio</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={aluminio}
                                onChange={handleChangeAluminio}/>
                                <Select
                                options={unidadesBasico}
                                value={unidadAluminioSeleccionada}
                                onChange={handleChangeUnidadAluminio}>
                                </Select>
                            </Form.Group> 
    
                            {/* Titulo Cationes de Intercambio */}
                            <div className='contenedorCationesIntercambio'>
                                <span className='tituloCationesIntercambio'>Textura del Suelo</span> 
                            </div>
    
                            {/* campo Arcilla */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className={texturaNo100 ? 'label-izquierdo-error' : 'label-izquierdo'}>Arcilla</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={arcilla}
                                onChange={handleChangeArcilla}/>
                                <Form.Label className='label-derecho'>%</Form.Label>
                            </Form.Group>
    
                            {/* campo limo */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className={texturaNo100 ? 'label-izquierdo-error' : 'label-izquierdo'}>Limo</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={limo}
                                onChange={handleChangeLimo}/>
                                <Form.Label className='label-derecho'>%</Form.Label>
                            </Form.Group>
    
                            
                            {/* campo arena */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className={texturaNo100 ? 'label-izquierdo-error' : 'label-izquierdo'}>Arena</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={arena}
                                onChange={handleChangeArena}/>
                                <Form.Label className='label-derecho'>%</Form.Label>
                            </Form.Group>    
                        </div>
    
                        {/* Botones formulario */}
                        <Form.Group className='seccionBotonesFormulario margenTop20 seccion-botones-analisis'>
                            <Button className="botonCancelarFormulario" variant="secondary" onClick={handleCancelar}>
                                Cerrar
                            </Button>
    
                            <Button className="botonConfirmacionFormulario" variant="secondary" type='submit' disabled={estaEnPeticion}>
                                Registrar
                            </Button> 
                        </Form.Group>    
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

export default AnalisisCompleto;
