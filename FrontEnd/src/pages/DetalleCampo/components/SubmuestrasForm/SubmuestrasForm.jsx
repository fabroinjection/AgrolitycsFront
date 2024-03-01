// importar estilos
import '../../../../components/Estilos/estilosFormulario.css';

// import componentes
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";

// import hooks
import { useContext, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

// import context
import { CantidadSubMuestrasContext } from '../../../../context/CantidadSubMuestrasContext';
import { EstadoSubMuestrasContext } from '../../../../context/EstadoSubMuestrasContext';

// import utilities
import { toast } from 'react-toastify';

function SubmuestrasForm({accionCancelar, tomaMuestra}){

    const { register, formState: {errors} , handleSubmit, reset } = useForm();

    //variables del contexto cantidad de submuestras
    const [ , setCantidadSubmuestras ] = useContext(CantidadSubMuestrasContext);

    //variables del contexto puntos de submuestras
    const [ , setHaySubmuestras ] = useContext(EstadoSubMuestrasContext);

    const [ errorNumNegativo, setErrorNumNegativo ] = useState(false);
    const [ errorVacio, setErrorVacio ] = useState(false);

    // funcion toast para alerta cantidad no ingresada
    const mostrarErrorCantidadVacia = () => {
        toast.error('Se debe ingresar una cantidad', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta cantidad negativa
    const mostrarErrorCantidadNegativa = () => {
        toast.error('Se debe ingresar una cantidad positiva', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    // funcion toast para alerta más caracters
    const mostrarErrorMaxLength = () => {
        toast.error('Se debe ingresar un número hasta 50 como máximo', {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 5000,
            }); 
    }

    const handleGenerarSubmuestras = (form) => {
        const cantSubmuestras = parseInt(form.cantSubmuestras);
        if (cantSubmuestras > 0 && cantSubmuestras <= 50) {
            setCantidadSubmuestras(cantSubmuestras);
            setHaySubmuestras(tomaMuestra);
        } else if (cantSubmuestras > 50) {
            mostrarErrorMaxLength();
            setErrorVacio(true);
        } else {
            mostrarErrorCantidadNegativa();
            setErrorNumNegativo(true);
        }
    }

    useEffect(() => {
        if (errors.cantSubmuestras?.type === "required") {
            mostrarErrorCantidadVacia();
            setErrorVacio(true);
        } else {
            setErrorVacio(false);
        }
    }, [errors.cantSubmuestras])

    return (
        <>
        <div className="overlay">
            <Form className='formularioClaro formCentrado' onSubmit={handleSubmit(handleGenerarSubmuestras)}>
                {/* Titulo del formulario */}
                <div className="seccionTitulo">
                    <strong className={(errorVacio || errorNumNegativo) ? "labelErrorFormulario tituloForm-pequeño" : "tituloForm-pequeño"}>Ingrese la cantidad de submuestras a realizar</strong>
                </div>

                {/* Input de cantidad de submuestras */}
                <Form.Group className="mb-3 seccionFormulario" controlId="formCantidadSubmuestras">
                    <Form.Control 
                        type="number" 
                        placeholder='ej. 10'
                        {...register("cantSubmuestras", {
                            required: true
                        })}
                    />
                </Form.Group>

                

                {/* Botones */}
                <Form.Group className="mb-3 seccionBotonesFormulario margenTop20" controlId="formBotones">
                    <Button className="botonCancelarFormulario" variant="secondary"
                    onClick={accionCancelar}>
                        Cancelar
                    </Button>

                    <Button className="botonConfirmacionFormulario" variant="secondary"
                    type='submit'>
                        Generar
                    </Button>
                </Form.Group>
            </Form>
        </div>
        </>
    );
}

export default SubmuestrasForm; 



