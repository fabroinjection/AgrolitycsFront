
import { Document, Page, Text, View, Image, StyleSheet, Font } from "@react-pdf/renderer"
import marcaApp from "../../assets/marcaApp.png";
import Cookies from "js-cookie";
// import logoAgrolitycs from "../../assets/logoAgrolitycs.png";

// Definicion de fuente
Font.register({family: "Pragmatica-ExtraLight", src: "src/fonts/Pragmatica-ExtraLight.ttf",});


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
const PDFDiagnosticoAgua = ({ interpretacion, datosLote }) => {


    return (
        <>
        {/* // Documento PDF */}
        <Document>
            
            {/* Creación de página */}
            <Page size="A4">

                    {/* Logo y nombre App*/}
                    <View style={styles.contenedor}>

                        <Image 
                            src={marcaApp}
                            style={styles.imagen}
                        />

                        <Text style={styles.titulo}>
                            Diagnóstico de Agua Útil
                        </Text>
                    </View>

                    <View style={styles.margen}>
                        {/* Encabezado */}
                        <View style={styles.page}>
                            <View style={styles.columnAnalisis}>

                                {/* Fecha Diagnóstico*/}
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

                                {/* Nombre Completo Ingeniero Agrónomo*/}
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
                            <Text>Interpretación de análisis de agua útil</Text>

                            {/* Parámetros y valoraciones */}
                            <View style={styles.page}>
                            
                                {/* Columna 1 */}
                                <View style={styles.columnAnalisis}>

                                    {/* Parámetro*/}
                                    <View style={styles.row}>
                                        <Text style={styles.cell}>Parámetro</Text>
                                        <Text style={styles.cell}>Valoración{'\u00B9'}</Text>
                                    </View>

                                    {/* Relación Absorción Sodio (RAS)*/}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>Relación Absorción Sodio</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>{interpretacion.Relacion_Absorcion_Sodio}</Text>
                                    </View>

                                    {/* Conductividad Eléctrica*/}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>Conductividad Eléctrica</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>{interpretacion.Conductividad_Electrica}</Text>
                                    </View>

                                    {/* Clase de Agua*/}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>Clase de Agua</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>{interpretacion.Clase_de_agua}</Text>
                                    </View>

                                    {/*Cloruros*/}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>Cloruros</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>{interpretacion.Cloruros}</Text>
                                    </View>

                                    {/* Carbonato Sódico Residual (CSR)*/}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>CSR</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>{interpretacion.Carbonato_sodico_resudual}</Text>
                                    </View>

                                    {/* Alcalinidad Total*/}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>Alcalinidad Total</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>{interpretacion.Alcalinidad_total}</Text>
                                    </View>
                                </View>


                                {/* Columna 2 */}
                                <View style={styles.columnAnalisis}>

                                    {/* Parámetro*/}
                                    <View style={styles.row}>
                                        <Text style={styles.cell}>Parámetro</Text>
                                        <Text style={styles.cell}>Valoración{'\u00B9'}</Text>
                                    </View>

                                    {/* Dureza Total*/}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>Dureza Total</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>{interpretacion.Dureza_total}</Text>
                                    </View>

                                    {/* Residuo Seco*/}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>Residuo Seco</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>{interpretacion.Residuo_seco}</Text>
                                    </View>

                                    {/* Sulfatos*/}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>Sulfatos</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>{interpretacion.Sulfatos}</Text>
                                    </View>

                                    {/* Fosfatos */}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>Fosfatos</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>-----</Text>
                                    </View>

                                    {/* Boro*/}
                                    <View style={styles.row}>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>Boro</Text>
                                        <Text style={[styles.cell, styles.fuentePragmatica]}>{interpretacion.Boro}</Text>
                                    </View>
                                </View>
                            </View>
                        </View> 
                    </View>

                    {/* Pie de pagina */}
                    <View style={styles.footer}>
                        <Text>
                            1. La valoración corresponde a diversas fuentes para valores estándares. 
                            Agrolitycs no se responsabiliza por el mal uso de los fertilizantes agropecuarios.
                        </Text>
                    </View>

                    {/* Marca de Agua */}
                    {/* <Image src={logoAgrolitycs} style={[styles.watermark, { width: "500px", height: "500px" }]} /> */}
            </Page>
        </Document>
        </>
        
    );
}

export default PDFDiagnosticoAgua;