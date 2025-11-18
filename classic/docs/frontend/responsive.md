# Diseño Responsive

## Breakpoints

```css
/* Mobile */
@media (max-width: 767px) { }

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Large Desktop */
@media (min-width: 1440px) { }
```

## Estrategia Mobile-First

El diseño se construye primero para mobile y se expande para pantallas más grandes.

### Ejemplo de Implementación

```css
/* Base: Mobile */
.container {
  padding: 1rem;
  width: 100%;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
    max-width: 720px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 960px;
  }
}
```

## Componentes Adaptativos

### Header/Navigation
- **Mobile**: Menú hamburguesa con sidebar
- **Tablet**: Menú colapsado con iconos
- **Desktop**: Menú completo horizontal

### Grid de Instancias
- **Mobile**: 1 columna
- **Tablet**: 2 columnas
- **Desktop**: 3-4 columnas

### Formularios
- **Mobile**: Inputs full-width, labels encima
- **Desktop**: Labels a la izquierda, múltiples columnas

### Tablas
- **Mobile**: Cards colapsables o scroll horizontal
- **Desktop**: Tabla tradicional

## Técnicas Utilizadas

### Flexbox
```css
.flex-container {
  display: flex;
  flex-direction: column; /* Mobile */
}

@media (min-width: 768px) {
  .flex-container {
    flex-direction: row; /* Desktop */
  }
}
```

### CSS Grid
```css
.grid-container {
  display: grid;
  grid-template-columns: 1fr; /* Mobile */
  gap: 1rem;
}

@media (min-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr); /* Tablet */
  }
}

@media (min-width: 1024px) {
  .grid-container {
    grid-template-columns: repeat(3, 1fr); /* Desktop */
  }
}
```

### Viewport Units
```css
.hero {
  height: 100vh;
  min-height: 400px; /* Fallback para pantallas pequeñas */
}
```

## Imágenes Responsive

```jsx
<img 
  src={image} 
  alt="Description"
  style={{ maxWidth: '100%', height: 'auto' }}
/>
```

## Tipografía Adaptativa

```css
body {
  font-size: 14px; /* Mobile */
}

@media (min-width: 768px) {
  body {
    font-size: 16px; /* Desktop */
  }
}
```

## Testing Responsive

Probar en:
- Chrome DevTools (responsive mode)
- Dispositivos físicos reales
- Diferentes navegadores (Chrome, Firefox, Safari)