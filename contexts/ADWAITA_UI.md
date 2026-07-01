# Adwaita UI — Sistema de diseño

Referencia visual para la interfaz Movie App UI, basada en el lenguaje de diseño
Adwaita de GNOME (GTK4 / libadwaita, GNOME 48+). Este archivo define colores,
tipografía, espaciado y componentes para que la implementación en Sass sea
consistente con el estilo de las aplicaciones GNOME nativas.

---

## 1. Tipografía

| Rol | Familia | Tamaño base |
|---|---|---|
| UI (sans) | `'Adwaita Sans', 'Inter', system-ui, sans-serif` | 11px |
| Mono (código) | `'Adwaita Mono', 'Iosevka', 'Source Code Pro', monospace` | 11px |
| Documento (texto largo) | `'Adwaita Sans', 'Inter', 'Noto Serif', serif` | 12pt |

### Jerarquía tipográfica

| Clase | Tamaño | Peso | Uso |
|---|---|---|---|
| `.title-1` | 24px | Bold | Pantallas principales, encabezados grandes |
| `.title-2` | 20px | Bold | Títulos de sección |
| `.title-3` | 16px | Bold | Títulos de tarjeta |
| `.title-4` | 14px | Bold | Subtítulos |
| `.heading` | 11px | Bold | Etiquetas de lista, encabezados de formulario |
| `.body` | 11px | Regular | Texto de UI, descripciones |
| `.caption` | 9px | Regular | Texto auxiliar, metadatos |
| `.monospace` | 11px | Regular | Código, logs, IDs |

---

## 2. Paleta de colores

### Colores de acento

| Variable | Valor | Uso |
|---|---|---|
| `--accent-blue` | `#3584e4` | Acento por defecto |
| `--accent-teal` | `#2190a4` | Acento alternativo |
| `--accent-green` | `#3a944a` | Éxito / confirmación |
| `--accent-yellow` | `#c88800` | Advertencia |
| `--accent-orange` | `#ed5b00` | Advertencia fuerte |
| `--accent-red` | `#e62d42` | Destructivo / error |
| `--accent-pink` | `#d56199` | Acento alternativo |
| `--accent-purple` | `#9141ac` | Acento alternativo |
| `--accent-slate` | `#6f8396` | Acento alternativo |

### Colores funcionales (modo claro)

| Variable | Valor | Uso |
|---|---|---|
| `--window-bg-color` | `#fafaf9` | Fondo de ventana/página |
| `--window-fg-color` | `#2e3436` | Texto principal |
| `--view-bg-color` | `#ffffff` | Fondo de tarjeta/lista |
| `--view-fg-color` | `#2e3436` | Texto sobre view |
| `--headerbar-bg-color` | `#ebebea` | Fondo de barra superior |
| `--headerbar-fg-color` | `#2e3436` | Texto en headerbar |
| `--card-bg-color` | `#ffffff` | Fondo de tarjeta |
| `--card-fg-color` | `#2e3436` | Texto en tarjeta |
| `--border-color` | `color-mix(in srgb, #2e3436 15%, transparent)` | Bordes y separadores |
| `--shade-color` | `color-mix(in srgb, #2e3436 7%, transparent)` | Sombras sutiles |
| `--dim-opacity` | `55%` | Opacidad de elementos atenuados |
| `--disabled-opacity` | `50%` | Opacidad de elementos deshabilitados |

### Colores funcionales (modo oscuro)

| Variable | Valor |
|---|---|
| `--window-bg-color` | `#1e1e1e` |
| `--window-fg-color` | `#f6f5f4` |
| `--view-bg-color` | `#2a2a2a` |
| `--view-fg-color` | `#f6f5f4` |
| `--headerbar-bg-color` | `#242424` |
| `--headerbar-fg-color` | `#f6f5f4` |
| `--card-bg-color` | `#333333` |
| `--card-fg-color` | `#f6f5f4` |

### Paleta completa GNOME

| Familia | 1 (claro) | 2 | 3 | 4 | 5 (oscuro) |
|---|---|---|---|---|---|
| Blue | `#99c1f1` | `#62a0ea` | `#3584e4` | `#1c71d8` | `#1a5fb4` |
| Green | `#8ff0a4` | `#57e389` | `#33d17a` | `#2ec27e` | `#26a269` |
| Yellow | `#f9f06b` | `#f8e45c` | `#f6d32d` | `#f5c211` | `#e5a50a` |
| Orange | `#ffbe6f` | `#ffa348` | `#ff7800` | `#e66100` | `#c64600` |
| Red | `#f66151` | `#ed333b` | `#e01b24` | `#c01c28` | `#a51d2d` |
| Purple | `#dc8add` | `#c061cb` | `#9141ac` | `#813d9c` | `#613583` |
| Brown | `#cdab8f` | `#b5835a` | `#986a44` | `#865e3c` | `#63452c` |
| Light | `#ffffff` | `#f6f5f4` | `#deddda` | `#c0bfbc` | `#9a9996` |
| Dark | `#77767b` | `#5e5c64` | `#3d3846` | `#241f31` | `#000000` |

---

## 3. Radios y espaciado

| Elemento | Radio |
|---|---|
| Ventana/página | 9px |
| Botón | 6px |
| Tarjeta (Card) | 9px |
| Input | 6px |
| Badge | 4px |
| Pill (botón redondeado) | 9999px |

| Concepto | Valor |
|---|---|
| Espaciado base entre widgets | 6px |
| Padding interior de tarjeta | 12px |
| Gap entre tarjetas en grid | 12px |
| Padding de página | 24px |

---

## 4. Componentes visuales

### Botones

| Tipo | Apariencia | Uso |
|---|---|---|
| `default` | Fondo `--window-bg-color`, borde `--border-color` | Acción estándar |
| `suggested-action` | Fondo `--accent-bg-color`, texto `--accent-fg-color` | Acción principal/afirmativa |
| `destructive-action` | Fondo `--destructive-bg-color`, texto `--destructive-fg-color` | Eliminar, destruir |
| `flat` | Sin fondo ni borde, hover con `--shade-color` | Acción secundaria |
| `pill` | Mismo que default pero con `border-radius: 9999px` | Acción compacta |

### Tarjetas (Cards)

```
┌─────────────────────────┐
│  ┌──────┐               │
│  │ poster │  Título      │  ← Card (fondo --card-bg-color)
│  │        │  Año · Dir   │     radio 9px, sombra sutil
│  └──────┘  ★             │     padding 12px
│            Favorito      │
└─────────────────────────┘
```

### Barra de navegación (Headerbar)

- Fondo: `--headerbar-bg-color`
- Texto: `--headerbar-fg-color`
- Altura: 48px
- Elementos alineados verticalmente, separación 6px

### Formularios

- Input: borde `--border-color`, radio 6px, padding 6px 8px
- Label: estilo `.heading` (11px bold)
- Error: texto en `--accent-red`, borde rojo en input
- Focus: anillo `--accent-bg-color` (outline 2px)

---

## 5. Modo oscuro

Aplicar mediante media query:

```scss
@media (prefers-color-scheme: dark) {
  :root {
    --window-bg-color: #1e1e1e;
    --window-fg-color: #f6f5f4;
    --view-bg-color: #2a2a2a;
    // ... resto de variables oscuras
  }
}
```

La IA debe implementar ambas variantes (claro y oscuro) en `_variables.scss`,
usando las variables funcionales en todos los componentes. No hardcodees colores.

---

## 6. Mapeo a variables Sass

En `src/styles/_variables.scss` se definirán:

```scss
// Tipografía
$font-family-sans: 'Adwaita Sans', 'Inter', system-ui, sans-serif;
$font-family-mono: 'Adwaita Mono', 'Iosevka', 'Source Code Pro', monospace;
$font-size-base: 11px;

// Colores funcionales (modo claro)
$window-bg-color: #fafaf9;
$window-fg-color: #2e3436;
$view-bg-color: #ffffff;
$accent-color: #3584e4;
$border-color: rgba(#2e3436, 0.15);

// Breakpoints mobile-first
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;
```

En `src/styles/_mixins.scss`:

```scss
@mixin respond-to($breakpoint) { ... }
@mixin dark-mode {
  @media (prefers-color-scheme: dark) { @content; }
}
```
