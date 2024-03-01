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
import DatePicker from 'react-datepicker';
import SpinnerAgrolitycs from '../../../../components/Spinner/SpinnerAgrolitycs';

// Importar utilities
import moment from 'moment';
import { toast } from 'react-toastify';

// Importar hooks
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";

// Importar services
import { registrarNuevoAnalisisBasico, modificarAnalisisBasicoService, darDeBajaAnalisisService } from '../../services/analisis.service';
import { renewToken } from '../../../../services/token.service';
import { laboratoriosService } from '../../../../services/laboratorios.service';
import { consultarLaboratorio } from '../../../../services/laboratorios.service';

function AnalisisBasico({ tomaDeMuestra, analisisBasico = undefined, fechaTomaMuestra = undefined }) {

    const { handleSubmit, reset } = useForm();

    let navigate = useNavigate();

    const [ estaEnPeticion, setEstaEnPeticion ] = useState(false);

    // modo del componente
    const [ modo, setModo ] = useState(false);

    const [startDate, setStartDate] = useState();
    const [ startDateModoModificar, setStartDateModoModificar ] = useState();

    // variables para los valores del análisis
    const [ materiaOrganica, setMateriaOrganica ] = useState("");
    const [ carbono, setCarbono ] = useState("");
    const [ nitrogeno, setNitrogeno ] = useState("");
    const [ relacionCN, setRelacionCN ] = useState("");
    const [ pH, setPH ] = useState("");
    const [ fosforo, setFosforo ] = useState("");
    const [ aluminio, setAluminio ] = useState("");
    const [ calcio, setCalcio ] = useState("");
    const [ magnesio, setMagnesio ] = useState("");
    const [ sodio, setSodio ] = useState("");
    const [ potasio, setPotasio ] = useState("");
    const [ saturacion, setSaturacion ] = useState("");
    const [ azufre, setAzufre ] = useState("");
    const [ densidadAparente, setDensidadAparente ] = useState("1,25");
    const [ cic, setCIC ] = useState("");

    // variables para los errores de campo vacio
    const [ fechaVacio, setFechaVacio ] = useState(false);
    const [ materiaOrganicaVacio, setMateriaOrganicaVacio ] = useState(false);
    const [ carbonoVacio, setCarbonoVacio ] = useState(false);
    const [ nitrogenoVacio, setNitrogenoVacio ] = useState(false);
    const [ pHVacio, setPHVacio ] = useState(false);
    const [ fosforoVacio, setFosforoVacio ] = useState(false);
    const [ calcioVacio, setCalcioVacio ] = useState(false);
    const [ magnesioVacio, setMagnesioVacio ] = useState(false);
    const [ sodioVacio, setSodioVacio ] = useState(false);
    const [ potasioVacio, setPotasioVacio ] = useState(false);
    const [ densidadVacio, setDensidadVacio ] = useState(false);
    const [ unidadAluminioVacio, setUnidadAluminioVacio ] = useState(false);
    const [ unidadVacio, setUnidadVacio ] = useState(false);
    const [ unidadDensidadVacio, setUnidadDensidadVacio ] = useState(false);
    const [ cicVacio, setCicVacio ] = useState(false);
    const [ unidadCicVacio, setUnidadCicVacio ] = useState(false);

    const [ laboratorios, setLaboratorios ] = useState();

    const unidades = [{label: "cmol(+)/Kg", value: 0}, 
                        {label: "ppm", value: 1},
                        {label: "meq/100g", value: 2}];

    const unidadesCIC = [{label: "cmol(+)/Kg", value: 0},
                        {label: "meq/100g", value: 1}]

    const unidadesDensidad = [{label: "gr/cm3", value: 0},
                              {label: "Mg/m3", value: 1},
                              {label: "Ton/m3", value: 2}];

    const [ unidadSeleccionada, setUnidadSeleccionada ] = useState();
    const [ unidadAluminio, setUnidadAluminio ] = useState();
    const [ unidadDensidad, setUnidadDensidad ] = useState({label: "gr/cm3", value: 0});
    const [ unidadCicSeleccionada, setUnidadCicSeleccionada ] = useState();

    const [ laboratorioSeleccionado, setLaboratorioSeleccionado ] = useState({label: "Seleccione Laboratorio",
                                                                            value: 0});
    const [ laboratorioVacio, setLaboratorioVacio ] = useState(false);

    // variable para guardar el laboratorio del análisis consultado
    const [ laboratorioAnalisis, setLaboratorioAnalisis ] = useState();

    // variables para el modo modificación
    const [ laboratorioAnalisisModificado, setLaboratorioAnalisisModificado ] = useState();
    const [ materiaOrganicaModificacion, setMateriaOrganicaModificacion ] = useState("");
    const [ carbonoModificacion, setCarbonoModificacion ] = useState("");
    const [ nitrogenoModificacion, setNitrogenoModificacion ] = useState("");
    const [ pHModificacion, setPHModificacion ] = useState("");
    const [ fosforoModificacion, setFosforoModificacion ] = useState("");
    const [ aluminioModificacion, setAluminioModificacion ] = useState("");
    const [ calcioModificacion, setCalcioModificacion ] = useState("");
    const [ magnesioModificacion, setMagnesioModificacion ] = useState("");
    const [ sodioModificacion, setSodioModificacion ] = useState("");
    const [ potasioModificacion, setPotasioModificacion ] = useState("");
    const [ cicModificacion, setCicModificacion ] = useState("");
    const [ azufreModificacion, setAzufreModificacion ] = useState("");
    const [ densidadModificacion, setDensidadModificacion ] = useState("");

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


    const handleChangeLaboratorio = (laboratorio) => {
        setLaboratorioSeleccionado({label: laboratorio.label, value: laboratorio.value});
    }

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

    const handleChangePH = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 14)){setPH(value);}
    }

    const handleChangeFosforo = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setFosforo(value);}
    }

    const handleChangeAluminio = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setAluminio(value);}
    }

    const handleChangeUnidadAluminio = (unidad) => {
        setUnidadAluminio(unidad);
    }

    const handleChangeUnidad = (unidad) => {
        setUnidadSeleccionada(unidad);
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
        if(calcio !== "" && magnesio !== "" && sodio !== "" && potasio !== ""){
            const calc = parseFloat(calcio.replace(",","."));
            const magn = parseFloat(magnesio.replace(",","."));
            const sod = parseFloat(sodio.replace(",","."));
            const pot = parseFloat(potasio.replace(",","."));
            const sat = (calc + magn + sod + pot).toFixed(2)
            setSaturacion(sat.toString());
        } else {
            setSaturacion("");
        }
    }, [calcio, magnesio, sodio, potasio]);
    

    const handleChangeAzufre = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setAzufre(value);}
    }

    const handleChangeDensidadAparente = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setDensidadAparente(value);}
    }

    const handleChangeUnidadDensidad = (opcion) => {
        setUnidadDensidad(opcion);
    }

    const handleChangeCic = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setCIC(value);}
    }

    const handleChangeUnidadCic = (opcion) => {
        setUnidadCicSeleccionada(opcion);
    }

    const handleCancelar = () => {
        navigate(-1);
    }

    const validarCampos = () => {
        if(startDate == undefined){
            setFechaVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorFechaVacia();
            return false;
        }
        else{
            setFechaVacio(false);
        }

        if (laboratorioSeleccionado.value === 0) {
            setLaboratorioVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorLaboratorioVacio();
            return false;
        } else {
            setLaboratorioVacio(false);
        }

        if(materiaOrganica === ""){
            setMateriaOrganicaVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorMateriaOrganicaVacio();
            return false;
        }
        else{
            setMateriaOrganicaVacio(false);
        }

        if (carbono === "") {
            setCarbonoVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorCarbonoVacio();
            return false;
        }
        else{
            setCarbonoVacio(false);
        }

        if(nitrogeno === ""){
            setNitrogenoVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorNitrogenoVacio();
            return false;
        }
        else{
            setNitrogenoVacio(false);
        }

        if(pH === "") {
            setPHVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorPhVacio();
            return false;
        }
        else{
            setPHVacio(false);
        }

        if(fosforo === "") {
            setFosforoVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorFosforoVacio();
            return false;
        } else {
            setFosforoVacio(false);
        }

        if(calcio === "") {
            setCalcioVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorCalcioVacio();
            return false;
        } else {
            setCalcioVacio(false);
        }

        if (magnesio === "") {
            setMagnesioVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorMagnesioVacio();
            return false;
        } else {
            setMagnesioVacio(false);
        }

        if(sodio === "") {
            setSodioVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorSodioVacio();
            return false;
        } else {
            setSodioVacio(false);
        }

        if(potasio === "") {
            setPotasioVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorPotasioVacio();
            return false;
        } else {
            setPotasioVacio(false);
        }

        if (cic === "") {
            setCicVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorCicVacio();
            return false;
        } else {
            setCicVacio(false);
        }

        if(densidadAparente === ""){
            setDensidadVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorDensidadVacio();
            return false;
        }
        else{
            setDensidadVacio(false)
        }

        if(unidadSeleccionada === undefined){
            setUnidadVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorUnidadVacio();
            return false;
        }
        else{
            setUnidadVacio(false);
        }

        if(unidadCicSeleccionada === undefined){
            setUnidadCicVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorUnidadCicVacio();
            return false;
        }
        else{
            setUnidadCicVacio(false);
        }

        if(unidadDensidad === undefined){
            setUnidadDensidadVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorUnidadDensidadVacio();
            return false;
        }
        else{
            setUnidadDensidadVacio(false);
        }

        if(aluminio !== ""){
            if(unidadAluminio === undefined){
                setUnidadAluminioVacio(true);
                setEstaEnPeticion(false);
                mostrarErrorUnidadAluminioVacio();
                return false;
            }
            else{
                setUnidadAluminioVacio(false)
            }
        }
        else{
            setUnidadAluminioVacio(false)
        }

        return true;

    }

    const handleSesionExpirada = () =>{
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
      }

    const handleConfirmarAnalisis = (e) => {
        if(e){
            setMostrarAnalisisRegistrado(false);
            reset();
            navigate(-1);
        }
    }

    const registrarAnalisisBasico = async () => {
        setEstaEnPeticion(true);
        const validacion = validarCampos();
        if(validacion){
            const nuevoAnalisisBasico = {
                toma_de_muestra_id: tomaDeMuestra.id,
                materia_organica: parseFloat(materiaOrganica.replace(",", ".")),
                carbono_organico: parseFloat(carbono.replace(",", ".")),
                nitrogeno_total: parseFloat(nitrogeno.replace(",", ".")),
                fosforo_extraible: parseFloat(fosforo.replace(",", ".")),
                ph: parseFloat(pH.replace(",", ".")),
                calcio: parseFloat(calcio.replace(",", ".")),
                calcio_unidad: unidadSeleccionada.label,
                magnesio: parseFloat(magnesio.replace(",", ".")),
                magnesio_unidad: unidadSeleccionada.label,
                sodio: parseFloat(sodio.replace(",", ".")),
                sodio_unidad: unidadSeleccionada.label,
                potasio: parseFloat(potasio.replace(",", ".")),
                potasio_unidad: unidadSeleccionada.label,
                capacidad_intercambio_cationica: parseFloat(cic.replace(",", ".")),
                capacidad_intercambio_cationica_unidad: unidadCicSeleccionada.label
            };

            if (aluminio !== "") {
                nuevoAnalisisBasico.aluminio = parseFloat(aluminio.replace(",","."));
                nuevoAnalisisBasico.aluminio_unidad = unidadAluminio.label;
            } else {
                nuevoAnalisisBasico.aluminio = null;
                nuevoAnalisisBasico.aluminio_unidad = "";
            }

            if (azufre !== "") {
                nuevoAnalisisBasico.azufre = parseFloat(azufre.replace(",","."));
            } else {
                nuevoAnalisisBasico.azufre = null;
            }

            nuevoAnalisisBasico.fecha_analisis = moment(startDate).format("YYYY-MM-DD");
            nuevoAnalisisBasico.laboratorio_id = laboratorioSeleccionado.value;
            nuevoAnalisisBasico.densidad_aparente = parseFloat(densidadAparente.replace(",","."));
            nuevoAnalisisBasico.densidad_aparente_unidad = unidadDensidad.label;

            try {
                await registrarNuevoAnalisisBasico(nuevoAnalisisBasico);
                setMostrarAnalisisRegistrado(true);
            } catch (error) {
                if(error.response && error.response.status === 401){
                    try {
                        await renewToken();
                        await registrarNuevoAnalisisBasico(nuevoAnalisisBasico);
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
        if(analisisBasico){
            const fetchLaboratorio = async () => {
                try {
                    const { data } = await consultarLaboratorio(analisisBasico.laboratorio_id);
                    setLaboratorioAnalisis(data);
                } catch (error) {
                    if (error.response && error.response.status === 401) {
                        try {
                            await renewToken();
                            const { data } = await consultarLaboratorio(analisisBasico.laboratorio_id);
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
    }, [analisisBasico]);

    useEffect(() => {
        if(modo === "modificar"){
            const fetchLaboratorioAnalisis = async () => {
                try {
                    const { data } = await consultarLaboratorio(analisisBasico.laboratorio_id);
                    setLaboratorioAnalisisModificado({label: data.nombre, value: data.id});
                } catch (error) {
                    if(error.response && error.response.status === 401){
                        try {
                            await renewToken();
                            const { data } = await consultarLaboratorio(analisisBasico.laboratorio_id);
                            setLaboratorioAnalisisModificado({label: data.nombre, value: data.id});
                        } catch (error) {
                          if(error.response && error.response.status === 401){
                            setMostrarErrorVencimientoToken(true);
                          }
                        }
                      }
                }
            }            
            fetchLaboratorioAnalisis();
        }
    }, [ modo ])

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

    const modificarAnalisisBasico = async () => {
        setEstaEnPeticion(true);
        const validacionModificacion = validarCamposModificacion();
        if(validacionModificacion){
            const analisisBasicoModificado = {
                toma_de_muestra_id: tomaDeMuestra.id,
                materia_organica: parseFloat(materiaOrganicaModificacion.replace(",", ".")),
                carbono_organico: parseFloat(carbonoModificacion.replace(",", ".")),
                nitrogeno_total: parseFloat(nitrogenoModificacion.replace(",", ".")),
                fosforo_extraible: parseFloat(fosforoModificacion.replace(",", ".")),
                ph: parseFloat(pHModificacion.replace(",", ".")),
                calcio: parseFloat(calcioModificacion.replace(",", ".")),
                calcio_unidad: unidadSeleccionada.label,
                magnesio: parseFloat(magnesioModificacion.replace(",", ".")),
                magnesio_unidad: unidadSeleccionada.label,
                sodio: parseFloat(sodioModificacion.replace(",", ".")),
                sodio_unidad: unidadSeleccionada.label,
                potasio: parseFloat(potasioModificacion.replace(",", ".")),
                potasio_unidad: unidadSeleccionada.label,
                capacidad_intercambio_cationica: parseFloat(cicModificacion.replace(",", ".")),
                capacidad_intercambio_cationica_unidad: unidadCicSeleccionada.label
            };

            if (aluminioModificacion !== "") {
                analisisBasicoModificado.aluminio = parseFloat(aluminioModificacion.replace(",","."));
                analisisBasicoModificado.aluminio_unidad = unidadAluminio.label;
            } else {
                analisisBasicoModificado.aluminio = null;
                analisisBasicoModificado.aluminio_unidad = "";
            }

            if (azufreModificacion !== "") {
                analisisBasicoModificado.azufre = parseFloat(azufreModificacion.replace(",","."));
            } else {
                analisisBasicoModificado.azufre = null;
            }

            analisisBasicoModificado.fecha_analisis = moment(startDateModoModificar).format("YYYY-MM-DD");
            analisisBasicoModificado.laboratorio_id = laboratorioAnalisisModificado.value;
            analisisBasicoModificado.densidad_aparente = parseFloat(densidadModificacion.replace(",","."));
            analisisBasicoModificado.densidad_aparente_unidad = unidadDensidad.label;

            try {
                await modificarAnalisisBasicoService(analisisBasico.id, analisisBasicoModificado);
                setMostrarAnalisisModificado(true);
            } catch (error) {
                if(error.response && error.response.status === 401){
                    try {
                        await renewToken();
                        await modificarAnalisisBasicoService(analisisBasico.id, analisisBasicoModificado);
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

    useEffect(() => {
        if(modo === "modificar"){
            setStartDateModoModificar(moment(analisisBasico.fecha_analisis, "YYYY-MM-DD").toDate());
            setMateriaOrganicaModificacion(String(analisisBasico.materia_organica).replace(".", ","));
            setCarbonoModificacion(String(analisisBasico.carbono_organico).replace(".", ","));
            setNitrogenoModificacion(String(analisisBasico.nitrogeno_total).replace(".", ","));
            setRelacionCN(analisisBasico.carbono_organico / analisisBasico.nitrogeno_total);
            setPHModificacion(String(analisisBasico.ph).replace(".", ","));
            setFosforoModificacion(String(analisisBasico.fosforo_extraible).replace(".", ","));
            if(analisisBasico.aluminio){
                setAluminioModificacion(String(analisisBasico.aluminio).replace(".", ","));
                setUnidadAluminio({label: "ppm", value: 1});
            }
            setCalcioModificacion(String(analisisBasico.calcio).replace(".", ","));
            setMagnesioModificacion(String(analisisBasico.magnesio).replace(".", ","));
            setSodioModificacion(String(analisisBasico.sodio).replace(".", ","));
            setPotasioModificacion(String(analisisBasico.potasio).replace(".", ","));
            setUnidadSeleccionada({label: "ppm", value: 1});
            setCicModificacion(String(analisisBasico.capacidad_intercambio_cationica).replace(".", ","));
            setUnidadCicSeleccionada({label: "meq/100g", value: 1});
            if(analisisBasico.azufre){
                setAzufreModificacion(String(analisisBasico.azufre).replace(".", ","));
            }
            setDensidadModificacion(String(analisisBasico.densidad_aparente).replace(".", ","));
            setLaboratorioSeleccionado({label: laboratorioAnalisis})

        }
    }, [modo])

    const handleChangeLaboratorioModificado = (laboratorio) => {
        setLaboratorioAnalisisModificado({label: laboratorio.label, value: laboratorio.value});
    }

    const handleChangeMateriaOrganicaModificacion = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 100)){setMateriaOrganicaModificacion(value);}
    }

    const handleChangeCarbonoModificacion = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 100)){setCarbonoModificacion(value);}
    }
    
    const handleChangeNitrogenoModificacion = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 100)){setNitrogenoModificacion(value);}
    }

    useEffect(() => {
        if(carbonoModificacion !== "" && nitrogenoModificacion !== ""){
          let carb = parseFloat(carbonoModificacion.replace(",","."));
          let nit = parseFloat(nitrogenoModificacion.replace(",","."));
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
      }, [carbonoModificacion, nitrogenoModificacion])

    const handleChangePHModificacion = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 14)){setPHModificacion(value);}
    }

    const handleChangeFosforoModificacion = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setFosforoModificacion(value);}
    }

    const handleChangeAluminioModificacion = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setAluminioModificacion(value);}
    }

    const handleChangeCalcioModificacion = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setCalcioModificacion(value);}
    }

    const handleChangeMagnesioModificacion = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setMagnesioModificacion(value);}
    }

    const handleChangeSodioModificacion = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setSodioModificacion(value);}
    }

    const handleChangePotasioModificacion = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setPotasioModificacion(value);}
    }

    useEffect(() => {
        if(calcioModificacion !== "" && magnesioModificacion !== "" && sodioModificacion !== "" 
        && potasioModificacion !== ""){
            let calc = parseFloat(calcioModificacion.replace(",","."));
            let magn = parseFloat(magnesioModificacion.replace(",","."));
            let sod = parseFloat(sodioModificacion.replace(",","."));
            let pot = parseFloat(potasioModificacion.replace(",","."));
            const sat = (calc + magn + sod + pot).toFixed(2)
            setSaturacion(sat.toString());
        }
        else{
            setSaturacion("");
        }
    }, [calcioModificacion, magnesioModificacion, sodioModificacion, potasioModificacion]);

    const handleChangeCicModificacion = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setCicModificacion(value);}
    }

    const handleChangeAzufreModificacion = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setAzufreModificacion(value);}
    }

    const handleChangeDensidadAparenteModificacion = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 99999)){setDensidadModificacion(value);}
    }

    const validarCamposModificacion = () => {
        if(startDateModoModificar == undefined){
            setFechaVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorFechaVacia();
            return false;
        }
        else{
            setFechaVacio(false);
        }

        if (laboratorioAnalisisModificado.value === 0) {
            setLaboratorioVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorLaboratorioVacio();
            return false;
        } else {
            setLaboratorioVacio(false);
        }

        if(materiaOrganicaModificacion === ""){
            setMateriaOrganicaVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorMateriaOrganicaVacio();
            return false;
        }
        else{
            setMateriaOrganicaVacio(false);
        }

        if (carbonoModificacion === "") {
            setCarbonoVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorCarbonoVacio();
            return false;
        }
        else{
            setCarbonoVacio(false);
        }

        if(nitrogenoModificacion === ""){
            setNitrogenoVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorNitrogenoVacio();
            return false;
        }
        else{
            setNitrogenoVacio(false);
        }

        if(pHModificacion === "") {
            setPHVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorPhVacio();
            return false;
        }
        else{
            setPHVacio(false);
        }

        if(fosforoModificacion === "") {
            setFosforoVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorFosforoVacio();
            return false;
        } else {
            setFosforoVacio(false);
        }

        if(calcioModificacion === "") {
            setCalcioVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorCalcioVacio();
            return false;
        } else {
            setCalcioVacio(false);
        }

        if (magnesioModificacion === "") {
            setMagnesioVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorMagnesioVacio();
            return false;
        } else {
            setMagnesioVacio(false);
        }

        if(sodioModificacion === "") {
            setSodioVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorSodioVacio();
            return false;
        } else {
            setSodioVacio(false);
        }

        if(potasioModificacion === "") {
            setPotasioVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorPotasioVacio();
            return false;
        } else {
            setPotasioVacio(false);
        }

        if (cicModificacion === "") {
            setCicVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorCicVacio();
            return false;
        } else {
            setCicVacio(false);
        }

        if(densidadModificacion === ""){
            setDensidadVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorDensidadVacio();
            return false;
        }
        else{
            setDensidadVacio(false)
        }

        if(unidadSeleccionada === undefined){
            setUnidadVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorUnidadVacio();
            return false;
        }
        else{
            setUnidadVacio(false);
        }

        if(unidadCicSeleccionada === undefined){
            setUnidadCicVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorUnidadCicVacio();
            return false;
        }
        else{
            setUnidadCicVacio(false);
        }

        if(unidadDensidad === undefined){
            setUnidadDensidadVacio(true);
            setEstaEnPeticion(false);
            mostrarErrorUnidadDensidadVacio();
            return false;
        }
        else{
            setUnidadDensidadVacio(false);
        }

        if(aluminioModificacion !== ""){
            if(unidadAluminio === undefined){
                setUnidadAluminioVacio(true);
                setEstaEnPeticion(false);
                mostrarErrorUnidadAluminioVacio();
                return false;
            }
            else{
                setUnidadAluminioVacio(false)
            }
        }
        else{
            setUnidadAluminioVacio(false)
        }

        return true;

    }

    const solicitarConfirmacionEliminacion = () => {
        setMostrarConfirmEliminacion(true);
    }

    const eliminarAnalisis = async (e) => {
        //Si el usuario confirma (e), se procede a eliminar el analisis
        setMostrarConfirmEliminacion(false);
        if (e) {
            try {
                await darDeBajaAnalisisService(analisisBasico.id);
                setMostrarAnalisisEliminado(true);
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 401) {
                        try {
                            await renewToken();
                            await darDeBajaAnalisisService(analisisBasico.id);
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

    if (analisisBasico) {
        if(laboratorioAnalisis){
            if (modo === "modificar" && laboratorioAnalisisModificado){
                return(
                    <>       
                        {/* MODIFICAR ANALISIS BÁSICO */}
                        {/* contenedor */}
                        <div className="contenedor-analisis">
            
                            {/* título contenedor */}
                            <div className='seccion-titulo-analisis'>
                                <span className='tituloForm'>Análisis Químico del Suelo - Básico</span> 
                            </div>
            
                            {/* formulario análisis */}
                            <Form className='formulario-analisis' onSubmit={handleSubmit(modificarAnalisisBasico)}>
        
                                {/* columna 1 */}
                                <div className="columna-uno">

                                    {/* Fecha de análisis */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={fechaVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Fecha</Form.Label>
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
                                        <Form.Label className={laboratorioVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Laboratorio</Form.Label>
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
                                        <Form.Control className='input-analisis' type='text'
                                        value={materiaOrganicaModificacion} onChange={handleChangeMateriaOrganicaModificacion}/>
                                        <Form.Label className='label-derecho'>%</Form.Label>
                                    </Form.Group>
            
                                     {/* campo carbono orgánico */}
                                     <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={carbonoVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Carbono Orgánico*</Form.Label>
                                        <Form.Control className='input-analisis' type='text'
                                        value={carbonoModificacion} onChange={handleChangeCarbonoModificacion}/>
                                        <Form.Label className='label-derecho'>%</Form.Label>
                                    </Form.Group>     
            
                                     {/* campo nitrógeno total */}
                                     <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={nitrogenoVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Nitrógeno Total*</Form.Label>
                                        <Form.Control className='input-analisis' type='text'
                                        value={nitrogenoModificacion} onChange={handleChangeNitrogenoModificacion}/>
                                        <Form.Label className='label-derecho'>%</Form.Label>
                                    </Form.Group>          
            
                                     {/* campo relación C/N */}
                                     <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className='label-izquierdo'>Relación C/N</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={relacionCN} disabled={true}/>
                                    </Form.Group>           
             
            
                                    {/* Campo pH */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={pHVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>pH*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={pHModificacion}
                                        onChange={handleChangePHModificacion}/>
                                    </Form.Group>
            
                                    {/* Campo fósforo */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={fosforoVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Fósforo Extraíble*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={fosforoModificacion}
                                        onChange={handleChangeFosforoModificacion}/>
                                        <Form.Label className='label-derecho'>ppm</Form.Label>
                                    </Form.Group>
                                        
                                    {/* Campo aluminio */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={unidadAluminioVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Aluminio</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={aluminioModificacion} 
                                        onChange={handleChangeAluminioModificacion}/>
                                        <Select
                                        options={unidades}
                                        value={unidadAluminio}
                                        onChange={handleChangeUnidadAluminio}>            
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
                                        <Form.Label className={(calcioVacio || unidadVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Calcio*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={calcioModificacion} 
                                        onChange={handleChangeCalcioModificacion}/>
                                        <Select
                                        options={unidades}
                                        value={unidadSeleccionada}
                                        onChange={handleChangeUnidad}>
            
                                        </Select>
                                    </Form.Group> 
            
                                    {/* Campo Magnesio */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={(magnesioVacio || unidadVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Magnesio*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={magnesioModificacion} 
                                        onChange={handleChangeMagnesioModificacion}/>
                                        <Select
                                        options={unidades}
                                        value={unidadSeleccionada}
                                        onChange={handleChangeUnidad}>
            
                                        </Select>
                                    </Form.Group> 
            
                                    {/* Campo Sodio */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={(sodioVacio || unidadVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Sodio*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={sodioModificacion} 
                                        onChange={handleChangeSodioModificacion}/>
                                        <Select
                                        options={unidades}
                                        value={unidadSeleccionada}
                                        onChange={handleChangeUnidad}>
            
                                        </Select>
                                    </Form.Group> 
            
                                    {/* Campo Potasio */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={(potasioVacio || unidadVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Potasio*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={potasioModificacion} 
                                        onChange={handleChangePotasioModificacion}/>
                                        <Select
                                        options={unidades}
                                        value={unidadSeleccionada}
                                        onChange={handleChangeUnidad}>
            
                                        </Select>
                                    </Form.Group> 
            
                                    {/* Campo Saturación Bases S */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className='label-izquierdo'>Saturación Bases S</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={saturacion} disabled={true}/>
                                        <Form.Label className='label-derecho'>
                                            {unidadSeleccionada === undefined ? unidadSeleccionada : unidadSeleccionada.label}
                                        </Form.Label>
                                    </Form.Group> 
        
                                    {/* Campo CIC */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={(cicVacio || unidadCicVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>CIC*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={cicModificacion}
                                        onChange={handleChangeCicModificacion}/>
                                        <Select
                                        options={unidadesCIC}
                                        value={unidadCicSeleccionada}
                                        onChange={handleChangeUnidadCic}>
            
                                        </Select>
                                    </Form.Group> 
        
                                    {/* Campo Azufre */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className='label-izquierdo'>Azufre</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={azufreModificacion} 
                                        onChange={handleChangeAzufreModificacion}/>
                                        <Form.Label className='label-derecho'>ppm</Form.Label>
                                    </Form.Group> 
        
                                    {/* Campo Densidad Aparente */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={densidadVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Densidad Aparente*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={densidadModificacion} 
                                            onChange={handleChangeDensidadAparenteModificacion}/>
                                        <Select
                                        options={unidadesDensidad}
                                        value={unidadDensidad}
                                        onChange={handleChangeUnidadDensidad}>
            
                                        </Select>
                                    </Form.Group>            
                                </div>
            
                                {/* Botones Formulario */}
                                <Form.Group className='seccionBotonesFormulario margenTop20 seccion-botones-analisis'>
                                    <Button className="botonCancelarFormulario" variant="secondary" onClick={handleCancelarEdicion}>
                                        Cancelar
                                    </Button>
            
                                    <Button className="botonConfirmacionFormulario" variant="secondary" type="submit" disabled={estaEnPeticion}>
                                        Aceptar
                                    </Button>    
                                </Form.Group>            
                            </Form>
                        </div>
            
                        {
                            mostrarAnalisisModificado &&
                            <Confirm texto={"Su Análisis ha sido modificado correctamente"}
                            onConfirm={handleConfirmarAnalisis}/>
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
                );
            }
            else{
                return(
                    <>
                        {/* CONSULTAR ANALISIS BÁSICO */}
                        {console.log()}
                        {/* contenedor */}
                        <div className="contenedor-analisis">
        
                            {/* título contenedor */}
                            <div className='seccion-titulo-analisis'>
                                <span className='tituloForm'>Análisis Químico del Suelo - Básico</span> 
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
                                        value={moment(analisisBasico.fecha_analisis).format('DD/MM/YYYY')}
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
                                        <Form.Label className={materiaOrganicaVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Materia Orgánica*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={analisisBasico.materia_organica} disabled={true}/>
                                        <Form.Label className='label-derecho'>%</Form.Label>
                                    </Form.Group>
        
                                    {/* campo carbono orgánico */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={carbonoVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Carbono Orgánico*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={analisisBasico.carbono_organico} disabled={true}/>
                                        <Form.Label className='label-derecho'>%</Form.Label>
                                    </Form.Group>     
        
                                    {/* campo nitrógeno total */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={nitrogenoVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Nitrógeno Total*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={analisisBasico.nitrogeno_total} disabled={true}/>
                                        <Form.Label className='label-derecho'>%</Form.Label>
                                    </Form.Group>          
        
                                    {/* campo relación C/N */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className='label-izquierdo'>Relación C/N</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={analisisBasico.carbono_organico / analisisBasico.nitrogeno_total} disabled={true}/>
                                    </Form.Group>           
            
        
                                    {/* Campo pH */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={pHVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>pH*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={analisisBasico.ph} disabled={true}/>
                                    </Form.Group>
        
                                    {/* Campo fósforo */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={fosforoVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Fósforo Extraíble*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={analisisBasico.fosforo_extraible} disabled={true}/>
                                        <Form.Label className='label-derecho'>ppm</Form.Label>
                                    </Form.Group>
        
                                    {/* Campo Aluminio */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={unidadAluminioVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Aluminio</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={analisisBasico.aluminio === null ? "" : analisisBasico.aluminio} 
                                        disabled={true}/>
                                        <Form.Label className='label-derecho'>ppm</Form.Label>
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
                                        <Form.Label className={calcioVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Calcio*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={analisisBasico.calcio} disabled={true}/>
                                        <Form.Label className='label-derecho'>ppm</Form.Label>
                                    </Form.Group> 
        
                                    {/* Campo Magnesio */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={magnesioVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Magnesio*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={analisisBasico.magnesio} disabled={true}/>
                                        <Form.Label className='label-derecho'>ppm</Form.Label>
                                    </Form.Group> 
        
                                    {/* Campo Sodio */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={sodioVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Sodio*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={analisisBasico.sodio} disabled={true}/>
                                        <Form.Label className='label-derecho'>ppm</Form.Label>
                                    </Form.Group> 
        
                                    {/* Campo Potasio */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={potasioVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Potasio*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={analisisBasico.potasio} disabled={true}/>
                                        <Form.Label className='label-derecho'>ppm</Form.Label>
                                    </Form.Group> 
        
                                    {/* Campo Saturación Bases S */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className='label-izquierdo'>Saturación Bases S</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={analisisBasico.calcio + analisisBasico.magnesio + analisisBasico.sodio + analisisBasico.potasio} 
                                        disabled={true}/>
                                        <Form.Label className='label-derecho'>ppm</Form.Label>
                                    </Form.Group> 
        
                                    {/* Campo CIC */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className={(cicVacio || unidadCicVacio) ? 'label-izquierdo-error' :'label-izquierdo'}>CIC*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={analisisBasico.capacidad_intercambio_cationica === null ? "" : analisisBasico.capacidad_intercambio_cationica}
                                        disabled={true}/>
                                        <Form.Label className='label-derecho'>meq/100g</Form.Label>
                                    </Form.Group> 

                                    {/* Campo Azufre */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className='label-izquierdo'>Azufre</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={analisisBasico.azufre === null ? "" : analisisBasico.azufre}
                                        disabled={true}/>
                                        <Form.Label className='label-derecho'>ppm</Form.Label>
                                    </Form.Group>  
        
                                    {/* Campo Densidad Aparente */}
                                    <Form.Group className='mb-3 seccion-form-analisis'>
                                        <Form.Label className='label-izquierdo'>Densidad Aparente*</Form.Label>
                                        <Form.Control className='input-analisis' type='text' value={analisisBasico.densidad_aparente} 
                                        disabled={true}/>
                                        <Form.Label className='label-derecho'>ppm</Form.Label>
                                    </Form.Group>
        
                                </div>

                                 {/* Botones formulario */}
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
                            mostrarErrorVencimientoToken &&
                            <Error texto={"Su sesión ha expirado"} 
                            onConfirm={handleSesionExpirada}/>
                        }  

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
    else if (laboratorios !== undefined){
        return(
            <>
                {/* REGISTRAR ANALISIS BÁSICO */}
                {/* contenedor */}
                <div className="contenedor-analisis">
    
                    {/* título contenedor */}
                    <div className='seccion-titulo-analisis'>
                        <span className='tituloForm'>Análisis Químico del Suelo - Básico</span> 
                    </div>
    
                    {/* formulario análisis */}
                    <Form className='formulario-analisis' onSubmit={handleSubmit(registrarAnalisisBasico)}>

                        {/* columna 1 */}
                        <div className="columna-uno">

                            {/* Fecha de análisis */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className={fechaVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Fecha</Form.Label>
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
                                <Form.Label className={laboratorioVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Laboratorio</Form.Label>
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
     
    
                            {/* Campo pH */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className={pHVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>pH*</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={pH}
                                onChange={handleChangePH}/>
                            </Form.Group>
    
                            {/* Campo fósforo */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className={fosforoVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Fósforo Extraíble*</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={fosforo}
                                onChange={handleChangeFosforo}/>
                                <Form.Label className='label-derecho'>ppm</Form.Label>
                            </Form.Group>
                                
                            {/* Campo aluminio */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className={unidadAluminioVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Aluminio</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={aluminio} onChange={handleChangeAluminio}/>
                                <Select
                                options={unidades}
                                value={unidadAluminio}
                                onChange={handleChangeUnidadAluminio}>
    
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
                                <Form.Label className={(calcioVacio || unidadVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Calcio*</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={calcio} onChange={handleChangeCalcio}/>
                                <Select
                                options={unidades}
                                value={unidadSeleccionada}
                                onChange={handleChangeUnidad}>
    
                                </Select>
                            </Form.Group> 
    
                            {/* Campo Magnesio */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className={(magnesioVacio || unidadVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Magnesio*</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={magnesio} onChange={handleChangeMagnesio}/>
                                <Select
                                options={unidades}
                                value={unidadSeleccionada}
                                onChange={handleChangeUnidad}>
    
                                </Select>
                            </Form.Group> 
    
                            {/* Campo Sodio */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className={(sodioVacio || unidadVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Sodio*</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={sodio} onChange={handleChangeSodio}/>
                                <Select
                                options={unidades}
                                value={unidadSeleccionada}
                                onChange={handleChangeUnidad}>
    
                                </Select>
                            </Form.Group> 
    
                            {/* Campo Potasio */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className={(potasioVacio || unidadVacio) ? 'label-izquierdo-error' : 'label-izquierdo'}>Potasio*</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={potasio} onChange={handleChangePotasio}/>
                                <Select
                                options={unidades}
                                value={unidadSeleccionada}
                                onChange={handleChangeUnidad}>
    
                                </Select>
                            </Form.Group> 
    
                            {/* Campo Saturación Bases S */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className='label-izquierdo'>Saturación Bases S</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={saturacion} disabled={true}/>
                                <Form.Label className='label-derecho'>
                                    {unidadSeleccionada === undefined ? unidadSeleccionada : unidadSeleccionada.label}
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

                            {/* Campo Azufre */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className={'label-izquierdo'}>Azufre</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={azufre} onChange={handleChangeAzufre}/>
                                <Form.Label className='label-derecho'>ppm</Form.Label>
                            </Form.Group> 

                            {/* Campo Densidad Aparente */}
                            <Form.Group className='mb-3 seccion-form-analisis'>
                                <Form.Label className={densidadVacio ? 'label-izquierdo-error' : 'label-izquierdo'}>Densidad Aparente*</Form.Label>
                                <Form.Control className='input-analisis' type='text' value={densidadAparente} 
                                            onChange={handleChangeDensidadAparente}/>
                                <Select
                                options={unidadesDensidad}
                                value={unidadDensidad}
                                onChange={handleChangeUnidadDensidad}>
    
                                </Select>
                            </Form.Group> 
                        </div>
            
                        {/* Botones Formulario */}
                        <Form.Group className='seccionBotonesFormulario margenTop20 seccion-botones-analisis'>
                            <Button className="botonCancelarFormulario" variant="secondary" onClick={handleCancelar}>
                                Cerrar
                            </Button>
    
                            <Button className="botonConfirmacionFormulario" variant="secondary" type="submit" disabled={estaEnPeticion}>
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

export default AnalisisBasico;