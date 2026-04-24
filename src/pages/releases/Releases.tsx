/*
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
import { IconDatabaseOff, IconPlus, IconRefresh, IconSearch } from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import type {
  ReleaseData,
  ReleaseStatus,
} from '@/components/layout/ButtonContentModal/ButtonContentModal'
import { ButtonContentModal } from '@/components/layout/ButtonContentModal/ButtonContentModal'
import { TitleHeader } from '@/components/layout/TitleHeader/TitleHeader'
import { useGetAllReleases } from '@/hooks/useGetReleases'

export function Releases() {
  const { releases, loading, error, refetch } = useGetAllReleases()
  const [statusFilter, setStatusFilter] = useState<'All' | ReleaseStatus>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<string | null>('Newest')

  const filteredAndSortedReleases = useMemo(() => {
    const mapped: ReleaseData[] = releases.map(r => ({
      title: r.releaseName,
      objective: r.releaseDescription,
      version: r.releaseVersion,
      tags: r.releaseTags,
      creationDate: r.releaseCreationDate,
      releaseDate: r.releaseLaunchDate,
      status: r.releaseStatus,
      service: r.releaseService,
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

  if (loading) {
    return (
      <Center h={400}>
        <Stack align="center" gap="xs">
          <Loader color="orange.6" size="lg" type="dots" />
          <Text size="sm" c="dimmed" fw={500}>
            Connecting to database...
          </Text>
        </Stack>
      </Center>
    )
  }

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

  return (
    <div>
      <TitleHeader
        title="Releases"
        metaDetails={['Manage your automated deployment pipelines']}
        breadcrumbs={[]}
        actionComponent={
          <Button leftSection={<IconPlus size={16} stroke={2.5} />} color="orange.6" radius="md">
            New Release
          </Button>
        }
      />

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
          data={filteredAndSortedReleases.map(r => r.title)}
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

      <div style={{ marginTop: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {filteredAndSortedReleases.map((item, index) => (
          <ButtonContentModal
            key={`${item.title}-${index}`}
            data={item}
            onStatusChange={() => {}}
          />
        ))}

        {filteredAndSortedReleases.length === 0 && (
          <Box style={{ width: '100%', textAlign: 'center' }} mt={50}>
            <Text c="dimmed" fz="lg" fw={500}>
              No releases found
            </Text>
          </Box>
        )}
      </div>
    </div>
  )
}
