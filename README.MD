
# RestaurantIO
RestaurantIO es una plataforma MERN (MongoDB + Express + React + Node) pensada para digitalizar la gestión diaria de un negocio de restauración.
Incluye dos roles (Administrador y Empleado) y agrupa en una sola interfaz todo lo necesario para llevar el control operativo y financiero del negocio.

## Funciones básicas
* Autenticación: Inicio de sesión seguro con JWT y derivación al panel correspondiente.
* Panel de Administrador: Resumen diario, gestión de empleados, ingresos, gastos y nóminas.
* Panel de Empleado: Resumen personal, registro de fichajes, descarga de nóminas y consulta de horas trabajadas.
* Gestión de empleados: Crear, editar y eliminar perfiles; ver horas trabajadas.
* Ingresos / Gastos: Registrar ventas y costes, filtrar y exportar tablas para análisis.
* Nóminas (PDF): Subida por el administrador y descarga por los empleados.
* Fichaje de turnos: Registro de entrada/salida y cálculo de horas ordinarias/extras.

Estas funcionalidades se derivan de los requisitos y casos de uso descritos en la memoria del proyecto.

## Cómo ejecutarlo
1. Demo en la nube (1 click)
Visita https://restaurantio.onrender.com.

> Si la instancia gratuita está en reposo, espera ~1 minuto a que se reactive.

Credenciales de prueba:
- Administrador -> admin@admin.com / admin
- Empleado -> user@user.com / user

2. Ejecución local (Node.js)
Requisitos: Node LTS (≥ 18) y npm.

- Instala todas las dependencias de *frontend* y *backend*: npm run build
- Arranca los dos servidores en modo desarrollo: npm run dev

Abre tu navegador en http://localhost:5173 (el backend se levanta en 3000 automáticamente). 


3. Contenedor Docker
Requisitos: Docker Desktop.

- Crea/actualiza la imagen: docker compose up --build -d  
- Muestra los servicios: docker compose 
- Detiene y elimina los contenedores: docker compose down

Luego visita http://localhost:8080 para usar la app en modo contenedor. 


## Stack y carpetas
- backend/  
- frontend/
- docker-compose.yml
- package.json: define los npm scripts: build, dev, test…

Todo el código está organizado por features para que cada funcionalidad sea totalmente independiente y fácil de mantener. 

Con estos pasos se puede probar, clonar y desplegar RestaurantIO en minutos.