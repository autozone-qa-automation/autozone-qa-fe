import { Button, Group, SimpleGrid, Stack, Textarea, TextInput, ActionIcon } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { ModalTemplate } from '@/components/ui/ModalTemplate/ModalTemplate'
import { servicesService } from '@/services/services.service'
import { IconPlus, IconTrash } from '@tabler/icons-react'

interface ServiceEditModalProps {
  service: { id: number; name: string; description?: string; urls?: { idUrl?: number; nombre: string; url: string }[] }
  onSuccess?: () => Promise<void>
  opened?: boolean
  onClose?: () => void
}

export function ServiceEditModal({ service, onSuccess, opened: controlledOpened, onClose: controlledOnClose }: ServiceEditModalProps) {
  const isControlled = controlledOpened !== undefined
  const [internalOpened, { open, close: internalClose }] = useDisclosure(false)
  const opened = isControlled ? controlledOpened : internalOpened
  const close = isControlled ? (controlledOnClose ?? (() => {})) : internalClose

  type UrlItem = { idUrl?: number; nombre: string; url: string }

  const form = useForm<{ name: string; description?: string; urls: UrlItem[] }>({
    initialValues: {
      name: service.name ?? '',
      description: service.description ?? '',
      urls: service.urls ? service.urls.map(u => ({ idUrl: u.idUrl, nombre: u.nombre, url: u.url })) : [],
    },
    validate: {
      name: isNotEmpty('Name is required'),
    },
  })

  const handleSubmit = async (values: { name: string; description?: string; urls: UrlItem[] }) => {
    const emptyUrlIndex = values.urls.findIndex(u => u.url.trim() === '')
    if (emptyUrlIndex !== -1) {
      form.setFieldError(`urls.${emptyUrlIndex}.url` as any, 'URL cannot be empty')
      notifications.show({
        title: 'Empty URL',
        message: 'Please enter a valid URL or remove the empty entry before saving.',
        color: 'yellow',
      })
      return
    }

    try {
      const payload: any = {
        name: values.name,
        description: values.description,
        urls: values.urls.map(u => ({ ...(u.idUrl ? { idUrl: u.idUrl } : {}), nombre: u.nombre, url: u.url })),
      }

      await servicesService.update(service.id, payload)
      notifications.show({ title: 'Success', message: 'Service updated', color: 'teal' })
      close()
      await onSuccess?.()
    } catch (err) {
      notifications.show({ title: 'Error', message: err instanceof Error ? err.message : 'Unexpected error', color: 'red' })
    }
  }

  return (
    <div>
      {!isControlled && (
        <Button color="orange.6" radius="md" onClick={open}>
          Edit Service
        </Button>
      )}

      <ModalTemplate opened={opened} onClose={close} title={`Edit Service`}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput label="NAME" withAsterisk {...form.getInputProps('name')} />

            <Textarea label="DESCRIPTION" minRows={4} {...form.getInputProps('description')} />

            <div>
              <Group position="apart" align="center" mb={6}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#8C8C94' }}>URLs</div>
                <Button size="xs" leftSection={<IconPlus size={14} />} onClick={() => {
                  const current = form.values.urls.slice()
                  current.push({ nombre: '', url: '' })
                  form.setFieldValue('urls', current)
                }}>
                  Add URL
                </Button>
              </Group>

              <Stack spacing="sm">
                {form.values.urls.map((u, i) => (
                  <Group key={i} align="flex-start">
                    <input type="hidden" {...form.getInputProps(`urls.${i}.idUrl` as any)} />
                    <TextInput placeholder="Nombre (e.g. Producción)" style={{ flex: 1 }} {...form.getInputProps(`urls.${i}.nombre` as any)} />
                    <TextInput placeholder="https://example.com" style={{ flex: 2 }} {...form.getInputProps(`urls.${i}.url` as any)} />
                    <ActionIcon color="red" onClick={() => {
                      const next = form.values.urls.slice()
                      next.splice(i, 1)
                      form.setFieldValue('urls', next)
                    }}>
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                ))}
              </Stack>
            </div>

            <Group position="right" mt="xl">
              <Button variant="outline" color="gray" onClick={() => { form.reset(); close() }}>
                Cancel
              </Button>
              <Button type="submit" bg="#f26621">
                Save Changes
              </Button>
            </Group>
          </Stack>
        </form>
      </ModalTemplate>
    </div>
  )
}

export default ServiceEditModal
