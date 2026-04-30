/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Button, Group, Select, Stack, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks' // <-- Agregado
import { notifications } from '@mantine/notifications'
import { ModalTemplate } from '@/components/ui/ModalTemplate/ModalTemplate'
import { useCreateFeature } from '@/hooks/useCreateFeature'
import { useFeatureFormResources } from '@/hooks/useFeatureFormResources'
import type { FormValues } from '@/utils/schemas/createFeature.schema'
import { featureSchema } from '@/utils/schemas/createFeature.schema'

const labelStyles = {
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#8C8C94',
  },
}

export function FeatureModalCreate({ onSuccess }: { onSuccess?: () => Promise<void> }) {
  // <-- Movimos el estado del modal aquí
  const [opened, { open, close }] = useDisclosure(false)

  const { createFeature, loading: creating } = useCreateFeature()
  const { servicesOptions, loading: loadingServices } = useFeatureFormResources()

  const form = useForm<FormValues>({
    initialValues: {
      featureName: '',
      description: '',
      idServices: '',
    },
    validate: values => {
      const result = featureSchema.safeParse(values)
      if (result.success) return {}
      const formErrors: Record<string, string> = {}
      result.error.issues.forEach(issue => {
        const path = issue.path.join('.')
        if (!formErrors[path]) formErrors[path] = issue.message
      })
      return formErrors
    },
    validateInputOnChange: true,
  })

  const handleSubmit = async (values: FormValues) => {
    const validation = featureSchema.safeParse(values)

    if (!validation.success) {
      notifications.show({
        title: 'Validation Error',
        message: 'Please check the form fields',
        color: 'red',
      })
      return
    }

    const payload = {
      featureName: values.featureName,
      featureDescription: values.description || '',
      idService: parseInt(values.idServices),
    }

    const result = await createFeature(payload)

    if (result) {
      notifications.show({
        title: 'Success!',
        message: 'Feature created successfully',
        color: 'teal',
      })
      form.reset()
      close() // <-- Cerramos el modal tras el éxito
      onSuccess?.()
    }
  }

  return (
    <div>
      {/* El botón para abrir el modal ahora vive aquí */}
      <Button color="orange.6" radius="md" onClick={open}>
        + New Feature
      </Button>

      {/* Pasamos opened y onClose al Template */}
      <ModalTemplate opened={opened} onClose={close} title="New Feature">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="FEATURE NAME"
              placeholder="e.g. Refund Processing"
              withAsterisk
              {...form.getInputProps('featureName')}
              styles={{ label: labelStyles.label }}
            />

            <Select
              label="SERVICE NAME"
              placeholder="Select a service..."
              data={servicesOptions}
              loading={loadingServices}
              disabled={loadingServices}
              withAsterisk
              {...form.getInputProps('idServices')}
              styles={{ label: labelStyles.label }}
              nothingFoundMessage="No services found"
              searchable
            />

            <Textarea
              label="DESCRIPTION"
              placeholder="Describe the feature scope and purpose..."
              minRows={3}
              {...form.getInputProps('description')}
              styles={{ label: labelStyles.label }}
            />

            <Group justify="flex-end" mt="xl">
              <Button
                variant="outline"
                color="gray"
                radius="md"
                // <-- Agregamos close() al botón de cancelar también
                onClick={() => {
                  form.reset()
                  close()
                }}
                disabled={creating || loadingServices}
              >
                Cancel
              </Button>
              <Button type="submit" bg="#f46624" radius="md" loading={creating}>
                Create Feature
              </Button>
            </Group>
          </Stack>
        </form>
      </ModalTemplate>
    </div>
  )
}
