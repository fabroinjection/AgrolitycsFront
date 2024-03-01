
//import hooks
import React, { Suspense, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PDFRotulo from "../../../../components/PDF/PDFRotulo";
import { PDFViewer } from "@react-pdf/renderer";
import PDFSubmuestras from "../../../../components/PDF/PDFSubmuestras";
import PDFDiagnosticoSuelo from "../../../../components/PDF/PDFDiagnosticoSuelo";
import PDFDiagnosticoAgua from "../../../../components/PDF/PDFDiagnosticoAgua";
import Error from "../../../../components/Modals/Error/Error";
import NoLogueado from "../../../../components/Modals/NoLogueado/NoLogueado";
import Cookies from "js-cookie";
import SpinnerAgrolitycs from "../../../../components/Spinner/SpinnerAgrolitycs";

//import context
import { ModoPDFContext } from "../../../../context/ModoPDFContext";
import { IdDiagnosticoContext } from "../../../../context/IdDiagnosticoContext";

//import services
import { datosRotuloService } from "../../services/pdf.service";
import { datosCampoPDFService } from "../../../../services/toma_muestra.service";
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

    // estados para mostrar errores
    const [mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken] = useState(false);
    const [ usuarioNoEncontrado, setUsuarioNoEncontrado ] = useState(false);
    const [ tomaMuestraNoEncontrada, setTomaMuestraNoEncontrada ] = useState(false);
    const [ loteNoEncontrado, setLoteNoEncontrado ] = useState(false);
    const [ campoNoEncontrado, setCampoNoEncontrado ] = useState(false);
    const [ productorNoEncontrado, setProductorNoEncontrado ] = useState(false);
    const [ localidadNoEncontrada, setLocalidadNoEncontrada ] = useState(false);
    const [ provinciaNoEncontrada, setProvinciaNoEncontrada ] = useState(false);
    const [ tipoAnalisisNoEncontrado, setTipoAnalisisNoEncontrado ] = useState(false);
    const [ profundidadNoEncontrada, setProfundidadNoEncontrada ] = useState(false);
    const [ perfilNoEncontrado, setPerfilNoEncontrado ] = useState(false);
    const [ tipoMuestreoNoEncontrado, setTipoMuestreoNoEncontrado ] = useState(false);
    const [ errorInesperado, setErrorInesperado ] = useState(false);


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
        if(idTomaMuestra && modoPDF === 'rotulo'){
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
                          else if (error.response && error.response.status === 404) {
                            setUsuarioNoEncontrado(true);
                          }
                          else if (error.response && error.response.status === 405) {
                            setTomaMuestraNoEncontrada(true);
                          }
                          else if (error.response && error.response.status === 406) {
                            setLoteNoEncontrado(true);
                          }
                          else if (error.response && error.response.status === 407) {
                            setCampoNoEncontrado(true);
                          }
                          else if (error.response && error.response.status === 408) {
                            setProductorNoEncontrado(true);
                          }
                          else if (error.response && error.response.status === 409) {
                            setLocalidadNoEncontrada(true);
                          }
                          else if (error.response && error.response.status === 410) {
                            setProvinciaNoEncontrada(true);
                          }
                          else if (error.response && error.response.status === 411) {
                            setTipoAnalisisNoEncontrado(true);
                          }
                          else if (error.response && error.response.status === 412) {
                            setProfundidadNoEncontrada(true);
                          }
                          else if (error.response && error.response.status === 413) {
                            setPerfilNoEncontrado(true);
                          }
                          else if (error.response && error.response.status === 414) {
                            setTipoMuestreoNoEncontrado(true);
                          }
                          else {
                            setErrorInesperado(true);
                          }
                        }
                      }
                      else if (error.response && error.response.status === 404) {
                        setUsuarioNoEncontrado(true);
                      }
                      else if (error.response && error.response.status === 405) {
                        setTomaMuestraNoEncontrada(true);
                      }
                      else if (error.response && error.response.status === 406) {
                        setLoteNoEncontrado(true);
                      }
                      else if (error.response && error.response.status === 407) {
                        setCampoNoEncontrado(true);
                      }
                      else if (error.response && error.response.status === 408) {
                        setProductorNoEncontrado(true);
                      }
                      else if (error.response && error.response.status === 409) {
                        setLocalidadNoEncontrada(true);
                      }
                      else if (error.response && error.response.status === 410) {
                        setProvinciaNoEncontrada(true);
                      }
                      else if (error.response && error.response.status === 411) {
                        setTipoAnalisisNoEncontrado(true);
                      }
                      else if (error.response && error.response.status === 412) {
                        setProfundidadNoEncontrada(true);
                      }
                      else if (error.response && error.response.status === 413) {
                        setPerfilNoEncontrado(true);
                      }
                      else if (error.response && error.response.status === 414) {
                        setTipoMuestreoNoEncontrado(true);
                      }
                      else {
                        setErrorInesperado(true);
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
                              } else {
                                setErrorInesperado(true);
                              }
                        }
                    } else {
                        setErrorInesperado(true);
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
                                  } else {
                                    setErrorInesperado(true);
                                  }
                            }
                        } else {
                            setErrorInesperado(true);
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
                                  } else {
                                    setErrorInesperado(true);
                                  }
                            }
                        } else {
                            setErrorInesperado(true);
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
                                setErrorInesperado(true);
                            }
                        }
                    } else {
                        setErrorInesperado(true);
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

    const handleErrorUsuarioNoEncontrado = () => {
        setUsuarioNoEncontrado(false);
        navigate("/home");
    }
    
    const handleErrorTomaMuestraNoEncontrada = () => {
        setTomaMuestraNoEncontrada(false);
        navigate("home");
    }

    const handleErrorLoteNoEncontrado = () => {
        setLoteNoEncontrado(false);
        navigate("/home");
    }

    const handleErrorCampoNoEncontrado = () => {
        setCampoNoEncontrado(false);
        navigate("/home");
    }

    const handleErrorProductorNoEncontrado = () => {
        setProductorNoEncontrado(false);
        navigate("/home");
    }

    const handleErrorLocalidadNoEncontrada = () => {
        setLocalidadNoEncontrada(false);
        navigate("/home");
    }

    const handleErrorProvinciaNoEncontrada = () => {
        setProvinciaNoEncontrada(false);
        navigate("/home");
    }

    const handleErrorProfundidadNoEncontrada = () => {
        setProfundidadNoEncontrada(false);
        navigate("/home");
    }

    const handleErrorPerfilNoEncontrado = () => {
        setPerfilNoEncontrado(false);
        navigate("/home");
    }

    const handleErrorTipoMuestreoNoEncontrado = () => {
        setTipoMuestreoNoEncontrado(false);
        navigate("/home");
    }

    const handleErrorInesperado = () => {
        setErrorInesperado(false);
        navigate("/home");
    }

    if (modoPDF === 'rotulo') {
        return(
            <>
            {datosPDF === undefined ? (
            <SpinnerAgrolitycs />
            ) : (
            <Suspense fallback={<SpinnerAgrolitycs />}>
                <PDFViewer style={{ width: "100%", height: "100vh" }}>
                <PDFRotulo datos={datosPDF}></PDFRotulo>
                </PDFViewer>
            </Suspense>
            )}

            {
                mostrarErrorVencimientoToken &&
                <Error texto={"Su sesión ha expirado"} 
                onConfirm={handleSesionExpirada}/>
            } 
            {
                usuarioNoEncontrado &&
                <Error texto={"El usuario asociado a la toma de muestra no se ha encontrado"} 
                onConfirm={handleErrorUsuarioNoEncontrado}/>
            }
            {
                tomaMuestraNoEncontrada &&
                <Error texto={"La toma de muestra no se ha encontrado"} 
                onConfirm={handleErrorTomaMuestraNoEncontrada}/>
            }
            {
                loteNoEncontrado &&
                <Error texto={"El lote asociado a la toma de muestra no se ha encontrado"} 
                onConfirm={handleErrorLoteNoEncontrado}/>
            }
            {
                campoNoEncontrado &&
                <Error texto={"El campo asociado a la toma de muestra no se ha encontrado"} 
                onConfirm={handleErrorCampoNoEncontrado}/>
            }
            {
                productorNoEncontrado &&
                <Error texto={"El productor asociado a la toma de muestra no se ha encontrado"} 
                onConfirm={handleErrorProductorNoEncontrado}/>
            }
            {
                localidadNoEncontrada &&
                <Error texto={"La localidad asociada a la toma de muestra no se ha encontrado"} 
                onConfirm={handleErrorLocalidadNoEncontrada}/>
            }
            {
                provinciaNoEncontrada &&
                <Error texto={"La provincia asociada a la toma de muestra no se ha encontrado"} 
                onConfirm={handleErrorProvinciaNoEncontrada}/>
            }
            {
                profundidadNoEncontrada &&
                <Error texto={"La profundidad asociado a la toma de muestra no se ha encontrado"} 
                onConfirm={handleErrorProfundidadNoEncontrada}/>
            }
            {
                perfilNoEncontrado &&
                <Error texto={"El perfil asociado a la toma de muestra no se ha encontrado"} 
                onConfirm={handleErrorPerfilNoEncontrado}/>
            }
            {
                tipoMuestreoNoEncontrado &&
                <Error texto={"El tipo muestreo asociado a la toma de muestra no se ha encontrado"} 
                onConfirm={handleErrorTipoMuestreoNoEncontrado}/>
            }
            {
                errorInesperado &&
                <Error texto={"Ocurrió un error inesperado"} 
                onConfirm={handleErrorInesperado}/>
            }
            </>
        )
    }
    else if (modoPDF === 'submuestra') {
        return(
            <>
            <Suspense fallback={<SpinnerAgrolitycs />}>
            <PDFViewer style={{ width: "100%", height: "100vh" }}>
                <PDFSubmuestras imagen={imagen}></PDFSubmuestras>
            </PDFViewer>
            </Suspense>
            {
                mostrarErrorVencimientoToken &&
                <Error texto={"Su sesión ha expirado"} 
                onConfirm={handleSesionExpirada}/>
            }
            {
                errorInesperado &&
                <Error texto={"Ocurrió un error inesperado"} 
                onConfirm={handleErrorInesperado}/>
            } 
            </>
        );

        
    }
    else if (modoPDF === 'diagnostico'){
        return(
            <>
                {analisis === undefined ? (
                <SpinnerAgrolitycs />
                ) : interpretacion === undefined ? (
                <SpinnerAgrolitycs />
                ) : diagnostico !== undefined ? (
                <Suspense fallback={<SpinnerAgrolitycs />}>
                    <PDFViewer style={{ width: "100%", height: "100vh" }}>
                    <PDFDiagnosticoSuelo
                        interpretacion={interpretacion}
                        diagnostico={diagnostico}
                        datosLote={datosCampoPDF}
                        cultivo={cultivoASembrar}
                    ></PDFDiagnosticoSuelo>
                    </PDFViewer>
                </Suspense>
                ) : (
                <Suspense fallback={<SpinnerAgrolitycs />}>
                    <PDFViewer style={{ width: "100%", height: "100vh" }}>
                    <PDFDiagnosticoAgua
                        interpretacion={interpretacion}
                        datosLote={datosCampoPDF}
                    ></PDFDiagnosticoAgua>
                    </PDFViewer>
                </Suspense>
                )}
                {
                    errorInesperado &&
                    <Error texto={"Ocurrió un error inesperado"} 
                    onConfirm={handleErrorInesperado}/>
                }
            </>
        )

    }
    else if (modoPDF === 'consulta diagnostico'){
        return(
            <>
                {analisis === undefined ? (
                <SpinnerAgrolitycs />
                ) : interpretacion === undefined ? (
                <SpinnerAgrolitycs />
                ) : diagnostico === undefined ? (
                <SpinnerAgrolitycs />
                ) : (
                <Suspense fallback={<SpinnerAgrolitycs />}>
                    <PDFViewer style={{ width: "100%", height: "100vh" }}>
                    <PDFDiagnosticoSuelo
                        interpretacion={interpretacion}
                        diagnostico={diagnostico}
                        datosLote={datosCampoPDF}
                        cultivo={cultivoASembrar}
                    ></PDFDiagnosticoSuelo>
                    </PDFViewer>
                </Suspense>
                )}
                {
                    errorInesperado &&
                    <Error texto={"Ocurrió un error inesperado"} 
                    onConfirm={handleErrorInesperado}/>
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

