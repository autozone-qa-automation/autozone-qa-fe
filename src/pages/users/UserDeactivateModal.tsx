import { Button, Group, Stack, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'
import { ModalTemplate } from '@/components/ui/ModalTemplate/ModalTemplate'
import { userService } from '@/services/user.service'
import type { User } from '@/types/user.types'

interface UserDeactivateModalProps {
  user: User
  onClose: () => void
  onSuccess?: () => Promise<void>
}

export function UserDeactivateModal({ user, onClose, onSuccess }: UserDeactivateModalProps) {
  const [loading, setLoading] = useState(false)

  const handleDeactivate = async () => {
    setLoading(true)
    try {
      await userService.update(user.id, { isActive: false })
      notifications.show({
        title: 'User deactivated',
        message: `${user.name} ${user.lastName} has been deactivated.`,
        color: 'teal',
      })
      onClose()
      await onSuccess?.()
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
    <ModalTemplate opened title="Deactivate User" onClose={onClose}>
      <Stack gap="lg">
        <Text size="sm" c="dimmed">
          Are you sure you want to deactivate{' '}
          <Text component="span" fw={600} c="dark.8">
            {user.name} {user.lastName}
          </Text>
          ? They will no longer be able to access the system. This action can be undone by editing
          the user.
        </Text>

        <Group justify="flex-end" mt="sm">
          <Button
            variant="outline"
            color="gray"
            radius="md"
            onClick={onClose}
            disabled={loading}
            data-testid="deactivate-cancel-btn"
          >
            Cancel
          </Button>
          <Button
            color="red.6"
            radius="md"
            loading={loading}
            onClick={handleDeactivate}
            data-testid="deactivate-confirm-btn"
          >
            Deactivate
          </Button>
        </Group>
      </Stack>
    </ModalTemplate>
  )
}
