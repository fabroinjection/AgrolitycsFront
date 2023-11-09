// Importar estilos
import '../../components/Analisis.css';
import './AnalisisBasico.css';

// Importar componentes
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import { Button } from "react-bootstrap";
import Error from '../../../../components/Modals/Error/Error';
import Confirm from '../../../../components/Modals/Confirm/Confirm';
import DatePicker from 'react-datepicker';

// Importar utilities
import moment from 'moment';

// Importar hooks
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";

// Importar services
import { registrarNuevoAnalisisBasico, modificarAnalisisBasicoService } from '../../services/analisis.service';
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

    const handleChangePH = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0 && parseFloat(value.replace(",", ".")) <= 14)){setPH(value);}
    }

    const handleChangeFosforo = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setFosforo(value);}
    }

    const handleChangeAluminio = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setAluminio(value);}
    }

    const handleChangeUnidadAluminio = (unidad) => {
        setUnidadAluminio(unidad);
    }

    const handleChangeUnidad = (unidad) => {
        setUnidadSeleccionada(unidad);
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
        if(calcio !== "" && magnesio !== "" && sodio !== "" && potasio !== "" && unidadSeleccionada){
            let calc = parseFloat(calcio.replace(",","."));
            let magn = parseFloat(magnesio.replace(",","."));
            let sod = parseFloat(sodio.replace(",","."));
            let pot = parseFloat(potasio.replace(",","."));
            setSaturacion((calc + magn + sod + pot).toString());
        }
        else{
            setSaturacion("");
        }
    }, [calcio, magnesio, sodio, potasio, unidadSeleccionada, saturacion])

    const handleChangeAzufre = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setAzufre(value);}
    }

    const handleChangeDensidadAparente = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setDensidadAparente(value);}
    }

    const handleChangeUnidadDensidad = (opcion) => {
        setUnidadDensidad(opcion);
    }

    const handleChangeCic = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setCIC(value);}
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

        if(fosforo === "") {
            setFosforoVacio(true);
            setEstaEnPeticion(false);
            return false;
        } else {
            setFosforoVacio(false);
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

        if(densidadAparente === ""){
            setDensidadVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setDensidadVacio(false)
        }

        if(unidadSeleccionada === undefined){
            setUnidadVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setUnidadVacio(false);
        }

        if(unidadCicSeleccionada === undefined){
            setUnidadCicVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setUnidadVacio(false);
        }

        if(unidadDensidad === undefined){
            setUnidadDensidadVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setUnidadDensidadVacio(false);
        }

        if(aluminio !== ""){
            if(unidadAluminio === undefined){
                setUnidadAluminioVacio(true);
                setEstaEnPeticion(false);
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
                    const { data } = await consultarLaboratorio(tomaDeMuestra.id);
                    setLaboratorioAnalisisModificado({label: data[0].nombre, value: data[0].id});
                } catch (error) {
                    if(error.response && error.response.status === 401){
                        try {
                            await renewToken();
                            const { data } = await consultarLaboratorio(tomaDeMuestra.id);
                            setLaboratorioAnalisisModificado({label: data[0].nombre, value: data[0].id});
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
          setRelacionCN((carb / nit).toString());
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
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setFosforoModificacion(value);}
    }

    const handleChangeAluminioModificacion = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setAluminioModificacion(value);}
    }

    const handleChangeCalcioModificacion = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setCalcioModificacion(value);}
    }

    const handleChangeMagnesioModificacion = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setMagnesioModificacion(value);}
    }

    const handleChangeSodioModificacion = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setSodioModificacion(value);}
    }

    const handleChangePotasioModificacion = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setPotasioModificacion(value);}
    }

    useEffect(() => {
        if(calcioModificacion !== "" && magnesioModificacion !== "" && sodioModificacion !== "" 
        && potasioModificacion !== "" && unidadSeleccionada){
            let calc = parseFloat(calcioModificacion.replace(",","."));
            let magn = parseFloat(magnesioModificacion.replace(",","."));
            let sod = parseFloat(sodioModificacion.replace(",","."));
            let pot = parseFloat(potasioModificacion.replace(",","."));
            setSaturacion((calc + magn + sod + pot).toString());
        }
        else{
            setSaturacion("");
        }
    }, [calcioModificacion, magnesioModificacion, sodioModificacion, potasioModificacion, unidadSeleccionada]);

    const handleChangeCicModificacion = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setCicModificacion(value);}
    }

    const handleChangeAzufreModificacion = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setAzufreModificacion(value);}
    }

    const handleChangeDensidadAparenteModificacion = (e) => {
        const { value } = e.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value.replace(",", ".")) >= 0)){setDensidadModificacion(value);}
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

        if (laboratorioAnalisisModificado.value === 0) {
            setLaboratorioVacio(true);
            setEstaEnPeticion(false);
            return false;
        } else {
            setLaboratorioVacio(false);
        }

        if(materiaOrganicaModificacion === ""){
            setMateriaOrganicaVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setMateriaOrganicaVacio(false);
        }

        if (carbonoModificacion === "") {
            setCarbonoVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setCarbonoVacio(false);
        }

        if(nitrogenoModificacion === ""){
            setNitrogenoVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setNitrogenoVacio(false);
        }

        if(pHModificacion === "") {
            setPHVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setPHVacio(false);
        }

        if(fosforoModificacion === "") {
            setFosforoVacio(true);
            setEstaEnPeticion(false);
            return false;
        } else {
            setFosforoVacio(false);
        }

        if(calcioModificacion === "") {
            setCalcioVacio(true);
            setEstaEnPeticion(false);
            return false;
        } else {
            setCalcioVacio(false);
        }

        if (magnesioModificacion === "") {
            setMagnesioVacio(true);
            setEstaEnPeticion(false);
            return false;
        } else {
            setMagnesioVacio(false);
        }

        if(sodioModificacion === "") {
            setSodioVacio(true);
            setEstaEnPeticion(false);
            return false;
        } else {
            setSodioVacio(false);
        }

        if(potasioModificacion === "") {
            setPotasioVacio(true);
            setEstaEnPeticion(false);
            return false;
        } else {
            setPotasioVacio(false);
        }

        if (cicModificacion === "") {
            setCicVacio(true);
            setEstaEnPeticion(false);
            return false;
        } else {
            setCicVacio(false);
        }

        if(densidadModificacion === ""){
            setDensidadVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setDensidadVacio(false)
        }

        if(unidadSeleccionada === undefined){
            setUnidadVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setUnidadVacio(false);
        }

        if(unidadCicSeleccionada === undefined){
            setUnidadCicVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setUnidadVacio(false);
        }

        if(unidadDensidad === undefined){
            setUnidadDensidadVacio(true);
            setEstaEnPeticion(false);
            return false;
        }
        else{
            setUnidadDensidadVacio(false);
        }

        if(aluminioModificacion !== ""){
            if(unidadAluminio === undefined){
                setUnidadAluminioVacio(true);
                setEstaEnPeticion(false);
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

    if (analisisBasico) {
        if(laboratorioAnalisis){
            if (modo === "modificar" && laboratorioAnalisisModificado){
                return(
                    <>                        
                        {/* MODIFICAR ANALISIS BÁSICO */}
                        {/* contenedor */}
                        <div className="contenedorAnalisisCompleto">
            
                            {/* título contenedor */}
                            <div className='contenedorTituloAnalisisCompleto'>
                                <span className='tituloAnalisisCompleto'>Análisis Químico del Suelo - Básico</span> 
                            </div>
            
                            {/* formulario análisis */}
                            <Form className='formularioAnalisisBasico' onSubmit={handleSubmit(modificarAnalisisBasico)}>
            
                                {/* Encabezado análisis */}
                                <div className='encabezado'>
        
                                    {/* Fecha de análisis */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={fechaVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Fecha</Form.Label>
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
                                        <Form.Label className={laboratorioVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Laboratorio</Form.Label>
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
                                        <Form.Control className='inputForm' type='text'
                                        value={materiaOrganicaModificacion} onChange={handleChangeMateriaOrganicaModificacion}/>
                                        <Form.Label className='labelForm'>%</Form.Label>
                                    </Form.Group>
            
                                     {/* campo carbono orgánico */}
                                     <Form.Group className='grupoForm'>
                                        <Form.Label className={carbonoVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Carbono Orgánico</Form.Label>
                                        <Form.Control className='inputForm' type='text'
                                        value={carbonoModificacion} onChange={handleChangeCarbonoModificacion}/>
                                        <Form.Label className='labelForm'>%</Form.Label>
                                    </Form.Group>     
            
                                     {/* campo nitrógeno total */}
                                     <Form.Group className='grupoForm'>
                                        <Form.Label className={nitrogenoVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Nitrógeno Total</Form.Label>
                                        <Form.Control className='inputForm' type='text'
                                        value={nitrogenoModificacion} onChange={handleChangeNitrogenoModificacion}/>
                                        <Form.Label className='labelForm'>%</Form.Label>
                                    </Form.Group>          
            
                                     {/* campo relación C/N */}
                                     <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Relación C/N</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={relacionCN} disabled={true}/>
                                    </Form.Group>           
             
            
                                    {/* Campo pH */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={pHVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>pH</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={pHModificacion}
                                        onChange={handleChangePHModificacion}/>
                                    </Form.Group>
            
                                    {/* Campo fósforo */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={fosforoVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Fósforo Extraíble</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={fosforoModificacion}
                                        onChange={handleChangeFosforoModificacion}/>
                                        <Form.Label className='labelForm'>ppm</Form.Label>
                                    </Form.Group>
                                        
                                    {/* Campo aluminio */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={'labelFormIzquierdo'}>Aluminio</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={aluminioModificacion} 
                                        onChange={handleChangeAluminioModificacion}/>
                                        <Select className='selectForm'
                                        options={unidades}
                                        value={unidadAluminio}
                                        onChange={handleChangeUnidadAluminio}>
            
                                        </Select>
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
                                        <Form.Control className='inputForm' type='text' value={calcioModificacion} 
                                        onChange={handleChangeCalcioModificacion}/>
                                        <Select className='selectForm'
                                        options={unidades}
                                        value={unidadSeleccionada}
                                        onChange={handleChangeUnidad}>
            
                                        </Select>
                                    </Form.Group> 
            
                                    {/* Campo Magnesio */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={magnesioVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Magnesio</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={magnesioModificacion} 
                                        onChange={handleChangeMagnesioModificacion}/>
                                        <Select className='selectForm'
                                        options={unidades}
                                        value={unidadSeleccionada}
                                        onChange={handleChangeUnidad}>
            
                                        </Select>
                                    </Form.Group> 
            
                                    {/* Campo Sodio */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={sodioVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Sodio</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={sodioModificacion} 
                                        onChange={handleChangeSodioModificacion}/>
                                        <Select className='selectForm'
                                        options={unidades}
                                        value={unidadSeleccionada}
                                        onChange={handleChangeUnidad}>
            
                                        </Select>
                                    </Form.Group> 
            
                                    {/* Campo Potasio */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={potasioVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Potasio</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={potasioModificacion} 
                                        onChange={handleChangePotasioModificacion}/>
                                        <Select className='selectForm'
                                        options={unidades}
                                        value={unidadSeleccionada}
                                        onChange={handleChangeUnidad}>
            
                                        </Select>
                                    </Form.Group> 
            
                                    {/* Campo Saturación Bases S */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Saturación Bases S</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={saturacion} disabled={true}/>
                                        <Form.Label className='labelForm'>
                                            {unidadSeleccionada === undefined ? unidadSeleccionada : unidadSeleccionada.label}
                                        </Form.Label>
                                    </Form.Group> 
        
                                    {/* Campo CIC */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={cicVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>CIC</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={cicModificacion}
                                        onChange={handleChangeCicModificacion}/>
                                        <Select className='selectForm'
                                        options={unidadesCIC}
                                        value={unidadCicSeleccionada}
                                        onChange={handleChangeUnidadCic}>
            
                                        </Select>
                                    </Form.Group> 
        
                                    {/* Campo Azufre */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={'labelFormIzquierdo'}>Azufre</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={azufreModificacion} 
                                        onChange={handleChangeAzufreModificacion}/>
                                        <Form.Label className='labelForm'>ppm</Form.Label>
                                    </Form.Group> 
        
                                    {/* Campo Densidad Aparente */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={densidadVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Densidad Aparente</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={densidadModificacion} 
                                                    onChange={handleChangeDensidadAparenteModificacion}/>
                                        <Select className='selectForm'
                                        options={unidadesDensidad}
                                        value={unidadDensidad}
                                        onChange={handleChangeUnidadDensidad}>
            
                                        </Select>
                                    </Form.Group> 
            
            
                                    {/* Mensaje de Faltan Campos */}
                                    <Form.Group className='grupoForm'>
                                        {fechaVacio && <Form.Label className='labelFormError'>*Debe seleccionar una fecha</Form.Label>}
                                        {laboratorioVacio && <Form.Label className='labelFormError'>*Debe seleccionar un laboratorio</Form.Label>}
                                        {(materiaOrganicaVacio || carbonoVacio || nitrogenoVacio || pHVacio || fosforoVacio || calcioVacio
                                        || magnesioVacio || sodioVacio || potasioVacio || cicVacio || densidadVacio) && <Form.Label className='labelFormError'>*Los campos en rojo no están completos</Form.Label>}
                                        {unidadVacio && <Form.Label className='labelFormError'>*Debe seleccionar una unidad</Form.Label>}
                                        {unidadCicVacio && <Form.Label className='labelFormError'>*Debe seleccionar una unidad para el CIC</Form.Label>}
                                        {unidadDensidadVacio && <Form.Label className='labelFormError'>*Debe seleccionar una unidad para la densidad</Form.Label>}
                                        {unidadAluminioVacio && <Form.Label className='labelFormError'>*Debe seleccionar una unidad para el aluminio</Form.Label>}
                                    </Form.Group> 
            
                                </div>
            
                                {/* Botones formulario */}
                                <div className="botonesFormAnalisis botonesFormAnalisisBasico">
                                    <Button className="estiloBotonesFormAnalisis btnCancelarAnalisis" variant="secondary" onClick={handleCancelarEdicion}>
                                        Cancelar
                                    </Button>
            
                                    <Button className="estiloBotonesFormAnalisis btnConfirmarAnalisis" variant="secondary" type="submit" disabled={estaEnPeticion}>
                                        Aceptar
                                    </Button>                    
                                </div>
            
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
                    </>
                );
            }
            else{
                return(
                    <>
                        {/* CONSULTAR ANALISIS BÁSICO */}
                        {/* contenedor */}
                        <div className="contenedorAnalisisCompleto">
        
                            {/* título contenedor */}
                            <div className='contenedorTituloAnalisisCompleto'>
                                <span className='tituloAnalisisCompleto'>Análisis Químico del Suelo - Básico</span> 
                            </div>
        
                            {/* formulario análisis */}
                            <Form className='formularioAnalisisBasico'>
        
                                {/* Encabezado análisis */}
                                <div className='encabezado'>
        
                                    {/* Fecha de análisis */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormEncabezado'>Fecha</Form.Label>
                                        <DatePicker 
                                        className='fechaAnalisis'
                                        value={moment(analisisBasico.fecha_analisis).format('DD/MM/YYYY')}
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
                                        <Form.Label className={materiaOrganicaVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Materia Orgánica</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={analisisBasico.materia_organica} disabled={true}/>
                                        <Form.Label className='labelForm'>%</Form.Label>
                                    </Form.Group>
        
                                    {/* campo carbono orgánico */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={carbonoVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Carbono Orgánico</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={analisisBasico.carbono_organico} disabled={true}/>
                                        <Form.Label className='labelForm'>%</Form.Label>
                                    </Form.Group>     
        
                                    {/* campo nitrógeno total */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={nitrogenoVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Nitrógeno Total</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={analisisBasico.nitrogeno_total} disabled={true}/>
                                        <Form.Label className='labelForm'>%</Form.Label>
                                    </Form.Group>          
        
                                    {/* campo relación C/N */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Relación C/N</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={analisisBasico.carbono_organico / analisisBasico.nitrogeno_total} disabled={true}/>
                                    </Form.Group>           
            
        
                                    {/* Campo pH */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={pHVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>pH</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={analisisBasico.ph} disabled={true}/>
                                    </Form.Group>
        
                                    {/* Campo fósforo */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={fosforoVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Fósforo Extraíble</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={analisisBasico.fosforo_extraible} disabled={true}/>
                                        <Form.Label className='labelForm'>ppm</Form.Label>
                                    </Form.Group>
        
                                    {/* Campo Aluminio */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={fosforoVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Aluminio</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={analisisBasico.aluminio === null ? "" : analisisBasico.aluminio} 
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
                                        <Form.Control className='inputForm' type='text' value={analisisBasico.calcio} disabled={true}/>
                                        <Form.Label className='labelForm'>ppm</Form.Label>
                                    </Form.Group> 
        
                                    {/* Campo Magnesio */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={magnesioVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Magnesio</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={analisisBasico.magnesio} disabled={true}/>
                                        <Form.Label className='labelForm'>ppm</Form.Label>
                                    </Form.Group> 
        
                                    {/* Campo Sodio */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={sodioVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Sodio</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={analisisBasico.sodio} disabled={true}/>
                                        <Form.Label className='labelForm'>ppm</Form.Label>
                                    </Form.Group> 
        
                                    {/* Campo Potasio */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={potasioVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Potasio</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={analisisBasico.potasio} disabled={true}/>
                                        <Form.Label className='labelForm'>ppm</Form.Label>
                                    </Form.Group> 
        
                                    {/* Campo Saturación Bases S */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Saturación Bases S</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={analisisBasico.calcio + analisisBasico.magnesio + analisisBasico.sodio + analisisBasico.potasio} 
                                        disabled={true}/>
                                        <Form.Label className='labelForm'>ppm</Form.Label>
                                    </Form.Group> 
        
                                    {/* Campo CIC */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className={cicVacio ? 'labelFormIzquierdoError' :'labelFormIzquierdo'}>CIC</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={analisisBasico.capacidad_intercambio_cationica === null ? "" : analisisBasico.capacidad_intercambio_cationica}
                                        disabled={true}/>
                                        <Form.Label className='labelForm'>meq/100g</Form.Label>
                                    </Form.Group> 
                                    
                                    {/* Campo Azufre */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Azufre</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={analisisBasico.azufre === null ? "" : analisisBasico.azufre}
                                        disabled={true}/>
                                        <Form.Label className='labelForm'>ppm</Form.Label>
                                    </Form.Group> 
        
                                    {/* Campo Densidad Aparente */}
                                    <Form.Group className='grupoForm'>
                                        <Form.Label className='labelFormIzquierdo'>Densidad Aparente</Form.Label>
                                        <Form.Control className='inputForm' type='text' value={analisisBasico.densidad_aparente} 
                                        disabled={true}/>
                                        <Form.Label className='labelForm'>ppm</Form.Label>
                                    </Form.Group>
        
                                </div>
        
                                {/* Botones formulario */}
                                <div className="botonesFormAnalisis botonesFormAnalisisBasico">
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
                            mostrarErrorVencimientoToken &&
                            <Error texto={"Su sesión ha expirado"} 
                            onConfirm={handleSesionExpirada}/>
                        }  

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
    else if (laboratorios !== undefined){
        return(
            <>
                {/* REGISTRAR ANALISIS BÁSICO */}
                {/* contenedor */}
                <div className="contenedorAnalisisCompleto">
    
                    {/* título contenedor */}
                    <div className='contenedorTituloAnalisisCompleto'>
                        <span className='tituloAnalisisCompleto'>Análisis Químico del Suelo - Básico</span> 
                    </div>
    
                    {/* formulario análisis */}
                    <Form className='formularioAnalisisBasico' onSubmit={handleSubmit(registrarAnalisisBasico)}>
    
                        {/* Encabezado análisis */}
                        <div className='encabezado'>

                            {/* Fecha de análisis */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className={fechaVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Fecha</Form.Label>
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
                                <Form.Label className={laboratorioVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Laboratorio</Form.Label>
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
     
    
                            {/* Campo pH */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className={pHVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>pH</Form.Label>
                                <Form.Control className='inputForm' type='text' value={pH}
                                onChange={handleChangePH}/>
                            </Form.Group>
    
                            {/* Campo fósforo */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className={fosforoVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Fósforo Extraíble</Form.Label>
                                <Form.Control className='inputForm' type='text' value={fosforo}
                                onChange={handleChangeFosforo}/>
                                <Form.Label className='labelForm'>ppm</Form.Label>
                            </Form.Group>
                                
                            {/* Campo aluminio */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className={'labelFormIzquierdo'}>Aluminio</Form.Label>
                                <Form.Control className='inputForm' type='text' value={aluminio} onChange={handleChangeAluminio}/>
                                <Select className='selectForm'
                                options={unidades}
                                value={unidadAluminio}
                                onChange={handleChangeUnidadAluminio}>
    
                                </Select>
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
                                options={unidades}
                                value={unidadSeleccionada}
                                onChange={handleChangeUnidad}>
    
                                </Select>
                            </Form.Group> 
    
                            {/* Campo Magnesio */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className={magnesioVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Magnesio</Form.Label>
                                <Form.Control className='inputForm' type='text' value={magnesio} onChange={handleChangeMagnesio}/>
                                <Select className='selectForm'
                                options={unidades}
                                value={unidadSeleccionada}
                                onChange={handleChangeUnidad}>
    
                                </Select>
                            </Form.Group> 
    
                            {/* Campo Sodio */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className={sodioVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Sodio</Form.Label>
                                <Form.Control className='inputForm' type='text' value={sodio} onChange={handleChangeSodio}/>
                                <Select className='selectForm'
                                options={unidades}
                                value={unidadSeleccionada}
                                onChange={handleChangeUnidad}>
    
                                </Select>
                            </Form.Group> 
    
                            {/* Campo Potasio */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className={potasioVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Potasio</Form.Label>
                                <Form.Control className='inputForm' type='text' value={potasio} onChange={handleChangePotasio}/>
                                <Select className='selectForm'
                                options={unidades}
                                value={unidadSeleccionada}
                                onChange={handleChangeUnidad}>
    
                                </Select>
                            </Form.Group> 
    
                            {/* Campo Saturación Bases S */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className='labelFormIzquierdo'>Saturación Bases S</Form.Label>
                                <Form.Control className='inputForm' type='text' value={saturacion} disabled={true}/>
                                <Form.Label className='labelForm'>
                                    {unidadSeleccionada === undefined ? unidadSeleccionada : unidadSeleccionada.label}
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

                            {/* Campo Azufre */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className={'labelFormIzquierdo'}>Azufre</Form.Label>
                                <Form.Control className='inputForm' type='text' value={azufre} onChange={handleChangeAzufre}/>
                                <Form.Label className='labelForm'>ppm</Form.Label>
                            </Form.Group> 

                            {/* Campo Densidad Aparente */}
                            <Form.Group className='grupoForm'>
                                <Form.Label className={densidadVacio ? 'labelFormIzquierdoError' : 'labelFormIzquierdo'}>Densidad Aparente</Form.Label>
                                <Form.Control className='inputForm' type='text' value={densidadAparente} 
                                            onChange={handleChangeDensidadAparente}/>
                                <Select className='selectForm'
                                options={unidadesDensidad}
                                value={unidadDensidad}
                                onChange={handleChangeUnidadDensidad}>
    
                                </Select>
                            </Form.Group> 
    
    
                            {/* Mensaje de Faltan Campos */}
                            <Form.Group className='grupoForm'>
                                {fechaVacio && <Form.Label className='labelFormError'>*Debe seleccionar una fecha</Form.Label>}
                                {laboratorioVacio && <Form.Label className='labelFormError'>*Debe seleccionar un laboratorio</Form.Label>}
                                {(materiaOrganicaVacio || carbonoVacio || nitrogenoVacio || pHVacio || fosforoVacio || calcioVacio
                                || magnesioVacio || sodioVacio || potasioVacio || cicVacio || densidadVacio) && <Form.Label className='labelFormError'>*Los campos en rojo no están completos</Form.Label>}
                                {unidadVacio && <Form.Label className='labelFormError'>*Debe seleccionar una unidad</Form.Label>}
                                {unidadCicVacio && <Form.Label className='labelFormError'>*Debe seleccionar una unidad para el CIC</Form.Label>}
                                {unidadDensidadVacio && <Form.Label className='labelFormError'>*Debe seleccionar una unidad para la densidad</Form.Label>}
                                {unidadAluminioVacio && <Form.Label className='labelFormError'>*Debe seleccionar una unidad para el aluminio</Form.Label>}
                            </Form.Group> 
    
                        </div>
    
                        {/* Botones formulario */}
                        <div className="botonesFormAnalisis botonesFormAnalisisBasico">
                            <Button className="estiloBotonesFormAnalisis btnCancelarAnalisis" variant="secondary" onClick={handleCancelar}>
                                Cancelar
                            </Button>
    
                            <Button className="estiloBotonesFormAnalisis btnConfirmarAnalisis" variant="secondary" type="submit" disabled={estaEnPeticion}>
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
            <>
                <div>Cargando...</div>
            </>
            
        )
    }

    
}

export default AnalisisBasico;