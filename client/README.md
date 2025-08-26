# Aplicación Web Médica - Frontend

## Descripción

Aplicación web responsive para un médico cardiólogo que permite presentar información profesional, gestionar reservas de citas y administrar la agenda de turnos.

## Características

- **Landing Page**: Presentación del médico, especialidad, formación y servicios
- **Reserva de Citas**: Formulario completo con calendario dinámico
- **Login Administrativo**: Acceso para médico/secretaria
- **Diseño Responsive**: Optimizado para móviles, tablets y desktop
- **UI Profesional**: Diseño moderno y acorde al área médica

## Tecnologías Utilizadas

- **React 18** - Biblioteca de interfaz de usuario
- **Vite** - Herramienta de construcción rápida
- **React Router DOM** - Enrutamiento de la aplicación
- **React Hook Form** - Manejo de formularios
- **Yup** - Validación de esquemas
- **Lucide React** - Iconos modernos
- **CSS Variables** - Sistema de diseño consistente

## Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd client
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:5173
   ```

## Scripts Disponibles

- `npm run dev` - Ejecuta la aplicación en modo desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── forms/          # Formularios
│   ├── layout/         # Componentes de layout
│   └── ui/             # Componentes de interfaz
├── context/            # Contextos de React
├── pages/              # Páginas de la aplicación
├── styles/             # Estilos globales
└── utils/              # Utilidades y helpers
```

## Componentes Principales

### Header
- Navegación principal
- Logo del médico
- Botón de login/logout
- Menú responsive para móviles

### Home (Landing Page)
- Hero section con información del médico
- Sección de servicios
- Formación académica
- Información de contacto

### Appointment Form
- Formulario de reserva de citas
- Validación de campos
- Selección de fecha y horario
- Lista de obras sociales

### Footer
- Información de contacto
- Enlaces rápidos
- Servicios ofrecidos

## Funcionalidades

### Sistema de Autenticación
- Login para médico/secretaria
- Credenciales de prueba:
  - Usuario: `medico` | Contraseña: `123456`
  - Usuario: `secretaria` | Contraseña: `123456`

### Reserva de Citas
- Formulario completo con validación
- Calendario de 2 semanas
- Horarios disponibles
- Selección de obra social
- Confirmación por email (simulada)

### Diseño Responsive
- Mobile-first approach
- Breakpoints: 480px, 768px, 1024px
- Navegación adaptativa
- Formularios optimizados para móvil

## Variables CSS

El proyecto utiliza un sistema de variables CSS para mantener consistencia en:
- Colores (primarios, secundarios, estados)
- Tipografía (tamaños, pesos, familias)
- Espaciado (márgenes, padding)
- Sombras y bordes
- Transiciones y animaciones

## Navegación

- `/` - Página principal (Home)
- `/reservar` - Formulario de reserva de citas
- `#inicio`, `#servicios`, `#formacion`, `#contacto` - Anclas de la página principal

## Estado de la Aplicación

- **Context de Autenticación**: Maneja el estado del usuario logueado
- **Formularios**: Estado local con validación en tiempo real
- **Responsive**: Adaptación automática según el tamaño de pantalla

## Próximos Pasos

- [ ] Integración con backend
- [ ] Panel administrativo
- [ ] Gestión de citas
- [ ] Notificaciones por email reales
- [ ] Base de datos de pacientes
- [ ] Sistema de pagos

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## Contacto

Para consultas sobre el proyecto, contactar a [tu-email@ejemplo.com]
