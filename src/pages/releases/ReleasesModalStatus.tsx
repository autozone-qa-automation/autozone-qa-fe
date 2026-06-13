/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Button, Group, Input, Select, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useEffect, useMemo, useState } from 'react'
import type { ReleaseData } from '@/components/layout/ButtonContentModal/ButtonContentModal'
import { ModalTemplate } from '@/components/ui/ModalTemplate/ModalTemplate'
import type { ReleaseStatus } from '@/types/Release.types'

interface ReleasesModalStatusProps {
  opened: boolean
  onClose: () => void
  release: ReleaseData | null
  loading: boolean
  onUpdateStatus: (releaseId: number, status: ReleaseStatus) => Promise<void>
}

const releaseStatusOptions: ReleaseStatus[] = ['Draft', 'Progress', 'Active']

const canTransitionTo = (currentStatus: ReleaseStatus, nextStatus: ReleaseStatus) => {
  if (currentStatus === nextStatus) return true

  switch (currentStatus) {
    case 'Draft':
      return nextStatus === 'Progress' || nextStatus === 'Active'
    case 'Progress':
      return nextStatus === 'Active'
    case 'Active':
      return false
    default:
      return false
  }
}

export function ReleasesModalStatus({
  opened,
  onClose,
  release,
  loading,
  onUpdateStatus,
}: ReleasesModalStatusProps) {
  const [selectedStatus, setSelectedStatus] = useState<ReleaseStatus>('Draft')
  const [confirmOpened, confirmModal] = useDisclosure(false)

  useEffect(() => {
    if (release) {
      setSelectedStatus(release.status)
    }
  }, [release])

  const statusOptions = useMemo(() => {
    if (!release) return []

    return releaseStatusOptions.map(status => ({
      label: status,
      value: status,
      disabled: !canTransitionTo(release.status, status),
    }))
  }, [release])

  if (!release) return null

  const inputStyles = {
    input: {
      backgroundColor: '#FAF9F7',
      borderColor: '#EDEBE5',
      borderRadius: '8px',
      color: '#1A1A1F',
    },
    label: { color: '#8C8C94', fontWeight: 500, fontSize: '12px' },
    required: { color: '#8C8C94' },
  }

  const hasChanged = selectedStatus !== release.status
  const canUpdate = hasChanged && canTransitionTo(release.status, selectedStatus)

  const handleConfirmUpdate = async () => {
    await onUpdateStatus(release.releaseId, selectedStatus)
    confirmModal.close()
    onClose()
  }

  return (
    <>
      <ModalTemplate
        opened={opened}
        onClose={onClose}
        title="Status of release"
        testId="release-status-modal"
      >
        <Stack gap="md">
          <Group>
            <Text c="#8C8C94" fz={11} fw={600} w={120}>
              OBJECTIVE:
            </Text>
            <Text c="#1A1A1F" fz={12} fw={600}>
              {release.objective}
            </Text>
          </Group>

          <Group>
            <Text c="#8C8C94" fz={11} fw={600} w={120}>
              VERSION:
            </Text>
            <Text c="#1A1A1F" fz={12} fw={600}>
              {release.version}
            </Text>
          </Group>

          <Input.Wrapper label="STATUS" required styles={inputStyles}>
            <Select
              data={statusOptions}
              value={selectedStatus}
              allowDeselect={false}
              onChange={value => value && setSelectedStatus(value)}
              styles={inputStyles}
              data-testid="release-status-select"
            />
          </Input.Wrapper>

          <Group justify="flex-end" mt="xl">
            <Button
              bg="#F26621"
              color="#FFFFFF"
              disabled={!canUpdate}
              loading={loading}
              onClick={confirmModal.open}
              data-testid="release-status-update-btn"
            >
              Update
            </Button>
          </Group>
        </Stack>
      </ModalTemplate>

      <ModalTemplate
        opened={confirmOpened}
        onClose={confirmModal.close}
        title="Confirm status update"
        testId="release-status-confirm-modal"
      >
        <Stack gap="md">
          <Text ta="center" fw={700} c="#1A1A1F">
            ¿Estás seguro de actualizar el status de {release.title} de {release.status} a{' '}
            {selectedStatus}?
          </Text>

          <Group justify="center" mt="md">
            <Button
              bg="#F26621"
              color="#FFFFFF"
              loading={loading}
              onClick={() => void handleConfirmUpdate()}
              data-testid="release-status-confirm-btn"
            >
              Sí
            </Button>

            <Button
              variant="outline"
              bg="#FFFFFF"
              color="#8C8C94"
              disabled={loading}
              onClick={confirmModal.close}
              data-testid="release-status-cancel-btn"
            >
              No
            </Button>
          </Group>
        </Stack>
      </ModalTemplate>
    </>
  )
}
