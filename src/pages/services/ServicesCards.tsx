/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */
import { Badge, Box, Card, Group, Text } from '@mantine/core'
import { IconCode, IconDatabase, IconDeviceDesktop, IconServer } from '@tabler/icons-react'

interface ServiceCardProps {
  idService: number
  nombre: string
  descripcion?: string
  featuresCount?: number
  testCasesCount?: number
  status?: 'active' | 'inactive' | 'draft' | 'archived'
}

const getServiceIcon = (nombre: string) => {
  switch (nombre.toLowerCase()) {
    case 'backend':
      return <IconCode size={16} />
    case 'frontend':
      return <IconDeviceDesktop size={16} />
    case 'bd':
      return <IconDatabase size={16} />
    default:
      return <IconServer size={16} />
  }
}

export function ServiceCard({
  idService,
  nombre,
  descripcion,
  featuresCount = 0,
  testCasesCount = 0,
  status = 'active',
}: ServiceCardProps) {
  const handleCardClick = () => {
    window.location.href = `/services/${idService}`
  }

  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'green'
      case 'inactive':
        return 'gray'
      case 'draft':
        return 'yellow'
      case 'archived':
        return 'red'
      default:
        return 'gray'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'active':
        return 'ACTIVE'
      case 'inactive':
        return 'INACTIVE'
      case 'draft':
        return 'DRAFT'
      case 'archived':
        return 'ARCHIVED'
      default:
        return String(status).toUpperCase()
    }
  }

  return (
    <Card
      shadow="sm"
      radius="md"
      p="md"
      withBorder
      onClick={handleCardClick}
      style={{
        borderTop: '4px solid orange',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        height: '100%',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = ''
      }}
    >
      <Group justify="space-between" align="flex-start">
        <Group>
          <Box
            style={{
              backgroundColor: '#f1f3f5',
              borderRadius: '50%',
              padding: 8,
            }}
          >
            {getServiceIcon(nombre)}
          </Box>

          <Box>
            <Text fw={600}>{nombre}</Text>
            <Text size="xs" c="dimmed">
              #{idService}
            </Text>
          </Box>
        </Group>

        <Badge color={getStatusColor()} variant="light">
          {getStatusText()}
        </Badge>
      </Group>

      {descripcion && (
        <Text size="sm" mt="xs" c="dimmed" lineClamp={2}>
          {descripcion}
        </Text>
      )}

      <Group mt="sm" gap="xs">
        <Badge variant="light" color="blue">
          {featuresCount} features
        </Badge>
        <Badge variant="light" color="teal">
          {testCasesCount} test cases
        </Badge>
      </Group>

      <Group justify="space-between" mt="md">
        <Text size="xs" c="dimmed">
          Servicio del sistema
        </Text>

        <Text size="xs" c="orange" fw={500}>
          See details →
        </Text>
      </Group>
    </Card>
  )
}

interface ServicesListProps {
  searchQuery?: string
  filter?: string
}

export function ServicesList({ searchQuery = '', filter = 'all' }: ServicesListProps) {
  const services: ServiceCardProps[] = [
    {
      idService: 1,
      nombre: 'Backend',
      descripcion: 'Lógica del sistema y APIs para la gestión automatizada',
      featuresCount: 8,
      testCasesCount: 42,
      status: 'active',
    },
    {
      idService: 2,
      nombre: 'Frontend',
      descripcion: 'Interfaz de usuario y experiencia visual',
      featuresCount: 12,
      testCasesCount: 38,
      status: 'active',
    },
    {
      idService: 3,
      nombre: 'BD',
      descripcion: 'Base de datos y persistencia de información',
      featuresCount: 5,
      testCasesCount: 24,
      status: 'inactive',
    },
    {
      idService: 4,
      nombre: 'API Gateway',
      descripcion: 'Gestión de rutas y autenticación',
      featuresCount: 6,
      testCasesCount: 15,
      status: 'draft',
    },
    {
      idService: 5,
      nombre: 'Auth Service',
      descripcion: 'Servicio de autenticación y autorización',
      featuresCount: 4,
      testCasesCount: 12,
      status: 'archived',
    },
  ]

  const filteredServices = services.filter(service => {
    if (filter !== 'all' && service.status !== filter) return false

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesName = service.nombre.toLowerCase().includes(query)
      const matchesDescription = service.descripcion?.toLowerCase().includes(query) || false
      return matchesName || matchesDescription
    }

    return true
  })

  if (filteredServices.length === 0) {
    return (
      <Card withBorder p="xl" radius="md">
        <Text ta="center" c="dimmed" size="lg">
          No services found
        </Text>
        <Text ta="center" c="dimmed" size="sm" mt="xs">
          Try adjusting your search or filter criteria
        </Text>
      </Card>
    )
  }

  return (
    <>
      {filteredServices.map(service => (
        <ServiceCard key={service.idService} {...service} />
      ))}
    </>
  )
}
