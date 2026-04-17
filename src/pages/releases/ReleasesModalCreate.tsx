/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import {
  Button,
  Group,
  MultiSelect,
  SegmentedControl,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { zodResolver } from 'mantine-form-zod-resolver'
import { z } from 'zod'
import { ModalTemplate } from '@/components/ui/ModalTemplate/ModalTemplate'

// 1. Definición del Schema con Zod
const schema = z.object({
  releaseName: z.string().min(1, { message: 'El nombre es obligatorio' }),
  objective: z.string().optional().default(''),
  version: z.string().min(1, { message: 'La versión es obligatoria' }),
  status: z.enum(['Draft', 'Active']),
  service: z.string().min(1, { message: 'Selecciona un servicio' }),
  tags: z.array(z.string()).default([]),
})

// 2. Extracción del tipo del Schema para TypeScript
type FormValues = z.infer<typeof schema>

export function ReleasesModalCreate() {
  // 3. Inicialización del formulario con el tipo inferido
  const form = useForm<FormValues>({
    initialValues: {
      releaseName: '',
      objective: '',
      version: '',
      status: 'Draft',
      service: '',
      tags: [],
    },
    validate: zodResolver(schema),
  })

  const handleSubmit = (values: FormValues) => {
    console.error(values)
  }

  return (
    <div>
      <ModalTemplate textButton="+ New Release" title="Create Release">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label="RELEASE NAME"
              placeholder="e.g. Q4 Performance Patch"
              withAsterisk
              {...form.getInputProps('releaseName')}
            />

            <Textarea
              label="OBJECTIVE"
              placeholder="Describe the purpose of this release..."
              minRows={3}
              {...form.getInputProps('objective')}
            />

            <Group grow>
              <TextInput
                label="VERSION"
                placeholder="2.1.0"
                withAsterisk
                {...form.getInputProps('version')}
              />
              {/* Placeholder visual según diseño original */}
              <TextInput label="STATUS" placeholder="" disabled />
            </Group>

            <Stack gap={4}>
              <Text size="sm" fw={500} c="dimmed">
                STATUS*
              </Text>
              <SegmentedControl
                fullWidth
                color="orange"
                data={[
                  { label: 'Draft', value: 'Draft' },
                  { label: 'Active', value: 'Active' },
                ]}
                {...form.getInputProps('status')}
                styles={{
                  root: { backgroundColor: '#f8f9fa' },
                  indicator: { backgroundColor: '#f46624' },
                }}
              />
            </Stack>

            <Select
              label="SERVICE"
              placeholder="Select a service..."
              data={['Inventory Service', 'Auth Service', 'Payment Gateway']}
              withAsterisk
              {...form.getInputProps('service')}
            />

            <MultiSelect
              label="TAGS"
              placeholder="hotfix, retail..."
              data={['hotfix', 'retail', 'critical', 'ui-update']}
              searchable
              hidePickedOptions
              {...form.getInputProps('tags')}
            />

            <Group justify="flex-end" mt="xl">
              <Button variant="outline" color="gray" radius="md" onClick={() => form.reset()}>
                Cancel
              </Button>
              <Button type="submit" bg="#f46624" radius="md">
                Create Release
              </Button>
            </Group>
          </Stack>
        </form>
      </ModalTemplate>
    </div>
  )
}
