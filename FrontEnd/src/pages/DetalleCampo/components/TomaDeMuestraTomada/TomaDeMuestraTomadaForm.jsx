// importar estilos
import '../../../../components/Estilos/estilosFormulario.css';

// import componentes
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import Error from '../../../../components/Modals/Error/Error';

// import hooks
import { useForm } from 'react-hook-form';
import { useState } from 'react';

// import utilities
import moment from 'moment';
import { toast } from 'react-toastify';

// import services
import { registrarTomaDeMuestraTomadaService } from '../../services/tomaDeMuestra.service';
import { renewToken } from '../../../../services/token.service';

function TomaDeMuestraTomadaForm({ accionCancelar, accionConfirmar, fechaEstimada, idTM }){

    const { handleSubmit, reset } = useForm();

    const [ fechaARegistrar, setFechaARegistrar ] = useState();
    const [ fechaVacio, setFechaVacio ] = useState(false);

    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);

    const handleCancelar = () => {
        reset();
        accionCancelar();
    }

    // funcion toast para alerta fecha vacia
    const mostrarErrorFechaVacia = () => {
        toast.error('Se debe ingresar una fecha', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const registrarTomaMuestraTomada = async () => {
        if(fechaARegistrar != undefined){
            setFechaVacio(false);
            try {
                await registrarTomaDeMuestraTomadaService(idTM, moment(fechaARegistrar).format("YYYY-MM-DD"));
                reset();
                accionConfirmar();
            } catch (error) {
                if(error.response && error.response.status === 401){
                    try {
                        await renewToken();
                        await registrarTomaDeMuestraTomadaService(idTM, moment(fechaARegistrar).format("YYYY-MM-DD"));
                        reset();
                        accionConfirmar();
                    } catch (error) {
                      if(error.response && error.response.status === 401){
                        setMostrarErrorVencimientoToken(true);
                      }
                    }
                  }
            }

        }
        else{
            setFechaVacio(true);
            mostrarErrorFechaVacia();
        }
    }

    return (
        <>
        <div className="overlay">
            <Form className='formularioClaro formCentrado' onSubmit={handleSubmit(registrarTomaMuestraTomada)}>
                {/* Titulo del formulario */}
                <div className="seccionTitulo">
                    <strong className={fechaVacio ? "tituloForm-pequeño labelErrorFormulario" : "tituloForm-pequeño"}>Ingrese la fecha en la que tomó la muestra</strong>
                </div>

                {/* Fecha Toma de Muestra */}
                <Form.Group className="mb-3 seccionFechaTM" controlId="formFechaTM">
                <DatePicker
                placeholderText='dd/mm/aaaa'
                      className="estilos-datepikcer"
                      dateFormat="dd/MM/yyyy"
                      selected={fechaARegistrar}
                      onChange={(date) => setFechaARegistrar(date)}
                      minDate={moment(fechaEstimada, "YYYY-MM-DD").toDate()}
                      maxDate={new Date()}
                      /> 
                    
                </Form.Group>
                

                {/* Botones */}
                <Form.Group className="seccionBotonesFormulario margenTop20" controlId="formBotones">
                    <Button className="botonCancelarFormulario" variant="secondary"
                    onClick={handleCancelar}>
                        Cancelar
                    </Button>

                    <Button className="botonConfirmacionFormulario" variant="secondary"
                    type='submit'>
                        Registrar
                    </Button>
                </Form.Group>
            </Form>
        </div>
        {mostrarErrorVencimientoToken && <Error texto={"Su sesión ha expirado"} onConfirm={handleSesionExpirada}/>}
        </>
    );
}

export default TomaDeMuestraTomadaForm; 