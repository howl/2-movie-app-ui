# Movie App UI

Frontend React para el API documentado en `@movie-app-api.yaml`. Catálogo de películas con autenticación JWT, roles (admin/user), favoritos por usuario e integración con OMDB.

**Stack**: React 19, Vite 8, JavaScript (ES6+), `react-router` (declarativo), Sass (estricto).

**Backend URLs**:
- Desarrollo: `http://localhost:3000`
- Producción: `https://proyecto-movie-app.onrender.com`

---

## Estructura del proyecto

```
src/
├── components/
│   ├── auth/       # LoginForm, SignupForm, ProtectedRoute
│   ├── movies/     # MovieCard, MovieList, MovieDetail, SearchBar
│   ├── favorites/  # FavoriteButton, FavoritesList
│   ├── admin/      # AdminMovieForm, AdminMovieTable
│   └── common/     # Navbar, Footer, Loading, ErrorMessage
├── hooks/          # useAuth, useMovies, useFavorites, useForm
├── services/       # api.js, authService.js, movieService.js, adminService.js
├── context/        # AuthContext.jsx
├── pages/          # LoginPage, SignupPage, SearchPage, MoviePage, FavoritesPage, AdminPage
├── styles/         # _variables.scss, _mixins.scss, global.scss
├── utils/          # constants.js, validators.js, storage.js
├── App.jsx
├── App.scss
├── main.jsx
└── index.scss
```

---

## Compilación y comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Build para producción |
| `npm run lint` | ESLint check |
| `npm run preview` | Preview del build |

---

## Estilo y convenciones de código

### Lenguaje y formato
- JavaScript (ES6+ modules). NO TypeScript.
- Named exports SIEMPRE: `export const ComponentName = () => { ... }`
- Componentes funcionales + hooks. NUNCA clases.

### Nomenclatura
- `PascalCase` → componentes, archivos `.jsx`, archivos `.scss`
- `camelCase` → hooks, servicios, utilidades, funciones, variables
- `UPPER_SNAKE` → constantes globales

### Imports
Orden estricto: React → react-router → servicios → hooks → componentes → estilos `.scss`

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { authService } from '../services/authService.js';
import { useAuth } from '../hooks/useAuth.js';
import { LoginForm } from '../components/auth/LoginForm.jsx';
import './LoginPage.scss';
```

### JSX
- Fragmentos `<>...</>` en lugar de `<div>` superfluos
- Self-closing cuando el componente no tiene children: `<Loading />`
- Props en múltiples líneas si son más de 2

### Estilos (Sass — estricto)
- 1 archivo `.scss` por componente, ubicado junto al `.jsx`
- **PROHIBIDO** inline styles (`style={{}}`) salvo excepción consultada y aprobada
- Variables globales en `styles/_variables.scss`
- Mixins reutilizables en `styles/_mixins.scss`
- Metodología BEM o anidamiento moderado, sin abusar de la profundidad (máximo 3 niveles)

### Otras reglas
- NO generar comentarios en el código
- NO usar `@ts-expect-error`, `@ts-ignore` (no hay TypeScript)
- NO dejar `console.log` en código de producción

---

## Referencia de la API

Extraído de `@movie-app-api.yaml`. Base URL desde `VITE_API_URL`.

### Autenticación
| Método | Ruta | Body | Respuesta |
|---|---|---|---|
| POST | `/api/v1/auth/login` | `{ email, password }` | `{ ok, msg, user, token }` |
| POST | `/api/v1/auth/signup` | `{ name, email, password }` | `{ ok, msg, user, token }` |

### Películas (usuario)
| Método | Ruta | Params/Body | Respuesta |
|---|---|---|---|
| GET | `/api/v1/movies/search?title=` | `title` (query) | `{ ok, msg (array\|string), peliculas?, token }` |
| GET | `/api/v1/movies/{id}` | `id` (path) | `{ ok, msg (Movie), token }` |

### Favoritos (usuario)
| Método | Ruta | Body | Respuesta |
|---|---|---|---|
| GET | `/api/v1/movies/favorites` | — | `{ ok, msg (Movie[]), token }` |
| POST | `/api/v1/movies/favorites` | `{ movieId }` | `{ message, favorites[] }` |
| DELETE | `/api/v1/movies/favorites/{id}` | `id` (path) | `{ ok, msg, token }` |

### Administración (admin)
| Método | Ruta | Body/Params | Respuesta |
|---|---|---|---|
| GET | `/api/v1/admin/movies` | — | `{ ok, msg, movies[], token }` |
| POST | `/api/v1/admin/movies` | `multipart/form-data` | `{ ok, msg, movie, token }` |
| GET | `/api/v1/admin/movies/{id}` | `id` (path) | `{ ok, msg (Movie), token }` |
| PATCH | `/api/v1/admin/movies/{id}` | `multipart/form-data` | `{ ok, msg, movie, token }` |
| DELETE | `/api/v1/admin/movies/{id}` | `id` (path) | `{ ok, msg, movie, token }` |

### Formato de respuesta estándar
- Éxito: `{ ok: true, msg, token }` (el token se renueva en cada respuesta)
- Error: `{ ok: false, msg }` o `{ ok: false, errors: { campo: { msg } } }`
- Error 403: `{ ok: true, msg: "Acceso prohibido" }`

### Modelo Movie
```js
{
  _id: String,        // ObjectId MongoDB (24 hex chars)
  title: String,      // requerido, max 255
  image: String,      // URL de Cloudinary o ruta local
  synopsis: String,   // requerido, max 2000
  year: Number,       // requerido, 1888-9999
  director: String,   // requerido, max 100
  genres: String[],   // requerido
  duration: Number,   // requerido, 1-1000
  externalId: String, // opcional, formato ttXXXXXXX
  createdAt: String,  // ISO date
  updatedAt: String   // ISO date
}
```

---

## Arquitectura

### Flujo de autenticación
1. Usuario hace login/signup → API devuelve `{ user, token }`
2. Token se almacena en `sessionStorage` (se pierde al cerrar pestaña)
3. `AuthContext` expone `{ user, token, login, logout, isAuthenticated, isAdmin }`
4. Cada request autenticado incluye `Authorization: Bearer <token>`
5. `api.js` detecta 401 → logout automático → redirect a `/login`
6. `ProtectedRoute` verifica autenticación y rol antes de renderizar hijos

### Routing (declarativo con react-router)
```jsx
<BrowserRouter>
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/" element={<SearchPage />} />
      <Route path="/movies/:id" element={<MoviePage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
    </Route>
    <Route element={<ProtectedRoute requiredRole="admin" />}>
      <Route path="/admin/movies" element={<AdminPage />} />
    </Route>
  </Routes>
</BrowserRouter>
```

### Gestión de estado
- `AuthContext` → estado global de autenticación
- Estado local (hooks) → búsquedas, formularios, listados
- Sin librería externa de state management

---

## Fases de implementación

### Fase 0 — Setup inicial
- `npm install react-router sass`
- Crear estructura de directorios `src/`
- ✅ Verificar: `npm run dev` no da errores

### Fase 1 — Servicios API
**Archivos a crear:**
- `src/services/api.js` — Cliente HTTP base con fetch.
  - Función `request(endpoint, options)` que:
    - Lee token de sessionStorage
    - Añade header `Authorization: Bearer <token>` si existe
    - Parsea response JSON
    - Si response es 401 → `sessionStorage.removeItem('token')` + lanza error
    - Devuelve el body parseado
  - Extrae el nuevo token del response (viene en `body.token`) y lo guarda en sessionStorage
- `src/services/authService.js` — `login(email, password)`, `signup(name, email, password)`
- `src/services/movieService.js` — `search(title)`, `getById(id)`, `getFavorites()`, `addFavorite(movieId)`, `removeFavorite(id)`
- `src/services/adminService.js` — `getAll()`, `create(formData)`, `update(id, formData)`, `remove(id)`
- `src/utils/storage.js` — `getToken()`, `setToken(token)`, `removeToken()`
- `src/utils/constants.js` — `API_URL` desde `import.meta.env.VITE_API_URL`
- `src/utils/validators.js` — `isValidEmail()`, `isValidPassword()`, `isRequired()`
- ✅ Verificar: `npm run lint`

### Fase 2 — Contexto de autenticación
**Archivos a crear:**
- `src/context/AuthContext.jsx` — `AuthProvider` + `AuthContext`
  - Estado: `user`, `token`, `loading` (inicializa leyendo token de sessionStorage)
  - `login(user, token)` → setea estado + sessionStorage
  - `logout()` → limpia estado + sessionStorage
- `src/hooks/useAuth.js` — wrapper de `useContext(AuthContext)` con error si se usa fuera del provider
- Modificar `src/main.jsx`:
  - Envolver `<App />` con `<AuthProvider>`
  - Envolver con `<BrowserRouter>` de react-router
- ✅ Verificar: `npm run lint` + `npm run build`

### Fase 3 — Layout y componentes base
**Archivos a crear:**
- `src/components/common/Navbar.jsx` + `Navbar.scss`:
  - Logo / nombre de la app
  - Enlaces: Home, Favorites (solo autenticado), Admin (solo admin)
  - Nombre de usuario + botón Cerrar sesión (si autenticado) / Login + Signup (si no)
- `src/components/common/Footer.jsx` + `Footer.scss`
- `src/components/common/ProtectedRoute.jsx`:
  - Si `loading` → `<Loading />`
  - Si no autenticado → `<Navigate to="/login" />`
  - Si `requiredRole` y no coincide → `<Navigate to="/" />`
  - Si ok → `<Outlet />`
- `src/components/common/Loading.jsx` + `Loading.scss`
- `src/components/common/ErrorMessage.jsx` + `ErrorMessage.scss`
- `src/styles/_variables.scss` — colores, fuentes, breakpoints
- `src/styles/_mixins.scss` — `respond-to($breakpoint)`, `flex-center`, etc.
- `src/index.scss` — reset, imports de variables y mixins, estilos base
- `src/App.scss` — layout general (min-height 100vh, sticky footer)
- Modificar `src/App.jsx`:
  - `<Navbar />` + `<Routes>` (importadas de las pages que se crearán en fases siguientes) + `<Footer />`
- ✅ Verificar: `npm run lint` + `npm run build`

### Fase 4 — Páginas de autenticación
**Archivos a crear:**
- `src/hooks/useForm.js` — hook genérico para formularios: maneja `values`, `errors`, `handleChange`, `handleSubmit`, `setErrors`
- `src/components/auth/LoginForm.jsx` + `LoginForm.scss`:
  - Campos: email, password
  - Botón submit: "Iniciar sesión"
  - Link a Signup
- `src/components/auth/SignupForm.jsx` + `SignupForm.scss`:
  - Campos: name, email, password
  - Botón submit: "Crear cuenta"
  - Link a Login
- `src/pages/LoginPage.jsx` + `LoginPage.scss`
- `src/pages/SignupPage.jsx` + `SignupPage.scss`
- Conectar con `authService` y `useAuth`
- ✅ Verificar: `npm run lint` + `npm run build`

### Fase 5 — Páginas de usuario
**Archivos a crear:**
- `src/components/movies/SearchBar.jsx` + `SearchBar.scss`:
  - Input + botón de búsqueda
  - Debounce opcional (300ms)
- `src/components/movies/MovieCard.jsx` + `MovieCard.scss`:
  - Poster, título, año, director, géneros
  - Botón de favorito (corazón)
- `src/components/movies/MovieList.jsx` + `MovieList.scss`:
  - Grid responsivo de MovieCards
  - Mensaje "No se encontraron películas" si empty
- `src/components/movies/MovieDetail.jsx` + `MovieDetail.scss`:
  - Vista detallada de una película (todos los campos del modelo Movie)
- `src/components/favorites/FavoriteButton.jsx` + `FavoriteButton.scss`:
  - Corazón relleno/vacío según estado
  - Llama a `addFavorite` / `removeFavorite`
- `src/components/favorites/FavoritesList.jsx` + `FavoritesList.scss`:
  - Lista de MovieCards filtrados por favoritos
- `src/hooks/useMovies.js` — `searchMovies()`, estado `movies`, `loading`, `error`
- `src/hooks/useFavorites.js` — `favorites`, `toggleFavorite()`, `isFavorite(movieId)`
- `src/pages/SearchPage.jsx` + `SearchPage.scss`
- `src/pages/MoviePage.jsx` + `MoviePage.scss`
- `src/pages/FavoritesPage.jsx` + `FavoritesPage.scss`
- ✅ Verificar: `npm run lint` + `npm run build`

### Fase 6 — Páginas de administración
**Archivos a crear:**
- `src/components/admin/AdminMovieTable.jsx` + `AdminMovieTable.scss`:
  - Tabla con todas las películas y columnas: título, año, director, duración, acciones (editar, eliminar)
- `src/components/admin/AdminMovieForm.jsx` + `AdminMovieForm.scss`:
  - Formulario completo de película (todos los campos del modelo Movie)
  - Manejo de `multipart/form-data` para subida de imagen
  - Modo crear / modo editar
- `src/pages/AdminPage.jsx` + `AdminPage.scss`:
  - Alterna entre tabla y formulario (crear/editar)
- Conectar con `adminService`
- ✅ Verificar: `npm run lint` + `npm run build`

### Fase 7 — Refinamiento final
- Redirects en casos edge (token expirado, 401 global)
- Feedback visual en acciones (estado de carga en botones, mensajes de éxito/error temporales)
- Responsive básico con media queries via `_mixins.scss`
- ✅ Verificar: `npm run lint` + `npm run build`

---

## Guía de pruebas (preparado para futuro)

- **Framework**: Vitest
- **Librería**: Testing Library (React)
- **Tests unitarios**: servicios (mockeando fetch), hooks, utilidades, validators
- **Tests de componentes**: renderizar, interactuar, verificar output
- **Tests de integración**: flujo completo (login → buscar → favorito)
- Archivos de test: `*.test.js` o `*.spec.js` junto al archivo que testean

---

## Seguridad

- JWT almacenado en `sessionStorage` (se pierde al cerrar pestaña, mitigación XSS parcial)
- Token extraído en `api.js` y añadido automáticamente a cada request
- En 401 → logout automático + redirect a login
- NO hardcodear URLs ni secrets. Usar `VITE_API_URL` (`.env` file)
- Validar formularios en cliente antes de enviar al servidor
- No mostrar errores técnicos al usuario (solo mensajes amigables)

---

## Flujo de trabajo con Git

- Ejecutar `npm run lint` antes de cada commit
- Ejecutar `npm run build` para verificar que compila
- Mensajes descriptivos: `"feat: añadir servicio de autenticación"`, `"refactor: extraer useForm hook"`
- Commits atómicos: uno por fase o por componente significativo
- NO hacer push a menos que se solicite explícitamente
