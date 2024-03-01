export function crearObjetoParaSolicitudModificacion(idDiagnostico, observaciones, fertilizantesSel, kgHaPerHaValues, fertilizantesTratamiento) {
    const tratamiento_modificado = {
      diagnostico_id: parseInt(idDiagnostico),
      observaciones: observaciones
    };

    let fertilizantesTratamientoFiltrados = [];

    // Se recorren los fertilizantes originales del tratamiento y se arma en el formato que pide la consulta
    // es decir, se eliminan los nombres de los fertilizantes
    for (const fertilizante of fertilizantesTratamiento) {
        try {
            fertilizantesTratamientoFiltrados.push({
                fertilizante_id: fertilizante.fertilizante_id,
                kg_ha: parseFloat(fertilizante.kgPorHa)
            });
        } catch (error) {
            console.error(`Error al obtener el id del fertilizante ${fertilizante}:`, error);
        }
    }

  
    // Se recorre el objeto formado por los fertilizantes agregados y se lo transforma en array
    // consultando las variables de los select de los stack (fertilizantes) y kgPerHaValues (kg/Ha de cada Stack)
    const fertilizantes = Object.keys(fertilizantesSel).map((key) => {
      const fertilizante_id = fertilizantesSel[key].value;
      const kg_ha = parseFloat(kgHaPerHaValues[key]);
      return { fertilizante_id, kg_ha };
    });


    // Se arma un nuevo array que inicialmente contiene los valores de los fertilizantes originales filtrados
    let fertilizantesFinales = [...fertilizantesTratamientoFiltrados];

    // Por cada uno de los fertilizantes agregados, se busca si ese fertilizante está entre los originales y si existe
    // se retorna falso y si no, se agrega el fertilizante al array.
    for (const fertilizante of fertilizantes) {
        const foundIndex = fertilizantesFinales.findIndex(f => f.fertilizante_id === fertilizante.fertilizante_id);
        if (foundIndex !== -1) {
            return false;
        } else {
            fertilizantesFinales.push({ fertilizante_id: fertilizante.fertilizante_id, kg_ha: fertilizante.kg_ha });
        }
    }

    return {
      tratamiento_modificado,
      fertilizantes: fertilizantesFinales
    }

  }