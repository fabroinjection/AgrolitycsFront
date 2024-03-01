export const formatFechaHoraAEscrito = (fechaHora) => {
    const meses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
      
    const diasSemana = [
    "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
    ];
    
    const fecha = new Date(fechaHora);
    
    const nombreDia = diasSemana[fecha.getDay()];
    const numeroDia = fecha.getDate();
    const nombreMes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();
    
    const fechaFormateada = `${nombreDia} ${numeroDia} de ${nombreMes} de ${año}`;

    return fechaFormateada;
}

export const formatFechaHoraANombreDia = (fechaHora) => {
     
    const diasSemana = [
    "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
    ];
    
    const fecha = new Date(fechaHora);
    fecha.setDate(fecha.getDate() + 1);
    
    const nombreDia = diasSemana[fecha.getDay()];
    
    return nombreDia;
}

export const formatFechaHoraADiaMes = (fechaHora) => {
    const meses = [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];

    const fecha = new Date(fechaHora);
    fecha.setDate(fecha.getDate() + 1);

    const numeroDia = fecha.getDate();
    const nombreMes = meses[fecha.getMonth()];

    const fechaFormateada = `${numeroDia} ${nombreMes}`;

    return fechaFormateada;
}