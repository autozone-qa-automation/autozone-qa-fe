/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { ActionIcon, Button, Group, Stack, Textarea, TextInput } from '@mantine/core'
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

interface ServicesModalCreateProps {
  opened: boolean
  onClose: () => void
  onSuccess?: () => Promise<void>
}

export function ServicesModalCreate({ opened, onClose, onSuccess }: ServicesModalCreateProps) {
  const { createService, loading } = useCreateService()

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

  const handleSubmit = async (values: CreateServiceRequest) => {
    const result = await createService({
      name: values.name.trim(),
      description: values.description?.trim() || undefined,
      urls: values.urls,
    })

    if (result) {
      notifications.show({
        title: 'Success!',
        message: 'Service created successfully',
        color: 'teal',
      })
      form.reset()
      onClose()
      onSuccess?.()
    } else {
      notifications.show({
        title: 'Error',
        message: 'Failed to create service',
        color: 'red',
      })
    }
  }

  return (
    <ModalTemplate opened={opened} onClose={handleClose} title="New Service">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="SERVICE NAME"
            placeholder="e.g. Payment API"
            withAsterisk
            {...form.getInputProps('name')}
            styles={{ label: labelStyles.label }}
          />

          <Textarea
            label="DESCRIPTION"
            placeholder="Describe the service scope and purpose..."
            minRows={3}
            {...form.getInputProps('description')}
            styles={{ label: labelStyles.label }}
          />

          <Stack gap="xs">
            {form.values.urls.map((_, index) => (
              <Group key={index} gap="xs" align="flex-end">
                <TextInput
                  label={index === 0 ? "URL'S" : undefined}
                  withAsterisk={index === 0}
                  placeholder="Name (e.g. Swagger)"
                  style={{ flex: 1 }}
                  styles={{ label: labelStyles.label }}
                  error="Missing name"
                  {...form.getInputProps(`urls.${index}.nombre`)}
                />
                <TextInput
                  placeholder="https://..."
                  style={{ flex: 2 }}
                  {...form.getInputProps(`urls.${index}.url`)}
                />
                <ActionIcon
                  color="gray"
                  variant="subtle"
                  style={{ marginBottom: 5 }}
                  onClick={() => form.removeListItem('urls', index)}
                  disabled={form.values.urls.length === 1}
                >
                  <IconX size={16} />
                </ActionIcon>
              </Group>
            ))}
            <Button
              variant="light"
              color="orange"
              size="xs"
              leftSection={<IconPlus size={14} />}
              onClick={() => form.insertListItem('urls', { nombre: '', url: '' })}
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
            >
              Cancel
            </Button>
            <Button type="submit" bg="#f46624" radius="md" loading={loading}>
              Create Service
            </Button>
          </Group>
        </Stack>
      </form>
    </ModalTemplate>
  )
}
