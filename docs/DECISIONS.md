# Decisiones de desarrollo

Este archivo registra las decisiones de arquitectura y diseño tomadas durante
el desarrollo del proyecto Movie App UI.

## 2026-07-01 — Setup inicial

- **React 19 + Vite 8**: SPA moderna con React Compiler.
- **JavaScript (ES6+)**: Sin TypeScript para mantener la base simple.
- **`react-router`**: Enrutamiento declarativo (no react-router-dom, que está
  obsoleto en favor del paquete unificado).
- **Sass**: Estilos con preprocesador. Sin Tailwind ni Bootstrap.
- **Adwaita UI**: Sistema de diseño basado en GNOME Adwaita (ver
  `contexts/ADWAITA_UI.md`).
- **Vitest + Testing Library**: Testing unitario, de integración y E2E
  (Playwright).
- **sessionStorage**: Almacenamiento del JWT (se pierde al cerrar pestana).
- **TDD**: Los tests se escriben antes que la implementacion.
