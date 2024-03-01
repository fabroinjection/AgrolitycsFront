import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../../Estilos/estilosModales.css';
import '../../Estilos/estilosFormulario.css';

import iconoConfirmar from '../../../assets/iconoConfirmar.png';

function Confirm(props) {
    const {texto, onConfirm} = props;
    
    const [show, setShow] = useState(true);
  
    const handleClose = () => {
        onConfirm(true);
        setShow(false);
    };

    
  
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
            <img className="icono-modal" src={iconoConfirmar} alt=""/>
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
  
  export default Confirm;