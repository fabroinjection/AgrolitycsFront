import './Help.css';

import Button from 'react-bootstrap/Button';
import HelpContent from '../../components/Ayuda/HelpContent/HelpContent';
import React, { useEffect, useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';

import NavbarSecundaria from '../../components/NavbarSecundaria/NavbarSecundaria';
import InformacionFooter from '../../components/InformacionFooter/InformacionFooter';

function Help() {

    const [activeButton, setActiveButton] = useState(null);

    const [scrolling, setScrolling] = useState(false);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const scrollToSection = (id) => {
      const section = document.getElementById(id);
  
      if (section && !scrolling) {
        setScrolling(true);
  
        section.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'start',
        });
  
        setTimeout(() => {
          setScrolling(false);
        }, 1000);
      }
    };  

    return (
        <>
            <NavbarSecundaria/>
            <div className='contenedor-help'>
                <div className='izquierda-help'>
                    <h4>Contenido</h4>

                    <Button 
                    className={`btn-sidebar ${activeButton === 'usuarios' ? 'active' : ''}`} 
                    onClick={() => {
                        scrollToSection('seccion-usuarios');
                        setActiveButton('usuarios');
                      }} 
                    href='#seccion-usuarios'
                    >
                        Usuarios
                    </Button>

                    <Button 
                    className={`btn-sidebar ${activeButton === 'campos' ? 'active' : ''}`} 
                    onClick={() => {
                        scrollToSection('seccion-campos');
                        setActiveButton('campos');
                      }} 
                    href='#seccion-campos'
                    >
                        Campos
                    </Button>

                    <Button 
                    className={`btn-sidebar ${activeButton === 'lotes' ? 'active' : ''}`} 
                    onClick={() => {
                        scrollToSection('seccion-campos');
                        setActiveButton('lotes');
                      }} 
                    href='#seccion-lotes'
                    >
                        Lotes
                    </Button>

                    <Button 
                    className={`btn-sidebar ${activeButton === 'tomaMuestra' ? 'active' : ''}`} 
                    onClick={() => {
                        scrollToSection('seccion-toma-muestra');
                        setActiveButton('tomaMuestra');
                      }} 
                    href='#seccion-toma-muestra'
                    >
                        Tomas de Muestra
                    </Button>

                    <Button 
                    className={`btn-sidebar ${activeButton === 'analisis' ? 'active' : ''}`} 
                    onClick={() => {
                        scrollToSection('seccion-analisis');
                        setActiveButton('analisis');
                      }} 
                    href='#seccion-analisis'
                    >
                        Análisis
                    </Button>

                    <Button 
                    className={`btn-sidebar ${activeButton === 'diagostico' ? 'active' : ''}`} 
                    onClick={() => {
                        scrollToSection('seccion-diagnostico');
                        setActiveButton('diagnostico');
                      }} 
                    href='#seccion-diagnostico'
                    >
                        Diagnóstico
                    </Button>

                    <Button 
                    className={`btn-sidebar ${activeButton === 'tratamiento' ? 'active' : ''}`} 
                    onClick={() => {
                        scrollToSection('seccion-tratamiento');
                        setActiveButton('tratamiento');
                      }} 
                    href='#seccion-tratamiento'
                    >
                        Tratamiento
                    </Button>

                    <Button 
                    className={`btn-sidebar ${activeButton === 'productores' ? 'active' : ''}`} 
                    onClick={() => {
                        scrollToSection('seccion-productores');
                        setActiveButton('productores');
                      }} 
                    href='#seccion-productores'
                    >
                        Productores
                    </Button>

                    <Button 
                    className={`btn-sidebar ${activeButton === 'laboratorios' ? 'active' : ''}`} 
                    onClick={() => {
                        scrollToSection('seccion-laboratorios');
                        setActiveButton('laboratorios');
                      }} 
                    href='#seccion-laboratorios'
                    >
                        Laboratorios
                    </Button>       

                    <Button 
                    className={`btn-sidebar ${activeButton === 'estadisticas' ? 'active' : ''}`} 
                    onClick={() => {
                        scrollToSection('seccion-estadisticas');
                        setActiveButton('estadisticas');
                      }} 
                    href='#seccion-estadisticas'
                    >
                        Estadísticas
                    </Button>             

                </div>

                <Offcanvas show={show} onHide={handleClose} responsive="lg" className="contenedor-offcanvas">
                  <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Contenido</Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body>
                    <Button 
                      className={`btn-sidebar ${activeButton === 'usuarios' ? 'active' : ''}`} 
                      onClick={() => {
                          scrollToSection('seccion-usuarios');
                          setActiveButton('usuarios');
                          handleClose
                        }} 
                      href='#seccion-usuarios'
                      >
                          Usuarios
                    </Button>

                    <Button 
                      className={`btn-sidebar ${activeButton === 'campos' ? 'active' : ''}`} 
                      onClick={() => {
                          scrollToSection('seccion-campos');
                          setActiveButton('campos');
                          handleClose
                        }} 
                      href='#seccion-campos'
                      >
                          Campos
                    </Button>

                    <Button 
                      className={`btn-sidebar ${activeButton === 'lotes' ? 'active' : ''}`} 
                      onClick={() => {
                          scrollToSection('seccion-campos');
                          setActiveButton('lotes');
                          handleClose
                        }} 
                      href='#seccion-lotes'
                      >
                          Lotes
                    </Button>

                    <Button 
                      className={`btn-sidebar ${activeButton === 'tomaMuestra' ? 'active' : ''}`} 
                      onClick={() => {
                          scrollToSection('seccion-toma-muestra');
                          setActiveButton('tomaMuestra');
                          handleClose
                        }} 
                      href='#seccion-toma-muestra'
                      >
                          Tomas de Muestra
                    </Button>

                    <Button 
                      className={`btn-sidebar ${activeButton === 'analisis' ? 'active' : ''}`} 
                      onClick={() => {
                          scrollToSection('seccion-analisis');
                          setActiveButton('analisis');
                          handleClose
                        }} 
                      href='#seccion-analisis'
                      >
                          Análisis
                    </Button>

                    <Button 
                      className={`btn-sidebar ${activeButton === 'diagostico' ? 'active' : ''}`} 
                      onClick={() => {
                          scrollToSection('seccion-diagnostico');
                          setActiveButton('diagnostico');
                          handleClose
                        }} 
                      href='#seccion-diagnostico'
                      >
                          Diagnóstico
                    </Button>

                    <Button 
                      className={`btn-sidebar ${activeButton === 'tratamiento' ? 'active' : ''}`} 
                      onClick={() => {
                          scrollToSection('seccion-tratamiento');
                          setActiveButton('tratamiento');
                          handleClose
                        }} 
                      href='#seccion-tratamiento'
                      >
                          Tratamiento
                    </Button>

                    <Button 
                      className={`btn-sidebar ${activeButton === 'productores' ? 'active' : ''}`} 
                      onClick={() => {
                          scrollToSection('seccion-productores');
                          setActiveButton('productores');
                          handleClose
                        }} 
                      href='#seccion-productores'
                      >
                          Productores
                    </Button>

                    <Button 
                      className={`btn-sidebar ${activeButton === 'laboratorios' ? 'active' : ''}`} 
                      onClick={() => {
                          scrollToSection('seccion-laboratorios');
                          setActiveButton('laboratorios');
                          handleClose
                        }} 
                      href='#seccion-laboratorios'
                      >
                          Laboratorios
                    </Button>       

                    <Button 
                      className={`btn-sidebar ${activeButton === 'estadisticas' ? 'active' : ''}`} 
                      onClick={() => {
                          scrollToSection('seccion-estadisticas');
                          setActiveButton('estadisticas');
                          handleClose
                        }} 
                      href='#seccion-estadisticas'
                      >
                          Estadísticas
                    </Button> 
                  </Offcanvas.Body>
                </Offcanvas>   

                <div className='derecha-help'>

                  <Button variant='primary' onClick={handleShow} className='boton-offcanvas'>En esta página</Button>

                    <h1>Soporte</h1>
                    <p> Te damos la bienvenida al área de ayuda. Aquí encontrarás videos que te guiarán en el uso de Agrolitycs para que le saques máximo provecho y aprendas a utilizarla.</p>


                    <h1 id='seccion-usuarios' className='seccion-help'>Usuarios</h1>

                    <h1 id='seccion-campos' className='seccion-help'>Campos</h1>

                    <h1 id='seccion-lotes' className='seccion-help'>Lotes</h1>
                    <HelpContent
                        titulo="Crear Lote"
                        descripcion="Aprende a crear un lote."
                        link="https://www.youtube.com/embed/BLVPih3jrdA?si=vGCge8qJWAHgM3fn"
                    />

                    
                    <h1 id='seccion-toma-muestra' className='seccion-help'>Tomas de Muestra</h1>

                    <h1 id='seccion-analisis' className='seccion-help'>Análisis</h1>

                    <h1 id='seccion-diagnostico' className='seccion-help'>Diagnostico</h1>

                    <h1 id='seccion-tratamiento' className='seccion-help'>Tratamiento</h1>

                    <h1 id='seccion-productores' className='seccion-help'>Productores</h1>

                    <h1 id='seccion-laboratorios' className='seccion-help'>Laboratorios</h1>

                    <h1 id='seccion-estadisticas' className='seccion-help'>Estadísticas</h1>
                    
                </div>
            </div>

            <div className='traer-frente'>
                <InformacionFooter/>
            </div>       
            
        </>
    )
}

export default Help;