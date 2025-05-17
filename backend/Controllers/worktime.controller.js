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
    daily.sort((a, b) => (b.date.localeCompare(a.date))); // Ordenamos por fecha descendente
    // Devolvemos el resultado
    res.json({ success: true, daily });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Error listando horas trabajadas" });
  }
};
