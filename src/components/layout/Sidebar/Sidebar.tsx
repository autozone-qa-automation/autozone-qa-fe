/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Divider,
  Group,
  NavLink,
  Popover,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core'
import {
  IconBox,
  IconBug,
  IconChevronRight,
  IconChevronsLeft,
  IconFileDescription,
  IconHome,
  IconLogout,
  IconPlugConnected,
  IconSubtitlesAi,
  IconTestPipe,
  IconUsers,
} from '@tabler/icons-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { useGetUserById } from '@/hooks/userGetUserById'
import classes from './Sidebar.module.css'

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
]

/**
 * Componente Sidebar.
 * Proporciona la navegación lateral de la aplicación, gestión de estado de rutas activas
 * y una sección de perfil de usuario en la parte inferior.
 * * @returns {JSX.Element} Una barra lateral vertical estructurada.
 */
export function Sidebar() {
  const location = useLocation()

  const [active, setActive] = useState(location.pathname)
  const [popoverOpened, setPopoverOpened] = useState(false)

  // ID=1 placeholder — replace with auth context user ID when auth is implemented
  const { user } = useGetUserById(1)

  const fullName = user ? `${user.name} ${user.lastname}` : '...'
  const initials = user ? `${user.name[0]}${user.lastname[0]}`.toUpperCase() : '?'
  const roleLabel = user?.role?.permisionlevel ?? '—'

  /**
   * Mapeo de navData para transformar objetos de configuración en componentes NavLink de Mantine.
   * Se integra con 'react-router' mediante la prop 'component={Link}'.
   */
  const links = navData.map(item => (
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
  ))

  return (
    <Stack h="100%" justify="space-between" p="md">
      <Box>
        {/* Sección de Encabezado: Logo y botón de colapsar */}
        <Group justify="space-between" mb="xl">
          <Group>
            <Avatar color="orange" radius="md">
              <Text fw={700} size="xl">
                T
              </Text>
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
        <Popover
          opened={popoverOpened}
          onChange={setPopoverOpened}
          position="top-start"
          width={224}
          shadow="md"
          radius="md"
          withArrow={false}
        >
          <Popover.Target>
            <UnstyledButton w="100%" onClick={() => setPopoverOpened(o => !o)}>
              <Group>
                <Avatar color="orange" radius="xl" size="lg">
                  {initials}
                </Avatar>
                <Box>
                  <Text fw={600} size="sm">
                    {fullName}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {roleLabel}
                  </Text>
                </Box>
              </Group>
            </UnstyledButton>
          </Popover.Target>

          <Popover.Dropdown p={0}>
            <Group p="xs" gap="xs" wrap="nowrap">
              <Avatar color="orange" radius="xl" size="md">
                {initials}
              </Avatar>
              <Box>
                <Text fw={600} size="sm">
                  {fullName}
                </Text>
                <Badge color="violet" variant="light" size="sm">
                  {roleLabel}
                </Badge>
              </Box>
            </Group>
            <Divider />
            <NavLink
              component={Link}
              to="/users"
              label="User Management"
              leftSection={<IconUsers size="1rem" />}
              rightSection={<IconChevronRight size="0.8rem" />}
              onClick={() => setPopoverOpened(false)}
            />
            <Divider />
            <NavLink
              label="Log Out"
              leftSection={<IconLogout size="1rem" />}
              onClick={() => setPopoverOpened(false)}
              color="red"
            />
          </Popover.Dropdown>
        </Popover>
      </Box>
    </Stack>
  )
}
