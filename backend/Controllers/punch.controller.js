import Punch from "../Models/PunchModel.js";

// Permite fichar la hora
export const punchClock = async (req, res) => {
  const userId = req.user.id;
  // Buscamos el último fichaje (cualquiera que sea su fecha)
  const lastPunch = await Punch
    .findOne({ employee: userId })
    .sort({ timestamp: -1 });
  // Si el último fue "entrada", hacemos "salida"; si no, "entrada"
  const type = lastPunch?.type === "entrada" ? "salida" : "entrada";
  // Creamos y guardamos el nuevo fichaje
  const punch = await Punch.create({ employee: userId, type });
  res.json({ success: true, punch });
};

// Obtenemos los fichajes de un empleado
export const getPunchesByEmployee = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const punches = await Punch.find({ employee: employeeId }).sort({ timestamp: -1 }); // Ordenamos de más recientes
    res.json({ success: true, punches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error al listar puncheos" });
  }
};

// Actualizamos el fichaje
export const updatePunch = async (req, res) => {
  const { id } = req.params;
  const { timestamp } = req.body;
  try {
    const punch = await Punch.findByIdAndUpdate(id, { timestamp: new Date(timestamp) }, { new: true }); // Si lo hay, lo convertimos a fecha y lo actualizamos y devolvemos la versión nueva
    if (!punch) return res.status(404).json({ success: false, message: "Punch no encontrado" });
    res.json({ success: true, punch });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error al actualizar puncheo" });
  }
};

// Permite borrar un fichaje
export const deletePunch = async (req, res) => {
  const { id } = req.params;
  try {
    const punch = await Punch.findByIdAndDelete(id); // Busca y elimina un fichaje
    if (!punch) return res.status(404).json({ success: false, message: "Punch no encontrado" });
    res.json({ success: true, message: "Punch eliminado" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error interno al eliminar puncheo" });
  }
};

// Permite crear un fichaje de manera manual
export const createPunchManual = async (req, res) => {
  const { employeeId, type, timestamp } = req.body;
  if (!employeeId || !type || !timestamp) {
    return res.status(400).json({ success: false, message: "Faltan datos: ID de empleado, tipo o horario" });
  }
  try {
    const punch = await new Punch({ employee: employeeId, type, timestamp: new Date(timestamp) }).save(); // Se guarda el fichaje
    res.status(201).json({ success: true, punch });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error interno al crear puncheo" });
  }
};

// Permite calcular y obtener los turnos del empleado
export const getShiftsByEmployee = async (req, res) => {
  const { employeeId } = req.params;
  try {
    const punches = await Punch.find({ employee: employeeId }).sort({ timestamp: 1 }); // Ordena por fecha ascendente

    // Calcular turnos
    const shifts = [];
    for (let i = 0; i < punches.length; i += 2) {
      const entry = punches[i]; // Todos los impares, será entrada
      const exit = punches[i + 1]; // Todos los pares, serán salida
      const entryDate = new Date(entry.timestamp); // Se crean los horarios de entrada
      const exitDate = exit ? new Date(exit.timestamp) : null; // Se crean los horarios de salida, si los hay
      let durationStr = ""; // Inicializamos la duración del turno en una cadena vacía
      if (exitDate) {
        const diffMs = Math.abs(exitDate - entryDate); // Calculamos la diferencia entre hora de entrada y salida
        const hours = Math.floor(diffMs / 1000 / 3600); // Pasamos de segundos a horas competas 
        const mins = Math.round((diffMs / 1000 / 60) % 60); // Convertimos los milisegundos sobrantes en minutos
        durationStr = `${hours}h ${mins}m`; // Creamos el string de horas calculadas
      }
      // Añadimos el turno al array de turnos
      shifts.push({
        id: entry._id,
        entryId: entry._id,
        exitId: exit?._id || null,
        date: entryDate,
        entryTime: entryDate,
        exitTime: exitDate,
        duration: durationStr,
      });
    }

    res.json({ success: true, shifts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error al listar shifts" });
  }
};
