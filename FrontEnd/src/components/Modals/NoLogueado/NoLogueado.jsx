import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './NoLogueado.css';

import iconoError from '../../../assets/iconoError.png';
import { useNavigate } from 'react-router-dom';

function NoLogueado() {
    
    let navigate = useNavigate();

    const [show, setShow] = useState(true);
  
    const handleClose = () => {
        setShow(false);
        navigate("/");
    };
  
    return (
      <>
        <Modal 
            show={show} 
            onHide={handleClose} 
            backdrop="static" 
            keyboard={false}
            centered
            className="modalNoLogueado">
          <Modal.Header>
            <img className="iconoNoLogueado" src={iconoError} alt="" href="https://www.flaticon.es/iconos-gratis/error"/>
          </Modal.Header>
          <Modal.Body>
            Usted no se encuentra logueado
          </Modal.Body>
          <Modal.Footer>
            <Button className='estiloBotonNoLogueado btnNoLogueadoAceptar' variant="secondary" onClick={handleClose}>
              Aceptar
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
  
  export default NoLogueado;