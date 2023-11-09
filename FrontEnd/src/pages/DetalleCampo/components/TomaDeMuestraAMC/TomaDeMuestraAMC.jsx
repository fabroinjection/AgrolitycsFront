// import componentes
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import Select from 'react-select';
import Error from "../../../../components/Modals/Error/Error";

// import hooks
import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

//import utilities
import { registerLocale, setDefaultLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import moment from "moment/moment";

// import estilos
import 'react-datepicker/dist/react-datepicker.css';
import './TomaDeMuestraAMC.css';

//import services
import { tiposAnalisisService } from "../../../../services/tipoanalisis.service";
import { tiposDeMuestreoService, profundidadesService, nuevaTomaDeMuestraService, modificarTomaDeMuestraService } from "../../services/tomaDeMuestra.service";
import { renewToken } from "../../../../services/token.service";

//import Context
import { ModoTomaDeMuestraAMCContext } from "../../../../context/ModoTomaDeMuestraAMCContext";

registerLocale('es', es);
setDefaultLocale('es');

function TomaDeMuestraABMC({titulo, nombreBoton, accionCancelar, accionConfirmar, idLote,
   tomaDeMuestra = null}){

    const {handleSubmit, reset} = useForm();

    let navigate = useNavigate();

    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);

    //variable que toma el valor de la fecha.
    const [startDate, setStartDate] = useState();
    const [ esFechaValida, setEsFechaValida ] = useState(true);

    //variable para el tipo de muestreo
    const [ tipoMuestreos, setTipoMuestreos ] = useState([]);
    const [ tipoMuestreoSeleccionado, setTipoMuestreoSeleccionado ] = useState({label: 'Seleccione una opcion', value: 0});
    const [ esTipoMuestreoValido, setEsTipoMuestreoValido ] = useState(true);

    //variable para la profundidad
    const [ profundidades, setProfundidades ] = useState([]);
    const [ profundidadSeleccionada, setProfundidadSeleccionada ] = useState({label: 'Seleccione una opcion', value: 0});
    const [ esProfundidadValida, setEsProfundidadValida ] = useState(true);

    //variable para el tipo de análisis
    const [ tipoAnalisis, setTipoAnalisis ] = useState([]);
    const [ tipoAnalisisSeleccionado, setTipoAnalisisSeleccionado ] = useState({label: 'Seleccione una opcion', value: 0});
    const [ esTipoAnalisisValido, setEsTipoAnalisisValido ] = useState(true);

    //variable para el context modo componente
    const [ modoTomaDeMuestra ] = useContext(ModoTomaDeMuestraAMCContext);

    //variable para mostrar que ya tiene un análisis asociado y no se puede modificar por ese motivo.
    const [ tieneAnalisisAsociado, setTieneAnalisisAsociado ] = useState(false);

    const handleSelectChangeTipoMuestreo = (opcion) => {
        setTipoMuestreoSeleccionado(opcion);
    }

    const handleSelectChangeProfundidad = (opcion) => {
        setProfundidadSeleccionada(opcion);
    }

    const handleSelectChangeTipoAnalisis = (opcion) => {
        setTipoAnalisisSeleccionado(opcion);
    }

    const validarTipoMuestreo = () => {
      if(tipoMuestreoSeleccionado.value === 0){
        setEsTipoMuestreoValido(false);
        return false;
      }
      else{
        setEsTipoMuestreoValido(true);
        return true;
      }
    }

    const validarProfundidad = () => {
      if(profundidadSeleccionada.value === 0){
        setEsProfundidadValida(false);
        return false;
      }
      else{
        setEsProfundidadValida(true);
        return true;
      }
    }

    const validarTipoAnalisis = () => {
      if(tipoAnalisisSeleccionado.value === 0){
        setEsTipoAnalisisValido(false);
        return false;
      }
      else{
        setEsTipoAnalisisValido(true);
        return true;
      }
    }

    const validarFecha = () => {
      if (startDate === null) {
        setEsFechaValida(false);
        return false;
      }
      else{
        setEsFechaValida(true);
        return true;
      }
      
    }

    const handleCancelar = () => {
        setTieneAnalisisAsociado(false);
        accionCancelar();
      }
      
      const handleConfirm = async () => {
        if (modoTomaDeMuestra === 'alta') {
          const validacionFecha = validarFecha();
          const validacionTipoAnalisis = validarTipoAnalisis();
          const validacionProfundidad = validarProfundidad();
          const validacionTipoMuestreo = validarTipoMuestreo();
          if(validacionFecha && validacionTipoAnalisis && validacionProfundidad && validacionTipoMuestreo){
            const tomaDeMuestraEnviar = {
              lote_id : idLote,
              tipo_muestreo_id: tipoMuestreoSeleccionado.value,
              profundidad_suelo_id: profundidadSeleccionada.value,
              fecha: moment(startDate).format("YYYY-MM-DD"),
              tipo_analisis_suelo_a_realizar_id: tipoAnalisisSeleccionado.value
            }
            try {
              await nuevaTomaDeMuestraService(tomaDeMuestraEnviar);
              accionConfirmar();
              reset();
            } catch (error) {
              if(error.response && error.response.status === 401){
                try {
                  await renewToken();
                  await nuevaTomaDeMuestraService(tomaDeMuestraEnviar, tipoAnalisisSeleccionado.value);
                  accionConfirmar();
                  reset();
                } catch (error) {
                  if(error.response && error.response.status === 401){
                    setMostrarErrorVencimientoToken(true);
                  }
                }
              }
            }          
          }
        }
        else if (modoTomaDeMuestra === 'consulta') {
          if(tomaDeMuestra.estado_toma_de_muestra_id !== "Pendiente"){
            setTieneAnalisisAsociado(true);
          }
          else{
            accionConfirmar();
          }
          
        }
        else if (modoTomaDeMuestra === 'edición') {
          //Se toma el valor de la fecha que corresponde
          let fechaTM;
          if (!startDate){
            fechaTM = tomaDeMuestra.fecha;
          }
          else{
            fechaTM = moment(startDate).format("YYYY-MM-DD");
          }

          //Se toma el valor del tipo de muestreo que corresponde
          let tipoMuestreo;
          if (tipoMuestreoSeleccionado.value === 0){
            tipoMuestreo = tomaDeMuestra.tipo_muestreo_id;
          }
          else{
            tipoMuestreo = tipoMuestreoSeleccionado.value;
          }

          //Se toma el valor de profundidad que corresponde
          let profundidad;
          if (profundidadSeleccionada.value === 0){
            profundidad = tomaDeMuestra.profundidad_suelo_id;
          }
          else{
            profundidad = profundidadSeleccionada.value;
          }

          //Se toma el valor del tipo analisis que corresponde
          let tipoAnalisis;
          if (tipoAnalisisSeleccionado.value === 0){
            tipoAnalisis = tomaDeMuestra.tipo_analisis_suelo_a_realizar_id
          }
          else{
            tipoAnalisis = tipoAnalisisSeleccionado.value
          }

          const tomaDeMuestraModificada = {
            lote_id : tomaDeMuestra.lote_id,
            tipo_muestreo_id: tipoMuestreo,
            profundidad_suelo_id: profundidad,
            fecha: fechaTM,
            tipo_analisis_suelo_a_realizar_id: tipoAnalisis
          }

          try {
            await modificarTomaDeMuestraService(tomaDeMuestra.id, tomaDeMuestraModificada);
            accionConfirmar();
            reset();
          } catch (error) {
            if(error.response && error.response.status === 401){
              try {
                await renewToken();
                await modificarTomaDeMuestraService(tomaDeMuestra.id, tomaDeMuestraModificada, tipoAnalisis);
                accionConfirmar();
                reset();
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
        if(modoTomaDeMuestra !== 'consulta'){
          const fetchTiposAnalisis = async () => {
            try {
              const tiposDeAnalisisDB = await tiposAnalisisService();
              setTipoAnalisis(tiposDeAnalisisDB.data);
            } catch (error) {
              if(error.response && error.response.status === 401){
                try {
                  await renewToken();
                  const tiposDeAnalisisDB = await tiposAnalisisService();
                  setTipoAnalisis(tiposDeAnalisisDB.data);
                } catch (error) {
                  if(error.response && error.response.status === 401){
                    setMostrarErrorVencimientoToken(true);
                  }
                }
              }
            }
          };
      
          fetchTiposAnalisis();
      }
      }, [modoTomaDeMuestra]);

      
      useEffect(() => {
        if(modoTomaDeMuestra !== 'consulta'){
          const fetchTiposMuestreo = async () => {
            try {
              const tiposDeMuestreoDB = await tiposDeMuestreoService();
              setTipoMuestreos(tiposDeMuestreoDB.data);
            } catch (error) {
              if(error.response && error.response.status === 401){
                try {
                  await renewToken();
                  const tiposDeMuestreoDB = await tiposDeMuestreoService();
                  setTipoMuestreos(tiposDeMuestreoDB.data);
                } catch (error) {
                  if(error.response && error.response.status === 401){
                    setMostrarErrorVencimientoToken(true);
                  }
                }
              }
            }
          };
      
          fetchTiposMuestreo();
        }
      }, []);

      useEffect(() => {
        if(modoTomaDeMuestra !== 'consulta'){
        const fetchProfundidades = async () => {
          try {
            const profundidadesDB = await profundidadesService();
            setProfundidades(profundidadesDB.data);
          } catch (error) {
            if(error.response && error.response.status === 401){
              try {
                await renewToken();
                const profundidadesDB = await profundidadesService();
                setProfundidades(profundidadesDB.data);
              } catch (error) {
                if(error.response && error.response.status === 401){
                  setMostrarErrorVencimientoToken(true);
                }
              }
            }
          }
        };
    
        fetchProfundidades();
      }
      }, [modoTomaDeMuestra]);

      const handleSesionExpirada = () =>{
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
      }

    return (
        <>
        <div className="overlay">
            <Form className="formTomaMuestra formCentrado" onSubmit={handleSubmit(handleConfirm)}>

                <div className="formTitulo">
                    <strong className="tituloFormTomaMuestra">{titulo}</strong>
                </div>
                

                {/* DatePicker de Fecha */}
                {!tomaDeMuestra ?
                    <Form.Group className="mb-3 seccionFecha" controlId="formFecha">
                      <Form.Label className="d-block ">Fecha Toma de Muestra</Form.Label>
                      <DatePicker
                      className="fechaTomaMuestra"
                      dateFormat="dd/MM/yyyy"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      minDate={new Date()} // Establece la fecha mínima como la fecha actual
                      />    
                      <div className='alerta'>
                        {
                          !esFechaValida &&
                          <Form.Text className="campoVacio">
                            * Ingrese una fecha.
                          </Form.Text>
                        }
                      </div>
                    </Form.Group>
          
                  : modoTomaDeMuestra === 'consulta' ?
                    <Form.Group className="mb-3 seccionFecha" controlId="formFecha">
                      <Form.Label className="d-block ">Fecha</Form.Label>
                      <DatePicker
                      className="fechaTomaMuestra"
                      value={moment(tomaDeMuestra.fecha).format("DD/MM/YYYY")}
                      isDisabled={true}
                      />    
                    </Form.Group>
                  : 
                    <Form.Group className="mb-3 seccionFecha" controlId="formFecha">
                      <Form.Label className="d-block ">Fecha</Form.Label>
                      <DatePicker
                      className="fechaTomaMuestra"
                      dateFormat="dd/MM/yyyy"
                      selected={startDate ? startDate : moment(tomaDeMuestra.fecha, "YYYY-MM-DD").toDate()}
                      onChange={(date) => setStartDate(date)}
                      minDate={new Date()} // Establece la fecha mínima como la fecha actual
                      />    
                    </Form.Group>
                }
                

                {/* Select de Tipo de Muestreo */}
                {!tomaDeMuestra ?
                  <Form.Group className="mb-3 seccionTipoMuestreo" controlId="formTipoMuestreo">
                    <Form.Label>Tipo de Muestreo</Form.Label>
                    <Select
                      className="selectTomaDeMuestra"
                      value={tipoMuestreoSeleccionado}
                      defaultValue={{label: 'Seleccione una opcion', value: 0}}
                      onChange={handleSelectChangeTipoMuestreo}
                      options={
                        tipoMuestreos.map( tipoMuestreo => ({label: tipoMuestreo.descripcion, value: tipoMuestreo.id}))
                      }
                    />  
                    <div className='alerta'>
                      {
                        !esTipoMuestreoValido &&
                        <Form.Text className="campoVacio">
                          * Seleccione un Tipo Muestreo.
                        </Form.Text>
                      }
                    </div>
                  </Form.Group> 
                : modoTomaDeMuestra === 'consulta' ?
                  <Form.Group className="mb-3 seccionTipoMuestreo" controlId="formTipoMuestreo">
                  <Form.Label>Tipo de Muestreo</Form.Label>
                    <Select
                      unstyled
                      className="selectTomaDeMuestra"
                      defaultValue={{label: tomaDeMuestra.tipo_muestreo_nombre,
                         value: tomaDeMuestra.tipo_muestreo_id}}
                      isDisabled={true}
                    />  
                  </Form.Group> 
                :
                <Form.Group className="mb-3 seccionTipoMuestreo" controlId="formTipoMuestreo">
                  <Form.Label>Tipo de Muestreo</Form.Label>
                  <Select
                    className="selectTomaDeMuestra"
                    defaultValue={{label: tomaDeMuestra.tipo_muestreo_nombre,
                      value: tomaDeMuestra.tipo_muestreo_id}}
                    onChange={handleSelectChangeTipoMuestreo}
                    options={
                      tipoMuestreos.map( tipoMuestreo => ({label: tipoMuestreo.descripcion, value: tipoMuestreo.id}))
                    }
                  />  
                </Form.Group> 
                }
                

                {/* Select de Profundidad de toma de muestra */}
                {!tomaDeMuestra ?
                  <Form.Group className="mb-3 seccionProfundidad" controlId="formProfundidad">
                    <Form.Label>Profundidad</Form.Label>
                    <Select 
                      className="selectTomaDeMuestra"
                      value={profundidadSeleccionada}
                      defaultValue={{label: 'Seleccione una opcion', value: 0}}
                      onChange={handleSelectChangeProfundidad}
                      options={
                        profundidades.map( prof => ({label: prof.descripcion, value: prof.id}))
                      }
                    />
                    <div className='alerta'>
                      {
                        !esProfundidadValida &&
                        <Form.Text className="campoVacio">
                          * Seleccione una Profundidad.
                        </Form.Text>
                      }
                    </div>
                  </Form.Group> 
                : modoTomaDeMuestra === 'consulta' ?
                  <Form.Group className="mb-3 seccionProfundidad" controlId="formProfundidad">
                    <Form.Label>Profundidad</Form.Label>
                    <Select 
                      unstyled
                      className="selectTomaDeMuestra"
                      defaultValue={{label: tomaDeMuestra.profundidad_suelo_nombre, 
                        value: tomaDeMuestra.profundidad_suelo_id}}
                      isDisabled={true}
                    />
                  </Form.Group> 
                :
                  <Form.Group className="mb-3 seccionProfundidad" controlId="formProfundidad">
                    <Form.Label>Profundidad</Form.Label>
                    <Select 
                      className="selectTomaDeMuestra"
                      defaultValue={{label: tomaDeMuestra.profundidad_suelo_nombre, 
                        value: tomaDeMuestra.profundidad_suelo_id}}
                      onChange={handleSelectChangeProfundidad}
                      options={
                        profundidades.map( prof => ({label: prof.descripcion, value: prof.id}))
                      }
                    />
                  </Form.Group> 
                }


                {/* Select de Tipo de Analisis */}
                {!tomaDeMuestra ?
                  <Form.Group className="mb-3 seccionTipoAnalisis" controlId="formTipoAnalisis">
                    <Form.Label>Tipo de Análisis</Form.Label>
                    <Select 
                      className="selectTomaDeMuestra"
                      value={tipoAnalisisSeleccionado}
                      defaultValue={{label: 'Seleccione una opcion', value: 0}}
                      onChange={handleSelectChangeTipoAnalisis}
                      options={
                        tipoAnalisis.map( tipoAn => ({label: tipoAn.descripcion, value: tipoAn.id}))
                      }
                    />
                    <div className='alerta'>
                      {
                        !esTipoAnalisisValido &&
                        <Form.Text className="campoVacio">
                          * Seleccione un Tipo de Analisis.
                        </Form.Text>
                      }
                    </div>
                  </Form.Group>          
                  : modoTomaDeMuestra === 'consulta' ?
                    <Form.Group className="mb-3 seccionTipoAnalisis" controlId="formTipoAnalisis">
                      <Form.Label>Tipo de Análisis</Form.Label>
                      <Select 
                        unstyled
                        className="selectTomaDeMuestra"
                        defaultValue={{label: tomaDeMuestra.tipo_analisis_suelo_a_realizar_nombre, 
                          value: tomaDeMuestra.tipo_analisis_suelo_a_realizar_id}}
                        isDisabled={true}
                      />
                    </Form.Group> 
                  : 
                  <Form.Group className="mb-3 seccionTipoAnalisis" controlId="formTipoAnalisis">
                    <Form.Label>Tipo de Análisis</Form.Label>
                    <Select 
                      className="selectTomaDeMuestra"
                      defaultValue={{label: tomaDeMuestra.tipo_analisis_suelo_a_realizar_nombre, 
                        value: tomaDeMuestra.tipo_analisis_suelo_a_realizar_id}}
                      onChange={handleSelectChangeTipoAnalisis}
                      options={
                        tipoAnalisis.map( tipoAn => ({label: tipoAn.descripcion, value: tipoAn.id}))
                      }
                    />
                  </Form.Group> 
                }

                {
                  tieneAnalisisAsociado &&
                  <Form.Group className="mb-3 seccionTipoAnalisis" controlId="formTipoAnalisis">
                    <Form.Label className="campoVacio">*No puede editarse una toma de muestra tomada o que tiene un análisis asociado.</Form.Label>
                  </Form.Group> 
                }
                   

                {/* Botones */}
                <Form.Group className="mb-3 seccionBotones" controlId="formBotones">
                    <Button className="estiloBotonesTomaMuestra botonCancelarTomaMuestra" variant="secondary"
                            onClick={handleCancelar}>
                        Cancelar
                    </Button>

                    <Button className="estiloBotonesTomaMuestra botonConfirmarTomaMuestra" variant="secondary"
                            type="submit">
                        {nombreBoton}
                    </Button>
                </Form.Group>             
            </Form>       

          {
            mostrarErrorVencimientoToken &&
            <Error texto={"Su sesión ha expirado"} 
            onConfirm={handleSesionExpirada}/>
          }  
        </div>
        </>
    );
}

export default TomaDeMuestraABMC;
