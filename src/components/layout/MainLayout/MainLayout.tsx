/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */
import { AppShell } from '@mantine/core'
import { Outlet } from 'react-router'
import { Sidebar } from '../Sidebar/Sidebar'

/**
 * Componente de diseño principal (Layout).
 * Este componente define la estructura global de la aplicación utilizando
 * el sistema AppShell de Mantine. Establece una barra lateral fija y
 * un área de contenido dinámico que cambia según la ruta.
 * * @returns {JSX.Element} El armazón de la aplicación con navegación y contenido.
 */
export function MainLayout() {
  return (
    <AppShell
      navbar={{
        width: 250,
        breakpoint: 'sm',
      }}
      padding="md"
    >
      <AppShell.Navbar>
        <Sidebar />
      </AppShell.Navbar>

      <AppShell.Main bg="#FCF9F4">
        <div style={{ padding: '15px' }}>
          <Outlet />
        </div>
      </AppShell.Main>
    </AppShell>
  )
}
