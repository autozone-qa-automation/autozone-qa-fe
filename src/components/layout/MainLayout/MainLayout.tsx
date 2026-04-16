/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */
import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router';
import { Sidebar } from "../Sidebar/Sidebar";

/**
 * Componente de diseño principal (Layout).
 * * Este componente define la estructura global de la aplicación utilizando 
 * el sistema AppShell de Mantine. Establece una barra lateral fija y 
 * un área de contenido dinámico que cambia según la ruta.
 * * @returns {JSX.Element} El armazón de la aplicación con navegación y contenido.
 */
export function MainLayout() {
  return (
    <AppShell
      // Configuración de la barra lateral: ancho de 250px y colapso en pantallas pequeñas (sm)
      navbar={{
        width: 250,
        breakpoint: 'sm'
      }}
      // Espaciado global entre los bordes y el contenido
      padding="md"
    >
      {/* Sección lateral: Aquí se renderiza el menú de navegación */}
      <AppShell.Navbar>
        <Sidebar />
      </AppShell.Navbar>

      {/* Sección principal: El componente Outlet renderiza la ruta activa de React Router */}
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}