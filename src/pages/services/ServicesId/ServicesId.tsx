/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */
import { Anchor, Button, Container, Divider, Group, Loader, Stack, Text } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { TitleHeader } from '@/components/layout/TitleHeader/TitleHeader'
import { useGetLastReleasesByServiceId } from '@/hooks/useGetLastReleasesByServiceId'
import { useGetServiceById } from '@/hooks/useGetServiceById'
import { ReleasesList } from '@/pages/services/ServicesId/ReleasesList'
import { ServiceDeleteModal } from '@/pages/services/ServicesId/ServiceDeleteModal'
import { ServicesList } from '@/pages/services/ServicesId/ServicesList'

export function ServicesId() {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const id = Number(serviceId)
  const [deleteModalOpened, setDeleteModalOpened] = useState(false)

  const { service, features, loading, error } = useGetServiceById(id)
  const {
    releases,
    loading: releasesLoading,
    error: releasesError,
  } = useGetLastReleasesByServiceId(id)

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
            <Button
              size="xs"
              color="red"
              variant="outline"
              leftSection={<IconTrash size={14} stroke={2.5} />}
              onClick={() => setDeleteModalOpened(true)}
            >
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

        <Divider />

        <ReleasesList releases={releases} loading={releasesLoading} error={releasesError} />
      </Stack>

      {service && (
        <ServiceDeleteModal
          isOpen={deleteModalOpened}
          onClose={() => setDeleteModalOpened(false)}
          serviceId={service.id}
          serviceName={service.getDisplayName()}
          onSuccess={() => {
            navigate('/services')
          }}
        />
      )}
    </Container>
  )
}
