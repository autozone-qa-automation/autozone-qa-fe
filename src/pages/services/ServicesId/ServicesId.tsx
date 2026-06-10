/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */
import { Anchor, Button, Container, Divider, Group, Loader, Stack, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { TitleHeader } from '@/components/layout/TitleHeader/TitleHeader'
import { useGetLastReleasesByServiceId } from '@/hooks/useGetLastReleasesByServiceId'
import { useGetServiceById } from '@/hooks/useGetServiceById'
import { FeatureModalCreate } from '@/pages/features/FeatureModalCreate'
import ServiceEditModal from '@/pages/services/ServiceEditModal'
import { ReleasesList } from '@/pages/services/ServicesId/ReleasesList'
import { ServiceDeleteModal } from '@/pages/services/ServicesId/ServiceDeleteModal'
import { ServicesList } from '@/pages/services/ServicesId/ServicesList'
import { featureService } from '@/services/features.service'

export function ServicesId() {
  const { serviceId } = useParams()
  const navigate = useNavigate()
  const id = Number(serviceId)
  const [editOpened, setEditOpened] = useState(false)
  const [deleteOpened, setDeleteOpened] = useState(false)
  const [addFeatureOpened, setAddFeatureOpened] = useState(false)

  const { service, features, loading, error, refetch } = useGetServiceById(id)
  const {
    releases,
    loading: releasesLoading,
    error: releasesError,
  } = useGetLastReleasesByServiceId(id)

  const handleUnlinkFeature = async (featureId: number) => {
    try {
      await featureService.deactivate(String(featureId))
      notifications.show({ title: 'Success', message: 'Feature deleted', color: 'teal' })
      await refetch?.()
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err instanceof Error ? err.message : 'Failed to delete feature',
        color: 'red',
      })
    }
  }

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
            <Button
              data-testid="service-id-edit-button"
              size="xs"
              color="orange.6"
              onClick={() => setEditOpened(true)}
            >
              Edit
            </Button>
            <Button
              size="xs"
              color="red"
              variant="outline"
              leftSection={<IconTrash size={14} stroke={2.5} />}
              onClick={() => setDeleteOpened(true)}
              data-testid="service-id-delete-button"
            >
              Delete
            </Button>
          </Group>
        </Group>

        <ServiceEditModal
          service={{
            id: service.id,
            name: service.name,
            description: service.description,
            urls: service.urls,
          }}
          opened={editOpened}
          onClose={() => setEditOpened(false)}
          onSuccess={refetch}
        />

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
            {service.urls && service.urls.length > 0 ? (
              service.urls.map(urlItem => (
                <Anchor
                  key={urlItem.idUrl ?? urlItem.url}
                  size="sm"
                  href={urlItem.url}
                  target="_blank"
                >
                  {urlItem.nombre || urlItem.url}
                </Anchor>
              ))
            ) : (
              <Text size="sm" c="dimmed">
                Sin URLs disponibles.
              </Text>
            )}
          </Stack>
        </Stack>

        <Divider />

        <ServicesList
          data={featureItems}
          onDeleteClick={id => {
            void handleUnlinkFeature(id)
          }}
          onAddClick={() => setAddFeatureOpened(true)}
        />

        <FeatureModalCreate
          opened={addFeatureOpened}
          onClose={() => setAddFeatureOpened(false)}
          initialServiceId={id}
          disableServiceSelect
          onSuccess={refetch}
        />

        <Divider />

        <ReleasesList releases={releases} loading={releasesLoading} error={releasesError} />
      </Stack>

      {service && (
        <ServiceDeleteModal
          isOpen={deleteOpened}
          onClose={() => setDeleteOpened(false)}
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
