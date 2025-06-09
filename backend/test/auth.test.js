import request from "supertest";
import expressApp from "../expressApp.js";
import User from "../Models/UserModel.js";
import bcrypt from "bcrypt";

// Mock de los modelos y las librerías necesarias
jest.mock("../Models/UserModel.js");
jest.mock("bcrypt");

describe("Auth API", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpiamos los mocks antes de cada test
  });

  // Test para la ruta de registro
  describe("POST /api/signup", () => {
    it("Debería ser una creación de cuenta correcta con datos válidos", async () => {
      User.findOne.mockResolvedValue(null); // Simulamos que no existe ningún usuario con ese email

      // Creamos un usuario simulado con los datos que esperamos recibir
      const savedUser = {
        _id: "userid123",
        toObject: () => ({
          _id: "userid123",
          email: "newuser@test.com",
          name: "User Test",
          lastName: "Test",
          phone: "1234567890",
        }),
      };
      User.create.mockResolvedValue(savedUser);

      // Realizamos la petición de registro con datos válidos
      const res = await request(expressApp).post("/api/signup").send({
        name: "User Test",
        lastName: "Test",
        email: "newuser@test.com",
        password: "password123",
        phone: "1234567890",
      });

      // Verificamos que la respuesta sea correcta
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Cuenta creada con éxito");
      expect(res.body.user).toEqual({
        _id: "userid123",
        email: "newuser@test.com",
        name: "User Test",
        lastName: "Test",
        phone: "1234567890",
      });
    });
  });

  // Test para la ruta de inicio de sesión
  describe("POST /login", () => {
    it("Debería iniciar sesión correctamente con credenciales válidas", async () => {
      // Simulamos un usuario válido con contraseña hasheada
      const mockUser = {
        _id: "userid123",
        password: "hashedpwd",
        toObject: () => ({
          _id: "userid123",
          email: "test@test.com",
          name: "Test",
          lastName: "User",
          phone: "000",
        }),
      };
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });
      bcrypt.compare.mockResolvedValue(true); // Simulamos que la contraseña coincide

      // Realizamos la petición de login con credenciales correctas
      const res = await request(expressApp)
        .post("/api/login")
        .send({ email: "test@test.com", password: "password123" });

      // Verificamos que el login sea exitoso
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Inicio de sesión correcto");
      expect(res.body.user).toEqual({
        _id: "userid123",
        email: "test@test.com",
        name: "Test",
        lastName: "User",
        phone: "000",
      });
    });

    it("Debería devolver un error por credenciales incorrectas", async () => {
      // Simulamos que no se encuentra el usuario
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      // Intentamos login con credenciales incorrectas
      const res = await request(expressApp)
        .post("/api/login")
        .send({ email: "wrong@test.com", password: "wrongpassword" });

      // Verificamos que se devuelva el error correcto
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Usuario no encontrado o incorrecto");
    });

    it("Debería devolver un error por credenciales faltantes", async () => {
      // Intentamos login sin proporcionar la contraseña
      const res = await request(expressApp)
        .post("/api/login")
        .send({ email: "test@test.com" }); // sin password

      // Verificamos que se devuelva el error de campos requeridos
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Todos los campos son requeridos");
    });
  });
});
