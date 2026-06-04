<!-- Language Selector -->
<div style="align: right;">
  <input type="radio" name="lang" id="lang-es" checked hidden>
  <input type="radio" name="lang" id="lang-en" hidden>
  <label for="lang-es" style="cursor:pointer; margin-right:10px;">🇪🇸 Español</label>
  <label for="lang-en" style="cursor:pointer;">🇬🇧 English</label>
</div>

<!-- ESPAÑOL -->
<div class="lang-es">

# 📚 Sistema de Gestión Académica – Frontend

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5-443E38)](https://zustand-demo.pmnd.rs/)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter)](https://reactrouter.com/)

**Aplicación web para la gestión de propuestas de carga académica**, donde estudiantes crean solicitudes mediante un wizard interactivo y tutores revisan, priorizan y aprueban cargas en un dashboard optimizado.

---

## 🚀 Estado actual del proyecto

**Fase 1 completada** ✅ – Configuración base del entorno frontend.

### ✔️ ¿Qué incluye esta fase?

- Proyecto inicializado con **Vite + React + TypeScript**.
- Estructura de carpetas profesional y escalable (modular por `features`).
- Dependencias principales instaladas y configuradas:
  - **Zustand** – Estado global.
  - **Zod** – Validación de datos.
  - **TanStack Table** – Tablas avanzadas para el dashboard.
  - **DnD Kit** – Drag & drop para selección de materias.
  - **TailwindCSS** – Estilos utilitarios.
  - **React Router v7** – Enrutamiento.
- Layout base reutilizable (`MainLayout`, `PageContainer`).
- Sistema de rutas funcional (`/`, `/dashboard`, `404`).
- Alias de imports `@/` configurado en Vite y TypeScript.

---

## 📁 Estructura del proyecto

```bash
src/
├── assets/               # Recursos estáticos
├── components/           # Componentes reutilizables
│   ├── ui/               # Botones, inputs, cards
│   └── layout/           # Header, sidebar, contenedores
├── features/             # Módulos por dominio (wizard, dashboard)
├── lib/                  # Utilidades, constantes, configuración
├── stores/               # Estado global (Zustand)
├── types/                # Tipos globales de TypeScript
├── pages/                # Páginas enrutables
├── routes/               # Configuración de React Router
├── styles/               # Estilos globales (Tailwind)
├── App.tsx
└── main.tsx
```

---

## 🛠️ Instalación y uso

### 1. Clonar el repositorio

```bash
git clone https://github.com/carmoralesc/Tuto.git
cd tuto-app
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Iniciar servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: http://localhost:5173

---

### 4. Construir para producción

```bash
npm run build
```

### 5. Vista previa de la build

```bash
npm run preview
```

---

## 🧭 Rutas disponibles (actual)

| Ruta       | Descripción                         |
| ---------- | ----------------------------------- |
| /          | Wizard del estudiante (placeholder) |
| /dashboard | Panel del tutor (placeholder)       |
| /\*        | Página 404                          |

---

## 🔧 Scripts disponibles

| Comando         | Acción                         |
| --------------- | ------------------------------ |
| npm run dev     | Servidor de desarrollo con HMR |
| npm run build   | Build de producción en `dist/` |
| npm run lint    | Ejecuta ESLint                 |
| npm run preview | Sirve la build de producción   |

---

## 📌 Decisiones técnicas destacadas

- **Zustand para estado global:** más simple y ligero que Redux.
- **TailwindCSS para estilos:** desarrollo rápido y consistente.
- **Estructura por features:** escalabilidad y separación clara.
- **Alias @/:** imports limpios (`@/components/...`).

---

## 📖 Próximos pasos (Fase 2)

- Definición de tipos globales (`Subject`, `Student`, `AcademicLoad`).
- Implementación de lógica de negocio:
  - Validación de prerrequisitos.
  - Cálculo de créditos y riesgo académico.
  - Detección de violaciones.
- Creación de mocks de datos.
- Desarrollo del wizard del estudiante.

---

## 🤝 Contribución

Este proyecto sigue una arquitectura definida. Se recomienda abrir un issue antes de enviar un Pull Request.

---

## 📄 Licencia

Uso privado con fines académicos.

</div>

<!-- ENGLISH -->
<div class="lang-en" style="display:none;">

# 📚 Academic Management System – Frontend

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5-443E38)](https://zustand-demo.pmnd.rs/)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter)](https://reactrouter.com/)

Web application for academic workload proposal management.

---

## 🚀 Current Project Status

**Phase 1 completed** ✅

---

## 📁 Project Structure

```bash
src/
├── assets/
├── components/
│   ├── ui/
│   └── layout/
├── features/
├── lib/
├── stores/
├── types/
├── pages/
├── routes/
├── styles/
├── App.tsx
└── main.tsx
```

---

## 🛠️ Installation & Usage

```bash
git clone https://github.com/carmoralesc/Tuto.git
cd tuto-app
npm install
npm run dev
```

---

## 📄 License

Private academic use.

</div>

<script>
(function() {
  const radioEs = document.getElementById('lang-es');
  const radioEn = document.getElementById('lang-en');
  const divEs = document.querySelector('.lang-es');
  const divEn = document.querySelector('.lang-en');

  function updateDisplay() {
    if (radioEs.checked) {
      divEs.style.display = 'block';
      divEn.style.display = 'none';
    } else {
      divEs.style.display = 'none';
      divEn.style.display = 'block';
    }
  }

  radioEs.addEventListener('change', updateDisplay);
  radioEn.addEventListener('change', updateDisplay);

  updateDisplay();
})();
</script>
