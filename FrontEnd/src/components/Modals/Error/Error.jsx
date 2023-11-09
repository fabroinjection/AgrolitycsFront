import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './Error.css';

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
            className="modalError">
          <Modal.Header>
            <img className="iconoError" src={iconoError} alt="" href="https://www.flaticon.es/iconos-gratis/error"/>
          </Modal.Header>
          <Modal.Body>
            {texto}
          </Modal.Body>
          <Modal.Footer>
            <Button className='estiloBotonError btnErrorAceptar' variant="secondary" onClick={handleClose}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
  export default Error;