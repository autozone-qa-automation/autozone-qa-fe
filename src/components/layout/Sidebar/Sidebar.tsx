/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */
import {
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
  IconFileDescription,
  IconLogout,
  IconPlugConnected,
  IconTestPipe,
  IconUsers,
} from '@tabler/icons-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { logout } from '@/utils/logout'
import classes from './Sidebar.module.css'

/**
 * Configuración de los elementos de navegación.
 * Cada objeto define la ruta, el nombre visible y el icono correspondiente.
 */
const navData = [
  { link: '/releases', label: 'Releases', icon: IconBox },
  { link: '/services', label: 'Services', icon: IconPlugConnected },
  { link: '/features', label: 'Features', icon: IconBug },
  { link: '/test-cases', label: 'Test Cases', icon: IconTestPipe },
  { link: '/reports', label: 'Reports', icon: IconFileDescription },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const [active, setActive] = useState(location.pathname)
  const [popoverOpened, setPopoverOpened] = useState(false)

  const name = localStorage.getItem('name') || '""'
  const sureName = localStorage.getItem('sureName') || '""'
  const role = localStorage.getItem('role') || '""'

  const fullName = `${name} ${sureName}`
  const initials = `${name[0]}${sureName[0]}`.toUpperCase()
  const roleLabel = role

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
        <Group mb="xl">
          <Avatar color="orange" radius="md">
            <Text fw={700} size="xl">
              T
            </Text>
          </Avatar>
          <Text size="xl" fw={700} c="dark.7">
            TestFlow
          </Text>
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
              onClick={() => {
                setPopoverOpened(false)
                logout()
                navigate('/login')
              }}
              color="red"
            />
          </Popover.Dropdown>
        </Popover>
      </Box>
    </Stack>
  )
}
