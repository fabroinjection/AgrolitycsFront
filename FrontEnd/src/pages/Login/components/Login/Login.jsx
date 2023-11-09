// import Componentes
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Error from '../../../../components/Modals/Error/Error';
import Confirm from '../../../../components/Modals/Confirm/Confirm';

import marcaApp from "../../../../assets/marcaApp.png";

// import Servicios
import { loginService } from '../../services/login.service';

// import hooks
import { useState } from 'react';

// import Cookies
// import { UserContext } from '../../../../contexts/UserContext';
import Cookies from 'js-cookie';

// import Estilos
import './Login.css'


function Login() {   

    // estado para Usuario
    const [ esUsuarioValido, setEsUsuarioValido] = useState(false);
    const [ esUsuarioRegistrado, setEsUsuarioRegistrado] = useState(false);

    const [ mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

    let navigate = useNavigate();

    const { register, formState: {errors} , handleSubmit, reset } = useForm();



    const enviarFormulario = async (form) => {
        try {
            const { data } = await loginService(form);
            const user = data;
            window.localStorage.setItem(
                'loggedAgroUser', JSON.stringify(user)
            );
            const nombreUsuario = {
                nombre: user.nombre + " " + user.apellido,
                email: form.username,
            }
            setCookies(nombreUsuario)
            reset();
            navigate("/home");
        } catch (error) {
            errorUsuario(error.response);
        }
    }

    const setCookies = (nombreUsuario) =>{
        //Calculo fecha y hora para la duración de 7 dias de la Cookie
        let currentDate = new Date();
        let expirationDate = new Date(currentDate.getTime() + (7 * 24 * 60 * 60 * 1000));

        //Se genera la cookie
        Cookies.set('email', nombreUsuario.email, {expires: expirationDate});
        Cookies.set('username', nombreUsuario.nombre, {expires: expirationDate})
    }

    const errorUsuario = (error) => {
        const statusCode = error.status;
        if (statusCode === 403){
            setEsUsuarioValido(true);
        }
        if (statusCode === 401){
            setEsUsuarioRegistrado(true);
        }

    }

    const handleAlerta = () =>{
        setMostrarConfirmacion(true);
    }

    const handleConfirmarAlerta = (e) =>{
        if(e){
            setMostrarConfirmacion(!mostrarConfirmacion);
        }
    }

  return (

    <div className="loginEstilo">

        <div className='marca'>
            <img  className="nombreMarca" src={marcaApp} alt="" />
        </div>
        <Form className="formLogin" onSubmit={handleSubmit(enviarFormulario)}>

            <fieldset>

                <div className="tituloIniciarSesion">
                    <span className="letraInter letraNegritaIS tituloCentradoIS">Iniciar Sesión</span>
                </div>

                <Form.Group controlId="formEmail" className="containerCentradoIS">
                    <Form.Label className="labelsIS letraInterIS">Correo electrónico</Form.Label>
                    <Form.Control type="email" className="inputCentradoIS"
                    {...register("username", {
                        required: true,
                        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                    })}
                    ></Form.Control>
                    {
                        errors.username?.type === "required" && (
                            <Form.Text className="campoVacioIS letraInterIS">
                                Ingrese correo electrónico.
                            </Form.Text> 
                        )
                    }
                    {
                        errors.username?.type === "pattern" && (
                            <Form.Text className="campoVacioIS letraInterIS">
                                Ingrese un mail válido.
                            </Form.Text>  
                        )
                    }
                    {
                        esUsuarioValido &&
                        <Error texto = "El usuario o contraseña no es válido" />
                    }
                    {
                        esUsuarioRegistrado &&
                        <Error texto = "El usuario no está registrado"/>
                    }
                </Form.Group>


                <Form.Group controlId="formPassword" className="containerCentradoIS">
                    <Form.Label className="labelsIS letraInterIS">Contraseña</Form.Label>
                    <Form.Control type="password" className="inputCentradoIS"
                    {...register("password", {
                        required: true,
                    })}></Form.Control>
                    {
                        errors.password?.type === "required" && (
                        <Form.Text className="campoVacioIS letraInterIS">
                            Ingrese una contraseña.
                        </Form.Text>
                        )
                    }    

                </Form.Group>
                
                <div className="divBotonesIS">
                    <div className="row">
                        <div className="col">
                            <Button className="botonIS" onClick={handleAlerta}>
                                Registrarme
                            </Button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                        <Button type="submit" className="botonIS">Ingresar</Button>
                        </div>
                    </div>
                </div>
                

                <Link to={"/"} className="forgotCentrado letraInterIS">
                    <Button  className="olvidada" variant="link">
                        He olvidado mi contraseña
                    </Button>
                    </Link>

                {
                    mostrarConfirmacion && 
                    <Confirm texto="No está desarrollado aún :(" 
                    onConfirm={handleConfirmarAlerta}/>
                }
                
            
            </fieldset>

        </Form>
    </div>
  )
}

export default Login