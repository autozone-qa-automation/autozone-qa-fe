/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { ActionIcon, Box, Button, Group, Stack, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconPlus, IconX } from '@tabler/icons-react'
import { ModalTemplate } from '@/components/ui/ModalTemplate/ModalTemplate'
import { useCreateService } from '@/hooks/useCreateService'
import type { CreateServiceRequest } from '@/types/service.types'

const labelStyles = {
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#8C8C94',
  },
}

/**
 * Interface describing the
 * props the component waits for
 */
interface ServicesModalCreateProps {
  opened: boolean
  onClose: () => void
  onSuccess?: () => Promise<void>
}

/**
 * @function ServicesModalCreate - Controlled modal form for creating a new service
 * @param opened - Whether the modal is visible
 * @param onClose - Callback to close the modal
 * @param onSuccess - Called after a successful creation so the parent can refresh its list
 * @returns
 */
export function ServicesModalCreate({ opened, onClose, onSuccess }: ServicesModalCreateProps) {
  const { createService, loading } = useCreateService()

  /**
   * @function handleClose - Resets the form and closes the modal
   * @returns
   */
  const handleClose = () => {
    form.reset()
    onClose()
  }

  const form = useForm<CreateServiceRequest>({
    initialValues: {
      name: '',
      description: '',
      urls: [{ nombre: '', url: '' }],
    },
    validate: {
      name: value => (value.trim().length < 2 ? 'Name must be at least 2 characters' : null),
      urls: value => (value.length === 0 ? 'At least one URL is required' : null),
    },
    validateInputOnChange: true,
  })

  /**
   * @function handleSubmit - Submits the form to create a new service
   * @param values - Validated form values
   * @returns
   */
  const handleSubmit = async (values: CreateServiceRequest) => {
    try {
      await createService({
        name: values.name.trim(),
        description: values.description?.trim() || undefined,
        urls: values.urls,
      })
      notifications.show({
        title: 'Success!',
        message: 'Service created successfully',
        color: 'green',
      })
      form.reset()
      onClose()
      await onSuccess?.()
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err instanceof Error ? err.message : 'Unexpected error',
        color: 'red',
      })
    }
  }

  return (
    <ModalTemplate opened={opened} onClose={handleClose} title="New Service">
      <form onSubmit={form.onSubmit(handleSubmit)} data-testid="service-create-form">
        <Stack gap="md">
          <TextInput
            label="SERVICE NAME"
            placeholder="e.g. Payment API"
            withAsterisk
            {...form.getInputProps('name')}
            styles={{ label: labelStyles.label }}
            data-testid="service-name-input"
          />

          <Textarea
            label="DESCRIPTION"
            placeholder="Describe the service scope and purpose..."
            minRows={3}
            {...form.getInputProps('description')}
            styles={{ label: labelStyles.label }}
            data-testid="service-description-input"
          />

          <Stack gap="xs">
            {form.values.urls.map((_, index) => (
              <Group key={index} gap="xs" align="flex-end">
                <TextInput
                  label={index === 0 ? "URL'S" : undefined}
                  withAsterisk={index === 0}
                  placeholder="e.g. Repository"
                  style={{ flex: 1 }}
                  styles={{ label: labelStyles.label }}
                  {...form.getInputProps(`urls.${index}.nombre`)}
                  data-testid={`url-nombre-${index}`}
                />
                <TextInput
                  placeholder="https://..."
                  style={{ flex: 2 }}
                  {...form.getInputProps(`urls.${index}.url`)}
                  data-testid={`url-url-${index}`}
                />
                {form.values.urls.length > 1 ? (
                  index === 0 ? (
                    <Box w={36} />
                  ) : (
                    <ActionIcon
                      color="gray"
                      variant="subtle"
                      size={36}
                      onClick={() => form.removeListItem('urls', index)}
                      data-testid={`remove-url-${index}`}
                    >
                      <IconX size={16} />
                    </ActionIcon>
                  )
                ) : (
                  <Box w={28} />
                )}
              </Group>
            ))}
            <Button
              variant="light"
              color="orange"
              size="xs"
              leftSection={<IconPlus size={14} />}
              onClick={() => form.insertListItem('urls', { nombre: '', url: '' })}
              data-testid="add-url-btn"
            >
              Add URL
            </Button>
          </Stack>

          <Group justify="flex-end" mt="xl">
            <Button
              variant="outline"
              color="gray"
              radius="md"
              onClick={handleClose}
              disabled={loading}
              data-testid="service-cancel-btn"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              bg="#f46624"
              radius="md"
              loading={loading}
              data-testid="service-submit-btn"
            >
              Create Service
            </Button>
          </Group>
        </Stack>
      </form>
    </ModalTemplate>
  )
}
