import { getPunches, pairShifts } from "./punch.controller.js";
import { TZ } from "../config/index.js";

const dayKey = (d) => d.toLocaleDateString("sv-SE", { timeZone: TZ }); // Formato YYYY-MM-DD

// Agrupa los segundos por día a partir de los turnos
const groupSecondsByDay = (shifts) =>
  shifts.reduce((map, { entryTime, exitTime }) => {
    const day = dayKey(entryTime);
    map[day] = map[day] ?? 0;
    if (exitTime) map[day] += (exitTime - entryTime) / 1000;
    return map;
  }, {});

// Permite obtener el tiempo trabajado por un empleado en el mes actual
export const getWorkingTimeByEmployee = async (req, res) => {
  const userId = req.user.id;
  try {
    const punches = await getPunches(userId); // Obtenemos los fichajes del empleado
    const from = new Date(new Date().getFullYear(), new Date().getMonth(), 1); // Primer día del mes
    const to = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1); // Primer día del siguiente mes
    const month = punches // Filtramos los fichajes del mes actual
      .filter((p) => p.timestamp >= from && p.timestamp < to);

    // Calculamos los turnos
    const shifts = pairShifts(month);
    // Agrupamos los segundos por día
    const secsMap = groupSecondsByDay(shifts);

    // Convertimos el objeto a un array de objetos con fecha y horas
    const daily = Object.entries(secsMap).map(([date, secs]) => ({
      date,
      hours: Math.floor(secs / 3600),
      minutes: Math.floor((secs % 3600) / 60),
    }));
    daily.sort((a, b) => b.date.localeCompare(a.date)); // Ordenamos por fecha descendente
    // Devolvemos el resultado
    res.json({ success: true, daily });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error listando horas trabajadas" });
  }
};

// Permite obtener el resumen de horas trabajadas por un empleado
export const getTransactionsSummary = async (req, res) => {
  try {
    const employeeId = req.user.id; // ID del empleado
    const payDay = req.user.paymentDay; // Día de cobro (1–31)

    // Traemos fichajes y filtramos por mes actual
    const punches = await getPunches(employeeId);
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1); // Primer día del mes
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 1); // Primer día del siguiente mes
    const month = punches.filter(
      (p) => p.timestamp >= from && p.timestamp < to
    );

    // Emparejamos turnos y calculamos horas y días
    const shifts = pairShifts(month);
    const secsMap = groupSecondsByDay(shifts);
    const daily = Object.entries(secsMap).map(([date, secs]) => ({
      date,
      hours: Math.floor(secs / 3600),
      minutes: Math.floor((secs % 3600) / 60),
    }));

    // Sumamos todas las horas del mes
    const totalMinutes = daily.reduce(
      (acc, { hours, minutes }) => acc + hours * 60 + minutes,
      0
    );

    // Calculamos horas extra por bloques de 40 h/semana
    const dayOfMonth = now.getDate();
    const weekNumber = Math.floor((dayOfMonth - 1) / 7); // Número de semanas completas del mes en curso
    const regularShiftHours = 40 * weekNumber * 60; // Horas normales de jornada en minutos
    const overtimeMin = Math.max(0, totalMinutes - regularShiftHours); // Horas extras en minutos
    const overtimeHrs = Math.floor(overtimeMin / 60); // Horas extras en horas

    // Próximo día de cobro y días que faltan
    let year = now.getFullYear(); 
    let monthCounter = now.getMonth(); 
    if (dayOfMonth > payDay) {
      monthCounter += 1; // Si ya pasó el día de cobro, sumamos un mes
      if (monthCounter > 11) {
        monthCounter = 0; // Si es diciembre, volvemos a enero
        year += 1; // Aumentamos el año
      }
    }
    const nextPay = new Date(year, monthCounter, payDay, 0, 0, 0); // Fecha del próximo día de cobro
    const msToNextPay = nextPay - now; // Milisegundos hasta el próximo día de cobro
    const daysToNextPay = Math.ceil(msToNextPay / (1000 * 60 * 60 * 24)); // Días hasta el próximo día de cobro

    // Respondemos con el objeto summary
    res.json({
      success: true,
      summary: {
        WorkedHours: { total: Math.floor(totalMinutes / 60) }, // Total de horas trabajadas
        Overtime: { total: overtimeHrs }, // Total de horas extras
        Total: { total: daysToNextPay }, // Días hasta el próximo día de cobro
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error al obtener resumen de horas" });
  }
};
