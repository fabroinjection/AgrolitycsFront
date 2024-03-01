// NuevoFertilizanteCard.jsx
import Stack from 'react-bootstrap/Stack';
import { Form } from 'react-bootstrap';
import Select from 'react-select';
import CloseButton from 'react-bootstrap/CloseButton';
import Error from '../../../../components/Modals/Error/Error';

// import hooks
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// import services
import { renewToken } from '../../../../services/token.service';
import { fertilizantesService } from '../../../../services/fertilizantes.service';

function NuevoFertilizanteCard({ onRemove, cardKey, onKgPerHaChange, onFertilizanteChange }) {

    //expresion regular para que el número sea real, separado con coma
    const numeroRealRegExpr = /^-?\d*([.]?\d{0,4})?$/;

    let navigate = useNavigate();
    
    // estados para errores
    const [ mostrarErrorVencimientoToken, setMostrarErrorVencimientoToken ] = useState(false);
    
    // estado para traer todos los fertilizantes
    const [ fertilizantes, setFertilizantes ] = useState([]);

    const [ kgHa, setKgHa ] = useState("");

    const handleRemove = () => {
        onRemove(cardKey);
    };

    const handleKgPerHaInputChange = (event) => {
        const { value } = event.target;
        if(value === "" || (numeroRealRegExpr.test(value) && parseFloat(value) >= 0 && parseFloat(value) <= 999999)){
            setKgHa(value);
            onKgPerHaChange(cardKey, event.target.value);
        }
    };

    const handleFertilizanteSelChange = (fertilizante) => {
        onFertilizanteChange(cardKey, fertilizante);
    }

    useEffect(() => {
        const fetchFertilizantes = async () => {
            try {
                const { data } = await fertilizantesService();
                setFertilizantes(data);
            } catch (error) {
                if(error.response && error.response.status === 401){
                    try {
                        await renewToken();
                        const { data } = await fertilizantesService();
                        setFertilizantes(data);
                    } catch (error) {
                        if(error.response && error.response.status === 401){
                            setMostrarErrorVencimientoToken(true);
                          }
                    }
                }
            }
        }
        fetchFertilizantes();
    }, [])

    const handleSesionExpirada = () =>{
        setMostrarErrorVencimientoToken(false);
        navigate("/");
        window.localStorage.removeItem('loggedAgroUser');
    }


    if (fertilizantes) {
        return (
            <div className='contenedorFertilizanteCard'>
                <Stack direction="horizontal" gap={0}>
                    <div className='p-2'>
                        <Form.Group>
                            <Select className='selectFertilizanteCard'
                                onChange={handleFertilizanteSelChange}
                                options={
                                    fertilizantes.map( fert => ({label: fert.nombre, value: fert.id}) )
                                }
                            />
                        </Form.Group>
                    </div>
                    <div className='p-2 ms-auto'>
                        <Form.Group>
                            <Form.Control type='text' className='inputFertilizanteCard' min={0} value={kgHa} onChange={handleKgPerHaInputChange}/>
                        </Form.Group>
                    </div>
                    <div className='p-2'> Kg/ha</div>
                    <div className='p-2'>
                        <CloseButton onClick={handleRemove} />
                    </div>
                </Stack>
                {
                    mostrarErrorVencimientoToken &&
                    <Error texto={"Su sesión ha expirado"} 
                    onConfirm={handleSesionExpirada}/>
                } 
            </div>
        );
    }
    
}

export default NuevoFertilizanteCard;

