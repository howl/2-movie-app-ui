# Plan de desarrollo — Movie App UI

Las fases siguen TDD (RED → GREEN → REFACTOR) según lo definido en la
Guía de pruebas de `@AGENTS.md`. Cada fase debe completarse en orden.

---

## Fase 0 — Setup inicial
- `npm install react-router sass`
- `npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test`
- Configurar `package.json` con scripts:
  - `"test": "vitest"`
  - `"test:run": "vitest run"`
- Crear `.env.example` con `MOVIE_API_URL=` (solo el nombre, sin valor)
- Crear `.env` local a partir de `.env.example`: `cp .env.example .env` y rellenar valor
- Añadir `.env` a `.gitignore`
- Crear estructura de directorios `src/`
- Crear `src/tests/setup.js` con `import '@testing-library/jest-dom'`
- Crear `e2e/` con configuración de Playwright
- Crear `CHANGELOG.md` con formato Keep a Changelog
- Crear `docs/` con:
  - `docs/DECISIONS.md` — registro de decisiones de arquitectura
  - `docs/STYLE_GUIDE.md` — ejemplos adicionales de patrones de código
- Modificar `vite.config.js`:
  - Añadir `envPrefix: 'MOVIE_'`
  - Añadir configuración de test:
    ```js
    test: {
      setupFiles: ['./src/tests/setup.js'],
      environment: 'jsdom',
    }
    ```
- ✅ Verificar: `npm run dev` no da errores + `npm run test:run` ejecuta correctamente

> **Nota**: Si en fases posteriores se añaden nuevas variables de entorno, actualizar también `.env.example` con el nombre de la nueva variable.

---

## Fase 1 — Servicios API
1. Escribir tests (RED)
   - Tests para api.js, authService.js, movieService.js, adminService.js,
     storage.js, constants.js, validators.js
2. Implementar archivos (GREEN)
    - `src/services/api.js` — Cliente HTTP base con fetch.
      Función `request(endpoint, options)` que:
      - Lee token de sessionStorage y añade header `Authorization: Bearer <token>`
      - Parsea el response JSON
      - Si el response es 401 → limpia token de sessionStorage + lanza error
      - Si `body.ok === false` → lanza error con `body.msg`
      - Extrae el nuevo token del body (`body.token`) y lo guarda en sessionStorage
      - Devuelve el body parseado (solo llega aquí si `ok: true`)
    - `src/services/authService.js` — `login(email, password)`, `signup(name, email, password)`
    - `src/services/movieService.js` — `search(title)`, `getById(id)`, `getFavorites()`, `addFavorite(movieId)`, `removeFavorite(id)`
    - `src/services/adminService.js` — `getAll()`, `create(formData)`, `update(id, formData)`, `remove(id)`
    - `src/utils/storage.js` — `getToken()`, `setToken(token)`, `removeToken()` (clave `auth_token`)
    - `src/utils/constants.js` — `API_URL` desde `import.meta.env.MOVIE_API_URL`
    - `src/utils/validators.js` — `isValidEmail()`, `isValidPassword()`, `isRequired()`
3. Refactorizar
- ✅ Verificar: `npm run lint` + `npm run test:run`

---

## Fase 2 — Contexto de autenticación
1. Escribir tests (RED)
   - Tests para AuthContext.jsx, useAuth.js
2. Implementar archivos (GREEN)
    - `src/context/AuthContext.jsx` — `AuthProvider` + `AuthContext`
      - Estado: `user`, `token`, `loading` (inicializa leyendo token de sessionStorage)
      - `login(user, token)` → setea estado + sessionStorage
      - `logout()` → limpia estado + sessionStorage
    - `src/hooks/useAuth.js` — wrapper de `useContext(AuthContext)` con error si se usa fuera del provider
    - Modificar `src/main.jsx`:
      - Envolver `<App />` con `<AuthProvider>`
      - Envolver con `<BrowserRouter>` de react-router
3. Refactorizar
- ✅ Verificar: `npm run lint` + `npm run build` + `npm run test:run`

---

## Fase 3 — Layout y componentes base
1. Escribir tests (RED)
   - Tests para Navbar.jsx, Footer.jsx, ProtectedRoute.jsx, Loading.jsx, ErrorMessage.jsx
2. Implementar archivos (GREEN)
    - `src/components/common/Navbar.jsx` + `Navbar.scss`:
      - Logo / nombre de la app
      - Enlaces: Home, Favorites (solo autenticado), Admin (solo admin)
      - Nombre de usuario + botón Cerrar sesión (si autenticado) / Login + Signup (si no)
    - `src/components/common/Footer.jsx` + `Footer.scss`
    - `src/components/common/ProtectedRoute.jsx`:
      - Si `loading` → `<Loading />`
      - Si no autenticado → guarda la ruta intentada y redirige a `<Navigate to="/login" />`
      - Si `requiredRole` y no coincide → `<Navigate to="/" />`
      - Si ok → `<Outlet />`
    - `src/components/common/Loading.jsx` + `Loading.scss` — componente skeleton
    - `src/components/common/ErrorMessage.jsx` + `ErrorMessage.scss`
      — Componente universal de error. Acepta `message` (string) y opcionalmente
      `type` (error, warning, info). Se usa en todas las páginas.
    - `src/styles/_variables.scss` — colores, fuentes, breakpoints mobile-first
      (ver `@contexts/ADWAITA_UI.md` para valores exactos de paleta,
      tipografía y radios)
    - `src/styles/_mixins.scss` — `respond-to($breakpoint)`, `dark-mode`,
      `flex-center`, etc.
    - `src/index.scss` — reset, imports de variables y mixins, estilos base
    - `src/App.scss` — layout general (min-height 100vh, sticky footer)
    - Modificar `src/App.jsx`:
      - `<Navbar />` + `<Routes>` (importadas de las páginas que se crearán en fases siguientes) + `<Footer />`
3. Refactorizar
- ✅ Verificar: `npm run lint` + `npm run build` + `npm run test:run`

---

## Fase 4 — Páginas de autenticación
1. Escribir tests (RED)
   - Tests para useForm.js, LoginForm.jsx, SignupForm.jsx, LoginPage.jsx, SignupPage.jsx
2. Implementar archivos (GREEN)
    - `src/hooks/useForm.js` — hook genérico para formularios: maneja `values`, `errors`, `handleChange`, `handleSubmit`, `setErrors`. La validación se ejecuta on blur y on submit.
    - `src/components/auth/LoginForm.jsx` + `LoginForm.scss`:
      - Campos: email, password
      - Botón submit: "Iniciar sesión"
      - Link a Signup
    - `src/components/auth/SignupForm.jsx` + `SignupForm.scss`:
      - Campos: name, email, password
      - Botón submit: "Crear cuenta"
      - Link a Login
    - `src/pages/LoginPage.jsx` + `LoginPage.scss` — tras login exitoso, redirige a la ruta que el usuario intentaba visitar; si no hay ruta previa, redirige a `/`
    - `src/pages/SignupPage.jsx` + `SignupPage.scss`
    - Conectar con `authService` y `useAuth`
3. Refactorizar
- ✅ Verificar: `npm run lint` + `npm run build` + `npm run test:run`

---

## Fase 5 — Páginas de usuario
1. Escribir tests (RED)
   - Tests para SearchBar.jsx, MovieCard.jsx, MovieList.jsx, MovieDetail.jsx,
     FavoriteButton.jsx, FavoritesList.jsx, useFetch.js,
     SearchPage.jsx, MoviePage.jsx, FavoritesPage.jsx
   - Tests de integración: flujo búsqueda → detalle → favorito
   - Tests E2E: buscar película, ver detalle, añadir/eliminar favorito
2. Implementar archivos (GREEN)
    - `src/components/movies/SearchBar.jsx` + `SearchBar.scss`:
      - Input + botón de búsqueda
      - Debounce de 300ms
    - `src/components/movies/MovieCard.jsx` + `MovieCard.scss`:
      - Poster, título, año, director, géneros
      - Si no hay poster, mostrar recuadro con texto "Sin póster" estilizado
      - Botón de favorito (corazón)
    - `src/components/movies/MovieList.jsx` + `MovieList.scss`:
      - Grid responsivo de MovieCards
      - Key de cada MovieCard: `movie._id`
      - Mensaje "No se encontraron películas" si empty
    - `src/components/movies/MovieDetail.jsx` + `MovieDetail.scss`:
      - Vista detallada de una película (todos los campos del modelo Movie)
      - Si no hay poster, mostrar recuadro con texto "Sin póster" estilizado
    - `src/components/favorites/FavoriteButton.jsx` + `FavoriteButton.scss`:
      - Corazón relleno/vacío según estado
      - Llama a `addFavorite` / `removeFavorite`
      - Espera la respuesta de la API antes de cambiar el estado visual (sin optimistic update)
    - `src/components/favorites/FavoritesList.jsx` + `FavoritesList.scss`:
      - Lista de MovieCards filtrados por favoritos
      - Key de cada MovieCard: `movie._id`
    - `src/hooks/useFetch.js` — hook genérico `{ data, loading, error, execute }`
    - `src/pages/SearchPage.jsx` + `SearchPage.scss`
    - `src/pages/MoviePage.jsx` + `MoviePage.scss`
    - `src/pages/FavoritesPage.jsx` + `FavoritesPage.scss`
3. Refactorizar
- ✅ Verificar: `npm run lint` + `npm run build` + `npm run test:run`

---

## Fase 6 — Páginas de administración
1. Escribir tests (RED)
   - Tests para AdminMovieTable.jsx, AdminMovieForm.jsx, AdminPage.jsx
   - Tests de integración: crear película → listar → editar → eliminar
   - Tests E2E: CRUD completo de película como administrador
2. Implementar archivos (GREEN)
    - `src/components/admin/AdminMovieTable.jsx` + `AdminMovieTable.scss`:
      - Tabla con todas las películas y columnas: título, año, director, duración, acciones (editar, eliminar)
      - Confirmación antes de eliminar (modal o confirm nativo)
    - `src/components/admin/AdminMovieForm.jsx` + `AdminMovieForm.scss`:
      - Formulario completo de película (todos los campos del modelo Movie)
      - Manejo de `multipart/form-data` para subida de imagen
      - Modo crear / modo editar
      - Tras guardar, mostrar mensaje de éxito y permanecer en la misma vista
    - `src/pages/AdminPage.jsx` + `AdminPage.scss`:
      - Alterna entre tabla y formulario (crear/editar)
    - Conectar con `adminService`
3. Refactorizar
- ✅ Verificar: `npm run lint` + `npm run build` + `npm run test:run`

---

## Fase 7 — Refinamiento final
- Redirects en casos edge (token expirado, 401 global)
- Feedback visual en acciones (estado de carga en botones, mensajes de éxito/error temporales)
- ✅ Verificar: `npm run lint` + `npm run build` + `npm run test:run`
