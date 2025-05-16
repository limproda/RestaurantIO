// Formateo de fechas y horas a formato español
export function toLocalSpain(date) {
  // Formato para fechas: DD-MM-YYYY
  const datePart = date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Formato para horas: hh:mm (24h)
  const timePart = date.toLocaleTimeString("es-ES", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${datePart} ${timePart}`;
}

export const toDateES = (d) => toLocalSpain(d).split(" ")[0]; // Formateo sólo de fechas: “DD-MM-YYYY”
export const toTimeES = (d) => toLocalSpain(d).split(" ")[1]; // Formateo sólo de horas: “hh:mm”

// Formateo a ISO
export function toInputDateTimeValue(date) {
  if (!date) return "";
  const timeZoneOffset = date.getTimezoneOffset() * 60000; // Calculamos la diferencia local vs UTC en ms
  const localDate = new Date(date.getTime() - timeZoneOffset); // Restamos ese offset al timestamp
  return localDate.toISOString().slice(0, 16); // Convertimos a ISO y cortamos segundos y la 'Z'
}
