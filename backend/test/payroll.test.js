import request from 'supertest';
import expressApp from '../expressApp.js';
import Payroll from '../Models/PayrollModel.js';

// Mock de los middlewares de autenticación para saltar la verificación
jest.mock('../Middlewares/auth.middleware.js', () => ({
  userVerification: (req, res, next) => next(),
  verifyAdmin: (req, res, next) => next(),
  verifyAdminOrOwner: (req, res, next) => next(),
}));

// Mock del modelo de Nóminas
jest.mock('../Models/PayrollModel.js');

describe('Payrolls API', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiamos los mocks antes de cada test
  });

  // Test para la ruta de obtención de nóminas
  describe('GET /payrolls', () => {
    it('Debería devolver una lista de nóminas', async () => {

      const isoDate = new Date().toISOString(); // Creamos una fecha ISO para las pruebas
      // Simulamos una lista de nóminas, con 1 nómina de ejemplo
      const mockPayrolls = [
        {
          _id: 'p1',
          employee: { _id: 'e1', name: 'Pepito', lastName: 'Grillo' },
          url: 'http://example.com/payroll1.pdf',
          month: 5,
          year: 2025,
          createdAt: isoDate,
        },
      ];

      // Configuramos el mock para que devuelva las nóminas simuladas
      Payroll.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockPayrolls),
      });

      // Realizamos la petición GET
      const res = await request(expressApp).get('/payrolls');
      // Verificamos la respuesta
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.payrolls).toEqual(mockPayrolls);
    });

    it('Debería devolver 500 en caso de error en la base de datos', async () => {
      // Simulamos un error en la base de datos
      Payroll.find.mockImplementation(() => { throw new Error('DB failure'); });

      const res = await request(expressApp).get('/payrolls');
      // Verificamos que se devuelva el error correcto
      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Error al obtener las nóminas');
    });
  });

  // Test para la ruta de obtención de nóminas de un empleado específico
  describe('GET /payrolls/employee/:employeeId', () => {
    it('Debería devolver las nóminas de un empleado específico', async () => {
      const employeeId = 'e1';
      const isoDate = new Date().toISOString();
      // Simulamos las nóminas de un empleado específico
      const mockPayrolls = [
        {
          _id: 'p2',
          employee: { _id: employeeId, name: 'Pepito', lastName: 'Grillo' },
          url: 'http://example.com/payroll2.pdf',
          month: 6,
          year: 2025,
          createdAt: isoDate,
        },
      ];

      // Configuramos el mock para devolver las nóminas del empleado
      Payroll.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockPayrolls),
      });

      const res = await request(expressApp).get(`/payrolls/employee/${employeeId}`);
      // Verificamos la respuesta
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.payrolls).toEqual(mockPayrolls);
    });

    it('Debería devolver 500 en caso de error en la base de datos', async () => {
      // Simulamos un error en la base de datos
      Payroll.find.mockImplementation(() => { throw new Error('DB error'); });
      const res = await request(expressApp).get('/payrolls/employee/e1');
      // Verificamos el error
      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Error al obtener las nóminas del empleado');
    });
  });

  // Test para la ruta de creación de nóminas
  describe('POST /payrolls', () => {
    it('Debería devolver 400 si faltan campos requeridos', async () => {
      // Intentamos crear una nómina sin datos
      const res = await request(expressApp)
        .post('/payrolls')
        .send({});
      // Verificamos el error de campos requeridos
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Faltan datos requeridos');
    });

    it('Debería devolver 400 si el mes es inválido', async () => {
      // Intentamos crear una nómina con mes inválido
      const res = await request(expressApp)
        .post('/payrolls')
        .send({ userId: 'u1', month: 13, year: 2025, fileUrl: 'url' });
      // Verificamos el error de mes inválido
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('El mes debe estar entre 1 y 12');
    });

    it('Debería devolver 400 si el año es inválido', async () => {
      // Intentamos crear una nómina con año inválido
      const res = await request(expressApp)
        .post('/payrolls')
        .send({ userId: 'u1', month: 5, year: 1999, fileUrl: 'url' });
      // Verificamos el error de año inválido
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('El año debe estar entre 2000 y 2100');
    });

    it('Debería crear una nueva nómina con datos válidos', async () => {
      const isoDate = new Date().toISOString();
      // Simulamos el guardado exitoso
      const saveMock = jest.fn().mockResolvedValue();
      // Creamos una nómina simulada
      const mockPayrollInstance = {
        _id: 'p3',
        employee: 'u1',
        url: 'url',
        month: 5,
        year: 2025,
        createdAt: isoDate,
        save: saveMock,
      };
      Payroll.mockImplementation(() => mockPayrollInstance);

      // Intentamos crear una nómina válida
      const res = await request(expressApp)
        .post('/payrolls')
        .send({ userId: 'u1', month: 5, year: 2025, fileUrl: 'url' });

      // Verificamos la creación exitosa
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Nómina creada con éxito');
      expect(res.body.payroll).toMatchObject({
        _id: 'p3',
        employee: 'u1',
        url: 'url',
        month: 5,
        year: 2025,
        createdAt: isoDate,
      });
      expect(saveMock).toHaveBeenCalled();
    });

    it('Debería devolver 500 en caso de error al guardar', async () => {
      // Simulamos un error al guardar
      const saveMock = jest.fn().mockRejectedValue(new Error('Save error'));
      Payroll.mockImplementation(() => ({ save: saveMock }));

      const res = await request(expressApp)
        .post('/payrolls')
        .send({ userId: 'u1', month: 5, year: 2025, fileUrl: 'url' });

      // Verificamos el error de guardado
      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Error al crear la nómina');
    });
  });

  // Test para la ruta de actualización de nóminas
  describe('DELETE /payrolls/:id', () => {
    it('Debería eliminar una nómina con éxito', async () => {
      // Simulamos el borrado exitoso
      Payroll.findByIdAndDelete.mockResolvedValue({ _id: 'p1' });
      const res = await request(expressApp).delete('/payrolls/p1');
      // Verificamos el borrado exitoso
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Nómina eliminada con éxito');
    });

    it('Debería devolver 404 si la nómina no se encuentra', async () => {
      // Simulamos que no se encuentra la nómina
      Payroll.findByIdAndDelete.mockResolvedValue(null);
      const res = await request(expressApp).delete('/payrolls/nonexistent');
      // Verificamos el error de no encontrado
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Nómina no encontrada');
    });

    it('Debería devolver 500 en caso de error al eliminar', async () => {
      // Simulamos un error al borrar
      Payroll.findByIdAndDelete.mockImplementation(() => { throw new Error('Delete error'); });
      const res = await request(expressApp).delete('/payrolls/p1');
      // Verificamos el error de borrado
      expect(res.status).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Error al eliminar la nómina');
    });
  });
});
