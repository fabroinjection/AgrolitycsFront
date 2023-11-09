import React from "react";
import { Document, Page, Text, View, Image, StyleSheet } from "@react-pdf/renderer"
import logoApp from "../../assets/logoApp.jpg";
import marcaApp from "../../assets/marcaApp.png"
// Definición de estilos
const styles = StyleSheet.create({
    column: {
        flexDirection: 'column',
        width: '90%',
        // textAlign: 'center',
        marginTop: '15px',
        marginLeft: "30px",
    },
    row: {
        flexDirection: 'row',
        marginBottom: '0px',
    },
    cell: {
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
        padding: 5,
        flexBasis: '100%',
        fontSize: '12px',
    },

    rotulo: {
        border:"2px", 
        borderColor:"black",
        margin:"50px",
    },

    imagen: {
        height:"80px", 
        width:"200px",
    },

    nombre: {
        fontSize: "40px",
    },

    contenedor: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: "5px",
    },
});
const PDFRotulo = ({ datos }) => {

    // Declaración de variables
    const fecha = datos.fecha_toma_de_muestra;
    const codigoTM = datos.codigo_toma_de_muestra;
    const tipoAnalisis = datos.tipo_analisis;
    const profundidad = datos.profundidad_toma_de_muestra;
    const ingeniero = datos.nombre_usuario + " " + datos.apellido_usuario;
    const email = datos.email_usuario;
    const productor = datos.nombre_productor + " " + datos.apellido_productor;
    const campo = datos.nombre_campo;
    const lote = datos.nombre_lote;
    const localidad = datos.localidad;
    const provincia = datos.provincia;

    return (
        // Documento PDF
        <Document>
            
            {/* Creación de página */}
            <Page size="A4">
                {/* Vista de div con bordes */}
                <View 
                style={styles.rotulo}>
                    {/* Logo y nombre App*/}
                    <View style={styles.contenedor}>
                        {/* <Image 
                            src={logoApp}
                            style={styles.imagen}
                        />
                        <Text style={styles.nombre}>
                            Agrolitycs
                        </Text> */}
                        <Image 
                            src={marcaApp}
                            style={styles.imagen}
                        />
                    </View>
                    {/* Tabla de contenido */}
                    <View style={styles.column}>

                        {/* Fila fecha */}
                        <View style={styles.row}>
                            <Text style={styles.cell}>Fecha:</Text>
                            <Text style={styles.cell}>{fecha}</Text>
                        </View>

                        {/* Fila Toma de muestra */}
                        <View style={styles.row}>
                            <Text style={styles.cell}>Toma de muestra:</Text>
                            <Text style={styles.cell}>{codigoTM}</Text>
                        </View>

                        {/* Fila tipo de analisis */}
                        <View style={styles.row}>
                            <Text style={styles.cell}>Análisis a realizar:</Text>
                            <Text style={styles.cell}>{tipoAnalisis}</Text>
                        </View>

                        {/* Fila Profundidad */}
                        <View style={styles.row}>
                            <Text style={styles.cell}>Profundidad muestreo:</Text>
                            <Text style={styles.cell}>{profundidad}</Text>
                        </View>

                        {/* Fila Solicitante */}
                        <View style={styles.row}>
                            <Text style={styles.cell}>Solicitante:</Text>
                            <Text style={styles.cell}>{ingeniero}</Text>
                        </View>

                        {/* Fila email */}
                        <View style={styles.row}>
                            <Text style={styles.cell}>Email:</Text>
                            <Text style={styles.cell}>{email}</Text>
                        </View>

                        {/* Fila Productor */}
                        <View style={styles.row}>
                            <Text style={styles.cell}>Productor:</Text>
                            <Text style={styles.cell}>{productor}</Text>
                        </View>

                        {/* Fila Campo */}
                        <View style={styles.row}>
                            <Text style={styles.cell}>Campo:</Text>
                            <Text style={styles.cell}>{campo}</Text>
                        </View>

                        {/* Fila Lote */}
                        <View style={styles.row}>
                            <Text style={styles.cell}>Lote:</Text>
                            <Text style={styles.cell}>{lote}</Text>
                        </View>

                        {/* Fila Localidad */}
                        <View style={styles.row}>
                            <Text style={styles.cell}>Localidad:</Text>
                            <Text style={styles.cell}>{localidad}</Text>
                        </View>

                        {/* Fila Provincia */}
                        <View style={styles.row}>
                            <Text style={styles.cell}>Provincia:</Text>
                            <Text style={styles.cell}>{provincia}</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
}

export default PDFRotulo;