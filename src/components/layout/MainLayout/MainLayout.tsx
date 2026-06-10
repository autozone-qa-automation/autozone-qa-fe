/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */
import { AppShell } from '@mantine/core'
import { Outlet } from 'react-router'
import { Sidebar } from '../Sidebar/Sidebar'

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
