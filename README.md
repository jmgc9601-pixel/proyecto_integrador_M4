# MateCode

**Aplicación web de gestión de tareas con React, TypeScript, Firebase y AWS SES.**

MateCode es una aplicación web que permite a los usuarios gestionar sus tareas personales mediante operaciones CRUD, autenticación y sincronización en tiempo real. También incorpora notificaciones por correo electrónico cuando se crea o completa una tarea.

---

## Tabla de contenidos

1. [Descripción del proyecto](#descripción-del-proyecto)
2. [Funcionalidades principales](#funcionalidades-principales)
3. [Tecnologías utilizadas](#tecnologías-utilizadas)
4. [Arquitectura del proyecto](#arquitectura-del-proyecto)
5. [Requisitos previos](#requisitos-previos)
6. [Instalación y ejecución](#instalación-y-ejecución)
7. [Variables de entorno](#variables-de-entorno)
8. [Integración con Firebase](#integración-con-firebase)
9. [Integración Serverless y AWS SES](#integración-serverless-y-aws-ses)
10. [Testing](#testing)
11. [Despliegue en Vercel](#despliegue-en-vercel)
12. [Seguridad](#seguridad)
13. [Uso crítico y responsable de inteligencia artificial](#uso-crítico-y-responsable-de-inteligencia-artificial)
14. [Validación del proyecto](#validación-del-proyecto)

---

## Descripción del proyecto

MateCode es una aplicación de gestión de tareas desarrollada como proyecto integrador del módulo M4.

Su objetivo es ofrecer una herramienta para organizar actividades, administrar prioridades y realizar seguimiento del progreso de las tareas.

La aplicación utiliza Firebase para gestionar la autenticación y almacenar la información de los usuarios. La interfaz se actualiza automáticamente mediante la sincronización en tiempo real de Cloud Firestore.

Adicionalmente, incorpora una función Serverless desplegada en Vercel que permite enviar notificaciones por correo electrónico mediante Amazon Simple Email Service (AWS SES).

## Funcionalidades principales

- Registro de usuarios e inicio de sesión.
- Cierre de sesión.
- Protección de rutas privadas.
- Gestión de tareas mediante operaciones CRUD:
  - Crear tareas.
  - Consultar tareas.
  - Editar tareas.
  - Eliminar tareas.
- Administración del estado de las tareas:
  - Pendiente.
  - En progreso.
  - Completada.
- Asignación de prioridades:
  - Baja.
  - Media.
  - Alta.
- Búsqueda y filtrado de tareas.
- Sincronización automática con Cloud Firestore.
- Persistencia de información después de recargar la aplicación.
- Notificaciones por correo electrónico al crear y completar tareas.
- Interfaz adaptable y modo de visualización configurable.

## Tecnologías utilizadas

| Tecnología | Versión / uso |
|---|---|
| React | 19.3.1 — Interfaz de usuario. |
| TypeScript | 7.0.2 — Tipado estático. |
| Vite | 8.3.x — Desarrollo y compilación. |
| React Router DOM | 7.18.5 — Navegación y rutas. |
| Firebase | 13.4.0 — Autenticación y Firestore. |
| Firebase Admin SDK | 14.5.1 — Verificación de tokens en backend. |
| AWS SDK for JavaScript (SES) | Envío de notificaciones. |
| Vercel Functions | Ejecución del endpoint Serverless. |
| Vitest | Pruebas automatizadas. |
| React Testing Library | Pruebas de componentes. |
| Oxlint | Análisis estático del código. |

*Las versiones indicadas corresponden a las dependencias declaradas en `package.json`.*

## Arquitectura del proyecto

MateCode utiliza una organización por responsabilidades para separar la interfaz, la lógica de negocio y el acceso a servicios externos.

### Estructura del proyecto

```text
matecode/
│
├── api/
│   ├── lib/
│   │   └── firebase-admin.ts
│   └── send-email.ts
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   └── ThemeToggle.tsx
│   │   └── tasks/
│   │       ├── TaskCard.tsx
│   │       ├── TaskFilters.tsx
│   │       ├── TaskModal.tsx
│   │       └── TaskModal.test.tsx
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTasks.ts
│   │   └── useTheme.ts
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   └── dashboard/
│   │       └── Dashboard.tsx
│   │
│   ├── routes/
│   │   ├── AppRoutes.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── services/
│   │   ├── firebase/
│   │   │   ├── auth.service.ts
│   │   │   ├── config.ts
│   │   │   └── tasks.service.ts
│   │   ├── email.service.ts
│   │   └── email.service.test.ts
│   │
│   ├── test/
│   │   ├── setup.ts
│   │   └── vitest.test.ts
│   │
│   ├── types/
│   │   └── task.types.ts
│   │
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── firestore.rules
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

### Responsabilidades principales

**Frontend (`src/`)**

Contiene la interfaz de usuario, las páginas, los componentes reutilizables, los hooks y los tipos de TypeScript.

**Servicios Firebase (`src/services/firebase/`)**

Centralizan la configuración y las operaciones relacionadas con autenticación y almacenamiento de tareas.

**Hook `useTasks`**

Gestiona la suscripción a las tareas del usuario, los estados de carga y error, los filtros y las operaciones CRUD.

**Servicio de correo (`src/services/email.service.ts`)**

Solicita el envío de notificaciones al endpoint Serverless. Obtiene el token de autenticación del usuario y lo envía mediante una petición HTTP.

**Backend Serverless (`api/`)**

Contiene la función encargada de validar las solicitudes, verificar los tokens de Firebase y comunicarse con AWS SES.

## Requisitos previos

Para ejecutar el proyecto localmente se necesita:

- Node.js compatible con Vite 8.
- npm.
- Una cuenta de Firebase con Authentication y Cloud Firestore configurados.
- Una cuenta de AWS con Amazon SES configurado, si se desea probar el envío de correos.
- Una cuenta de Vercel para desplegar las funciones Serverless.

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/jmgc9601-pixel/proyecto_integrador_M4.git
```

### 2. Entrar al directorio

```bash
cd matecode
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto y agregar las variables necesarias.

Consultar la sección [Variables de entorno](#variables-de-entorno).

### 5. Ejecutar el entorno de desarrollo

```bash
npm run dev
```

Vite mostrará la dirección local donde se puede abrir la aplicación.

### 6. Ejecutar las pruebas automatizadas

```bash
npm run test -- --run
```

### 7. Revisar el código con Oxlint

```bash
npm run lint
```

### 8. Compilar el proyecto

```bash
npm run build
```

Este comando ejecuta primero la comprobación de TypeScript mediante `tsc -b` y posteriormente genera la compilación de producción con Vite.

### 9. Visualizar la compilación localmente

```bash
npm run preview
```

## Variables de entorno

Las credenciales y configuraciones sensibles deben mantenerse fuera del código fuente y del repositorio.

### Variables del frontend

El SDK web de Firebase utiliza las siguientes variables:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Estas variables corresponden a la configuración del SDK web de Firebase. No deben confundirse con credenciales administrativas.

### Variables del backend

La función Serverless necesita las siguientes variables:

```env
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
SES_FROM_EMAIL=
```

**Importante:**

- Los valores reales deben obtenerse de las respectivas plataformas.
- `FIREBASE_PRIVATE_KEY` debe conservar el formato esperado por Firebase Admin.
- Las credenciales AWS y la clave privada de Firebase Admin nunca deben exponerse en el frontend.
- Las variables del backend deben configurarse también en el entorno de producción de Vercel.
- Los nombres de las variables deben coincidir con los utilizados en los archivos de configuración del proyecto.
- El archivo `.env` no debe subirse al repositorio.

## Integración con Firebase

MateCode utiliza Firebase Authentication para identificar a los usuarios y Cloud Firestore para almacenar sus tareas.

### Autenticación

El sistema permite registrar usuarios, iniciar sesión y cerrar sesión.

Las rutas privadas utilizan el estado de autenticación para controlar el acceso al dashboard.

### Almacenamiento

Las tareas se almacenan en Cloud Firestore y se relacionan con el identificador del usuario autenticado.

El hook `useTasks` utiliza una suscripción a los cambios de Firestore para actualizar automáticamente la interfaz cuando se producen modificaciones.

La consulta de tareas filtra por el identificador del usuario autenticado mediante `where('userId', '==', userId)`.

### Persistencia

Las tareas permanecen almacenadas en Firestore después de recargar la aplicación o cerrar sesión.

Las reglas de seguridad de Firestore restringen las operaciones sobre la colección `tasks` al propietario de cada documento y bloquean el acceso al resto de colecciones.

## Integración Serverless y AWS SES

MateCode incorpora un endpoint Serverless en:

```text
/api/send-email
```

La función se ejecuta en Vercel y utiliza AWS SES para enviar notificaciones.

### Flujo de funcionamiento

1. El usuario crea o completa una tarea.
2. El hook `useTasks` solicita el envío de una notificación.
3. El servicio `email.service.ts` obtiene el token de autenticación de Firebase.
4. El frontend envía una petición POST al endpoint `/api/send-email`.
5. El backend verifica el token mediante Firebase Admin.
6. Se valida el tipo de notificación y los datos recibidos.
7. AWS SES procesa el envío del correo.
8. El endpoint devuelve el resultado de la operación.

### Tipos de notificaciones

| Evento | Tipo |
|---|---|
| Creación de una tarea | `task_created` |
| Finalización de una tarea | `task_completed` |

El servicio de correo está desacoplado de las operaciones CRUD: un error en el envío de una notificación no debe impedir que una tarea se cree o complete correctamente.

**Nota sobre AWS SES:** durante el desarrollo y las pruebas, la cuenta puede permanecer en Sandbox. En ese estado existen restricciones sobre los destinatarios y los límites de envío. Para enviar correos a destinatarios no verificados es necesario solicitar el acceso correspondiente a producción.

## Testing

MateCode utiliza Vitest y React Testing Library para comprobar comportamientos importantes de la aplicación.

### Ejecutar las pruebas

```bash
npm run test -- --run
```

### Ejecutar las pruebas en modo interactivo

```bash
npm run test
```

### Pruebas implementadas

| Prueba | Comportamiento verificado |
|---|---|
| Configuración de Vitest | Comprueba que el entorno de pruebas ejecuta correctamente. |
| Título vacío | Impide enviar una tarea sin título. |
| Título válido | Comprueba que el formulario envía los datos correctamente. |
| Error HTTP del servidor | Comprueba el manejo de una respuesta de error del endpoint. |
| Error de conexión | Comprueba el manejo de fallos de comunicación. |

Los servicios externos se simulan mediante mocks para evitar conexiones reales a Firebase o AWS durante estas pruebas.

## Despliegue en Vercel

La aplicación está preparada para desplegarse en Vercel.

**URL de producción:** `https://proyecto-integrador-m4-f0gn7m8dl-jmgc9601-pixel.vercel.app`

### Consideraciones para el despliegue

1. Conectar el repositorio del proyecto con Vercel.
2. Configurar las variables de entorno del frontend y backend.
3. Verificar la configuración de Firebase.
4. Configurar las credenciales necesarias para AWS SES.
5. Ejecutar el despliegue.
6. Comprobar el funcionamiento de autenticación, CRUD y notificaciones.

Las variables de entorno deben configurarse en Vercel para los entornos correspondientes y volver a desplegar después de modificarlas.

## Seguridad

El proyecto aplica distintas medidas para proteger la información y las operaciones:

- Autenticación mediante Firebase Authentication.
- Protección de rutas privadas.
- Verificación de tokens en el backend mediante Firebase Admin.
- Separación de frontend y backend.
- Uso de variables de entorno para credenciales.
- Restricción de operaciones de Firestore mediante reglas de seguridad.
- Validación del método HTTP y del contenido recibido por el endpoint Serverless.
- Uso de credenciales AWS con permisos limitados para el envío de correos.

Las reglas de Firestore se encuentran en `firestore.rules` y se han configurado manualmente en Firebase Console. La configuración local coincide con las reglas publicadas.

## Uso crítico y responsable de inteligencia artificial

Durante el desarrollo de MateCode se utilizó inteligencia artificial como herramienta de apoyo para el aprendizaje, análisis, implementación y validación de funcionalidades.

El uso de IA se orientó a:

- Solicitar explicaciones paso a paso sobre conceptos de React, TypeScript, Firebase y arquitectura Serverless.
- Analizar errores y comprender sus posibles causas antes de aplicar cambios.
- Solicitar ejemplos pequeños y adaptados a la estructura existente del proyecto.
- Revisar implementaciones y contrastar las recomendaciones con el funcionamiento real de la aplicación.
- Diseñar pruebas automatizadas para validar comportamientos y casos de error.
- Identificar oportunidades de mejora en organización, seguridad y documentación.

La IA se utilizó como apoyo y no como sustituto de la comprensión técnica. Las implementaciones se revisaron y probaron en el entorno local y, cuando correspondía, en producción.

Entre las decisiones técnicas importantes se encuentran:

- Separar los servicios de Firebase de los componentes de interfaz.
- Centralizar la gestión de tareas mediante un hook personalizado.
- Utilizar Firestore para sincronización y persistencia en tiempo real.
- Verificar los tokens de Firebase en el backend antes de procesar solicitudes de correo.
- Mantener las credenciales administrativas fuera del frontend.
- Desacoplar las notificaciones por correo de las operaciones principales del CRUD.
- Incorporar pruebas automatizadas para validar casos normales y errores.

El objetivo fue utilizar la IA de forma crítica, comprender las soluciones implementadas y comprobar su funcionamiento antes de considerarlas terminadas.

## Validación del proyecto

Durante la validación del proyecto se ejecutaron los siguientes controles:

| Control | Resultado |
|---|---|
| Oxlint | 0 advertencias y 0 errores |
| TypeScript | Sin errores de compilación |
| Vitest | 5 pruebas aprobadas |
| Archivos de prueba | 3 archivos |
| Build de producción | Completado correctamente |
| Aplicación en producción | Autenticación y CRUD comprobados |
| Notificaciones por correo | Envío de creación y finalización comprobado |
| Reglas de Firestore | Publicadas y coincidentes con el archivo local |

La compilación puede mostrar una advertencia de Vite relacionada con el tamaño del bundle JavaScript principal. Esta advertencia corresponde a una oportunidad de optimización y no impide completar la compilación.

---

## Autor

**Desarrollador:** `Juan Garcia`

**Proyecto:** MateCode

**Programa:** Henry webft79

**Módulo:** M4 — Proyecto integrador

**Repositorio:** `https://github.com/jmgc9601-pixel/proyecto_integrador_M4.git`

**Aplicación desplegada:** `https://proyecto-integrador-m4-f0gn7m8dl-jmgc9601-pixel.vercel.app`

---

*MateCode — Organización y seguimiento de tareas en un solo lugar.*