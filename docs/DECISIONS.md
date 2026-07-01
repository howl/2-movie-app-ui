# Decisiones de desarrollo

Este archivo registra las decisiones de arquitectura y diseno tomadas durante
el desarrollo del proyecto Movie App UI.

## 2026-07-01 — Fase 0: Setup inicial

- **React 19 + Vite 8**: SPA moderna con React Compiler.
- **JavaScript (ES6+)**: Sin TypeScript para mantener la base simple.
- **`react-router`**: Enrutamiento declarativo (no react-router-dom, que esta
  obsoleto en favor del paquete unificado).
- **Sass**: Estilos con preprocesador. Sin Tailwind ni Bootstrap.
- **Adwaita UI**: Sistema de diseno basado en GNOME Adwaita (ver
  `contexts/ADWAITA_UI.md`).
- **Vitest + Testing Library**: Testing unitario, de integracion y E2E
  (Playwright).
- **sessionStorage**: Almacenamiento del JWT (se pierde al cerrar pestana).
- **TDD**: Los tests se escriben antes que la implementacion.

## 2026-07-01 — Fase 1: Servicios API

- **`api.js` como modulo plano**: La capa HTTP no es un hook React porque no
  necesita estado. Solo gestiona fetch, headers, token y errores.
- **`useFetch` separado de `api.js`**: El hook solo anade estado
  (loading/data/error) alrededor de la llamada al servicio.
- **Servicios como modulos independientes**: Cada servicio (auth, movie, admin)
  solo define rutas y metodos, delega el transporte a `api.js`.
- **`api.request` lanza error si `body.ok === false`**: Simplifica el manejo
  de errores en los hooks (solo capturan excepciones).
- **Clave `auth_token` en sessionStorage**: Unica clave para evitar colisiones.

## 2026-07-01 — Fase 2: Contexto de autenticacion

- **AuthContext como contexto global**: Necesario para que cualquier componente
  acceda al usuario/token sin prop drilling.
- **AuthProvider con lazy initialization**: `useState(() => getToken())` lee el
  token de sessionStorage en el primer render, sin necesidad de useEffect.
- **Separacion de AuthContext y AuthProvider**: Se evita el error de Fast Refresh
  de ESLint (solo exportar componentes JSX).
- **Inicializacion sincrona del token**: sessionStorage es sincrono, no requiere
  loading state.

## 2026-07-01 — Fase 3: Layout y componentes base

- **Sticky footer con flexbox**: `#root` como contenedor flex con
  `min-height: 100vh`, el main ocupa el espacio restante con `flex: 1`.
- **Skeleton como componente de carga**: Se eligio skeleton sobre spinner por
  consistencia con Adwaita.
- **ErrorMessage como componente unico**: Acepta `type` (error, warning, info)
  para variantes visuales.
- **ProtectedRoute con `state.from`**: Guarda la ruta intentada para redirigir
  tras login exitoso.

## 2026-07-01 — Fase 4: Paginas de autenticacion

- **useForm con validacion por blur y submit**: La doble validacion mejora la
  experiencia de usuario (feedback inmediato al salir del campo, mas validacion
  completa al enviar).
- **LoginPage redirige a ruta intentada**: Usa `location.state.from` para
  mantener la navegacion fluida.
- **Errores de API mostrados via ErrorMessage**: Errores del servidor se
  renderizan con el componente universal.

## 2026-07-01 — Fase 5: Paginas de usuario

- **useFetch como hook generico**: Cada pagina crea sus propias instancias
  (searchFetch, favoritesFetch, movieFetch). No se uso contexto de favoritos
  porque el prop drilling es minimo (2 niveles).
- **SearchPage maneja dos formatos de respuesta**: La API puede devolver
  resultados locales (`msg` como array) o externos (`peliculas` como array).
- **FavoriteButton sin optimistic update**: Espera la respuesta de la API antes
  de cambiar el estado visual. Esto evita estados inconsistentes.
- **Key de listas con `movie._id`**: Se usa el ObjectId de MongoDB en lugar
  del indice para evitar problemas de re-renderizado.
