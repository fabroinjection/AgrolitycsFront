import '../estilosTratamientoRealizado.css';

// import components
import Stack from 'react-bootstrap/Stack';
import { Form } from 'react-bootstrap';

// import hooks
import { useState } from 'react';

function FertilizanteCard({ fertilizante, kgHa, onKgHaChange = undefined, modo }){

    //expresion regular para que el número sea real, separado con coma
    const numeroRealRegExpr = /^\d*\.?\d{0,2}$/;

    const [inputValue, setInputValue] = useState(kgHa)

    const handleInputChange = (e) => {
        const { value } = e.target;

        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value) >= 0 && parseFloat(value) <= 999999)){
            setInputValue(value);
            onKgHaChange(parseFloat(value));
        }
        
    };

    return(
        <>
        <div className='contenedorFertilizanteCard'>
            <Stack direction="horizontal" gap={0}>
                <div className='p-2'>{fertilizante}</div>
                <div className='p-2 ms-auto'>
                    <Form.Group >
                        <Form.Control type='text' className='inputFertilizanteCard' value={inputValue}
                        onChange={handleInputChange} disabled={modo === 'Consultar' ? true : false}/>
                    </Form.Group>
                </div>
                <div className='p-2'> Kg/ha</div>
                <div className='p-2'></div>
            </Stack>
        </div>
        </>
    );
}

export default FertilizanteCard;