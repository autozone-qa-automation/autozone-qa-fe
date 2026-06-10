import { ActionIcon, Button, Divider, Group, Modal, Stack, Text } from '@mantine/core'
import { IconAlertCircle, IconX } from '@tabler/icons-react'
import { useState } from 'react'

/**
 * DeleteModalTemplate component
 * Reusable confirmation dialog for delete actions
 */
interface DeleteModalTemplateProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  title: string
  entityName: string
  testIdPrefix?: string
  zIndex?: number
}

/**
 * Reusable modal component for confirming delete actions
 * @param isOpen - Controls whether the modal is visible
 * @param onClose - Function to call when the modal should be closed
 * @param onConfirm - Function to call when the delete action is confirmed
 * @param title - Title text displayed at the top of the modal
 * @param entityName - Name of the entity being deleted (for display purposes)
 * @param testIdPrefix - Optional prefix for test IDs in the modal (default: 'delete')
 * @param zIndex - Optional z-index for the modal (default: 400)
 * @returns The DeleteModalTemplate component
 */
export function DeleteModalTemplate({
  isOpen,
  onClose,
  onConfirm,
  title,
  entityName,
  testIdPrefix = 'delete',
  zIndex = 400,
}: DeleteModalTemplateProps) {
  const [loading, setLoading] = useState(false)

  const handleClose = () => {
    if (loading) return
    onClose()
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
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
      zIndex={zIndex}
      overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      closeOnEscape={!loading}
      closeOnClickOutside={!loading}
      aria-labelledby={`${testIdPrefix}-title`}
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
            <Text id={`${testIdPrefix}-title`} fw={700} size="lg" c="#1A1A1F">
              {title}
            </Text>
            <Text size="sm" c="dimmed">
              Are you sure you want to delete
            </Text>
            <Text fw={700} c="dark.8">
              {entityName}
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
            data-testid={`${testIdPrefix}-cancel-btn`}
          >
            Cancel
          </Button>
          <Button
            color="red.6"
            radius="md"
            loading={loading}
            onClick={() => void handleConfirm()}
            data-testid={`${testIdPrefix}-confirm-btn`}
          >
            Delete
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
