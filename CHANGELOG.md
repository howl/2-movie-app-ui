# Changelog

Todas las versiones notables de Movie App UI se documentan en este archivo.

Formato basado en [Keep a Changelog](https://keepachangelog.com/),
y versionado con [SemVer](https://semver.org/).

## [0.5.0] — 2026-07-01

### Añadido
- Páginas de usuario: SearchBar, MovieCard, MovieList, MovieDetail,
  FavoriteButton, FavoritesList
- Hook `useFetch` para llamadas asíncronas genéricas
- Páginas: SearchPage, MoviePage, FavoritesPage
- Tests unitarios y de integración para todos los componentes (208 tests)

## [0.4.0] — 2026-07-01

### Añadido
- Hook `useForm` con validación on blur y on submit
- Páginas de autenticación: LoginPage, SignupPage
- Componentes de formulario: LoginForm, SignupForm
- Integración con authService y AuthContext
- Tests unitarios para formularios y páginas (178 tests)

## [0.3.0] — 2026-07-01

### Añadido
- Componentes base: Navbar, Footer, Loading, ErrorMessage, ProtectedRoute
- Estilos globales: `_variables.scss`, `_mixins.scss` con sistema Adwaita
- Layout sticky footer y estilos base en App.scss e index.scss
- 154 tests para componentes base

## [0.2.0] — 2026-07-01

### Añadido
- Contexto de autenticación: AuthContext, AuthProvider
- Hook `useAuth` para consumir el contexto
- Integración de AuthProvider y BrowserRouter en main.jsx
- 140 tests para contexto y hook

## [0.1.0] — 2026-07-01

### Añadido
- Servicios API: api.js, authService.js, movieService.js, adminService.js
- Utilidades: storage.js, constants.js, validators.js
- 126 tests unitarios con cobertura exhaustiva de border cases

## [0.0.0] — 2026-07-01

### Añadido
- Setup inicial del proyecto con Vite + React 19.
- Estructura de directorios y configuracion de herramientas.
