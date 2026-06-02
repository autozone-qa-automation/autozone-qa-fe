/**
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Center,
  Loader,
  Select,
  Stack,
  Text,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconDatabaseOff, IconRefresh, IconSearch } from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import type { ReleaseData } from '@/components/layout/ButtonContentModal/ButtonContentModal'
import { ButtonContentModal } from '@/components/layout/ButtonContentModal/ButtonContentModal'
import { TitleHeader } from '@/components/layout/TitleHeader/TitleHeader'
import { useGetAllReleases } from '@/hooks/useGetReleases'
import { useUpdateReleaseStatus } from '@/hooks/useUpdateReleaseStatus'
import { ReleaseDeleteModal } from '@/pages/releases/ReleaseDeleteModal'
import { ReleasesModalStatus } from '@/pages/releases/ReleasesModalStatus'
import type { ReleaseStatus } from '@/types/Release.types'
import { ReleasesModalCreate } from './ReleasesModalCreate'

/**
 * Componente funcional que renderiza la página de gestión de Releases.
 * * @returns {JSX.Element} La vista de releases con controles de filtrado y grid de tarjetas.
 */
export function Releases() {
  /** Hook personalizado para obtener releases y estados de carga/error del backend */
  const { releases, loading, error, refetch } = useGetAllReleases()

  const { updateReleaseStatus, loading: updatingStatus } = useUpdateReleaseStatus()

  /** @type {'All' | ReleaseStatus} Estado seleccionado para filtrar la lista */
  const [statusFilter, setStatusFilter] = useState<'All' | ReleaseStatus>('All')

  /** @type {string} Query de búsqueda por nombre del release */
  const [searchQuery, setSearchQuery] = useState('')

  /** @type {string | null} Criterio de ordenamiento ('Newest' | 'Oldest') */
  const [sortBy, setSortBy] = useState<string | null>('Newest')

  /** Estado para controlar el modal de cambio de status */
  const [statusModalOpened, setStatusModalOpened] = useState(false)

  /** Estado para controlar el modal de eliminación */
  const [deleteModalOpened, setDeleteModalOpened] = useState(false)

  /** Release seleccionado para actualizar status o borrar */
  const [selectedRelease, setSelectedRelease] = useState<ReleaseData | null>(null)
  /**
   * Memoriza la lista de releases procesada.
   * Realiza tres pasos correlativos:
   * 1. Mapeo de VO del Backend a estructura compatible con componentes UI.
   * 2. Filtrado por estatus y búsqueda de texto.
   * 3. Ordenamiento cronológico según la fecha de creación.
   * * @returns {ReleaseData[]} Lista de releases filtrada y ordenada lista para renderizar.
   */
  const filteredAndSortedReleases = useMemo(() => {
    const mapped: ReleaseData[] = releases.map(r => ({
      releaseId: r.releaseId,
      title: r.releaseName,
      objective: r.releaseDescription,
      version: r.releaseVersion,
      tags: r.releaseTags.join(', '),
      creationDate: r.releaseCreationDate,
      releaseDate: r.releaseLaunchDate ?? '',
      status: r.releaseStatus,
      service: r.releaseServices?.[0] || 'Global',
      serviceId: r.releaseServiceId ?? null,
    }))

    return mapped
      .filter(release => {
        const matchesStatus = statusFilter === 'All' || release.status === statusFilter
        const matchesSearch = release.title.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesStatus && matchesSearch
      })
      .sort((a, b) => {
        const timeA = new Date(a.creationDate).getTime()
        const timeB = new Date(b.creationDate).getTime()
        return sortBy === 'Newest' ? timeB - timeA : timeA - timeB
      })
  }, [releases, statusFilter, searchQuery, sortBy])

  const releaseSearchOptions = useMemo(
    () => Array.from(new Set(filteredAndSortedReleases.map(release => release.title))),
    [filteredAndSortedReleases]
  )

  // --- Renderizado de Estados de Carga ---
  if (loading) {
    return (
      <Center h={400}>
        <Stack align="center" gap="xs">
          <Loader color="orange.6" size="lg" type="dots" />
          <Text size="sm" c="dimmed" fw={500}>
            Loading Releases...
          </Text>
        </Stack>
      </Center>
    )
  }

  // --- Renderizado de Estados de Error ---
  if (error) {
    return (
      <Center h={450}>
        <Alert
          variant="light"
          color="red"
          title="Connection Error"
          icon={<IconDatabaseOff size={24} />}
          radius="md"
          w={450}
        >
          <Stack gap="md">
            <Text size="sm">{error}</Text>
            <Button
              variant="outline"
              color="red"
              size="xs"
              leftSection={<IconRefresh size={14} />}
              onClick={() => void refetch()}
              w="fit-content"
            >
              Retry Connection
            </Button>
          </Stack>
        </Alert>
      </Center>
    )
  }

  const handleOnClose = () => {
    setTimeout(() => {
      void refetch()
    }, 200)
  }

  const openStatusModal = (release: ReleaseData) => {
    setSelectedRelease(release)
    setStatusModalOpened(true)
  }

  const closeStatusModal = () => {
    setStatusModalOpened(false)
    setSelectedRelease(null)
  }

  const openDeleteModal = (release: ReleaseData) => {
    setSelectedRelease(release)
    setDeleteModalOpened(true)
  }

  const closeDeleteModal = () => {
    setDeleteModalOpened(false)
    setSelectedRelease(null)
  }

  const handleUpdateStatus = async (releaseId: number, status: ReleaseStatus) => {
    try {
      await updateReleaseStatus(releaseId, status)

      notifications.show({
        title: 'Success!',
        message: 'Release status updated successfully',
        color: 'teal',
      })

      await refetch()
    } catch (e) {
      notifications.show({
        title: 'Error updating release status',
        message: e instanceof Error ? e.message : 'Unexpected error',
        color: 'red',
      })

      throw e
    }
  }

  // --- Vista Principal ---
  return (
    <div>
      <TitleHeader
        title="Releases"
        metaDetails={['Manage your automated deployment pipelines']}
        breadcrumbs={[]}
        actionComponent={
          <ReleasesModalCreate
            handleOnClose={() => {
              handleOnClose()
            }}
          />
        }
      />

      {/* Barra de Herramientas: Filtros, Buscador y Sort */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', width: '100%' }}>
        {(['All', 'Active', 'Draft', 'Progress'] as const).map(s => (
          <Button
            key={s}
            variant={statusFilter === s ? 'filled' : 'outline'}
            color={statusFilter === s ? 'orange.6' : 'gray'}
            bg={statusFilter === s ? '' : 'white'}
            radius="md"
            size={s === 'All' ? 'sm' : 'xs'}
            fw={600}
            onClick={() => setStatusFilter(s)}
          >
            {s === 'All' ? 'All Releases' : s}
          </Button>
        ))}

        <Autocomplete
          placeholder="Search releases..."
          data={releaseSearchOptions}
          value={searchQuery}
          onChange={setSearchQuery}
          ml="auto"
          size="xs"
          w="220px"
          leftSection={<IconSearch size={16} stroke={2.5} />}
        />

        <Select
          placeholder="Sort by"
          data={['Newest', 'Oldest']}
          value={sortBy}
          onChange={setSortBy}
          size="xs"
          leftSection={
            <Text size="xs" fw={500} c="dimmed" ml={5}>
              Sort:
            </Text>
          }
          leftSectionWidth={45}
        />
      </div>

      {/* Grid de Contenido: Tarjetas de Release */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {filteredAndSortedReleases.map(item => (
          <ButtonContentModal
            key={item.releaseId}
            data={item}
            onOpenStatusModal={openStatusModal}
            onDeleteClick={openDeleteModal}
          />
        ))}

        {/* Empty State */}
        {filteredAndSortedReleases.length === 0 && (
          <Box style={{ width: '100%', textAlign: 'center' }} mt={50}>
            <Text c="dimmed" fz="lg" fw={500}>
              No releases found
            </Text>
          </Box>
        )}
      </div>

      <ReleasesModalStatus
        opened={statusModalOpened}
        onClose={closeStatusModal}
        release={selectedRelease}
        loading={updatingStatus}
        onUpdateStatus={handleUpdateStatus}
      />

      {selectedRelease && (
        <ReleaseDeleteModal
          isOpen={deleteModalOpened}
          onClose={closeDeleteModal}
          releaseId={selectedRelease.releaseId}
          releaseName={selectedRelease.title}
          onSuccess={() => void refetch()}
        />
      )}
    </div>
  )
}
