/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Anchor, Button, Container, Divider, Group, Loader, Stack, Text } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { TitleHeader } from '@/components/layout/TitleHeader/TitleHeader'
import type { FeatureItem } from '@/pages/services/ServicesId/ServicesList'
import { ServicesList } from '@/pages/services/ServicesId/ServicesList'

interface Service {
  id: number
  name: string
  description?: string
  repositoryUrl?: string
  documentationUrl?: string
}

interface FeatureVO {
  id: number
  featureName: string
  featureDescription: string
  idService: number
}

export function ServicesId() {
  const { serviceId } = useParams()
  const id = Number(serviceId)

  const [service, setService] = useState<Service | null>(null)
  const [features, setFeatures] = useState<FeatureItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const resService = await fetch(`http://localhost:8080/api/v1/services/${id}`)
        if (!resService.ok) throw new Error('Servicio no encontrado')
        const dataService = (await resService.json()) as Service
        setService(dataService)

        const resFeatures = await fetch(`http://localhost:8080/api/v1/features`)
        const allFeatures = (await resFeatures.json()) as FeatureVO[]

        const filtered: FeatureItem[] = allFeatures
          .filter((f: FeatureVO) => Number(f.idService) === id)
          .map((f: FeatureVO) => ({
            idFeature: f.id,
            nombre: f.featureName,
          }))

        setFeatures(filtered)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Error al conectar con el backend')
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData().catch((err: Error) => {
        setError(err.message)
      })
    }
  }, [id])

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

  return (
    <Container size="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="flex-start">
          <TitleHeader
            title={service.name}
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
            <Anchor size="sm" href={service.repositoryUrl || '#'} target="_blank">
              Repository
            </Anchor>
            <Anchor size="sm" href={service.documentationUrl || '#'} target="_blank">
              Documentation
            </Anchor>
          </Stack>
        </Stack>

        <Divider />

        <ServicesList data={features} onDeleteClick={() => {}} />

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
