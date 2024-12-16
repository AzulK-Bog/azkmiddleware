//parse date from string
export const parseDateYearMonthDay = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

//parse date from string an hour
export const parseDateHour = (date: string): string => {
  const fechaFormateada = new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
  return fechaFormateada;
};

export function strHourToDate(horaStr: string): Date | null {
  const horaSplit = horaStr.split(':');

  if (horaSplit.length !== 3) {
    console.error('Formato de hora inválido. Debe ser HH:mm:ss');
    return null;
  }

  const horas = parseInt(horaSplit[0], 10);
  const minutos = parseInt(horaSplit[1], 10);
  const segundos = parseInt(horaSplit[2], 10);

  if (isNaN(horas) || isNaN(minutos) || isNaN(segundos)) {
    console.error('Formato de hora inválido. Debe ser HH:mm:ss');
    return null;
  }

  const fecha = new Date();
  fecha.setHours(horas, minutos, segundos);

  return fecha;
}

export function generateDateString(): string {
  return new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function generateHourString(): string {
  return new Date().toLocaleTimeString('es-ES', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function convertirFechaISO(fechaISO: string): string {
  // Crear un objeto Date a partir de la cadena ISO
  const fecha = new Date(fechaISO);

  // Opciones para el formato de fecha y hora
  const opciones: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZone: 'UTC',
  };

  // Convertir la fecha usando el formato especificado
  return fecha.toLocaleString('es-ES', opciones);
}
