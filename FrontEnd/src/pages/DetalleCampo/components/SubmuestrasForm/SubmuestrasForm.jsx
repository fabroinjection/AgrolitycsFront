// importar estilos
import './SubmuestrasForm.css';

// import componentes
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";

// import hooks
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';

// import context
import { CantidadSubMuestrasContext } from '../../../../context/CantidadSubMuestrasContext';
import { EstadoSubMuestrasContext } from '../../../../context/EstadoSubMuestrasContext';

function SubmuestrasForm({accionCancelar, tomaMuestra}){

    const { register, formState: {errors} , handleSubmit, reset } = useForm();

    //variables del contexto cantidad de submuestras
    const [ , setCantidadSubmuestras ] = useContext(CantidadSubMuestrasContext);

    //variables del contexto puntos de submuestras
    const [ , setHaySubmuestras ] = useContext(EstadoSubMuestrasContext);

    const [ errorNumNegativo, setErrorNumNegativo ] = useState(false);

    const handleGenerarSubmuestras = (form) => {
        const cantSubmuestras = parseInt(form.cantSubmuestras);
        if (cantSubmuestras > 0) {
            setCantidadSubmuestras(cantSubmuestras);
            setHaySubmuestras(tomaMuestra);
        }
        else{
            setErrorNumNegativo(true);
        }
    }

    const positiveIntegerValidator = (value) => {
        const intValue = parseInt(value, 10);
        return Number.isInteger(intValue) && intValue > 0;
      };

    return (
        <>
        <div className="overlay">
            <Form className='formSubmuestras formSubmuestrasCentrado' onSubmit={handleSubmit(handleGenerarSubmuestras)}>
                {/* Titulo del formulario */}
                <div className="formTituloSubmuestras">
                    <strong className="tituloFormSubmuestras">Ingrese la cantidad de submuestras a realizar</strong>
                </div>

                {/* Input de cantidad de submuestras */}
                <Form.Group className="mb-3 seccionCantidadSubmuestras" controlId="formCantidadSubmuestras">
                    <Form.Control className="inputCantidad" type="number" {...register("cantSubmuestras", {
                        required: true,
                        })}
                    />
                </Form.Group>
                <div className='alerta'>
                    {errors.cantSubmuestras?.type === "required" && (
                        <span className="campoVacio">
                            * Ingrese una cantidad de submuestras.
                        </span>
                    )}
                    {errorNumNegativo && (
                        <span className="campoVacio">
                            * Ingrese un número positivo mayor a cero.
                        </span>
                    )}
                </div>
                

                {/* Botones */}
                <Form.Group className="mb-3 seccionBotonesSubmuestra" controlId="formBotones">
                    <Button className="estiloBotonesSubmuestras botonCancelarSubmuestra" variant="secondary"
                    onClick={accionCancelar}>
                        Cancelar
                    </Button>

                    <Button className="estiloBotonesTomaMuestra botonGenerarSubmuestras" variant="secondary"
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



