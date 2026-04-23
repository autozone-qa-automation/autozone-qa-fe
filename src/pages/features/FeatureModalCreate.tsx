/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Button, Group, Select, Stack, Textarea, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import { z } from 'zod'
import { ModalTemplate } from '@/components/ui/ModalTemplate/ModalTemplate'

const schema = z.object({
  featureName: z.string().min(1, { message: 'El nombre es obligatorio' }),
  description: z.string().optional().default(''),
  service: z.string().min(1, { message: 'Selecciona un servicio' }),
})

const labelStyles = {
  label: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#8C8C94',
  },
}

type FormValues = z.infer<typeof schema>

export function FeatureModalCreate() {
  const form = useForm<FormValues>({
    initialValues: {
      featureName: '',
      description: '',
      service: '',
    },
    validate: zodResolver(schema),
  })

  const handleSubmit = (values: FormValues) => {
    console.error(values)
  }

  return (
    <div>
      <ModalTemplate textButton="+ New Feature" title="New Feature">
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
              data={['Inventory Service', 'Auth Service', 'Payment Gateway']}
              withAsterisk
              {...form.getInputProps('service')}
              styles={{ label: labelStyles.label }}
            />

            <Textarea
              label="DESCRIPTION"
              placeholder="Describe the feature scope and purpose..."
              minRows={3}
              {...form.getInputProps('description')}
              styles={{ label: labelStyles.label }}
            />

            <Group justify="flex-end" mt="xl">
              <Button variant="outline" color="gray" radius="md" onClick={() => form.reset()}>
                Cancel
              </Button>
              <Button type="submit" bg="#f46624" radius="md">
                Create Feature
              </Button>
            </Group>
          </Stack>
        </form>
      </ModalTemplate>
    </div>
  )
}
