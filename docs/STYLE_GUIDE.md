# Guia de estilo — Movie App UI

## Principios

- 1 componente = 1 archivo `.jsx` + 1 archivo `.scss` (juntos en el mismo
  directorio).
- Named exports siempre. Nunca `export default`.
- Funciones flecha siempre. Nunca `function`.
- Punto y coma al final de cada sentencia. Comas finales en arrays, objetos y
  multilinea.
- Nombres de variables, funciones, parametros y archivos en ingles.
- Comentarios en el codigo solo si son estrictamente necesarios, y en ingles.

## Convenciones de codigo

Ver seccion "Estilo y convenciones de codigo" en `AGENTS.md`.

## Testing

- Tests escritos antes que la implementacion (TDD).
- Un test = una asercion logica.
- Probar border cases de forma exhaustiva.
- Tests unitarios para servicios, hooks y utils.
- Tests de integracion para paginas y componentes.
- Tests E2E con Playwright para flujos completos.

## Commits

- Formato conventional commits en ingles.
- Commits atomicos: uno por fase o por cambio significativo.
