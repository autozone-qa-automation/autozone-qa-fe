/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */
import { Anchor, Button, Container, Divider, Group, Loader, Stack, Text } from '@mantine/core'
import { useParams } from 'react-router'
import { TitleHeader } from '@/components/layout/TitleHeader/TitleHeader'
import { useGetServiceById } from '@/hooks/useGetServiceById'
import { ServicesList } from '@/pages/services/ServicesId/ServicesList'

export function ServicesId() {
  const { serviceId } = useParams()
  const id = Number(serviceId)

  const { service, features, loading, error } = useGetServiceById(id)

  if (!id) return <Text p="xl">ID de servicio no válido</Text>

  if (loading)
    return (
      <Group p="xl" justify="center">
        <Loader size="sm" color="orange.6" />
        <Text size="sm" c="dimmed">
          Cargando información...
        </Text>
      </Group>
    )

  if (error)
    return (
      <Text c="red" p="xl">
        Error: {error}
      </Text>
    )

  if (!service) return <Text p="xl">El servicio no existe</Text>

  const featureItems = features.map(f => ({
    idFeature: f.id,
    nombre: f.featureName,
  }))

  return (
    <Container size="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="flex-start">
          <TitleHeader
            title={service.getDisplayName()}
            metaDetails={[`${features.length} features`, `0 test cases`]}
            breadcrumbs={[
              { title: 'Services', href: '/services' },
              { title: service.name, href: '#' },
            ]}
          />

          <Group gap="xs">
            <Button size="xs" color="orange.6">
              Edit
            </Button>
            <Button size="xs" color="red" variant="outline">
              Delete
            </Button>
          </Group>
        </Group>

        <Stack gap={4}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
            Description
          </Text>
          <Text size="sm">{service.description || 'Sin descripción'}</Text>
        </Stack>

        <Stack gap={4}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
            URLs
          </Text>
          <Stack gap={2}>
            <Anchor size="sm" href="#" target="_blank">
              Repository
            </Anchor>
            <Anchor size="sm" href="#" target="_blank">
              Documentation
            </Anchor>
          </Stack>
        </Stack>

        <Divider />

        <ServicesList data={featureItems} onDeleteClick={() => {}} />

        <Stack gap="sm" mt="md">
          <Text fw={600} size="sm" c="dimmed" tt="uppercase">
            Last Releases
          </Text>
          <Text size="sm" c="dimmed" fs="italic">
            No hay releases recientes para mostrar.
          </Text>
        </Stack>
      </Stack>
    </Container>
  )
}
