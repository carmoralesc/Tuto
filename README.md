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
Tuto/
├── index.html                          # Entry point HTML (Vite)
├── package.json                        # Dependencias (React 19, Zustand 5, Zod v4, Tailwind 3, Vite 6, react-hook-form 7, @tanstack/react-table, @dnd-kit)
├── vite.config.ts                      # Configuración de Vite
├── tailwind.config.js                  # Config Tailwind (darkMode: 'class')
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js
├── postcss.config.js
├── public/
│   └── tecnm.webp                      # Logo institucional TecNM
│
└── src/
    ├── main.tsx                         # ReactDOM.createRoot — monta <App />
    ├── App.tsx                          # useTheme(), <AppRouter />
    │
    ├── routes/
    │   └── AppRouter.tsx                # React Router: /login, /dashboard, /tutor/seguimiento, /tutor/reporte-semestral, /wizard/...
    │
    ├── pages/                           # 🧭 Páginas/vistas completas
    │   ├── LoginPage.tsx                # Inicio de sesión (siempre tema claro)
    │   ├── StudentDashboard.tsx         # Dashboard alumno — botón "Realizar propuesta"
    │   ├── StudentWizardPage.tsx        # Wizard de carga académica (7 pasos)
    │   ├── TutorDashboardPage.tsx       # Dashboard tutor — tabla de propuestas
    │   ├── ProfilePage.tsx              # Perfil de usuario (editable PB/PEA)
    │   └── NotFoundPage.tsx             # 404
    │
    ├── components/                      # 🧩 Componentes reutilizables
    │   ├── layout/
    │   │   ├── AppHeader.tsx            # Barra superior (logo, nav, menú usuario, toggle tema)
    │   │   ├── MainLayout.tsx           # Layout con header + contenido
    │   │   └── PageContainer.tsx        # Contenedor con padding estándar
    │   ├── ui/
    │   │   ├── Toast.tsx                # Toast individual
    │   │   └── ToastContainer.tsx       # Contenedor de toasts (portal)
    │   ├── ProtectedRoute.tsx           # Guard: redirige según autenticación y rol
    │   ├── tutor/                       # Componentes del módulo tutor
    │   │   ├── TutorTrackingList.tsx    # Doc 4: tabla sábana + toggle lista asistencia
    │   │   ├── StudentTrackingView.tsx  # Doc 4: vista individual de seguimiento
    │   │   ├── TutorSemesterReportList.tsx  # Doc 5/7: reporte semestral + toggle acción
    │   │   └── StudentSemesterReportView.tsx # Doc 5: edición individual de reporte
    │   └── student/                     # Componentes del módulo alumno
    │       └── StudentTrackingForm.tsx  # Formulario simplificado (fullName, PB, PEA)
    │
    ├── features/                        # 🎯 Features con lógica de negocio encapsulada
    │   ├── auth/                        # (schemas de autenticación si aplica)
    │   ├── schemas/
    │   │   └── personalData.schema.ts   # Zod schema para datos personales del wizard
    │   ├── student-wizard/              # 🧙 Wizard de propuesta de carga académica
    │   │   ├── components/
    │   │   │   ├── index.ts             # Barrel export
    │   │   │   ├── PersonalDataStep.tsx # Paso 1: datos personales
    │   │   │   ├── SubjectSelectionStep.tsx # Paso 2: selección de materias (DnD)
    │   │   │   ├── DraggableSubject.tsx # Tarjeta de materia arrastrable
    │   │   │   ├── DroppableZone.tsx    # Zona de drop para materias
    │   │   │   ├── FailedSubjectsStep.tsx    # Paso 3: materias reprobadas
    │   │   │   ├── FailureReasonsStep.tsx    # Paso 4: razones de reprobación
    │   │   │   ├── FileUploadStep.tsx        # Paso 5: subida de documentos
    │   │   │   ├── SignatureStep.tsx         # Paso 6: firma
    │   │   │   ├── ConfirmationStep.tsx      # Paso 7: confirmación
    │   │   │   ├── WizardNavigation.tsx      # Botones Anterior/Siguiente
    │   │   │   └── ProtectedStep.tsx         # Guard de paso completado
    │   │   ├── hooks/
    │   │   │   └── useToast.tsx         # Hook de notificaciones toast
    │   │   ├── context/                 # Contextos del wizard
    │   │   └── types/                   # Tipos específicos del wizard
    │   └── tutor-dashboard/             # 🧑‍🏫 Dashboard del tutor
    │       ├── components/
    │       │   ├── ProposalsTable.tsx   # Tabla de propuestas (TanStack Table)
    │       │   ├── ProposalDetail.tsx   # Vista detallada de una propuesta
    │       │   └── TutorSubjectEditor.tsx # Editor DnD de materias (tutor modifica)
    │       ├── hooks/                   # Hooks del dashboard tutor
    │       └── types/                   # Tipos locales del dashboard
    │
    ├── stores/                          # 🗃️ Estado global (Zustand + persist)
    │   ├── useAuthStore.ts              # Autenticación, perfil, login/logout
    │   ├── useWizardStore.ts            # Estado del wizard (pasos, materias seleccionadas)
    │   ├── useAcademicStore.ts          # Datos académicos compartidos
    │   ├── useStudentTrackingStore.ts   # Doc 4: datos de seguimiento (mock 7 alumnos)
    │   └── useThemeStore.ts             # Tema: light/dark/amoled/system (persiste en localStorage)
    │
    ├── types/                           # 📐 Tipos TypeScript compartidos
    │   ├── student.types.ts             # Student, SubjectAttempt, AcademicLevel
    │   ├── subject.types.ts             # Subject (materia)
    │   ├── academic-load.types.ts       # AcademicLoadProposal, SelectedSubject
    │   └── student-tracking.types.ts    # StudentTrackingData, TrackingTest5, etc.
    │
    ├── constants/                       # 📋 Datos constantes
    │   └── tracking-activities.ts       # A1-A48, NECESIDADES_LABELS, TOTAL_SEMESTERS
    │
    ├── data/
    │   └── subjects.ts                  # Catálogo de materias (subjectArray + mapa)
    │
    ├── mocks/                           # 🧪 Datos de prueba
    │   ├── students.mock.ts             # 7 alumnos mock con historial académico
    │   ├── subjects.mock.ts             # Datos mock de materias
    │   └── proposals.mock.ts            # Propuestas de carga académica mock
    │
    ├── lib/                             # 🔧 Utilidades y generadores
    │   ├── config/                      # Configuración de la app
    │   ├── constants/                   # Constantes de utilidad
    │   ├── utils/
    │   │   ├── index.ts                 # Barrel: risk, subject-level, validation
    │   │   ├── risk.utils.ts            # Cálculo de puntuación de riesgo
    │   │   ├── subject-level.utils.ts   # Lógica de niveles (ordinario/repite/especial)
    │   │   └── validation.utils.ts      # Detección de violaciones de carga
    │   ├── generateSabanasHTML.ts       # Genera HTML para imprimir Docs 4 y 5
    │   ├── generateAttendanceListHTML.ts # Genera HTML para imprimir Doc 6
    │   └── generateActionReportHTML.ts  # Genera HTML para imprimir Doc 7
    │
    ├── styles/                          # 🎨 Estilos
    │   ├── App.css                      # Estilos legacy de la app
    │   ├── global.css                   # Estilos globales
    │   └── index.css                    # Tailwind layers + card-glass + dark/amoled + scrollbar + login-force-light
    │
    └── __tests__/
        └── logic.test.ts               # Tests unitarios de lógica de negocio
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
