/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { createBrowserRouter } from 'react-router'
// Importación del Layout principal y las páginas (Vistas)
import { MainLayout } from './components/layout/MainLayout/MainLayout'
import { FeatureDetail } from './pages/features/FeatureDetail/FeatureDetail'
import { Features } from './pages/features/Features'
import { Generate } from './pages/generate/Generate'
import { Home } from './pages/home/Home'
import { Releases } from './pages/releases/Releases'
import { Reports } from './pages/reports/Reports'
import { Services } from './pages/services/Services'
import { ServicesId } from './pages/services/ServicesId/ServicesId'
import { TestCases } from './pages/tests-cases/TestCases'
import { Users } from './pages/users/Users'

/**
 * Configuración del enrutador principal de la aplicación.
 * Define la jerarquía de rutas y asocia las URLs con sus respectivos componentes.
 * Utiliza un patrón de "Nested Routes" (rutas anidadas) donde 'Layout' envuelve a las demás.
 */
export const router = createBrowserRouter([
  {
    // Ruta raíz: Define el contenedor principal (Navbar, Sidebar, etc.)
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'releases',
        element: <Releases />,
      },
      {
        path: 'features',
        element: <Features />,
      },
      {
        path: 'features/:featureId',
        element: <FeatureDetail />,
      },
      {
        path: 'generate',
        element: <Generate />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'services',
        element: <Services />,
      },
      {
        path: 'services/:serviceId',
        element: <ServicesId />,
      },
      {
        path: 'test-cases',
        element: <TestCases />,
      },
      {
        path: 'users',
        element: <Users />,
      },
    ],
  },
])
