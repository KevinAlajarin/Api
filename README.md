# Sistema de Gestión de Citas Médicas

## Descripción General

Sistema web completo para gestionar citas médicas con un backend desarrollado en Node.js/Express y un frontend desarrollado en React. Permite a los pacientes reservar citas médicas, a los administradores gestionarlas y envía notificaciones automáticas por email cuando cambia el estado de una cita.

## Arquitectura del Sistema

El proyecto está dividido en dos partes principales:

- **Backend**: API REST desarrollada con Node.js, Express.js y Sequelize (MySQL)
- **Frontend**: Aplicación React con Vite, React Router y Context API

---

## Backend

### Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución
- **Express.js**: Framework web
- **Sequelize**: ORM para MySQL
- **MySQL**: Base de datos relacional
- **SendGrid**: Servicio de envío de emails
- **CORS**: Middleware para habilitar solicitudes cross-origin
- **dotenv**: Gestión de variables de entorno

### Estructura del Proyecto Backend

```
Backend/
├── config/
│   └── db.js                 # Configuración de conexión a MySQL
├── controllers/
│   ├── citaController.js     # Lógica de negocio para citas
│   └── obraSocialController.js # Lógica de negocio para obras sociales
├── models/
│   ├── cita.js               # Modelo de datos de Cita
│   ├── obraSocial.js         # Modelo de datos de ObraSocial
│   └── index.js              # Configuración de modelos y relaciones
├── routes/
│   ├── citaRoutes.js         # Rutas para endpoints de citas
│   └── obraSocialRoutes.js   # Rutas para endpoints de obras sociales
├── services/
│   └── emailService.js       # Servicio de envío de emails con SendGrid
├── server.js                 # Punto de entrada de la aplicación
└── package.json              # Dependencias del proyecto
```

### Modelos de Base de Datos

### Base de datos utilizada: SQL

#### Modelo Cita

- **id**: Identificador único (auto-generado)
- **nombre**: Nombre del paciente (requerido)
- **apellido**: Apellido del paciente (requerido)
- **telefono**: Teléfono de contacto (requerido)
- **email**: Email del paciente (requerido, validado como email válido)
- **fecha**: Fecha de la cita en formato DATEONLY (requerido)
- **horario**: Horario de la cita en formato string "HH:MM" (requerido)
- **obraSocialId**: ID de la obra social asociada (foreign key, requerido)
- **estado**: Estado de la cita - valores posibles: "Solicitada", "Confirmada", "Cancelada", "Pendiente" (default: "Solicitada")
- **createdAt**: Fecha de creación (automático)
- **updatedAt**: Fecha de última actualización (automático)

#### Modelo ObraSocial

- **id**: Identificador único (auto-generado)
- **nombre**: Nombre de la obra social (requerido, único)
- **activa**: Estado activo/inactivo de la obra social (boolean, default: true)
- **createdAt**: Fecha de creación (automático)
- **updatedAt**: Fecha de última actualización (automático)

#### Relaciones

- Una **Cita** pertenece a una **ObraSocial** (relación `belongsTo`)
- Una **ObraSocial** tiene muchas **Citas** (relación `hasMany`)

### API Endpoints

#### Endpoints de Citas (`/api/citas`)

1. **POST `/api/citas`** - Crear nueva cita
   - Body: `{ nombre, apellido, telefono, email, obraSocialId, fecha, horario }`
   - Respuesta: `201 Created` - Retorna el objeto de la cita creada

2. **GET `/api/citas`** - Obtener todas las citas
   - Respuesta: `200 OK` - Array de objetos de citas con información de obra social, ordenadas por fecha y horario descendente

3. **GET `/api/citas/disponibilidad?fecha=YYYY-MM-DD`** - Obtener horarios disponibles
   - Query Parameters: `fecha` (requerido) - Fecha en formato "YYYY-MM-DD"
   - Respuesta: `200 OK` - `{ slots: ["09:00", "09:30", ...] }`
   - Lógica: Genera todos los horarios posibles de 09:00 a 17:30 (cada 30 minutos) y filtra los horarios ya ocupados para esa fecha

4. **PUT `/api/citas/:id/estado`** - Actualizar estado de cita
   - Parámetros URL: `id` - ID de la cita a actualizar
   - Body: `{ estado: "Confirmada" | "Cancelada" | "Pendiente" }`
   - Respuesta: `200 OK` - Retorna la cita actualizada con información de obra social
   - **Notificaciones por Email**: 
     - Si el estado cambia a **"Confirmada"**: Se envía un email de confirmación al paciente
     - Si el estado cambia a **"Cancelada"**: Se envía un email de cancelación al paciente
     - Si el estado no cambia o cambia a "Pendiente": No se envía email

#### Endpoints de Obras Sociales (`/api/obras-sociales`)

1. **GET `/api/obras-sociales`** - Obtener todas las obras sociales
   - Respuesta: `200 OK` - Array de objetos de obras sociales ordenadas alfabéticamente

2. **POST `/api/obras-sociales`** - Crear nueva obra social
   - Body: `{ nombre, activa?: boolean }`
   - Respuesta: `201 Created` - Retorna el objeto de la obra social creada
   - Error `409` si el nombre ya existe

3. **PUT `/api/obras-sociales/:id`** - Actualizar obra social
   - Parámetros URL: `id` - ID de la obra social a actualizar
   - Body: `{ nombre?, activa? }`
   - Respuesta: `200 OK` - Retorna la obra social actualizada

4. **DELETE `/api/obras-sociales/:id`** - Eliminar obra social
   - Parámetros URL: `id` - ID de la obra social a eliminar
   - Respuesta: `200 OK` - Mensaje de confirmación
   - Error `409` si tiene citas asociadas

### Sistema de Notificaciones por Email

El sistema utiliza **SendGrid** para enviar notificaciones automáticas por email:

- **Confirmación**: Cuando una cita cambia a estado "Confirmada"
- **Cancelación**: Cuando una cita cambia a estado "Cancelada"

**Características de los emails:**
- Formato HTML con estilos CSS embebidos
- Versión texto plano como alternativa
- Fechas formateadas en español argentino
- Incluye todos los detalles de la cita (fecha, horario, obra social)
- Manejo de errores: si falla el envío, se registra pero no afecta la actualización de la cita

---

## Frontend

### Tecnologías Utilizadas

- **React 19**: Biblioteca de UI
- **Vite**: Build tool y dev server
- **React Router DOM**: Enrutamiento
- **React Hook Form**: Manejo de formularios
- **Yup**: Validación de esquemas
- **Axios**: Cliente HTTP
- **date-fns**: Utilidades para fechas
- **react-calendar**: Componente de calendario
- **lucide-react**: Iconos
- **Context API**: Gestión de estado global

### Estructura del Proyecto Frontend

```
client/
├── src/
│   ├── components/
│   │   ├── forms/
│   │   │   ├── AppointmentForm.jsx    # Formulario de reserva de citas
│   │   │   └── LoginModal.jsx         # Modal de inicio de sesión
│   │   ├── layout/
│   │   │   ├── Header.jsx              # Header con navegación
│   │   │   └── Footer.jsx              # Footer
│   │   └── ui/
│   │       └── Calendar.jsx           # Componente de calendario personalizado
│   ├── context/
│   │   ├── AuthContext.jsx             # Contexto de autenticación
│   │   ├── CitaContext.jsx              # Contexto de gestión de citas
│   │   └── SocialSecurityContext.jsx   # Contexto de obras sociales
│   ├── pages/
│   │   ├── Home.jsx                    # Página de inicio
│   │   ├── Appointment.jsx             # Página de reserva de citas
│   │   └── Admin.jsx                   # Panel administrativo
│   ├── styles/
│   │   └── globals.css                 # Estilos globales
│   ├── App.jsx                         # Componente principal
│   └── main.jsx                        # Punto de entrada
└── package.json
```

### Páginas y Funcionalidades

#### 1. Página de Inicio (`/`)

**Componente**: `Home.jsx`

**Secciones:**
- **Hero Section**: Presentación del médico con botones de acción
- **Servicios Médicos**: Grid con 6 servicios (Cardiología, ECG, Holter, etc.)
- **Formación Académica**: Timeline con educación y especializaciones
- **Información de Contacto**: Dirección, teléfono, email, horarios

**Características:**
- Navegación suave entre secciones
- Botones adaptativos según estado de autenticación
- Diseño responsive

#### 2. Página de Reserva (`/reservar`)

**Componente**: `Appointment.jsx`

**Funcionalidades:**
- Formulario completo de reserva de citas
- Información sobre horarios y ubicación
- Lista de obras sociales aceptadas
- Información de contacto para ayuda

**Formulario de Reserva** (`AppointmentForm.jsx`):

**Campos:**
- Nombre y Apellido (validación: solo letras, 2-50 caracteres)
- Teléfono (validación: formato argentino)
- Email (validación: formato email válido)
- Obra Social (select con obras sociales activas desde la API)
- Fecha (calendario personalizado)
- Horario (select dinámico según fecha seleccionada)

**Validaciones:**
- Validación en tiempo real con React Hook Form + Yup
- Mensajes de error específicos
- Campos deshabilitados hasta completar dependencias

**Calendario:**
- Muestra solo días laborables (lunes a viernes)
- Fechas disponibles de las próximas 2 semanas
- Deshabilita fechas pasadas
- Selección visual clara

**Horarios Disponibles:**
- Consulta automática al backend al seleccionar fecha
- Muestra solo horarios disponibles (09:00 - 17:30, cada 30 min)
- Excluye horarios ya ocupados
- Indicador de carga mientras consulta

**Flujo:**
1. Usuario completa datos personales
2. Selecciona obra social
3. Selecciona fecha en calendario
4. Sistema consulta horarios disponibles
5. Usuario selecciona horario
6. Envío del formulario
7. Mensaje de éxito con opción de reservar otra cita

#### 3. Panel Administrativo (`/admin`)

**Componente**: `Admin.jsx`

**Requisito**: Autenticación requerida (redirige si no está autenticado)

**Secciones:**

**Dashboard Cards:**
- Citas Pendientes: Contador de citas con estado "Solicitada"
- Obras Sociales Activas: Contador de obras sociales activas
- Pacientes Atendidos: Contador de citas confirmadas

**Gestión de Obras Sociales:**
- Lista de todas las obras sociales con estado (Activa/Inactiva)
- Botón "Nueva Obra Social" para crear
- Botones de editar y eliminar por obra social
- Modal para crear/editar con formulario
- Modal de confirmación antes de eliminar
- Validación: no permite eliminar si tiene citas asociadas

**Gestión de Citas:**
- Lista completa de todas las citas
- Filtros:
  - Ordenar por fecha (más reciente / más antiguo)
  - Filtrar por estado (Todos / Pendiente / Confirmada / Cancelada)
- Información mostrada por cita:
  - ID de la cita
  - Nombre y apellido del paciente
  - Fecha y horario formateados
  - Email del paciente
  - Obra social asociada
  - Estado actual (con colores: verde=Confirmada, rojo=Cancelada, amarillo=Pendiente)
- Acciones por cita:
  - **Confirmar**: Cambia estado a "Confirmada" (envía email automático)
  - **Cancelar**: Cambia estado a "Cancelada" (envía email automático)
  - **Notificar Email**: Botón informativo (muestra modal de confirmación)

**Características:**
- Actualización en tiempo real de la lista de citas
- Estados de carga durante operaciones
- Manejo de errores con mensajes informativos
- Diseño responsive y accesible

### Validaciones del Frontend

**Formulario de Reserva:**
- Nombre/Apellido: Solo letras y espacios, 2-50 caracteres
- Teléfono: Formato argentino válido, 8-20 caracteres
- Email: Formato email válido
- Obra Social: Selección requerida
- Fecha: Selección requerida, solo fechas disponibles
- Horario: Selección requerida, solo horarios disponibles

**Validación en tiempo real:**
- Mensajes de error específicos por campo
- Campos deshabilitados hasta completar dependencias
- Indicadores visuales de errores

### Integración Frontend-Backend

**URLs de API:**
- Base URL: `http://localhost:3000`
- Citas: `/api/citas`
- Obras Sociales: `/api/obras-sociales`

---

### Credenciales de Acceso

**Panel Administrativo:**
- Usuario: `medico` / Contraseña: `123456`
- Usuario: `secretaria` / Contraseña: `123456`

---

## Características Principales

### Para Pacientes

- ✅ Reserva de citas online
- ✅ Selección de fecha y horario disponible
- ✅ Validación de datos en tiempo real
- ✅ Recepción de emails de confirmación/cancelación
- ✅ Información sobre servicios médicos
- ✅ Lista de obras sociales aceptadas

### Para Administradores

- ✅ Panel de administración completo
- ✅ Gestión de citas (ver, confirmar, cancelar)
- ✅ Gestión de obras sociales (crear, editar, eliminar)
- ✅ Filtros y ordenamiento de citas
- ✅ Dashboard con estadísticas
- ✅ Notificaciones automáticas por email al cambiar estado de citas

### Técnicas

- ✅ API RESTful bien estructurada
- ✅ Validaciones en frontend y backend
- ✅ Manejo de errores robusto
- ✅ Diseño responsive
- ✅ Código modular y mantenible
- ✅ Context API para gestión de estado
- ✅ Sincronización automática de base de datos
- ✅ Emails HTML profesionales

---

## Consideraciones de Seguridad

1. **Variables de entorno**: Nunca subir el archivo `.env` al repositorio. Asegúrate de que esté en `.gitignore`
2. **API Keys**: Mantén tus API keys de SendGrid seguras y no las compartas públicamente
3. **Autenticación**: Actualmente es básica (hardcoded). En producción, implementar JWT o similar
4. **CORS**: En producción, configurar CORS para permitir solo dominios específicos
5. **Validación**: Validar datos tanto en frontend como backend
6. **SQL Injection**: Sequelize previene inyecciones SQL automáticamente
7. **Hash criptografico**: Las contraseñas tanto del medico como de la secretaria estan hasheadas

---

## Estructura de Archivos del Proyecto

```
API/
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   ├── package.json
│   └── .env (crear manualmente)
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Pasos de instalacion

Requisitos Previos:

- Node.js (v16 o superior)
- MySQL (Server en ejecución)
- Git

1. Clonar el repositorio
git clone [ <URL_DE_TU_REPOSITORIO>](https://github.com/KevinAlajarin/Api)
cd <NOMBRE_DEL_PROYECTO>

2. Configurar el Backend
-- cd Backend
-- npm install
   
3. Configuración de Variables de Entorno (.env):
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=citas_medicas_db
DB_DIALECT=mysql

SENDGRID_API_KEY=tu_api_key_de_sendgrid
SENDGRID_FROM_EMAIL=tu_email_verificado_en_sendgrid

4. Base de Datos:
Iniciar el Servidor:

Bash

npm start

O para modo desarrollo con nodemon:
npm run dev
El backend correrá en: http://localhost:3000

5. Configuracion del Frontend
-- cd client
-- npm install
-- npm run dev

El frontend correrá generalmente en: http://localhost:5173
