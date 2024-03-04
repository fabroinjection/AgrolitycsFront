import './InformacionFooter.css';

function InformacionFooter(){

    return (
        <div className='informacion-footer'>
            <strong className='seccion-footer'>
                &copy; 2023 - 2024 Agrolitycs. Todos los derechos reservados.
            </strong>
            <strong className='seccion-footer'>
                <a href="#/terminosycondiciones" className='link-footer'>Términos y condiciones</a>  
            </strong>
            <strong className='seccion-footer'>
                <a href="#/info" className='link-footer'>Información</a>
            </strong>    
            <strong className='seccion-footer'>
                <a href="#/help" className='link-footer'>Ayuda</a>   
            </strong> 
            <strong className='seccion-footer'>
                <a href="mailto:agrolitycs@gmail.com" className='link-footer'>Contacto</a>
            </strong>           
        </div>
    )
}

export default InformacionFooter;