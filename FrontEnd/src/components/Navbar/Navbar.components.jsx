import './Navbar.components.css';
import UsuarioWidget from './UsuarioWidget/UsuarioWidget';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Image } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

import marcaApp from '../../assets/marcaApp.png';
import nombreAgrolitycs from "../../assets/nombreAgrolitycs.png";

import { useNavigate } from 'react-router-dom';

export default function NavbarBootstrap() {

  let navigate = useNavigate();

  const handleNavigationProductores = () => {
    navigate('/productores')
  }

  const handleNavigationLaboratorios = () => {
    navigate('/laboratorios')
  }

  return (
    <>
      <Navbar className='navbarAplicacion' expand="lg" sticky="top">
        <Container className="contenedor">
          
          <Navbar.Brand>
            <Image className='marcaApp' src={nombreAgrolitycs}></Image>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
            </Nav>
            <Button className='nav-button' onClick={handleNavigationProductores}>Productores</Button>
            <Button className='nav-button' onClick={handleNavigationLaboratorios}>Laboratorios</Button>
            <UsuarioWidget/>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}
