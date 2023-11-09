import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './Alerta.css';

import iconoAdvertencia from '../../../assets/iconoAdvertencia.png';

function Alerta(props) {
    const {texto, nombreBoton, onConfirm} = props;
    
    const [show, setShow] = useState(true);

    const handleClose = () => {
      onConfirm(false);
      setShow(false);
    }
    
    const handleConfirm = () => {
      onConfirm(true);
      setShow(false);
    }

    return (
      <>
        <Modal 
            show={show} 
            onHide={handleClose} 
            backdrop="static" 
            keyboard={false}
            centered
            className="modalAlerta">
          <Modal.Header>
            <img className="iconoAdvertencia" src={iconoAdvertencia} alt="" />
          </Modal.Header>
          <Modal.Body>
            {texto}
          </Modal.Body>
          <Modal.Footer>
            <Button className='estiloBoton btnAlertaCancelar' variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button className='estiloBoton btnAlertaCerrarSesion' variant="secondary" onClick={handleConfirm}>
              {nombreBoton}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
  export default Alerta;