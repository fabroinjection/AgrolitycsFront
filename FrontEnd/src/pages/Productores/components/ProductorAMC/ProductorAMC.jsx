//Estilos
import './ProductorAMC.css';

// import componentes
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";


function ProductorAMC(){

    return(
        <>
            <div className="overlay">
                <Form className="formProductor formCentrado">

                    <div className="formTituloProductor">
                        <strong className="tituloFormProductor">Nuevo Productor</strong>
                    </div>
                                  
                    <div className='columnasProductores'>

                        <div className='columnaUnoProductor'>

                            {/* Input Nombres */}
                            <Form.Group className="mb-3 seccionNombreProd">
                                <Form.Label>Nombres</Form.Label>
                                <Form.Control className="inputProductores" type="text"/>
                            </Form.Group>

                            {/* Input Apellidos */}
                            <Form.Group className="mb-3 seccionApellidos">
                                <Form.Label>Apellidos</Form.Label>
                                <Form.Control className="inputProductores" type="text"/>
                            </Form.Group>

                            {/* Input Cuit o Cuil */}
                            <Form.Group className="mb-3 seccionCuitCuil">
                                <Form.Label>Cuit/Cuil</Form.Label>
                                <Form.Control className="inputProductores" type="text"/>
                            </Form.Group>  
 
                        </div>

                        <div className="columanDosProductor">

                            {/* Input Email */}
                            <Form.Group className="mb-3 seccionEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control className="inputProductores" type="email"/>
                            </Form.Group>


                            {/* Input Referencias */}
                            <Form.Group className="mb-3 seccionReferencia">
                                <Form.Label>Referencia</Form.Label>
                                <Form.Control className="inputProductoresRef" as="textarea"/>
                            </Form.Group>   
                        </div>
                    </div>
                                    
                    
                    {/* Botones */}
                    <Form.Group className="mb-3 seccionBotones" controlId="formBotones">
                        <Button className="estiloBotonesProductor botonCancelarProductor" variant="secondary">
                            Cancelar
                        </Button>
                        <Button className="estiloBotonesProductor botonConfirmarProductor" variant="secondary"
                                type="submit">
                            Registrar
                        </Button>
                    </Form.Group>             
                </Form>        
            </div>
        </>
    );
}

export default ProductorAMC; 