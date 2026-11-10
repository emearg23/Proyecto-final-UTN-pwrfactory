# Pwr Factory API

API RESTful para gestionar el catálogo de **Pwr Factory**, una tienda de repuestos para vehículos Volkswagen y Audi: productos (repuestos), categorías y usuarios. Está construida con Node.js, Express y MongoDB (Mongoose), con operaciones CRUD, una capa de servicios que concentra la lógica de negocio y autenticación con JWT.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB + Mongoose
- bcrypt (hasheo de contraseñas)
- jsonwebtoken (autenticación con JWT)
- dotenv (variables de entorno)
- cors

## Estructura del proyecto

```
pwr-factory-api/
├── app.js
├── .env
├── package.json
└── src/
    ├── models/        (productModel, categoryModel, userModel)
    ├── services/      (lógica de negocio y acceso a la base de datos)
    ├── controllers/   (manejan la solicitud y respuesta HTTP)
    ├── routes/        (definición de endpoints)
    ├── config/        (db.js: conexión a MongoDB)
    ├── middleware/    (verifyToken.js: validación del JWT)
    └── utils/         (createError, handleError)
```

Los controladores solo manejan Request/Response y delegan toda la lógica y las llamadas a Mongoose a los servicios.

## Esquema de la base de datos

**categories**

| Campo | Tipo | Notas |
|---|---|---|
| nombre | String | Obligatorio, único |
| descripcion | String | Opcional |

**products**

| Campo | Tipo | Notas |
|---|---|---|
| nombre | String | Obligatorio |
| descripcion | String | Opcional |
| precio | Number | Obligatorio, mayor o igual a 0 |
| stock | Number | Mayor o igual a 0, por defecto 0 |
| categoria | ObjectId | Referencia a `categories`, obligatorio |

**users**

| Campo | Tipo | Notas |
|---|---|---|
| nombre | String | Obligatorio |
| email | String | Obligatorio, único |
| password | String | Obligatorio, mínimo 6 caracteres, se guarda hasheada con bcrypt |

Todas las colecciones incluyen `createdAt` y `updatedAt` automáticamente.

## Cómo correr el proyecto

1. Clonar el repositorio e instalar dependencias:

```bash
npm install
```

2. Completar el archivo `.env` con tus datos (ver sección siguiente).

3. Iniciar el servidor:

```bash
npm start
```

Para desarrollo con recarga automática:

```bash
npm run dev
```

El servidor queda disponible en `http://localhost:3000`.

## Variables de entorno (.env)

El repositorio incluye un `.env` de ejemplo con valores de relleno (placeholders):

```
PORT=3000
MONGODB_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/pwr-factory?retryWrites=true&w=majority
JWT_SECRET=cambiar_por_una_clave_secreta_larga
JWT_EXPIRES_IN=2h
```

Reemplazar `<usuario>`, `<password>` y `<cluster>` por los datos de tu base (MongoDB Atlas o local, por ejemplo `mongodb://localhost:27017/pwr-factory`).

## Endpoints

Las rutas marcadas con 🔒 requieren el header `Authorization: Bearer <token>`.

### Usuarios

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/users/register` | Registrar un usuario |
| POST | `/api/users/login` | Iniciar sesión y obtener el token JWT |

### Categorías

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/categories` | Listar todas las categorías |
| GET | `/api/categories/:id` | Obtener una categoría |
| POST | `/api/categories` 🔒 | Crear una categoría |
| DELETE | `/api/categories/:id` 🔒 | Eliminar una categoría (falla con 409 si tiene productos asociados) |

### Productos

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/products` | Listar productos (con la categoría completa mediante `populate`) |
| GET | `/api/products/:id` | Obtener un producto (con su categoría) |
| POST | `/api/products` 🔒 | Crear un producto |
| PUT | `/api/products/:id` 🔒 | Actualizar un producto |
| DELETE | `/api/products/:id` 🔒 | Eliminar un producto |

### Códigos de respuesta

| Código | Significado |
|---|---|
| 200 | Operación exitosa |
| 201 | Recurso creado |
| 400 | Datos inválidos o ID mal formado |
| 401 | Token faltante o inválido, o credenciales incorrectas |
| 404 | Recurso o ruta no encontrada |
| 409 | Conflicto (dato duplicado o categoría en uso) |
| 500 | Error interno del servidor |

## Ejemplos de datos (Mock JSON)

Categorías de ejemplo para la tienda: Frenos, Motor, Suspensión, Filtros, Eléctrico y Carrocería.

### POST `/api/users/register`

```json
{
  "nombre": "Marcos",
  "email": "marcos@pwrfactory.com",
  "password": "123456"
}
```

Respuesta (201):

```json
{
  "id": "6720a1f4c2b3d4e5f6a7b8c9",
  "nombre": "Marcos",
  "email": "marcos@pwrfactory.com"
}
```

### POST `/api/users/login`

```json
{
  "email": "marcos@pwrfactory.com",
  "password": "123456"
}
```

Respuesta (200):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "6720a1f4c2b3d4e5f6a7b8c9",
    "nombre": "Marcos",
    "email": "marcos@pwrfactory.com"
  }
}
```

### POST `/api/categories` 🔒

```json
{
  "nombre": "Frenos",
  "descripcion": "Pastillas, discos y componentes del sistema de frenos"
}
```

Respuesta (201):

```json
{
  "_id": "6720a2b1c2b3d4e5f6a7b8d0",
  "nombre": "Frenos",
  "descripcion": "Pastillas, discos y componentes del sistema de frenos",
  "createdAt": "2026-10-20T15:00:00.000Z",
  "updatedAt": "2026-10-20T15:00:00.000Z"
}
```

### POST `/api/products` 🔒

```json
{
  "nombre": "Pastillas de freno delanteras Golf VII",
  "descripcion": "Juego de pastillas para Volkswagen Golf VII 1.4 TSI",
  "precio": 48500,
  "stock": 12,
  "categoria": "6720a2b1c2b3d4e5f6a7b8d0"
}
```

Respuesta (201):

```json
{
  "_id": "6720a3c4c2b3d4e5f6a7b8e1",
  "nombre": "Pastillas de freno delanteras Golf VII",
  "descripcion": "Juego de pastillas para Volkswagen Golf VII 1.4 TSI",
  "precio": 48500,
  "stock": 12,
  "categoria": {
    "_id": "6720a2b1c2b3d4e5f6a7b8d0",
    "nombre": "Frenos",
    "descripcion": "Pastillas, discos y componentes del sistema de frenos"
  }
}
```

### PUT `/api/products/:id` 🔒

Se pueden enviar solo los campos a modificar:

```json
{
  "precio": 52000,
  "stock": 8
}
```

### Ejemplo de error (404)

```json
{
  "message": "Producto no encontrado"
}
```

### Ejemplo de error de validación (400)

```json
{
  "message": "Datos inválidos",
  "detalles": ["El precio es obligatorio"]
}
```

## Funcionalidades implementadas

- CRUD completo de productos y operaciones GET, POST y DELETE de categorías
- Relación Producto → Categoría con `populate` en las lecturas
- Capa de servicios con toda la lógica de negocio y acceso a Mongoose
- Validación de que la categoría exista al crear o actualizar un producto
- Bloqueo del borrado de categorías que tengan productos asociados
- Manejo de errores con códigos HTTP apropiados (200, 201, 400, 401, 404, 409, 500)
- Registro de usuarios con contraseña hasheada mediante bcrypt (pre-save hook)
- Login con JWT y middleware `verifyToken` que protege las rutas de creación, actualización y eliminación
- Variables de entorno con dotenv y CORS habilitado

## Funcionalidades a futuro

- Campos de marca (Volkswagen / Audi) y modelos compatibles en cada repuesto
- Paginación y filtros de productos (por categoría, marca, modelo y rango de precio)
- Roles de usuario (administrador y cliente)
- Actualización de categorías
- Carga de imágenes de los repuestos
- Carrito y pedidos de compra
- Tests automatizados
- Despliegue en un servicio de hosting
