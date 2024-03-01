import './HelpContent.css';
import Ratio from 'react-bootstrap/Ratio';

function HelpContent({titulo, descripcion, link}) {

    return(
        <div className='help-content'>
            <h3 className='titulo-help-content'>{titulo}</h3>
            <p>{descripcion}</p>
            <div className='contendor-video'>
                <Ratio aspectRatio="16x9">
                    <iframe width="560" height="315" src={link} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                </Ratio>
            </div>
        </div>
    )

}

export default HelpContent;