# Autozone QA Automation — Frontend

Tecnológico de Monterrey — Campus Chihuahua  
Desarrollo e Implantación de Sistemas de Software — TC3005B GPO500  
Semestre Febrero – Junio 2025

---

## Stack

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/) + [Testing Library](https://testing-library.com/)
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/)

---

## Requisitos previos

- Node.js v20 LTS
- npm v10+

Si usas `nvm`, puedes instalar la versión correcta con:

```bash
nvm install 20
nvm use 20
```

---

## Cómo correr el proyecto

```bash
# Instalar dependencias
npm install

# Correr en desarrollo
npm run dev

# Correr pruebas
npm test

# Correr linter
npm run lint

# Correr linter con autofix
npm run lint:fix

# Build de producción
npm run build
```

---

## Cómo contribuir

### 1. Asegúrate de estar en `main` y actualizado

```bash
git checkout main
git pull origin main
```

### 2. Crea tu rama con la nomenclatura de Jira

El nombre de la rama debe seguir el formato `AZ-#` donde `#` es el número de ticket:

```bash
git checkout -b AZ-123
```

### 3. Haz tus cambios

Trabaja en tu rama. Antes de hacer commit, verifica que tu código pase el linter y los tests:

```bash
npm run lint       # revisar errores de linter
npm run lint:fix   # corregir los automáticos
npm test           # correr pruebas
npm run build      # verificar que el build no truene
```

### 4. Sube tu rama y abre un Merge Request

```bash
git push origin AZ-123
```

Ve a GitHub, abre un Pull Request desde tu rama hacia `main` y solicita el review de al menos uno de los Git Guardians listados abajo.

---

## Acceptance criteria

Para que un PR pueda ser mergeado a `main` debe cumplir **todos** los siguientes criterios:

- [ ] Aprobación de al menos un Git Guardian (admin o miembro del team `reviewers`)
- [ ] El job de **Lint** pasa en el pipeline de CI (`npm run lint` sin errores)
- [ ] Todos los **tests** pasan (`npm test`)
- [ ] El **build** compila sin errores (`npm run build`)

Estos checks corren automáticamente en GitHub Actions al abrir o actualizar un PR. También puedes verificarlos localmente antes de hacer push.

---

## Git Guardians

Personas autorizadas para aprobar Pull Requests:

| Nombre | Matrícula | GitHub |
|---|---|---|
| Alonso Alarcón | A01563388 | — | @alxxjandro
| Alejandro Carrillo | A01567228 | @Carrillo-coder |
| Rocío Rodríguez | A01563530 | @RocioElysaRodriguez |
| Saúl Campos | A01567242 | @saulito-tec |
| Eliel Mejía | A01563697 | @elimeji |

---

## Configurar Format on Save en VS Code

### Extensiones requeridas

Instala las siguientes extensiones en VS Code:

- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

### Activar Prettier como formatter por defecto

1. Abre la paleta de comandos con `Ctrl + Shift + P` (o `Cmd + Shift + P` en Mac)
2. Escribe `Format Document With...` y selecciónalo
3. Elige **Prettier - Code formatter** como formatter por defecto
4. Abre la paleta de comandos con `Ctrl + Shift + P` (o `Cmd + Shift + P` en Mac)
5. Escribe `Developer: Reload Window` y selecciónalo

### Activar Format on Save en VS Code

1. Abre Settings con `Ctrl + ,` (o `Cmd + ,` en Mac)
2. Busca `Format on Save`
3. Activa la casilla **Editor: Format On Save**

### Verificar que funciona

Abre cualquier archivo `.tsx` o `.ts`, haz un cambio pequeño (por ejemplo, agrega un espacio extra) y guarda con `Ctrl + S` (o `Cmd + S` en Mac). Prettier debe formatear el archivo automáticamente al guardar.

### Verificar que Format on Save está activo en el proyecto

El repositorio incluye un archivo `.vscode/settings.json` con la configuración necesaria. Si no lo tienes, asegúrate de que tu `settings.json` tenga:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

Con esto, cada vez que guardes un archivo Prettier lo formatea automáticamente y ESLint aplica los fixes que pueda resolver solo.
