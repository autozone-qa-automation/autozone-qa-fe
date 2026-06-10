import { ActionIcon, Button, Group, Stack, Textarea, TextInput } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { IconTrash } from '@tabler/icons-react'
import { ModalTemplate } from '@/components/ui/ModalTemplate/ModalTemplate'
import { servicesService } from '@/services/services.service'
import type { CreateServiceRequest } from '@/types/service.types'

interface ServiceEditModalProps {
  service: {
    id: number
    name: string
    description?: string
    urls?: { idUrl?: number; nombre: string; url: string }[]
  }
  onSuccess?: () => Promise<void>
  opened?: boolean
  onClose?: () => void
}

const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

export function ServiceEditModal({
  service,
  onSuccess,
  opened: controlledOpened,
  onClose: controlledOnClose,
}: ServiceEditModalProps) {
  const isControlled = controlledOpened !== undefined
  const [internalOpened, { open, close: internalClose }] = useDisclosure(false)
  const opened = isControlled ? controlledOpened : internalOpened
  const close = isControlled ? (controlledOnClose ?? (() => {})) : internalClose

  type UrlItem = { idUrl?: number; nombre: string; url: string }

  const form = useForm<{ name: string; description?: string; urls: UrlItem[] }>({
    initialValues: {
      name: service.name ?? '',
      description: service.description ?? '',
      urls: service.urls
        ? service.urls.map(u => ({ idUrl: u.idUrl, nombre: u.nombre, url: u.url }))
        : [],
    },
    validate: {
      name: isNotEmpty('Name is required'),
    },
  })

  const handleSubmit = async (values: { name: string; description?: string; urls: UrlItem[] }) => {
    const urls = values.urls || []

    // Validar URLs vacías e inválidas
    for (let i = 0; i < urls.length; i++) {
      const urlItem = urls[i]
      if (!urlItem) continue

      const url = urlItem.url.trim()

      if (url === '') {
        form.setFieldError(`urls.${i}.url`, 'URL cannot be empty')
        notifications.show({
          title: 'Empty URL',
          message: 'Please enter a valid URL or remove the empty entry before saving.',
          color: 'yellow',
        })
        return
      }

      if (!isValidUrl(url)) {
        form.setFieldError(`urls.${i}.url`, 'Invalid URL format. Use http:// or https://')
        notifications.show({
          title: 'Invalid URL',
          message: `URL at row ${i + 1} is invalid. Use http:// or https://`,
          color: 'yellow',
        })
        return
      }
    }

    try {
      const payload: Partial<CreateServiceRequest> = {
        name: values.name,
        description: values.description,
        urls: urls.map(u => ({
          ...(u.idUrl ? { idUrl: u.idUrl } : {}),
          nombre: u.nombre,
          url: u.url,
        })),
      }

      await servicesService.update(service.id, payload)
      notifications.show({ title: 'Success', message: 'Service updated', color: 'teal' })
      close()
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
              <Group mb={6}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#8C8C94' }}>URLs</div>
              </Group>

              <Stack gap="sm">
                {form.values.urls.map((_u, i) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const idProps = form.getInputProps(`urls.${i}.idUrl` as any)
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const nombreProps = form.getInputProps(`urls.${i}.nombre` as any)
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const urlProps = form.getInputProps(`urls.${i}.url` as any)

                  return (
                    <Group key={i} align="flex-start">
                      <input type="hidden" {...idProps} />
                      <TextInput
                        placeholder="Nombre (e.g. Producción)"
                        style={{ flex: 1 }}
                        {...nombreProps}
                      />
                      <TextInput
                        placeholder="https://example.com"
                        style={{ flex: 2 }}
                        {...urlProps}
                      />
                      {!form.values.urls[i]?.idUrl && (
                        <ActionIcon
                          type="button"
                          color="red"
                          onClick={() => {
                            const next = form.values.urls.slice()
                            next.splice(i, 1)
                            form.setFieldValue('urls', next)
                          }}
                        >
                          <IconTrash size={16} />
                        </ActionIcon>
                      )}
                    </Group>
                  )
                })}
              </Stack>
            </div>

            <Group justify="flex-end" mt="xl">
              <Button
                type="button"
                variant="outline"
                color="gray"
                onClick={() => {
                  form.reset()
                  close()
                }}
              >
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
