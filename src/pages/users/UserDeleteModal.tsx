import { ActionIcon, Button, Divider, Group, Modal, Stack, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconAlertCircle, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { userService } from '@/services/user.service'

interface UserDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string | number
  userName: string
  onSuccess?: () => void
}

export function UserDeleteModal({
  isOpen,
  onClose,
  userId,
  userName,
  onSuccess,
}: UserDeleteModalProps) {
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    if (loading) return
    onClose()
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      await userService.deactivate(userId)
      notifications.show({
        title: 'User deactivated',
        message: `${userName} has been deactivated successfully.`,
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
      aria-labelledby="delete-user-title"
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
            <Text id="delete-user-title" fw={700} size="lg" c="#1A1A1F">
              Delete User
            </Text>
            <Text size="sm" c="dimmed">
              Are you sure you want to delete
            </Text>
            <Text fw={700} c="dark.8">
              {userName}
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
            data-testid="delete-user-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            color="red.6"
            radius="md"
            loading={loading}
            onClick={() => void handleDelete()}
            data-testid="delete-user-confirm-btn"
          >
            Delete
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
