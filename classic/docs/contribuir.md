# Guía de Contribución

## Flujo de Trabajo

### 1. Fork y Clone

```bash
# Fork en GitHub, luego:
git clone https://github.com/YOUR_USERNAME/Week3-CrudCloud-Frontend.git
git clone https://github.com/YOUR_USERNAME/Week3-CrudCloud-Backend.git
```

### 2. Crear Rama de Feature

```bash
git checkout -b feature/nueva-funcionalidad
```

Convención de nombres:
- `feature/`: Nuevas funcionalidades
- `fix/`: Corrección de bugs
- `docs/`: Actualizaciones de documentación
- `refactor/`: Refactorización de código

### 3. Desarrollar

Asegurarse de:
- Seguir las convenciones de código del proyecto
- Escribir código limpio y comentado
- Agregar tests cuando sea posible

### 4. Commit

Mensajes de commit descriptivos:

```bash
git add .
git commit -m "feat: agregar filtro por estado en instancias"
```

Convención de commits:
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Documentación
- `style:` Formato, sin cambios de código
- `refactor:` Refactorización
- `test:` Agregar tests
- `chore:` Tareas de mantenimiento

### 5. Push y Pull Request

```bash
git push origin feature/nueva-funcionalidad
```

Abrir Pull Request en GitHub con:
- Título descriptivo
- Descripción detallada de cambios
- Referencias a issues relacionados
- Screenshots si aplica

## Estándares de Código

### Frontend (React)

- Usar componentes funcionales con hooks
- PropTypes o TypeScript para props
- Nombres de componentes en PascalCase
- Nombres de funciones en camelCase
- Evitar inline styles, usar CSS modules
- Mantener componentes pequeños y reutilizables

### Backend (Spring Boot)

- Seguir convenciones de Java
- Nombres de clases en PascalCase
- Nombres de métodos en camelCase
- DTOs para transferencia de datos
- Manejo de excepciones apropiado
- Documentar endpoints con comentarios

## Testing

### Frontend

```bash
npm test
npm run test:coverage
```

### Backend

```bash
mvn test
mvn verify
```

## Revisión de Código

Pull Requests serán revisados considerando:
- Funcionalidad correcta
- Adherencia a estándares
- Código limpio y legible
- Tests incluidos
- Documentación actualizada

## Issues

Al reportar un bug:
- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots si aplica
- Versiones de software

Al sugerir feature:
- Descripción detallada
- Caso de uso
- Posible implementación

## Preguntas

Para dudas o discusiones, usar GitHub Discussions o contactar al equipo.

## Código de Conducta

- Respetar a todos los colaboradores
- Críticas constructivas
- Enfoque en el código, no en las personas
- Mantener un ambiente inclusivo