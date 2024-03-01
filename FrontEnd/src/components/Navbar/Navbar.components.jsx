import './Navbar.components.css';
import UsuarioWidget from './UsuarioWidget/UsuarioWidget';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Image } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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

  const handleNavigationTratamientos = () => {
    navigate('/tratamientos')
  }

  const handleNavigationEstadisticas = () => {
    navigate('/estadisticas')
  }

  const handleNavigationInfo = () => {
    navigate('/info')
  }

  return (
    <>
      <Navbar className='navbarAplicacion' expand="lg" sticky="top">
        <Container className="contenedor">
          
          <Navbar.Brand>
            <Link to='/home'>
              <Image className='marcaApp' src={nombreAgrolitycs}></Image>
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
            </Nav>
            <Button className='nav-button' onClick={handleNavigationProductores}>Productores</Button>
            <Button className='nav-button' onClick={handleNavigationLaboratorios}>Laboratorios</Button>
            <Button className='nav-button' onClick={handleNavigationTratamientos}>Tratamientos</Button>
            <Button className='nav-button' onClick={handleNavigationEstadisticas}>Estadísticas</Button>
            <Button className='nav-button' onClick={handleNavigationInfo}>Información</Button>
            <UsuarioWidget/>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}
