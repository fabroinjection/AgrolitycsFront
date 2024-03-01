
import '../Navbar/Navbar.components.css';

import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { Image } from 'react-bootstrap';

import nombreAgrolitycs from '../../assets/nombreAgrolitycs.png';

function NavbarSecundaria() {

    return(
        <>
            <Navbar className='navbarAplicacion' expand="lg" sticky="top">
                <Container className="contenedor">
                    <Navbar.Brand href="">
                        <Image className='marcaApp' src={nombreAgrolitycs}></Image>
                    </Navbar.Brand>
                </Container>
            </Navbar>
        </>
    )
}

export default NavbarSecundaria;