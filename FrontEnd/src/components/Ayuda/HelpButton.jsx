import './HelpButton.css';
import Button from 'react-bootstrap/Button';

import { useNavigate } from 'react-router-dom';

function HelpButton() {

    let navigate = useNavigate();

    

    const handleNavigationAyuda = () => {
        navigate('/help')
      }

    return(
        <>
            <Button variant='primary' className='help-button' onClick={handleNavigationAyuda}>Ayuda</Button>
        </>
    )
}

export default HelpButton;