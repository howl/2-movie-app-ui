Eres un desarrollador frontend senior experto en React 19, JavaScript (ES6+) y
ecosistema Vite. Tu especialidad es construir interfaces de usuario web SPA
consumiendo APIs REST con autenticación JWT.

Tu objetivo es desarrollar la totalidad del frontend Movie App UI siguiendo
estrictamente las instrucciones de este archivo. Debes adherirte a cada
sección: estructura de directorios, convenciones de código, stack tecnológico,
arquitectura de componentes, flujo de autenticación y plan de fases.

Reglas de comportamiento:
- Lees TODO el archivo AGENTS.md antes de comenzar cualquier tarea.
- Ejecutas `npm run lint`, `npm run test:run` y `npm run build` al finalizar cada fase.
- Si algo no está especificado, preguntas antes de asumir.
- No generas código que no se te haya solicitado explícitamente.
- No añades comentarios al código ni dependencias innecesarias.
- Mantienes la barra de navegación (navbar) y el pie de página (footer)
  visibles en todas las páginas.
- Implementas el patrón loading → error → success en toda la UI
  (ver "Manejo de errores y estados" en Arquitectura).

# Movie App UI

Frontend React para el API documentado en `@contexts/movie-app-api.yaml`. Catálogo de películas con autenticación JWT, roles (admin/user), favoritos por usuario e integración con OMDB.

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
├── hooks/          # useAuth, useFetch, useForm
├── services/       # api.js, authService.js, movieService.js, adminService.js
├── context/        # AuthContext.jsx
├── pages/          # LoginPage, SignupPage, SearchPage, MoviePage, FavoritesPage, AdminPage
├── styles/         # _variables.scss, _mixins.scss
├── utils/          # constants.js, validators.js, storage.js
├── App.jsx
├── App.scss
├── main.jsx
├── index.scss
├── docs/           # Decisiones de desarrollo, guías de estilo
└── CHANGELOG.md
---
Los archivos de test (`*.test.js` o `*.test.jsx`) se ubican junto al archivo
que testean. Ejemplo:
```
services/
├── api.js
├── api.test.js         ← aquí
├── authService.js
└── authService.test.js ← aquí
```

---

## Compilación y comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Build para producción |
| `npm run lint` | ESLint check |
| `npm run preview` | Preview del build |
| `npm run test` | Tests en modo watch |
| `npm run test:run` | Tests ejecución única (CI) |

---

## Configuración del entorno

### Variables de entorno
Las variables de entorno públicas usan el prefijo `MOVIE_` y se definen en un archivo `.env` en la raíz del proyecto.

| Variable | Descripción | Valor por defecto (desarrollo) |
|---|---|---|
| `MOVIE_API_URL` | URL base del backend API | `http://localhost:3000` |

**Importante**: Para que Vite exponga variables con prefijo `MOVIE_`, el archivo `vite.config.js` debe incluir `envPrefix: 'MOVIE_'` en la configuración.

### Archivo `.env`
Crear en la raíz del proyecto:
```
MOVIE_API_URL=http://localhost:3000
```

### Acceso en código
Las variables de entorno se acceden mediante `import.meta.env`:
```js
const API_URL = import.meta.env.MOVIE_API_URL;
```

---

## Estilo y convenciones de código

### Lenguaje y formato
- JavaScript (ES6+ modules). NO TypeScript.
- Named exports SIEMPRE: `export const ComponentName = () => { ... }`. NUNCA usar `export default`.
- Punto y coma AL FINAL DE CADA SENTENCIA. Siempre.
- Comas finales en arrays, objetos, imports multilínea y parámetros de función.
- Componentes funcionales + hooks. NUNCA clases.
- Funciones flecha SIEMPRE. NUNCA usar `function`. Si por algún motivo de fuerza mayor fuese necesario, consultar con el usuario antes de proceder.

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
- **PROHIBIDO** inline styles (`style={{}}`) salvo excepción consultada y aprobada por el usuario
- Variables globales en `styles/_variables.scss`
- Mixins reutilizables en `styles/_mixins.scss`
- Metodología BEM o anidamiento moderado, sin mezclar ambos enfoques en un mismo archivo (máximo 3 niveles de profundidad)
- Diseño responsive con enfoque mobile-first

### Extensiones en imports
- Incluir SIEMPRE la extensión del archivo en imports: `.js`, `.jsx`, `.scss`.
  Vite puede resolverlas sin extensión, pero se exige explícitamente por consistencia.

### Otras reglas
- NO generar comentarios en el código
- NO usar `@ts-expect-error`, `@ts-ignore` (no hay TypeScript)
- NO dejar `console.log` en código de producción

### Dependencias
- **HTTP client**: Usar `fetch` nativo del navegador. NO instalar `axios` ni otras librerías HTTP.
- **Routing**: `react-router` (ya incluido en el stack).
- **Estilos**: `sass` para preprocesado CSS. NO instalar frameworks CSS (Bootstrap, Tailwind, etc.).
- **Estado global**: Solo `AuthContext` + hooks locales. NO instalar librerías de state management (Redux, Zustand, Jotai, etc.).
- **Package manager**: npm. NO usar pnpm, yarn, bun ni otros gestores. Todos los comandos de instalación deben ejecutarse con `npm install <paquete>`.
- **Utilidades**: NO instalar lodash, ramda u otras librerías de utilidades. Usar funciones nativas de JS.

### React Compiler

El proyecto utiliza el React Compiler (`babel-plugin-react-compiler`),
que optimiza automáticamente memoización y re-renderizados.
- NO usar `useMemo` ni `useCallback`.
- El compilador se encarga de esas optimizaciones de forma automática.

---


Extraído de `@contexts/movie-app-api.yaml`. Base URL desde `import.meta.env.MOVIE_API_URL`.

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

**Nota de búsqueda**: `msg` puede ser un array de películas (búsqueda local) o un string (búsqueda externa OMDB). Si es string, los resultados están en `peliculas`. La página debe manejar ambos formatos.

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
2. Token se almacena en `sessionStorage` con clave `auth_token` (se pierde al cerrar pestaña)
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
- `AuthContext` para estado global de autenticación
- Estado local (hooks) para búsquedas, formularios, listados

### Flujo de datos

La información viaja a través de 4 capas, cada una con responsabilidades estrictas:

```
API (backend)
  ↓ JSON
services/api.js        ← Capa de transporte HTTP: fetch, headers, token, 401
services/*Service.js   ← Capa de dominio: llama a api.request() con método/endpoint/body
  ↓ datos crudos
hooks/ (useFetch)      ← Capa de estado: hook genérico con { data, loading, error, execute }
  ↓ props + handlers
pages/ + components/   ← Capa de presentación: renderiza UI, llama a hooks, no llama a servicios
```

**Reglas del flujo**:
- Los componentes NUNCA llaman a servicios directamente. Siempre a través de hooks.
- Los hooks NUNCA importan componentes. Solo importan servicios y utilidades.
- Las páginas orquestan hooks y componentes. Cada página usa los hooks que necesite; si la misma lógica asíncrona se repite en dos o más componentes, se extrae a un hook compartido.
- Los componentes presentacionales reciben datos por props. No tienen efectos secundarios ni llamadas asíncronas.

### Manejo de errores y estados

Toda página o componente que consuma datos asíncronos DEBE implementar el patrón de 3 estados (loading, error, success) en este orden, siendo el caso sin datos un sub-estado de success:

```jsx
const MiComponente = () => {
  const { data, loading, error } = useMiHook();

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  if (!data || (Array.isArray(data) && data.length === 0))
    return <p>No se encontraron resultados</p>;

  return <Contenido data={data} />;
};
```

| Estado | Condición | Componente |
|---|---|---|
| `loading` | `loading === true` | `<Loading />` (skeleton) |
| `error` | `error !== null` | `<ErrorMessage message={error} />` |
| `success` | `data` válido | Renderizado del contenido |
| `success` (sin datos) | `!data` o array vacío | Mensaje contextual según dominio |

**Reglas**:
- Cada hook que haga llamadas asíncronas debe exponer `{ data, loading, error }`.
- Los mensajes de error deben ser amigables para el usuario, NO técnicos.
- El caso sin datos es un sub-estado de `success`: la API respondió bien pero no hay contenido. Mostrar mensaje contextual según dominio (búsqueda sin resultados, lista vacía de favoritos, etc.).
- Los botones de acciones (guardar, eliminar, favorito) deben mostrar estado de carga independiente mientras la operación está en curso.
- Los errores de validación de formularios se muestran por campo, no como mensaje global.
- `ErrorMessage` es el componente único para mostrar errores en toda la app. Todas las páginas y componentes lo usan para errores de API, validación y estados vacíos.

### Hook `useFetch`

Hook genérico para llamadas asíncronas. Expone `{ data, loading, error, execute }`.

- **`execute(serviceFn, ...args)`** — recibe una función del servicio (`movieService.search`, `movieService.getById`, etc.) y sus argumentos. Gestiona `loading` y `error` automáticamente.
- No ejecuta nada al montarse. Es la página quien decide cuándo llamar a `execute`.
- Cada instancia del hook es independiente. Una página puede tener varias: una para búsqueda, otra para favoritos, etc.

```jsx
const searchFetch = useFetch();
const favoritesFetch = useFetch();

const handleSearch = (title) => {
  searchFetch.execute(movieService.search, title);
};

useEffect(() => {
  favoritesFetch.execute(movieService.getFavorites);
}, []);
```

Los componentes presentacionales reciben datos por props desde la página que orquesta los hooks.

### ErrorBoundary

Envolver `src/App.jsx` con un componente ErrorBoundary (clase o librería) que capture
excepciones no controladas en cualquier componente hijo. Ante un error inesperado:
- Si el error tiene un mensaje legible, mostrarlo al usuario.
- Si no, mostrar un mensaje genérico: "Ha ocurrido un error inesperado".
- NO mostrar el error técnico ni el stack trace.

---

## Guía de pruebas

Se aplica TDD (Test-Driven Development): los tests se escriben antes que la
implementación. Ciclo: RED (test falla) → GREEN (implementar) → REFACTOR.

### Stack de testing
- **Framework**: Vitest (integrado con Vite)
- **Librería**: Testing Library (React) + jest-dom
- **E2E**: Playwright
- **Mocks**: fetch con `vi.fn()` (sin dependencias externas)

### Cobertura por capa
| Tipo | Capa | Qué testear | Herramienta |
|---|---|---|---|
| Unitario | services/ | Llamadas HTTP, parseo, errores | `vi.fn()` mockeando fetch |
| Unitario | utils/ | Validadores, storage, constantes | Vitest directo |
| Unitario | hooks/ | Estados loading/error/data, execute | `renderHook` |
| Integración | pages/ + components/ | Flujos completos (login → búsqueda → favorito) | `render` + `screen` + `userEvent` |
| E2E | Navegador | Registrar → login → buscar → favorito → admin CRUD | Playwright |

### Reglas de testing
- Cada test prueba **una sola cosa** (una aserción lógica por test).
- Probar **border cases**: arrays vacíos, null/undefined, errores HTTP, límites de caracteres, IDs inválidos.
- Los tests E2E se ubican en `e2e/` en la raíz del proyecto.

---

## Plan de desarrollo

El plan de implementación detallado se encuentra en `@contexts/PLAN_DE_DESARROLLO.md`.
Carga ese archivo cuando vayas a comenzar una fase. Las fases son:

| Fase | Descripción |
|---|---|
| **Fase 0** | Setup inicial: dependencias, `.env`, estructura, Vitest |
| **Fase 1** | Servicios API: `api.js`, `authService`, `movieService`, `adminService`, utils |
| **Fase 2** | Contexto de autenticación: `AuthContext`, `useAuth` |
| **Fase 3** | Layout y componentes base: Navbar, Footer, Loading, ErrorMessage, ProtectedRoute, estilos |
| **Fase 4** | Páginas de autenticación: Login, Signup, `useForm` |
| **Fase 5** | Páginas de usuario: SearchBar, MovieCard, MovieList, MovieDetail, FavoriteButton, FavoritesList, `useFetch` |
| **Fase 6** | Páginas de administración: AdminMovieTable, AdminMovieForm, AdminPage |
| **Fase 7** | Refinamiento final: redirects, feedback visual, responsive |

---

## Seguridad

- JWT almacenado en `sessionStorage` (se pierde al cerrar pestaña, mitigación XSS parcial)
- Token extraído en `api.js` y añadido automáticamente a cada request
- En 401 → logout automático + redirect a login
- NO hardcodear URLs ni secrets. Usar `MOVIE_API_URL` (`.env` file)
- Validar formularios en cliente antes de enviar al servidor
- No mostrar errores técnicos al usuario (solo mensajes amigables)

---

## Flujo de trabajo con Git

- Ejecutar `npm run lint` antes de cada commit
- Ejecutar `npm run build` para verificar que compila
- Ejecutar `npm run test:run` para verificar que los tests pasan
- Formato conventional commits: `tipo(ámbito): descripción`
  - `feat`: nueva funcionalidad o componente
  - `fix`: corrección de bug
  - `refactor`: cambio de código sin nueva funcionalidad ni fix
  - `style`: cambios de formato (sass, espacios, etc.)
  - `docs`: cambios en documentación
  - `test`: añadir o modificar tests
  - `chore`: cambios en build, dependencias, configuración
  - `perf`: mejora de rendimiento
  - Ejemplos: `feat: añadir servicio de autenticación`, `refactor: extraer useForm hook`, `fix: redirigir al login tras 401`
- Commits atómicos: uno por fase o por componente significativo
- NO hacer push a menos que se solicite explícitamente
- Versionado semántico (SemVer): `MAJOR.MINOR.PATCH`
  - MAJOR: cambios incompatibles en API o UI
  - MINOR: nuevas funcionalidades
  - PATCH: bug fixes y refactors
- Mantener `CHANGELOG.md` con registro de cambios por versión
