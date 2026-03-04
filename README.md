# InnerWork - Frontend

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Ionic](https://img.shields.io/badge/Ionic-3880FF?style=for-the-badge&logo=ionic&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![ApexCharts](https://img.shields.io/badge/ApexCharts-FF4560?style=for-the-badge&logo=apexcharts&logoColor=white)

Este repositorio contiene el código fuente de la interfaz de usuario para la plataforma **InnerWork**, una aplicación web desarrollada con **Angular** e **Ionic Framework**. El sistema permite la monitorización proactiva del bienestar organizacional y la prevención del burnout mediante el análisis de datos multimodales y métricas predictivas.

## Características del Sistema

La aplicación implementa una arquitectura reactiva basada en **Signals** para optimizar el rendimiento y la sincronización de estados entre los siguientes módulos:

### 1. Sistema de Navegación Dinámica y Acceso
- **Navegación por Rol:** La interfaz adapta la barra de navegación automáticamente según el perfil del usuario (Administrador o Empleado).
- **Home/Landing:** Punto de entrada con descripción de servicios y flujos de registro o autenticación.
- **Autenticación:** Inicio de sesión seguro con gestión de estados de carga y manejo de errores mediante señales.

### 2. Directorio de Empleados (Gestión Administrativa)
- **Control Centralizado:** Interfaz avanzada para la gestión de la plantilla con funciones de búsqueda y filtrado multinivel.
- **Filtrado Avanzado:**
    - Búsqueda por nombre y correo electrónico.
    - Filtrado por departamento (R&D, Sales, Human Resources).
    - Rango de riesgo de burnout y filtrado por fechas de evaluación.
- **Gestión CRUD:** Acceso a modales de edición y sistemas de eliminación con confirmación.
- **Monitoreo de Estado:** Visualización del riesgo de burnout categorizado por estados (High Risk, Monitor, Healthy) y última fecha de evaluación.

### 3. Panel de Administración (Admin Dashboard)
- **Métricas Globales:** Indicadores de Bienestar General, Alertas Críticas (Burnout $\geq 70\%$) y Tasa de Participación semanal.
- **Tendencias Organizacionales:** Gráficas evolutivas que contrastan la satisfacción y el estrés detectado por IA a escala corporativa.

### 4. Panel del Empleado (User Dashboard)
- **Evolución Personal:** Visualización de tendencias de bienestar personal mediante series temporales.
- **Asistencia Interactiva:** Integración de `AiChatComponent` para soporte emocional interactivo.
- **Control de Check-In:** Notificación dinámica sobre el estado del registro diario.

### 5. Registro Multimodal (Check-In)
- **Journaling:** Captura de archivos binarios (audio `.webm` e imágenes `.jpg`) procesados mediante `WebcamPersonDetectorComponent`.
- **Encuestas:** Recopilación de métricas sobre balance vida-trabajo, desempeño y satisfacción ambiental.

## Tecnologías y Herramientas

- **Framework Core:** Angular 17/18 (Standalone Components & Signals)
- **Componentes UI:** Ionic Framework (Ionic standalone)
- **Visualización:** ApexCharts para la representación de series temporales
- **Estilizado:** Tailwind CSS e infraestructura de diseño de Ionic
- **Comunicación:** RxJS para la gestión de flujos asíncronos en servicios de infraestructura

## Organización del Proyecto (src/app/)

La estructura del código sigue una arquitectura modular y escalable, separando la lógica de presentación de la lógica de servicios y modelos:

```text
app/
├── core/             [Infraestructura] Interceptores, guardias de ruta y servicios de comunicación API
├── pages/            [Vistas] Componentes de página (Login, Admin Dashboard, Form)
├── shared/           [Compartido] Recursos transversales reutilizables
│   ├── components/   [UI] Componentes comunes (Gráficas, Spinners, Alertas)
│   └── models/       [Tipado] Interfaces de datos y DTOs del sistema
└── app.routes.ts     [Navegación] Definición del sistema de rutas y Lazy Loading
