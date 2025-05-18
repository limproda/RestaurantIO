export const testEnvironment = 'node'; // Configuramos el entorno de prueba para Node.js

// Procesamos con Babel para soportar ESM y características modernas
export const transform = {
  '^.+\\.js$': 'babel-jest',
};

// Carpetas raíz de los tests
export const roots = ['<rootDir>/test'];
