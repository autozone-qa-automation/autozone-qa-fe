/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { ActionIcon, Button, Divider, Group, Modal, Stack, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconAlertCircle, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { servicesService } from '@/services/services.service'

interface ServiceDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  serviceId: number
  serviceName: string
  onSuccess?: () => void
}

export function ServiceDeleteModal({
  isOpen,
  onClose,
  serviceId,
  serviceName,
  onSuccess,
}: ServiceDeleteModalProps) {
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    if (loading) return
    onClose()
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await servicesService.remove(serviceId)
      notifications.show({
        title: 'Service deleted',
        message: `${serviceName} has been deleted successfully.`,
        color: 'teal',
      })
      onSuccess?.()
      onClose()
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err instanceof Error ? err.message : 'Unexpected error',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      opened={isOpen}
      onClose={handleClose}
      withCloseButton={false}
      radius={16}
      size={420}
      padding="xl"
      centered
      closeOnEscape={!loading}
      closeOnClickOutside={!loading}
      aria-labelledby="delete-service-title"
    >
      <Stack gap="md">
        <Group align="flex-start" gap="sm" wrap="nowrap">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <IconAlertCircle size={20} color="#EF4444" stroke={2} />
          </div>

          <Stack gap={2} style={{ flex: 1 }}>
            <Text id="delete-service-title" fw={700} size="lg" c="#1A1A1F">
              Delete Service
            </Text>
            <Text size="sm" c="dimmed">
              Are you sure you want to delete
            </Text>
            <Text fw={700} c="dark.8">
              {serviceName}
            </Text>
          </Stack>

          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={handleClose}
            disabled={loading}
            aria-label="Close dialog"
          >
            <IconX size={16} />
          </ActionIcon>
        </Group>

        <Divider />

        <Text size="xs" c="red.6">
          This action cannot be undone.
        </Text>

        <Group justify="flex-end" gap="sm">
          <Button
            variant="outline"
            color="gray"
            radius="md"
            onClick={handleClose}
            disabled={loading}
            data-testid="delete-service-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            color="red.6"
            radius="md"
            loading={loading}
            onClick={() => void handleDelete()}
            data-testid="delete-service-confirm-btn"
          >
            Delete
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
