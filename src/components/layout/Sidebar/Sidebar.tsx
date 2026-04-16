/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */
import { useState } from 'react';
import { NavLink, Text, Avatar, Group, Stack, Box, ActionIcon, Divider } from '@mantine/core';
import { useLocation, Link } from 'react-router';
import {
  IconPlugConnected,
  IconBox,
  IconSubtitlesAi,
  IconFileDescription,
  IconTestPipe,
  IconBug,
  IconChevronsLeft,
  IconHome
} from '@tabler/icons-react';
import classes from './Sidebar.module.css';

/**
 * Configuración de los elementos de navegación.
 * Cada objeto define la ruta, el nombre visible y el icono correspondiente.
 */
const navData = [
  { link: '/', label: 'Home', icon: IconHome },
  { link: '/releases', label: 'Releases', icon: IconBox },
  { link: '/services', label: 'Services', icon: IconPlugConnected },
  { link: '/features', label: 'Features', icon: IconBug },
  { link: '/test-cases', label: 'Test Cases', icon: IconTestPipe },
  { link: '/generate', label: 'Generate', icon: IconSubtitlesAi },
  { link: '/reports', label: 'Reports', icon: IconFileDescription },
];

/**
 * Componente Sidebar.
 * Proporciona la navegación lateral de la aplicación, gestión de estado de rutas activas
 * y una sección de perfil de usuario en la parte inferior.
 * * @returns {JSX.Element} Una barra lateral vertical estructurada.
 */
export function Sidebar() {
  const location = useLocation();

  // Estado para rastrear qué enlace está seleccionado, inicializado con la ruta actual de la URL
  const [active, setActive] = useState(location.pathname);

  /**
   * Mapeo de navData para transformar objetos de configuración en componentes NavLink de Mantine.
   * Se integra con 'react-router' mediante la prop 'component={Link}'.
   */
  const links = navData.map((item) => (
    <NavLink
      key={item.label}
      component={Link} // Permite la navegación del lado del cliente sin recargar la página
      to={item.link}
      label={item.label}
      leftSection={<item.icon size="1.2rem" stroke={1.5} />}
      onClick={() => setActive(item.link)}
      active={active === item.link}
      className={classes.link}
      variant="filled"
      color="#FFF4ED" // Fondo suave para el estado activo
    />
  ));

  return (
    <Stack h="100%" justify="space-between" p="md">
      <Box>
        {/* Sección de Encabezado: Logo y botón de colapsar */}
        <Group justify="space-between" mb="xl">
          <Group>
            <Avatar color="orange" radius="md">
              <Text fw={700} size="xl">T</Text>
            </Avatar>
            <Text size="xl" fw={700} c="dark.7">
              TestFlow
            </Text>
          </Group>
          <ActionIcon variant="subtle" color="gray">
            <IconChevronsLeft size="1.2rem" stroke={1.5} />
          </ActionIcon>
        </Group>

        {/* Enlaces de navegación principales */}
        <Stack gap={0}>{links}</Stack>
      </Box>

      {/* Sección de Pie de página: Información del usuario */}
      <Box>
        <Divider mb="lg" />
        <Group>
          <Avatar color="orange" radius="xl" size="lg">
            RS
          </Avatar>
          <Box>
            <Text fw={600} size="sm">Santiago Estrada</Text>
            <Text size="xs" c="dimmed">
              Developer
            </Text>
          </Box>
        </Group>
      </Box>
    </Stack>
  );
}