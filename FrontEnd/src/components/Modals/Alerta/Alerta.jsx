import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import '../../Estilos/estilosModales.css';
import '../../Estilos/estilosFormulario.css';

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
            className="contenedor-modal">
          <Modal.Header>
            <img className="icono-modal" src={iconoAdvertencia} alt="" />
          </Modal.Header>
          <Modal.Body>
            {texto}
          </Modal.Body>
          <Modal.Footer className='seccionBotonesFormulario'>
            <Button className='botonCancelarFormulario' variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button className='botonConfirmacionFormulario' variant="secondary" onClick={handleConfirm}>
              {nombreBoton}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
  export default Alerta;