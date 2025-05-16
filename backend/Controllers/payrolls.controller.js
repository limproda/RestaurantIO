import Payroll from "../Models/PayrollModel.js";

// Obtiene todas las nóminas de todos los empleados
export const getAllPayrolls = async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate("employee", "name lastName") // Extraemos únicamente los nombres y apellidos de cada empleado
      .sort({ createdAt: -1 }); // Ordenamos según la fecha de creación, mostrando primero las más recientes
    res.json({
      success: true,
      payrolls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las nóminas",
    });
  }
};

// Obtiene las nóminas por empleado
export const getPayrollsByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const payrolls = await Payroll.find({ employee: employeeId }) // Buscamos las nóminas de un empleado concreto
      .populate("employee", "name lastName") 
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      payrolls,
    });
  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Error al obtener las nóminas del empleado",
    });
  }
};

// Crear una nueva nómina
export const createPayroll = async (req, res) => {
  try {
    const { userId, month, year, fileUrl } = req.body;

    // Validar que los datos requeridos estén presentes
    if (!userId || !month || !year || !fileUrl) {
      return res.status(400).json({
        success: false,
        message: "Faltan datos requeridos",
      });
    }

    // Validar que el mes y año estén en rangos válidos
    if (month < 1 || month > 12) {
      return res.status(400).json({
        success: false,
        message: "El mes debe estar entre 1 y 12",
      });
    }

    // Validar que el año esté correcto
    if (year < 2000 || year > 2100) {
      return res.status(400).json({
        success: false,
        message: "El año debe estar entre 2000 y 2100",
      });
    }

    // Creamos un objeto nómina
    const payroll = new Payroll({
      employee: userId,
      url: fileUrl,
      month: Number(month),
      year: Number(year),
    });

    await payroll.save();

    res.status(201).json({
      success: true,
      message: "Nómina creada con éxito",
      payroll,
    });
  } catch (error) {
    console.error("Error al crear nómina:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear la nómina",
    });
  }
};

// Eliminar una nómina
export const deletePayroll = async (req, res) => {
  try {
    const payroll = await Payroll.findByIdAndDelete(req.params.id); // Buscamos y eliminamos la nómina

    if (!payroll) {
      return res.status(404).json({
        success: false,
        message: "Nómina no encontrada",
      });
    }

    res.json({
      success: true,
      message: "Nómina eliminada con éxito",
    });
  } catch (error) {
    console.error("Error al eliminar nómina:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar la nómina",
    });
  }
};