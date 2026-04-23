/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import './ReleasesModal.css'
import {
  Button,
  Group,
  Input,
  MultiSelect,
  SegmentedControl,
  Select,
  Stack,
  Textarea,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { ModalTemplate } from '@/components/ui/ModalTemplate/ModalTemplate'
import type { FormValues } from '@/utils/schemas/release.schema'
import { releaseSchema } from '@/utils/schemas/release.schema'

export function ReleasesModalCreate() {
  const form = useForm<FormValues>({
    initialValues: {
      releaseName: '',
      objective: '',
      version: '',
      status: 'Draft',
      service: '',
      features: [],
      tags: [],
    },
    validate: values => {
      const result = releaseSchema.safeParse(values)

      if (result.success) return {}

      const formErrors: Record<string, string> = {}
      result.error.issues.forEach(issue => {
        const path = issue.path.join('.')
        if (!formErrors[path]) {
          formErrors[path] = issue.message
        }
      })
      return formErrors
    },
    validateInputOnChange: true,
  })

  const handleSubmit = () => {
    form.reset()
  }
  const inputStyles = {
    input: {
      backgroundColor: '#FAF9F7',
      borderColor: '#EDEBE5',
      borderRadius: '8px',
      color: '#B2B2B8',
    },
    label: { color: '#8C8C94', fontWeight: 500, fontSize: '12px' },
    required: { color: '#8C8C94' },
  }

  return (
    <ModalTemplate textButton="+ New Release" title="Create Release">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label="RELEASE NAME"
            withAsterisk
            styles={inputStyles}
            placeholder="e.g. Q4 Performance Patch"
            {...form.getInputProps('releaseName')}
            error={form.errors.releaseName}
          />

          <Textarea
            label="OBJECTIVE"
            placeholder="Describe the purpose of this release..."
            minRows={3}
            {...form.getInputProps('objective')}
            error={form.errors.objective}
            styles={inputStyles}
          />

          <Group grow align="flex-start">
            <TextInput
              label="VERSION"
              withAsterisk
              placeholder="2.1.0"
              {...form.getInputProps('version')}
              error={form.errors.version}
              styles={inputStyles}
            />

            <Input.Wrapper label="STATUS" required error={form.errors.status} styles={inputStyles}>
              <SegmentedControl
                w="100%"
                data={['Draft', 'Progress', 'Active']}
                {...form.getInputProps('status')}
                styles={{
                  root: { backgroundColor: '#FAF9F7' },
                  indicator: { backgroundColor: '#F26621' },
                }}
              />
            </Input.Wrapper>
          </Group>

          <Select
            label="SERVICE"
            placeholder="Select a service..."
            data={['Inventory Service', 'Auth Service', 'Payment Gateway']}
            withAsterisk
            {...form.getInputProps('service')}
            error={form.errors.service}
            styles={inputStyles}
          />

          <MultiSelect
            label="FEATURES"
            placeholder={
              form.values.service ? 'Select features...' : 'Requires prior service selection...'
            }
            data={['Feature A', 'Feature B', 'Feature C']}
            searchable
            hidePickedOptions
            disabled={!form.getInputProps('service').value}
            {...form.getInputProps('features')}
            error={form.errors.features}
            styles={inputStyles}
          />

          <MultiSelect
            label="TAGS"
            placeholder="hotfix, retail..."
            data={['hotfix', 'retail', 'critical', 'ui-update']}
            searchable
            hidePickedOptions
            {...form.getInputProps('tags')}
            error={form.errors.tags}
            styles={inputStyles}
          />

          <Group justify="flex-end" mt="xl">
            <Button variant="outline" bg="#FFFFFF" color="#8C8C94" onClick={() => form.reset()}>
              Cancel
            </Button>
            <Button type="submit" bg="#F26621" color="#FFFFFF">
              Create Release
            </Button>
          </Group>
        </Stack>
      </form>
    </ModalTemplate>
  )
}
