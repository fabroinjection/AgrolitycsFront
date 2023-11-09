import PDFRotulo from "../../../../components/PDF/PDFRotulo";
import { PDFViewer } from "@react-pdf/renderer";
import PDFSubmuestras from "../../../../components/PDF/PDFSubmuestras";
import PDFDiagnosticoSuelo from "../../../../components/PDF/PDFDiagnosticoSuelo";
import PDFDiagnosticoAgua from "../../../../components/PDF/PDFDiagnosticoAgua";
import Error from "../../../../components/Modals/Error/Error";
import NoLogueado from "../../../../components/Modals/NoLogueado/NoLogueado";
import Cookies from "js-cookie";

//import hooks
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

//import context
import { ModoPDFContext } from "../../../../context/ModoPDFContext";
import { IdDiagnosticoContext } from "../../../../context/IdDiagnosticoContext";

//import services
import { datosRotuloService, datosCampoPDFService } from "../../services/pdf.service";
import { renewToken } from "../../../../services/token.service";
import { getAnalisisService } from "../../../../services/getanalisis.service";
import { diagnosticoService, interpretacionBasicoYCompletoService, interpretacionAguaUtilService } from "../../services/diagnostico.service";
import { consultarDiagnosticoService } from "../../services/diagnostico.service";
import { getCultivoService } from "../../../../services/diagnosticos.service";
import moment from "moment";

function VisorPDF({ imagen = null }) {

    //estados para las alertas
    const [alertaNoLogueado, setAlertaNoLogueado] = useState(false);
    const [alertaPdfNoSeleccionado, setAlertaPdfNoSeleccionado] = useState(false);
    const [mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken] = useState(false);

    let navigate = useNavigate();
    const { idTomaMuestra } = useParams();
    const [modoPDF] = useContext(ModoPDFContext);
    const [ datosPDF, setDatosPDF ] = useState();

    //contexto para tomar el id del diagnóstico para la consulta de un diagnóstico
    const [ idDiagnostico, setIdDiagnostico ] = useContext(IdDiagnosticoContext);

    //variable para guardar el análisis cuando el pdf es de diagnóstico
    const [ analisis, setAnalisis ] = useState();
    const [ interpretacion, setInterpretacion ] = useState();
    const [ diagnostico, setDiagnostico ] = useState();
    const [ datosCampoPDF, setDatosCampoPDF ] = useState();
    const [ cultivoASembrar, setCultivoASembrar ] = useState();

    useEffect( () => {
        const usuario = Cookies.get('username')
        if(usuario && modoPDF === undefined){
            setAlertaPdfNoSeleccionado(true);
        }
        else{
            setAlertaNoLogueado(true);
        }
    }, [modoPDF])


    useEffect(()=>{
        if(idTomaMuestra & modoPDF === 'rotulo'){
            const fetchRotulo = async () => {
                try {
                    const { data } = await datosRotuloService(idTomaMuestra);
                    setDatosPDF(data);
                } catch (error) {
                    if(error.response && error.response.status === 401){
                        try {
                          renewToken();
                          const { data } = await datosRotuloService(idTomaMuestra);
                          setDatosPDF(data);
                        } catch (error) {
                          if(error.response && error.response.status === 401){
                            setMostrarErrorVencimientoToken(true);
                          }
                        }
                      }   
                }
                
            }
            fetchRotulo();
        }
        
    },[idTomaMuestra, modoPDF])

    useEffect(() => {
        if(idTomaMuestra && (modoPDF === 'diagnostico' || modoPDF === 'consulta diagnostico')){
            const fetchAnalisis = async () => {
                try {
                    const { data } = await getAnalisisService(idTomaMuestra);
                    setAnalisis(data);
                } catch (error) {
                    if(error.response && error.response.status === 401){
                        try {
                            renewToken();
                            const { data } = await getAnalisisService(idTomaMuestra);
                            setAnalisis(data);
                        } catch (error) {
                            if(error.response && error.response.status === 401){
                                setMostrarErrorVencimientoToken(true);
                              }
                        }
                    }

                }
            }
            fetchAnalisis();
        }
    }, [idTomaMuestra, modoPDF])

    useEffect(() => {
        if(idTomaMuestra && modoPDF === 'diagnostico' && analisis){
            if(analisis[0].cloruros === null){
                const fetchDiagnostico = async () => {
                    try {
                        const cultivo = await getCultivoService(Cookies.get("Cultivo"));
                        setCultivoASembrar(cultivo.data);
                        const campo = await datosCampoPDFService(idTomaMuestra);
                        const campoAdaptadoAPDF = {
                            Campo_localidad: campo.data.Campo_localidad,
                            Campo_nombre: campo.data.Campo_nombre,
                            Campo_provincia: campo.data.Campo_provincia,
                            Diagnostico_fechaAlta: moment(campo.data.Diagnostico_fechaAlta).format("DD/MM/YYYY"),
                            Lote_nombre: campo.data.Lote_nombre,
                            Lote_tamaño: campo.data.Lote_tamaño,
                            TomaDeMuestra_codigo: campo.data.TomaDeMuestra_codigo
                        }
                        setDatosCampoPDF(campoAdaptadoAPDF);
                        const interc = await interpretacionBasicoYCompletoService(analisis[0].id);
                        setInterpretacion(interc.data);
                        const diag = await diagnosticoService(analisis[0].id, Cookies.get("Rendimiento"), Cookies.get("Cultivo"));
                        setDiagnostico(diag.data);
                    } catch (error) {
                        if(error.response && error.response.status === 401){
                            try {
                                renewToken();
                                const cultivo = await getCultivoService(Cookies.get("Cultivo"));
                                setCultivoASembrar(cultivo.data);
                                const campo = await datosCampoPDFService(idTomaMuestra);
                                const campoAdaptadoAPDF = {
                                    Campo_localidad: campo.data.Campo_localidad,
                                    Campo_nombre: campo.data.Campo_nombre,
                                    Campo_provincia: campo.data.Campo_provincia,
                                    Diagnostico_fechaAlta: moment(campo.data.Diagnostico_fechaAlta).format("DD/MM/YYYY"),
                                    Lote_nombre: campo.data.Lote_nombre,
                                    Lote_tamaño: campo.data.Lote_tamaño,
                                    TomaDeMuestra_codigo: campo.data.TomaDeMuestra_codigo
                                }
                                setDatosCampoPDF(campoAdaptadoAPDF);
                                const interc = await interpretacionBasicoYCompletoService(analisis[0].id);
                                setInterpretacion(interc.data);
                                const diag = await diagnosticoService(analisis[0].id, Cookies.get("Rendimiento"), Cookies.get("Cultivo"));
                                setDiagnostico(diag.data);
                            } catch (error) {
                                if(error.response && error.response.status === 401){
                                    setMostrarErrorVencimientoToken(true);
                                  }
                            }
                        }

                    }
                }
                fetchDiagnostico();
            }
            else{
                const fetchInterpretacionAguaUtil = async () => {
                    try {
                        const campo = await datosCampoPDFService(idTomaMuestra);
                        const campoAdaptadoAPDF = {
                            Campo_localidad: campo.data.Campo_localidad,
                            Campo_nombre: campo.data.Campo_nombre,
                            Campo_provincia: campo.data.Campo_provincia,
                            Diagnostico_fechaAlta: moment(campo.data.Diagnostico_fechaAlta).format("DD/MM/YYYY"),
                            Lote_nombre: campo.data.Lote_nombre,
                            Lote_tamaño: campo.data.Lote_tamaño,
                            TomaDeMuestra_codigo: campo.data.TomaDeMuestra_codigo
                        }
                        setDatosCampoPDF(campoAdaptadoAPDF);
                        const { data } = await interpretacionAguaUtilService(analisis[0].id);
                        setInterpretacion(data);
                    } catch (error) {
                        if(error.response && error.response.status === 401){
                            try {
                                renewToken();
                                const campo = await datosCampoPDFService(idTomaMuestra);
                                const campoAdaptadoAPDF = {
                                    Campo_localidad: campo.data.Campo_localidad,
                                    Campo_nombre: campo.data.Campo_nombre,
                                    Campo_provincia: campo.data.Campo_provincia,
                                    Diagnostico_fechaAlta: moment(campo.data.Diagnostico_fechaAlta).format("DD/MM/YYYY"),
                                    Lote_nombre: campo.data.Lote_nombre,
                                    Lote_tamaño: campo.data.Lote_tamaño,
                                    TomaDeMuestra_codigo: campo.data.TomaDeMuestra_codigo
                                }
                                setDatosCampoPDF(campoAdaptadoAPDF);
                                const { data } = await interpretacionAguaUtilService(analisis[0].id);
                                setInterpretacion(data);
                            } catch (error) {
                                if(error.response && error.response.status === 401){
                                    setMostrarErrorVencimientoToken(true);
                                  }
                            }
                        }

                    }
                }
                fetchInterpretacionAguaUtil();
            }
        }
    }, [idTomaMuestra, modoPDF, analisis])

    useEffect(() => {
        if(idTomaMuestra && modoPDF === 'consulta diagnostico' && analisis && idDiagnostico){
            const fetchDiagnostico = async () => {
                try {
                    const cultivo = await getCultivoService(Cookies.get("Cultivo"));
                    setCultivoASembrar(cultivo.data);
                    const campo = await datosCampoPDFService(idTomaMuestra);
                    const campoAdaptadoAPDF = {
                        Campo_localidad: campo.data.Campo_localidad,
                        Campo_nombre: campo.data.Campo_nombre,
                        Campo_provincia: campo.data.Campo_provincia,
                        Diagnostico_fechaAlta: moment(campo.data.Diagnostico_fechaAlta).format("DD/MM/YYYY"),
                        Lote_nombre: campo.data.Lote_nombre,
                        Lote_tamaño: campo.data.Lote_tamaño,
                        TomaDeMuestra_codigo: campo.data.TomaDeMuestra_codigo
                    }
                    setDatosCampoPDF(campoAdaptadoAPDF);
                    const interc = await interpretacionBasicoYCompletoService(analisis[0].id);
                    setInterpretacion(interc.data);
                    const diagn = await consultarDiagnosticoService(analisis[0].id, idDiagnostico);
                    setDiagnostico(diagn.data);
                } catch (error) {
                    if(error.response && error.response.status === 401){
                        try {
                            renewToken();
                            const campo = await datosCampoPDFService(idTomaMuestra);
                            const campoAdaptadoAPDF = {
                                Campo_localidad: campo.data.Campo_localidad,
                                Campo_nombre: campo.data.Campo_nombre,
                                Campo_provincia: campo.data.Campo_provincia,
                                Diagnostico_fechaAlta: moment(campo.data.Diagnostico_fechaAlta).format("DD/MM/YYYY"),
                                Lote_nombre: campo.data.Lote_nombre,
                                Lote_tamaño: campo.data.Lote_tamaño,
                                TomaDeMuestra_codigo: campo.data.TomaDeMuestra_codigo
                            }
                            setDatosCampoPDF(campoAdaptadoAPDF);
                            const interc = await interpretacionBasicoYCompletoService(analisis[0].id);
                            setInterpretacion(interc.data);
                            const diagn = await consultarDiagnosticoService(analisis[0].id, idDiagnostico);
                            setDiagnostico(diagn.data);
                        } catch (error) {
                            if(error.response && error.response.status === 401){
                                setMostrarErrorVencimientoToken(true);
                            }
                            else{
                                console.log("ERROR: ", error);
                            }
                        }
                    }
                }
            }
            fetchDiagnostico();
        }
    }, [idTomaMuestra, analisis, modoPDF, idDiagnostico])

    const handlePdfNoSeleccionado = () => {
        setAlertaPdfNoSeleccionado(false);
        navigate("/home");
    }

    const handleSesionExpirada = () =>{
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
      }

    if (modoPDF === 'rotulo') {
        return(
            <>
            {datosPDF === undefined ? <div>Cargando...</div> : 
                <PDFViewer style={{width:"100%", height:"100vh"}}>
                    <PDFRotulo datos={datosPDF}>
        
                    </PDFRotulo>
                </PDFViewer>
            }

            {
                mostrarErrorVencimientoToken &&
                <Error texto={"Su sesión ha expirado"} 
                onConfirm={handleSesionExpirada}/>
            } 
            </>
        )
    }
    else if (modoPDF === 'submuestra') {
        return(
            <>
            <PDFViewer style={{width:"100%", height:"100vh"}}>
                <PDFSubmuestras imagen={imagen}>
    
                </PDFSubmuestras>
            </PDFViewer>
            {
                mostrarErrorVencimientoToken &&
                <Error texto={"Su sesión ha expirado"} 
                onConfirm={handleSesionExpirada}/>
            } 
            </>
        );

        
    }
    else if (modoPDF === 'diagnostico'){
        return(
            <>
                {analisis === undefined ? <div>Cargando...</div> 
                 :
                    interpretacion === undefined ? <div>Cargando...</div>
                    : 
                        diagnostico !== undefined ?
                            <PDFViewer style={{width:"100%", height:"100vh"}}>
                                <PDFDiagnosticoSuelo interpretacion={interpretacion} diagnostico={diagnostico} 
                                datosLote={datosCampoPDF} cultivo={cultivoASembrar}>
    
                                </PDFDiagnosticoSuelo>
                            </PDFViewer>
                        :
                            <PDFViewer style={{width:"100%", height:"100vh"}}>
                                <PDFDiagnosticoAgua interpretacion={interpretacion} datosLote={datosCampoPDF}>
    
                                </PDFDiagnosticoAgua>
                            </PDFViewer>
                }
            </>
        )

    }
    else if (modoPDF === 'consulta diagnostico'){
        return(
            <>
                {analisis === undefined ? <div>Cargando...</div> 
                    :
                        interpretacion === undefined ? <div>Cargando...</div>
                        : 
                            diagnostico === undefined ? <div>Cargando...</div>
                            :
                                <>
                                    {console.log("Análisis: ", analisis[0])}
                                    {console.log("Interpretación: ", interpretacion)}
                                    {console.log("Diagnóstico: ", diagnostico)}
                                    {console.log(cultivoASembrar)}
                                    {console.log(datosCampoPDF)}
                                    <PDFViewer style={{width:"100%", height:"100vh"}}>
                                        <PDFDiagnosticoSuelo interpretacion={interpretacion} diagnostico={diagnostico} 
                                        datosLote={datosCampoPDF} cultivo={cultivoASembrar}>
            
                                        </PDFDiagnosticoSuelo>
                                    </PDFViewer>
                                </>
                }
            </>
        )
    }
    else{
        return(
            <>
                {alertaPdfNoSeleccionado && <Error texto={"No hay un pdf seleccionado"} onConfirm={handlePdfNoSeleccionado}/>}
                {alertaNoLogueado && <NoLogueado/>}
            </>
            
        )
        
    }

}

export default VisorPDF;

