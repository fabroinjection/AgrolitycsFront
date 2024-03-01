import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../../Estilos/estilosModales.css';
import '../../Estilos/estilosFormulario.css';

import iconoError from '../../../assets/iconoError.png';

function Error({texto, onConfirm = undefined}) {
    
    const [show, setShow] = useState(true);
  
    const handleClose = () => {
      if (onConfirm !== undefined){
        onConfirm();
      }
      setShow(false)};
  
    return (
      <>
        <Modal 
            show={show} 
            onHide={handleClose} 
            backdrop="static" 
            keyboard={false}
            centered
            className="contenedor-modal">
          <Modal.Header>
            <img className="icono-modal" src={iconoError} alt="" href="https://www.flaticon.es/iconos-gratis/error"/>
          </Modal.Header>
          <Modal.Body>
            {texto}
          </Modal.Body>
          <Modal.Footer>
            <Button className='botonConfirmacionFormulario' variant="secondary" onClick={handleClose}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
  export default Error;