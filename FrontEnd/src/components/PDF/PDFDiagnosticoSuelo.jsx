
import { Document, Page, Text, View, Image, StyleSheet, Font } from "@react-pdf/renderer"
import marcaApp from "../../assets/marcaApp.png";
import { useState } from "react";
import Cookies from "js-cookie";
// import logoAgrolitycs from "../../assets/logoAgrolitycs.png";

// Definicion de fuente
Font.register({family: "Pragmatica-ExtraLight", src: "../src/fonts/Pragmatica-ExtraLight.ttf",});


// Definición de estilos
const styles = StyleSheet.create({
    column: {
        flexDirection: 'column',
        width: '100%',
        // textAlign: 'center',
        marginTop: '15px',
        // marginLeft: "60px",
    },
    row: {
        flexDirection: 'row',
        marginBottom: '0px',
    },
    cell: {
        flexGrow: 1,
        backgroundColor: 'transparent',
        padding: 5,
        flexBasis: '100%',
        fontSize: '11pt',
    },

    rotulo: {
        border:"2px", 
        borderColor:"black",
        margin:"50px",
    },

    imagen: {
        height:"60px", 
        width:"200px",
    },

    nombre: {
        fontSize: "40px",
    },

    contenedor: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: "5px",
        gap: "30px",
    },

    margen: {
        marginLeft: "50px",
        marginRight: "50px",
    },

    page: {
        flexDirection: "row", // Organizar las columnas una al lado de la otra
        justifyContent: "space-between", // Espacio entre las columnas
        // padding: 20,
    },

    columnAnalisis: {
        flexDirection: 'column',
        width: '50%',
        // textAlign: 'center',
        marginTop: '15px',
        // marginLeft: "60px",
    },

    letra12: {
        fontSize: "11pt",
    },

    footer: {
        position: "absolute",
        bottom: 20, // Puedes ajustar la posición vertical del pie de página aquí
        left: 50,
        right: 50,
        // textAlign: "center",
        fontSize: 8,
        fontFamily: "Pragmatica-ExtraLight",
    },

    superscript: {

        textTransform: "superscript",
    },

    seccion: {
        marginTop: "25px",
    },

    separacion: {
        marginTop: "20px",
    },

    letra10: {
        fontSize: "10pt",
    },

    boldText: {
        fontWeight: "bold",
    },

    fuentePragmatica: {
        fontFamily: "Pragmatica-ExtraLight",
        fontSize: "10pt",
    },

    watermark: {
        position: "absolute",
        zIndex: 1000, // Asegura que la marca de agua esté por encima del contenido
        opacity: 0.1, // Cambia la opacidad de la marca de agua según tus preferencias
    },

    titulo: {
        marginTop: "20px",
    },
});
const PDFDiagnosticoSuelo = ({ interpretacion, diagnostico, datosLote, cultivo }) => {

    const [ fertilizantes, setFertilizantes ] = useState(Object.entries(diagnostico[0]))

    return (
        <>
        {/* // Documento PDF */}
        <Document>
            {/* Creación de página */}
            <Page size="A4">

                    {/* Logo y Título*/}
                    <View style={styles.contenedor}>

                        <Image 
                            src={marcaApp}
                            style={styles.imagen}
                        />

                        <Text style={styles.titulo}>
                            Diagnóstico del Suelo
                        </Text>
                    </View>

                    <View style={styles.margen}>
                        {/* Encabezado */}
                        <View style={styles.page}>
                            <View style={styles.columnAnalisis}>

                                {/* Fecha diagnóstico*/}
                                <View style={styles.row}>
                                    <Text style={[styles.cell, styles.letra10]}>Fecha:</Text>
                                    <Text style={[styles.cell, styles.letra10, styles.fuentePragmatica]}>{datosLote.Diagnostico_fechaAlta}</Text>
                                </View>

                                {/* Nombre Campo*/}
                                <View style={styles.row}>
                                    <Text style={[styles.cell, styles.letra10]}>Campo:</Text>
                                    <Text style={[styles.cell, styles.letra10, styles.fuentePragmatica]}>{datosLote.Campo_nombre}</Text>
                                </View>

                                {/* Nombre Lote*/}
                                <View style={styles.row}>
                                    <Text style={[styles.cell, styles.letra10]}>Lote:</Text>
                                    <Text style={[styles.cell, styles.letra10, styles.fuentePragmatica]}>{datosLote.Lote_nombre}</Text>
                                </View>

                                {/* Tamaño Lote */}
                                <View style={styles.row}>
                                    <Text style={[styles.cell, styles.letra10]}>Tamaño lote:</Text>
                                    <Text style={[styles.cell, styles.letra10, styles.fuentePragmatica]}>{datosLote.Lote_tamaño} {" ha."}</Text>
                                </View>

                            </View>
                            <View style={styles.columnAnalisis}>

                                {/* Nombre Completo Ingeniero*/}
                                <View style={styles.row}>
                                    <Text style={[styles.cell, styles.letra10]}>Ingeniero:</Text>
                                    <Text style={[styles.cell, styles.letra10, styles.fuentePragmatica]}>{Cookies.get('email')}</Text>
                                </View>                         

                                {/* Nombre Localidad*/}
                                <View style={styles.row}>
                                    <Text style={[styles.cell, styles.letra10]}>Localidad:</Text>
                                    <Text style={[styles.cell, styles.letra10, styles.fuentePragmatica]}>{datosLote.Campo_localidad}</Text>
                                </View>

                                {/* Nombre Provincia*/}
                                <View style={styles.row}>
                                    <Text style={[styles.cell, styles.letra10]}>Provincia:</Text>
                                    <Text style={[styles.cell, styles.letra10, styles.fuentePragmatica]}>{datosLote.Campo_provincia}</Text>
                                </View>

                                {/* Código Toma de Muestra */}
                                <View style={styles.row}>
                                    <Text style={[styles.cell, styles.letra10]}>Toma de muestra:</Text>
                                    <Text style={[styles.cell, styles.letra10, styles.fuentePragmatica]}>{datosLote.TomaDeMuestra_codigo}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Interpretación de Análisis */}
                        <View style={styles.seccion}>

                            {/* Título */}
                            <Text>Interpretación de análisis</Text>

                            {/* Parámetros y valoraciones */}
                            <View style={styles.page}>
                            
                                {/* Columna 1 */}
                                <View style={styles.columnAnalisis}>

                                    {/* Parámetro*/}
                                    <View style={styles.row}>
                                        <Text style={styles.cell}>Parámetro</Text>
                                        <Text style={styles.cell}>Valoración{'\u00B9'}</Text>
                                    </View>

                                    {/* Materia Orgánica*/}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>Materia Orgánica</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>{interpretacion.Materia_organica}</Text>
                                    </View>

                                    {/* Nitrógeno Total*/}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>Nitrógeno Total</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>{interpretacion.Nitrogeno_Total}</Text>
                                    </View>

                                    {/* Carbono Orgánico*/}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>Carbono Orgánico</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>{interpretacion.Carbono_Organico}</Text>
                                    </View>

                                    {/* pH*/}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>pH</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>{interpretacion.PH}</Text>
                                    </View>

                                    {/* Calcio*/}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>Calcio</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>{interpretacion.Calcio}</Text>
                                    </View>

                                    {/* Magnesio*/}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>Magnesio</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>{interpretacion.Magnesio}</Text>
                                    </View>

                                    {/* Potasio*/}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>Potasio</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>{interpretacion.Potasio}</Text>
                                    </View>

                                    {/* PSI*/}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>PSI</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>----</Text>
                                    </View>

                                </View>


                                {/* Columna 2 */}
                                <View style={styles.columnAnalisis}>

                                    {/* Parámetro*/}
                                    <View style={styles.row}>
                                        <Text style={styles.cell}>Parámetro</Text>
                                        <Text style={styles.cell}>Valoración{'\u00B9'}</Text>
                                    </View>

                                    {/* Nitratos*/}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>Nitratos</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>{interpretacion.Nitratos}</Text>
                                    </View>

                                    {/* Fósforo Extraíble*/}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>Fósforo extraíble</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>{interpretacion.Fosforo_Extraible}</Text>
                                    </View>

                                    {/* Conductividad Eléctrica*/}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>C.E.</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>{interpretacion.Conductividad_Electrica}</Text>
                                    </View>

                                    {/* Azufre */}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>Azufre</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>{interpretacion.Azufre}</Text>
                                    </View>

                                    {/* Capacidad de Intercambio Catiónico*/}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>CIC</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>{interpretacion.CIC}</Text>
                                    </View>

                                    {/* Saturación de bases S*/}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>Saturación de Bases S</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>{interpretacion.Saturacion_Bases_S}</Text>
                                    </View>

                                    {/* Clase Textural*/}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>Clase Textural</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>{interpretacion.Textura_Suelo}</Text>
                                    </View>
                                </View>
                            </View>
                        </View> 


                        {/* Recomendación de fertilizantes */}
                        <View style={styles.seccion}>
                            {/* Título */}
                            <Text>Recomendación de fertilizantes</Text>
                            {/* Cultivo y Rendimiento */}
                            <View style={styles.page}>

                                {/* Columna Cultivo y Rendimiento*/}
                                <View style={styles.column}>
                                        <View style={styles.row}>
                                            {/* Cultivo */}
                                            <Text style={styles.cell}>Cultivo a Sembrar{'\u00B2'}: {cultivo}</Text>

                                            {/* Rendimiento */}
                                            <Text style={styles.cell}>Rendimiento esperado: {diagnostico[1].usuario_rinde + " Ton/ha"}</Text>
                                        </View>
                                </View>
                            </View>

                            {/* Texto intro a nutrientes */}
                            <Text style={[styles.letra12, styles.separacion, styles.fuentePragmatica]}>En base al cultivo que se desea sembrar y al rendimiento esperado por hectárea, se observa esta demanda de nutrientes{'\u00B3'}:</Text>

                            {/* Nutrientes */}
                            <View style={styles.page}>

                                {/* Columna 1*/}
                                <View style={styles.column}>

                                        {/* Nitrógeno */}
                                        <View style={styles.row}>
                                            <Text style={styles.cell}>Nitrógeno:</Text>
                                            <Text style={[styles.cell, styles.fuentePragmatica]}>{diagnostico[1].Elementos.Nitrogeno.calculo_dosisFertilizante.toFixed(2)}</Text>
                                        </View>

                                        {/* Fósforo */}
                                        <View style={styles.row}>
                                            <Text style={styles.cell}>Fósforo:</Text>
                                            <Text style={[styles.cell, styles.fuentePragmatica]}>{diagnostico[1].Elementos.Fosforo.calculo_dosisFertilizante.toFixed(2)}</Text>
                                        </View>
                                </View>

                                {/* Columna 2*/}
                                <View style={styles.column}>

                                        {/* Potasio */}
                                        <View style={styles.row}>
                                            <Text style={styles.cell}>Potasio:</Text>
                                            <Text style={[styles.cell, styles.fuentePragmatica]}>{diagnostico[1].Elementos.Potasio.calculo_dosisFertilizante.toFixed(2)}</Text>
                                        </View>

                                        {/* Calcio */}
                                        <View style={styles.row}>
                                            <Text style={styles.cell}>Calcio:</Text>
                                            <Text style={[styles.cell, styles.fuentePragmatica]}>{diagnostico[1].Elementos.Calcio.calculo_dosisFertilizante.toFixed(2)}</Text>
                                        </View>
                                </View>

                                {/* Columna 3*/}
                                <View style={styles.column}>

                                        {/* Magnesio */}
                                        <View style={styles.row}>
                                            <Text style={styles.cell}>Magnesio:</Text>
                                            <Text style={[styles.cell, styles.fuentePragmatica]}>{diagnostico[1].Elementos.Magnesio.calculo_dosisFertilizante.toFixed(2)}</Text>
                                        </View>

                                        {/* Azufre */}
                                        <View style={styles.row}>
                                            <Text style={styles.cell}>Azufre:</Text>
                                            <Text style={[styles.cell, styles.fuentePragmatica]}>{diagnostico[1].Elementos.Azufre.calculo_dosisFertilizante.toFixed(2)}</Text>
                                        </View>
                                </View>
                            </View>

                            {/* Texto recomendación de fertilizantes */}
                            <Text style={[styles.letra12, styles.separacion, styles.fuentePragmatica]}>Para cubrir la demanda se recomienda aplicar estos fertilizantes{'\u2074'}:</Text>
                            
                            {/* Fertilizantes */}
                            <View style={styles.page}>

                                <View style={styles.column}>

                                        {/* Encabezado */}
                                        <View style={styles.row}>
                                            <Text style={styles.cell}>Tipo de Fertilizante</Text>
                                            <Text style={styles.cell}>Cantidad por ha.</Text>
                                            <Text style={styles.cell}>Cantidad para el lote.</Text>
                                        </View>

                                        {/* Cada uno de los fertilizantes a aplicar */}
                                        {
                                            fertilizantes.map(([elemento, datos], indice) => (
                                                datos !== 0 &&
                                                <View key={indice} style={styles.row}>
                                                  <Text style={[styles.cell, styles.fuentePragmatica]}>{elemento}</Text>
                                                  <Text style={[styles.cell, styles.fuentePragmatica]}>{(datos / datosLote.Lote_tamaño).toFixed(2)} {" kg/ha"}</Text>
                                                  <Text style={[styles.cell, styles.fuentePragmatica]}>{(datos).toFixed(2)} {" kg"}</Text>
                                                </View>
                                              ))
                                        }
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Pie de pagina */}
                    <View style={styles.footer}>
                        <Text>
                            1. La valoración corresponde a diversas fuentes para valores estándares.  2. La demanda nutrimental de cada cultivo es obtenida en base a datos proporcionados por el IPNI.
                            3. Los resultados se obtienen a través del método simplificado.  4. El contenido de nutrientes puede variar dependiendo del fabricante, la pureza del producto y la mezcla con otros productos.
                            Considerar que las necesidades de los cultivos pueden variar según la zona geográfica.  Agrolitycs no se responsabiliza por el mal uso de los fertilizantes agropecuarios.
                        </Text>
                    </View>

                    {/* Marca de Agua */}
                    {/* <Image src={logoAgrolitycs} style={[styles.watermark, { width: "500px", height: "500px" }]} /> */}
            </Page>
        </Document>
        </>
        
    );
}

export default PDFDiagnosticoSuelo;