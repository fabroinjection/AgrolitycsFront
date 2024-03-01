import './Educacion.css';

import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import Table from 'react-bootstrap/Table';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

import muestreoAleatorio from '../../assets/muestreoAleatorio.png';
import muestroSistematico from '../../assets/muestreoSistematico.png';
import rotulo from '../../assets/rotulo.png';
import compatibilidadFertilizantes from '../../assets/compatibilidad-fertilizantes.png';
import clasesTexturales from '../../assets/clasesTexturales.jpg';
import NavbarSecundaria from '../NavbarSecundaria/NavbarSecundaria';
import InformacionFooter from '../InformacionFooter/InformacionFooter';

function Educacion(){

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

    return(
        <>
        <NavbarSecundaria/>
        <div className="contenedor-help">
            <div className="izquierda-help">
                <h4>Contenido</h4>
                <Button 
                  className={`btn-sidebar ${activeButton === 'tecnicasDeMuestreo' ? 'active' : ''}`} 
                  onClick={() => {
                      scrollToSection('tecnicasDeMuestreo');
                      setActiveButton('tecnicasDeMuestreo');
                      }} 
                  href='#tecnicasDeMuestreo'
                  >
                    Técnicas de Muestreo
                </Button>
                <Button 
                  className={`btn-sidebar ${activeButton === 'tiposAnalisis' ? 'active' : ''}`} 
                  onClick={() => {
                      scrollToSection('tiposAnalisis');
                      setActiveButton('tiposAnalisis');
                      }} 
                  href='#tiposAnalisis'
                  >
                    Tipos de Análisis
                </Button>
                <Button 
                  className={`btn-sidebar ${activeButton === 'requerimientosNutricionales' ? 'active' : ''}`} 
                  onClick={() => {
                      scrollToSection('requerimientosNutricionales');
                      setActiveButton('requerimientosNutricionales');
                      }} 
                  href='#requerimientosNutricionales'
                  >
                    Requerimientos Nutricionales
                </Button>
                <Button 
                  className={`btn-sidebar ${activeButton === 'fertilizantes' ? 'active' : ''}`} 
                  onClick={() => {
                      scrollToSection('fertilizantes');
                      setActiveButton('fertilizantes');
                      }} 
                  href='#fertilizantes'
                  >
                    Fertilizantes
                </Button>
                <Button 
                  className={`btn-sidebar ${activeButton === 'intepretacionAnalisis' ? 'active' : ''}`} 
                  onClick={() => {
                      scrollToSection('intepretacionAnalisis');
                      setActiveButton('intepretacionAnalisis');
                      }} 
                  href='#intepretacionAnalisis'
                  >
                    Interpretación de Análisis
                </Button>          
                
            </div>        
                                
            <Offcanvas show={show} onHide={handleClose} responsive="lg" className="contenedor-offcanvas">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>Contenido</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Button 
                  className={`btn-sidebar ${activeButton === 'tecnicasDeMuestreo' ? 'active' : ''}`} 
                  onClick={() => {
                      scrollToSection('tecnicasDeMuestreo');
                      setActiveButton('tecnicasDeMuestreo');
                      handleClose
                      }} 
                  href='#tecnicasDeMuestreo'
                  >
                    Técnicas de Muestreo
                </Button>
                <Button 
                  className={`btn-sidebar ${activeButton === 'tiposAnalisis' ? 'active' : ''}`} 
                  onClick={() => {
                      scrollToSection('tiposAnalisis');
                      setActiveButton('tiposAnalisis');
                      handleClose
                      }} 
                  href='#tiposAnalisis'
                  >
                    Tipos de Análisis
                </Button>
                <Button 
                  className={`btn-sidebar ${activeButton === 'requerimientosNutricionales' ? 'active' : ''}`} 
                  onClick={() => {
                      scrollToSection('requerimientosNutricionales');
                      setActiveButton('requerimientosNutricionales');
                      handleClose
                      }} 
                  href='#requerimientosNutricionales'
                  >
                    Requerimientos Nutricionales
                </Button>
                <Button 
                  className={`btn-sidebar ${activeButton === 'fertilizantes' ? 'active' : ''}`} 
                  onClick={() => {
                      scrollToSection('fertilizantes');
                      setActiveButton('fertilizantes');
                      handleClose
                      }} 
                  href='#fertilizantes'
                  >
                    Fertilizantes
                </Button>
                <Button 
                  className={`btn-sidebar ${activeButton === 'intepretacionAnalisis' ? 'active' : ''}`} 
                  onClick={() => {
                      scrollToSection('intepretacionAnalisis');
                      setActiveButton('intepretacionAnalisis');
                      handleClose
                      }} 
                  href='#intepretacionAnalisis'
                  >
                    Interpretación de Análisis
                </Button>  
              </Offcanvas.Body>
            </Offcanvas>               
            
            <div className='derecha-help'>

              <Button variant='primary' onClick={handleShow} className='boton-offcanvas'>En esta página</Button>

                <h1>¡Aprendamos sobre el Proceso!</h1>
                <p>Aquí puedes ver parte de el proceso que realizamos en Agrolitycs y los valores que utilizamos para brindarte los resultados más acertados.</p>

                <h2 className='tituloPrincipal' id='tecnicasDeMuestreo'>Técnicas de Muestreo</h2>

                <p >Dentro del proceso que culmina con el análisis de una muestra de suelo en un laboratorio, la fase de muestreo emerge como un factor crítico que puede influir significativamente en los resultados obtenidos. Es esencial reconocer que la precisión del análisis y, por ende, la calidad de la información sobre la fertilidad del suelo, depende en gran medida de una ejecución meticulosa durante la etapa de muestreo.</p>
                <p>Garantizar una técnica de muestreo adecuada se traduce en la capacidad de ajustar la fertilización de manera precisa, adaptándola a las condiciones específicas de cada lote. Este enfoque no solo optimiza la eficiencia en el uso de insumos, sino que también minimiza los riesgos asociados con la pérdida de nutrientes fuera del sistema.</p>
                <p>La fiabilidad de los resultados obtenidos, aunque se respalda en la competencia del laboratorio de suelos, está intrínsecamente ligada a la representatividad de la muestra extraída en relación con el sitio que se busca caracterizar. Para lograr esto de manera efectiva, es imperativo considerar varios aspectos clave, como la delimitación de áreas homogéneas para el muestreo, la elección cuidadosa de elementos y materiales para la toma de muestras, el tipo de muestra requerida, la extracción precisa de muestras y submuestras, así como el adecuado acondicionamiento, conservación y transporte de las mismas. La identificación clara de cada muestra completa este conjunto de prácticas esenciales para asegurar la validez y representatividad de los datos recopilados.</p>

                <h3 className='tituloPrincipal'>Primer paso: delimitación de áreas homogéneas de muestreo</h3>
                <p>Para establecer áreas homogéneas se deberían tener en cuenta algunos elementos de apoyo, así como ciertos aspectos generales; entre otros, los siguientes:</p>
                <ul>
                  <li>Uso de cartas topográficas, fotografías aéreas y mapas de suelos, mapas de rendimientos, de riesgo de inundación, etc.</li>
                  <li>Historia del lote: si es de uso agrícola o ganadero, secuencia de cultivos o pasturas previos, rendimientos, análisis de suelo y fertilizaciones anteriores, etc.</li>
                  <li>Tipo de relieve (si es plano o tiene pendiente).</li>
                  <li>Intensidad de uso y grado de deterioro del suelo.</li>
                  <li>Diferencias en la vegetación.</li>
                </ul>

                <p>Desde Agrolitycs proporcionamos a través de un mapa visual dos tipos de muestreo, en dónde te indicamos los puntos dentro del lote en dónde se recomienda tomar la muestra.</p>

                <p>Si se trata de un lote dedicado a agricultura, normalmente se muestrea en el entresurco del cultivo 
                    anterior. En aquellos casos donde no se puede identificar la ubicación de las líneas (que separan 
                    las áreas consideradas homogéneas), este trabajo puede tornarse complicado, y es conveniente en 
                    tal situación realizar un muestreo “apareado”. Esto significa que, por cada una de las muestras tomadas al azar, 
                    se debe obtener una segunda sub muestra, separada de la anterior a una distancia 
                    equivalente al 50% de la distancia entre surcos de la última campaña y perpendicular a la dirección 
                    de siembra.
                </p>

                <h3 className='tituloPrincipal'>Segundo paso: selección de elementos y materiales para la toma de muestras</h3>
                <p>Presentamos una lista de elementos y materiales necesarios para la toma de muestra:</p>

                <ul>
                  <li>Barrenos: elemento que permite la toman de muestra con mayor rapidez y uniformemente.</li>
                  <li>Palas.</li>
                  <li>Contenedor limpio.</li>
                  <li>Regla para medir la profundidad.</li>
                  <li>Bolsas de plásticos limpias y resistentes.</li>
                  <li>Rótulo de identificación de la toma de muestra proporcionado por Agrolitycs.</li>
                </ul>

                <Card className='contendorCard'>
                  <Card.Body className='bodyCard'>
                    <Card.Title className="mb-2 ">Nota</Card.Title>
                    <Card.Text>
                    Si se desea analizar micronutrientes, deben tomarse las debidas precauciones para evitar que 
                    las herramientas de muestreo no los contengan, a fin de no contaminar la muestra y, por lo tanto, 
                    alterar los resultados de los análisis. Por ejemplo, evitar el uso de elementos de hierro o galvanizados. 
                    Sí pueden usarse materiales de plástico y de acero inoxidable, procurando, en este caso tomar 
                    las submuestras de un sector del pan de suelo que no haya estado en contacto con el implemento.
                    </Card.Text>
                  </Card.Body>
                </Card>

                <h3 className='tituloPrincipal'>Tercer paso: selección de tipo de muestra</h3>

                <h5 className='tituloSecundario'>Número de muestras y submuestras</h5>

                <p><strong>Muestra simple:</strong> se obtiene a través de una única extracción de suelo y se utiliza generalmente 
                  en trabajos de investigación y/o cuando son suelos muy homogéneos.
                </p>

                <p>
                <strong>Muestra compuesta:</strong> se ontiene al extraer de cada lote varias muestras simples (submuestras),
                  tomadas a la misma profundidad y con un volumen de suelo semejante.
                  Luego son mezcladas en recipiente y se extrae una sola muestra de 1kg de suelo aproximandamente.
                  Cuanto mayor sea la cantidad de submuestras, más representativo será el muestreo y los resultados de laboratorio más 
                  próximos a la realidad del campo.
                </p>

                <h5 className='tituloSecundario'>Tipo de muestro</h5>
                <p>Una vez definidas las áreas homogéneas en el lote o parecela, se procede al muestreo.</p>

                <p>
                  <strong>Muestreo sistemático espacial:</strong> es el método más apropiado si el objetivo es producir mapas para la aplicación variable 
                  de fertilizantes. Las muestras son tomadas a intervalos regulares en todas las direcciones.
                  En este caso es necesario definir previamente los puntos de muestreo, georreferenciarlos y luego idenficar las muestras con 
                  precisioón.
                </p>

                <p>Existen varios tipos de muestreo sistemático: cuadrícula, zig-zag, diagonal y sinuosa.</p>
                <p>Desde Agrolitics te brindamos la posibilidad de generar un muestreo sistemático directamente en el mapa del lote que deseas muestrear.</p>

                <div className='centrarImagen'>
                  <Image src={muestroSistematico} rounded  className='imagenEducacion'/>
                </div>
                

                <p>
                  <strong>Muestro aleatorio o no sistematizado:</strong> consiste en recorrer el lote, recolectando submuestras al azar, que luego son
                  mezcladas para formar la muestra compuesta.
                </p>
                <p>Desde Agrolitics te brindamos la posibilidad de generar un muestreo aleatorio directamente en el mapa del lote que deseas muestrear.</p>

                <div className='centrarImagen'>
                  <Image src={muestreoAleatorio} rounded className='imagenEducacion'/>
                </div>
                

                <h5 className='tituloSecundario'>Profundidad de muestreo y condiciones de humedad</h5>
                <p>La profundidad de muestreo depende del objetivo del análisis, del párametro que se desea evaluar, del tipo de labranza y de la profundidad de
                  exploración que alcanzan las raíces del cultivo.
                </p>
                <ul>
                  <li>
                    Así, para la mayoría de las determinaciones de parámetros de menor variabilidad y/movilidad 
                    en el tiempo y/o en el espacio, tales como materia orgánica, fosforo extractable, pH, 
                    la profundidad recomendada es de 0-20 cm. 
                  </li>
                  <li>
                  En el caso de diagnósticos de fertilización nitrogenada, dado la movilidad de los nitratos en el 
                  suelo, se deberían tomar muestras hasta los 60 cm de profundidad, extrayendo tres estratos de 
                  20 cm cada uno (0-20, 20-40 y 40-60 cm) o la profundidad considerada acorde al método de 
                  diagnóstico utilizado. 
                  </li>
                  <li>
                  Para situaciones en las cuales se sospecha salinidad y/o sodicidad, y por lo tanto se analizará conductividad eléctrica o porcentaje de sodio intercambiable (PSI), también se recomienda 
                  muestrear hasta los 60 cm y por estratos: 0-20, 20-40 y de 40-60 cm. Si sólo se muestrea en 
                  superficie se puede arribar a una conclusión errónea al subestimar la verdadera situación del 
                  suelo, dado que el valor de estas variables puede incrementarse a mayor profundidad, afectando la calidad del suelo y la productividad de los cultivos
                  </li>
                  <li>
                  Para estimar el dato de agua disponible, el muestreo puede hacerse cada 30 cm, hasta el 1,5 m 
                  de profundidad. 
                  </li>
                </ul>

                <p>
                Es muy importante respetar la profundidad de muestreo, sobre todo en suelos secos y/o duros, 
                porque se tiende a muestrear a menor profundidad, sobreestimando o subestimando el valor del 
                parámetro controlado debido a la estratificación.
                </p>

                <h3 className='tituloPrincipal'>Cuarto paso: extracción de las muestras y submuestras</h3>

                <p>
                Antes de proceder a la extracción propiamente dicha de cada muestra o submuestra, se debe eliminar la cobertura vegetal u hojarasca presente sobre la superficie de cada punto elegido, evitando 
                eliminar la capa superior del suelo.
                </p>
                <ul>
                  <li>
                  Con barrenos: introducir la herramienta hasta la profundidad deseada y extraer las submuestras, 
                  luego colocarlas en una bolsa grande o balde limpios.
                  </li>
                  <li>
                  Con pala: Efectuar cortes hasta la profundidad deseada. Cavar una primera palada haciendo un hoyo en forma de V, 
                  descartar el suelo al costado. Luego realizar una segunda palada de unos 3 cm de espesor aproximadamente, descartando los bordes y 
                  colocar el suelo en una bolsa o balde limpios.
                  </li>
                </ul>

                <p>
                Una vez recolectadas todas las submuestras de una muestra compuesta, se deben romper los agregados (“desterronar”) 
                hasta un tamaño de aproximadamente 1 cm y mezclar lo más uniformemente posible. Si el tamaño de la muestra fuera 
                superior al que se enviará al laboratorio (0,5 a 1 kg), es necesario reducir el tamaño mediante cuarteos y conservar 
                sólo el material necesario. El desterronado y la mezcla, según las circunstancias, puede hacerse a medida que se va 
                muestreando o al finalizar la toma de muestras, previo al envío al laboratorio.
                </p>

                <Card className='contendorCard'>
                  <Card.Body className='bodyCard'>
                    <Card.Title className="mb-2">¿Qué es el cuarteo?</Card.Title>
                    <Card.Text>
                      Si la cantidad de muestra que se tomó supera el peso recomendado por el laboratorio, ésta se debe 
                      reducir mediante el procedimiento de cuarteo que consiste en esparcir la muestra de suelo, previamente mezclada, 
                      sobre una lona o plástico limpios. Luego se divide en 4 partes y se conservan dos cuartos diagonales. 
                      Se debe repetir el procedimiento hasta llegar a la cantidad de muestra deseada, la cual se embolsará para su envío al laboratorio. 
                    </Card.Text>
                  </Card.Body>
                </Card>

                <h3 className='tituloPrincipal'>Quinto paso: acondicionamiento, rotulado, conservación y transporte de la muestra</h3>
                <p>
                  Las muestras compuestas se deben homogeneizar mediante mezclado, colocar en bolsas plásticas limpias (sin uso), cerrar 
                  herméticamente la bolsa e identificar con datos claros y precisos mediante un rótulo y rotular de manera clara, 
                  con una identificación unívoca y sencilla. 
                </p>

                <div className='centrarImagen'>
                  <Image src={rotulo} rounded className='imagen-rotulo'/>
                </div>

                <p>
                  Para realizar algunas determinaciones (por ejemplo, el análisis de nitratos), es necesario que la muestra se conserve refrigerada 
                  (no más de 8 a 12 °C) hasta que sea entregada al laboratorio, lo cual debe hacerse en un lapso no mayor a 24-48 hs. 
                  En estos casos, lo recomendable es colocar el suelo en la bolsa inmediatamente después de tomada la muestra, comprimirlo 
                  como para que quede la menor cantidad de aire posible adentro, sellar la bolsa y refrigerarla tan pronto como sea posible. 
                  Para ello es necesario llevar al campo heladeras o conservadoras con refrigerantes congelados (o elementos que cumplan esa función, 
                  por ejemplo, botellas de agua de 500 ml congeladas). 
                </p>

                <Card className='contendorCard'>
                  <Card.Body className='bodyCard'>
                    <Card.Title className="mb-2">Tener en cuenta las siguientes recomendaciones:</Card.Title>
                    <Card.Text>
                      <ul>
                        <li>
                          Si se rotulara directamente sobre la superficie de la bolsa, recordar usar marcador resistente al agua. 
                        </li>
                        <li>
                          Si se emplearan etiquetas de papel, no se deberían colocar en contacto con el suelo, dado que, con la humedad, 
                          se deteriorarían y se perdería la información. En estos casos, es recomendable usar doble bolsa y la etiqueta 
                          ubicarla entre ambas. 
                        </li>
                        <li>
                          Aunque el propósito del muestreo no requiera de la refrigeración de la muestra, ésta se debe conservar, dentro de lo posible, 
                          en lugar fresco y oscuro.
                        </li>
                      </ul>
                    </Card.Text>
                  </Card.Body>
                </Card>

                <h2 className='tituloPrincipal' id='tiposAnalisis'>Tipos de Análisis</h2>
                <p>El análisis de suelo cumple un papel fundamental dentro del proceso, ya que tiene como objetivo analizar los niveles de nutrientes del suelo. Esta evaluación es esencial en etapas posteriores del proceso, ya que facilita la formulación de un plan adecuado de recomendación de fertilizantes a aplicar en el suelo para de esta forma garantizar que se mantenga el suelo en óptimas condiciones para el crecimiento de cultivos y  se alcancen los rendimientos esperados.</p>
                <p>Los resultados obtenidos del análisis revelan la presencia de niveles óptimos, deficiencias o excesos de nutrientes en el suelo, brindando información valiosa para ajustar las prácticas de manejo y mejorar la salud del suelo.</p>
                <p>Existen diferentes tipos de análisis de suelo, ya que el mismo es un sistema complejo y diverso; cada tipo de análisis aborda aspectos específicos del suelo y proporciona información valiosa para entender su calidad y salud. Es imposible que un solo análisis de suelo abarque de manera exhaustiva todas las propiedades del suelo a analizar. Además, es relevante destacar que cada tipo de análisis conlleva diferentes costos debido a la complejidad de las pruebas y el esfuerzo requerido por los laboratorios para obtener resultados precisos. Es por estos factores que existen una diversidad de tipos de análisis:</p>

                <ul>
                  <li><strong>Análisis Completo:</strong> Abarca macronutrientes, micronutrientes, características físicas, químicas y biológicas del suelo, es decir, un conocimiento detallado del suelo. Materia Orgánica, Carbono Orgánico, Nitrógeno Total, Nitrógeno Anaeróbico, Nitratos, Fósforo Extraíble, pH, Conductividad Eléctrica, Azufre, Cationes de Intercambio (Calcio, Magnesio, Sodio, Potasio), Capacidad de Intercambio Catiónico, Valor de Insaturación, Aluminio, Textura del Suelo (Arcilla, Limo y Arena), Humedad Gravimétrica y Densidad Aparente.</li>
                  <li><strong>Análisis Básico:</strong> Abarca los parámetros esenciales para evaluar las condiciones generales del suelo y su capacidad para sostener el crecimiento de los cultivos. Materia Orgánica, Carbono Orgánico, Nitrógeno Total, Fósforo Extraíble, pH, Aluminio, Cationes de Intercambio (Calcio, Magnesio, Sodio, Potasio), Capacidad de Intercambio Catiónico, Azufre y Densidad Aparente.</li>
                  <li><strong>Análisis de Agua Útil:</strong> Abarca parámetros para evaluar la calidad de agua disponible para las plantas en suelo y su impacto en los cultivos. pH,  Conductividad Eléctrica, Relación Absorción Sodio, CSR, Cloruros, Nitratos, Fosfatos, Residuo Seco, Dureza Total, Alcalinidad Total, Humedad Gravimétrica, Sulfatos, Boro y Densidad Aparente.</li>
                </ul>

                <p>La combinación de estos análisis a lo largo del tiempo proporciona una visión completa del suelo, permitiendo a los ingenieros agrónomos tomar decisiones informadas sobre prácticas agrícolas, correcciones y mejoras para optimizar la salud del suelo y maximizar los rendimientos esperados.</p>

                <h2 className='tituloPrincipal' id='requerimientosNutricionales'>Requerimientos nutricionales de los cultivos</h2>
                <p>El adecuado suministro de nutrientes de manera equilibrada y precisa es esencial para promover el desarrollo sostenible de la agricultura, aumentar la producción y productividad agrícola, cerrar brechas de rendimiento y mejorar la rentabilidad. En Argentina, la fertilidad química de los suelos está experimentando una marcada insuficiencia. Observamos déficits de nutrientes, pérdidas significativas de materia orgánica y deterioro de las propiedades físicas del suelo, entre otros problemas.</p>
                <p>Para preservar la fertilidad del suelo y alcanzar rendimientos y calidad óptimos en los cultivos, es crucial implementar un manejo integrado del agroecosistema. Debe llevarse a cabo la reposición de nutrientes consumidos durante el ciclo del cultivo utilizando diversas fuentes. Este equilibrio entre la oferta de nutrientes y las necesidades de los cultivos permite maximizar los rendimientos mientras se minimizan las pérdidas al medio ambiente. En aquellos suelos donde resulta económicamente viable, aplicar dosis elevadas de nutrientes, combinadas con otras prácticas de manejo de cultivos que mejoren las condiciones físicas del suelo o el riego, puede aumentar la eficiencia en el uso de los nutrientes.</p>
                <p>La fertilización, como fuente de aporte de nutrientes, es la práctica más común y de respuesta más inmediata en la producción agropecuaria. Cada tipo de fertilizante tiene sus propias ventajas y desventajas, dependiendo de su forma de aplicación y de las condiciones agroecológicas y económicas locales.</p>
                <p>Para determinar las necesidades de fertilización, se realiza un diagnóstico basado en análisis de suelos. Las recomendaciones nutricionales tienen en cuenta de manera integral las necesidades agronómicas de los cultivos, en conjunto con los resultados productivos esperados.</p>
                <p>En Argentina, se han establecido estrategias para el manejo de la nutrición de los cultivos, iniciando con la evaluación de los requisitos específicos de cada cultivo y calculando las dosis en función del rendimiento esperado en cada lote.</p>
                <p>Presentamos aquí los requerimientos nutricionales de cada uno de los cultivos para los que Agrolitycs genera recomendaciones de fertilización. Los valores se encuentran expresados en Kg/Ton.</p>

                <Table striped bordered hover size="sm" responsive className='tabla'>
                  <thead>
                    <tr>
                      <th>Nutriente</th>
                      <th>Maiz</th>
                      <th>Soja</th>
                      <th>Trigo</th>
                      <th>Sorgo Granífero</th>
                      <th>Cebada</th>
                      <th>Girasol</th>
                      <th>Alfalfa</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>N</td>
                      <td>22</td>
                      <td>75</td>
                      <td>30</td>
                      <td>30</td>
                      <td>26.3</td>
                      <td>40</td>
                      <td>27</td>
                    </tr>
                    <tr>
                      <td>P<sub>2</sub>O<sub>5</sub></td>
                      <td>9.164</td>
                      <td>16.037</td>
                      <td>11.455</td>
                      <td>10.08</td>
                      <td>9.164</td>
                      <td>25.2</td>
                      <td>5.73</td>
                    </tr>
                    <tr>
                      <td>K<sub>2</sub>O</td>
                      <td>22.895</td>
                      <td>47.151</td>
                      <td>22.895</td>
                      <td>3.374</td>
                      <td>22.9</td>
                      <td>35</td>
                      <td>25.3</td>
                    </tr>
                    <tr>
                      <td>CaO</td>
                      <td>4.197</td>
                      <td>22.384</td>
                      <td>4.197</td>
                      <td>5.6</td>
                      <td>27.6</td>
                      <td>25.2</td>
                      <td>16.8</td>
                    </tr>
                    <tr>
                      <td>MgO</td>
                      <td>4.974</td>
                      <td>14.922</td>
                      <td>6.632</td>
                      <td>7.5</td>
                      <td>-</td>
                      <td>18.24</td>
                      <td>5</td>
                    </tr>
                    <tr>
                      <td>S</td>
                      <td>4</td>
                      <td>4.5</td>
                      <td>5</td>
                      <td>3.75</td>
                      <td>4.15</td>
                      <td>5</td>
                      <td>3.5</td>
                    </tr>
                    <tr>
                      <td>B</td>
                      <td>0.02</td>
                      <td>0.025</td>
                      <td>0.025</td>
                      <td>-</td>
                      <td>-</td>
                      <td>0.165</td>
                      <td>0.03</td>
                    </tr>
                    <tr>
                      <td>Cl</td>
                      <td>0.444</td>
                      <td>0.237</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>Cu</td>
                      <td>0.013</td>
                      <td>0.025</td>
                      <td>0.01</td>
                      <td>-</td>
                      <td>-</td>
                      <td>0.019</td>
                      <td>0.007</td>
                    </tr>
                    <tr>
                      <td>Fe</td>
                      <td>0.125</td>
                      <td>0.3</td>
                      <td>0.137</td>
                      <td>-</td>
                      <td>-</td>
                      <td>0.261</td>
                      <td>0.04</td>
                    </tr>
                    <tr>
                      <td>Mn</td>
                      <td>0.189</td>
                      <td>0.15</td>
                      <td>0.07</td>
                      <td>-</td>
                      <td>-</td>
                      <td>0.055</td>
                      <td>0.025</td>
                    </tr>
                    <tr>
                      <td>Mo</td>
                      <td>0.001</td>
                      <td>0.005</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>0.029</td>
                      <td>0.0003</td>
                    </tr>
                    <tr>
                      <td>Zn</td>
                      <td>0.053</td>
                      <td>0.06</td>
                      <td>0.052</td>
                      <td>-</td>
                      <td>-</td>
                      <td>0.099</td>
                      <td>0.015</td>
                    </tr>
                    <tr>
                      <td>Ni</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  </tbody>
                </Table>
                <p className='fuente-10pt'>Valores obtenidos del <a href="http://lacs.ipni.net/">International Plant Nutrition Institute (IPNI)</a></p>
                <p className='fuente-10pt'>NOTA: Algunos nutrientes ya se presentan en su forma oxidada debido a que es la forma en la que se encuentran en los fertilizantes comerciales.</p>

                <h2 className='tituloPrincipal' id='fertilizantes'>Fertilizantes</h2>
                <p>Los fertilizantes desempeñan un papel crucial en la optimización de la salud y el rendimiento de los cultivos agrícolas. Estos insumos esenciales no solo corrigen las deficiencias nutricionales en las plantas, sino que también elevan la calidad y la cantidad de los alimentos que llegan a nuestra mesa.</p>

                <h5 className='tituloSecundario'>Nutrientes a medida</h5>
                <p>Los fertilizantes son diseñados para abordar deficiencias específicas de nutrientes en las plantas. Por ejemplo, los fertilizantes nitrogenados suplen la necesidad de nitrógeno, mientras que los fosfatados son clave para garantizar un adecuado suministro de fosfato.</p>

                <h5 className='tituloSecundario'>Impulso a la producción</h5>
                <p>Al proporcionar nutrientes esenciales, los fertilizantes se convierten en aliados indispensables en la producción de alimentos y cultivos comerciales. Mejoran la productividad y la calidad de los cultivos, contribuyendo a la seguridad alimentaria global.</p>

                <h5 className='tituloSecundario'>Revitalizando suelos agotados</h5>
                <p>La sobreexplotación de los suelos puede resultar en una disminución de la fertilidad. Los fertilizantes desempeñan un papel crucial en revitalizar estos suelos agotados, restaurando su capacidad para sustentar el crecimiento vegetal.</p>

                <h5 className='tituloSecundario'>Dosificación precisa</h5>
                <p>Cada cultivo tiene necesidades nutricionales específicas, y la cantidad de fertilizante requerida varía según el rendimiento esperado. El cálculo preciso de las dosis de fertilizantes, basado en los nutrientes necesarios y la disponibilidad de diferentes tipos y grados, es fundamental para optimizar los resultados.</p>

                <p>En la siguiente tabla se observan los distintos tipos de fertilizantes que utilizamos en Agrolitycs para realizar las recomendaciones de fertilizantes, así cómo su fórmula química y su composición aproximada.</p>

                <Table striped bordered hover size="sm" responsive className='tabla'>
                  <thead>
                    <tr>
                      <th>Fertilizante</th>
                      <th>Fórmula Química</th>
                      <th colSpan={7}>Concentración (%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                      <td></td>
                      <td>N</td>
                      <td>P<sub>2</sub>O<sub>2</sub></td>
                      <td>K<sub>2</sub>O</td>
                      <td>CaO</td>
                      <td>MgO</td>
                      <td>S</td>
                      <td>Cl</td>
                    </tr>
                    <tr>
                      <td colSpan={9} className='sub-encabezado'>Nitrogenados</td>
                    </tr>
                    <tr>
                      <td>Urea</td>
                      <td>CO(NH<sub>2</sub>)<sub>2</sub></td>
                      <td>46</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td> 
                    </tr>
                    <tr>
                      <td>UAN 32</td>
                      <td>CO(NH<sub>2</sub>)<sub>2</sub> + NH<sub>4</sub>NO<sub>3</sub></td>
                      <td>32</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>Sulfato de Amonio</td>
                      <td>NH<sub>4</sub>NO<sub>3</sub> + (NH<sub>4</sub>)<sub>2</sub>SO<sub>4</sub></td>
                      <td>21</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>24</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>Nitrato de Amonio Calcáreo (CAN27)</td>
                      <td>NH<sub>4</sub>NO<sub>3</sub> + (CaCO<sub>3</sub>)</td>
                      <td>27</td>
                      <td>-</td>
                      <td>-</td>
                      <td>12</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>Sulfonitrato de Amonio</td>
                      <td>(NH<sub>4</sub>)<sub>2</sub>SO<sub>4</sub></td>
                      <td>26</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>14</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td colSpan={9} className='sub-encabezado'>Fosfatados</td>
                    </tr>
                    <tr>
                      <td>Fosfato Monoamónico (MAP)</td>
                      <td>NH<sub>4</sub>PO<sub>4</sub></td>
                      <td>11</td>
                      <td>52</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>Fosfato Diamónico (DAP)</td>
                      <td>(NH<sub>4</sub>)<sub>2</sub>H<sub>2</sub>PO<sub>4</sub></td>
                      <td>18</td>
                      <td>46</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>Superfosfato Simple (SPS)</td>
                      <td>Ca(H<sub>2</sub>PO<sub>4</sub>)<sub>2</sub> H<sub>2</sub>O + CaSO<sub>4</sub></td>
                      <td>-</td>
                      <td>21</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>Superfosfato Triple (SPT)</td>
                      <td>Ca(H<sub>2</sub>PO<sub>4</sub>)<sub>2</sub> H<sub>2</sub>O</td>
                      <td>-</td>
                      <td>46</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td colSpan={9} className='sub-encabezado'>Potásicos</td>
                    </tr>
                    <tr>
                      <td>Nitrato de Potasio</td>
                      <td>KNO<sub>3</sub></td>
                      <td>13</td>
                      <td>-</td>
                      <td>44</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>Cloruro Potásico</td>
                      <td>KCl</td>
                      <td>-</td>
                      <td>-</td>
                      <td>60</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>Sulfato de Potasio</td>
                      <td>K<sub>2</sub>SO<sub>4</sub></td>
                      <td>-</td>
                      <td>-</td>
                      <td>50</td>
                      <td>-</td>
                      <td>-</td>
                      <td>18</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td colSpan={9} className='sub-encabezado'>Cálcicos</td>
                    </tr>
                    <tr>
                      <td>Carbonato de Calcio</td>
                      <td>Ca(OH)<sub>2</sub></td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>89</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>Cloruro de Calcio</td>
                      <td>CaCl<sub>2</sub></td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>90</td>
                      <td>-</td>
                      <td>-</td>
                      <td>64</td>
                    </tr>
                    <tr>
                      <td>Nitrato de Calcio</td>
                      <td>Ca(NO<sub>3</sub>)<sub>2</sub> 4H<sub>2</sub>O</td>
                      <td>15</td>
                      <td>-</td>
                      <td>-</td>
                      <td>48</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td colSpan={9} className='sub-encabezado'>Magnésicos</td>
                    </tr>
                    <tr>
                      <td>Dolomita</td>
                      <td>CaCO<sub>3</sub> + MgCO<sub>3</sub></td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>33</td>
                      <td>14</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>Sulfato de Magnesio</td>
                      <td>MgSO<sub>4</sub> H<sub>2</sub>O</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>17</td>
                      <td>23</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>Nitrato de Magnesio</td>
                      <td>Mg(NO<sub>3</sub>)<sub>2</sub> 6H<sub>2</sub>O</td>
                      <td>11</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>15</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td colSpan={9} className='sub-encabezado'>Azufrados</td>
                    </tr>
                    <tr>
                      <td>Sulfato de Amonio</td>
                      <td>(NH<sub>4</sub>)<sub>2</sub> SO<sub>4</sub></td>
                      <td>21</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>24</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>Sulfato de Calcio</td>
                      <td>CaSO<sub>4</sub> 2H<sub>2</sub>O</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>25</td>
                      <td>-</td>
                      <td>16</td>
                      <td>-</td>
                    </tr>
                  </tbody>
                </Table>
                <p className='fuente-10pt'>Valores obtenidos del <a href="http://lacs.ipni.net/">International Plant Nutrition Institute (IPNI)</a></p>
                <p className='fuente-10pt'>NOTA: Algunos nutrientes ya se presentan en su forma oxidada debido a que es la forma en la que se encuentran en los fertilizantes comerciales.</p>


                <h3 className='tituloPrincipal'>Compatibilidad de Fertilizantes</h3>
                <p>Antes de aplicar los diferentes tipos de fertilizantes, se debe corroborar que éstos sean compatibles entre sí. La mala utilización de los mismos puede causar daños a la tierra y a los cultivos.</p>
                <p>En Agrlitycs nos aseguramos de que los fertilizantes que recoemendamos para el tratamiento del lote, sean copatibles entre sí.</p>
                <p>En caso de que desees reemplazar algún fertilizante por otro, te proporcionamos una tabla con las distintas compatiblidades para que tus cultivos estén a salvo.</p>

                <div className='centrarImagen'>
                  <Image src={compatibilidadFertilizantes} rounded className='imagen-fertilizantes'/>
                </div>

                <h2 className='tituloPrincipal' id='intepretacionAnalisis'>Interpretación de análisis de suelo</h2>
                <p>En Agrolitycs proporcionamos una interpretación de los diferentes parámetros que se pueden encontrar en los análisis de suelo.</p>
                <p>Ponemos a disposición de usted, todas las tablas de las cuales nos basamos para este proceso.</p>

                <Table striped bordered hover size="sm" responsive className='tabla'>
                  <thead>
                    <tr>
                      <th>Concepto</th>
                      <th>Unidad de medida</th>
                      <th>Bajo</th>
                      <th>Medio</th>
                      <th>Óptimo</th>
                      <th>Alto</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Materia Orgánica</td>
                      <td>%</td>
                      <td>&lt; 2</td>
                      <td>2 - 5</td>
                      <td>5.1 - 10</td>
                      <td>&gt; 10</td>
                    </tr>
                    <tr>
                      <td>pH</td>
                      <td>Sin unidad</td>
                      <td>&lt; 5</td>
                      <td>5 - 6</td>
                      <td>6.1 - 7</td>
                      <td>&gt; 7</td>
                    </tr>
                    <tr>
                      <td>Calcio</td>
                      <td>meq/100gr</td>
                      <td>&lt; 4</td>
                      <td>4 - 6</td>
                      <td>6.1 - 15</td>
                      <td>&gt; 15</td>
                    </tr>
                    <tr>
                      <td>Magnesio</td>
                      <td>meq/100gr</td>
                      <td>&lt; 1</td>
                      <td>1 - 3</td>
                      <td>3.1 - 6</td>
                      <td>&gt; 6</td>
                    </tr>
                    <tr>
                      <td>Potasio</td>
                      <td>meq/100gr</td>
                      <td>&lt; 0.2</td>
                      <td>0.2 - 0.5</td>
                      <td>0.51 - 0.8</td>
                      <td>&gt; 0.8</td>
                    </tr>
                    <tr>
                      <td>Fósforo</td>
                      <td>mg/L = ppm</td>
                      <td>&lt; 12</td>
                      <td>12 - 20</td>
                      <td>21 - 50</td>
                      <td>&gt; 50</td>
                    </tr>                  
                    <tr>
                      <td>Azufre</td>
                      <td>mg/L = ppm</td>
                      <td>&lt; 12</td>
                      <td>12 - 20</td>
                      <td>21 - 50</td>
                      <td>&gt; 50</td>
                    </tr>        
                  </tbody>
                </Table>

                <Table striped bordered hover size="sm" responsive className='tabla'>
                  <thead>
                    <tr>
                      <th>Nitrógeno Total (%)</th>
                      <th>Clasificación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>&lt; 0.032</td>
                      <td>Extremadamente pobre</td>
                    </tr>
                    <tr>
                      <td>0.032 - 0.063</td>
                      <td>Pobre</td>
                    </tr>
                    <tr>
                      <td>0.064 - 0.095</td>
                      <td>Medianamente pobre</td>
                    </tr>
                    <tr>
                      <td>0.096 - 0.126</td>
                      <td>Medio</td>
                    </tr>
                    <tr>
                      <td>0.127 - 0.158</td>
                      <td>Medianamente rico</td>
                    </tr>
                    <tr>
                      <td>0.159 - 0.221</td>
                      <td>Rico</td>
                    </tr>
                    <tr>
                      <td>&gt; 0.221</td>
                      <td>Extremadamente rico</td>
                    </tr>
                  </tbody>
                </Table>   

                <Table striped bordered hover size="sm" responsive className='tabla'>
                  <thead>
                    <tr>
                      <th>Carbono Orgánico (%)</th>
                      <th>Clasificación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>&lt; 0.75</td>
                      <td>Muy bajo</td>
                    </tr>
                    <tr>
                      <td>0.75 - 1.25</td>
                      <td>Bajo</td>
                    </tr>
                    <tr>
                      <td>1.26 - 1.50</td>
                      <td>Algo bajo</td>
                    </tr>
                    <tr>
                      <td>1.51 - 2.00</td>
                      <td>Moderado</td>
                    </tr>
                    <tr>
                      <td>2.01 - 3.00</td>
                      <td>Bueno</td>
                    </tr>
                    <tr>
                      <td>&gt; 3.00</td>
                      <td>Muy bueno</td>
                    </tr>
                  </tbody>
                </Table> 

                <Table striped bordered hover size="sm" responsive className='tabla'>
                  <thead>
                    <tr>
                      <th>PSI (%)</th>
                      <th>Clasificación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>7 - 15</td>
                      <td>Ligeramente sódico</td>
                    </tr>
                    <tr>
                      <td>16 - 20</td>
                      <td>Moderadamente sódico</td>
                    </tr>
                    <tr>
                      <td>21 - 30</td>
                      <td>Fuertmente sódico</td>
                    </tr>
                    <tr>
                      <td>&gt; 30</td>
                      <td>Extremádamente sódico</td>
                    </tr>
                  </tbody>
                </Table>              

                <Table striped bordered hover size="sm" responsive className='tabla'>
                  <thead>
                    <tr>
                      <th>Nitratos N-N0<sub>3</sub> (ppm)</th>
                      <th>Clasificación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>&lt; 20</td>
                      <td>Muy pobre</td>
                    </tr>
                    <tr>
                      <td>20 - 40</td>
                      <td>Pobre</td>
                    </tr>
                    <tr>
                      <td>41 - 80</td>
                      <td>Moderado</td>
                    </tr>
                    <tr>
                      <td>&gt; 80</td>
                      <td>Bien provisto</td>
                    </tr>
                  </tbody>
                </Table>  

                <Table striped bordered hover size="sm" responsive className='tabla'>
                  <thead>
                    <tr>
                      <th>Conductividad Eléctrica (ms/cm a 25°C)</th>
                      <th>Clasificación</th>
                      <th>Observaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>0 - 2</td>
                      <td>Normal</td>
                      <td>Sin limitaciones para el crecimiento de los cultivos.</td>
                    </tr>
                    <tr>
                      <td>2 - 4</td>
                      <td>Ligeramente salino</td>
                      <td>Con limitaciones para el crecimiento de muchos cultivos muy sensibles.</td>
                    </tr>
                    <tr>
                      <td>5 - 8</td>
                      <td>Moderadamente salino</td>
                      <td>Con limitaciones para el crecimiento de muchos cultivos y la consecuente pérdida de rendimiento.</td>
                    </tr>
                    <tr>
                      <td>9 - 16</td>
                      <td>Fuertemente salino</td>
                      <td>Apto solo para el crecimiento de cultivos tolerantes a las condiciones de salinidad.</td>
                    </tr>
                    <tr>
                      <td>&gt; 16</td>
                      <td>Extremadamente salino</td>
                      <td>Solo para muy pocos cultivos adaptados.</td>
                    </tr>
                  </tbody>
                </Table>  

                <h3 className='tituloPrincipal'>Clases texturales (Arena, Limo y Arcilla)</h3>
                <div className='centrarImagen'>
                  <Image src={clasesTexturales} rounded className='imagen-rotulo'/>
                </div>


                <p className='bibliografia'>Bibliografía: <a href="https://redbpa.org.ar/">Red de Buenas Prácticas Agropecuarias</a></p>

                <p className='bibliografia'>&copy; 2023. Agrolitycs. Todos los derechos reservados.</p>

            </div>
        </div>
        <div className='traer-frente'>
          <InformacionFooter/>
        </div> 
        </>
    );
}

export default Educacion;