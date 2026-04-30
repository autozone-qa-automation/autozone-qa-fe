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
  Stack,
  TagsInput,
  Textarea,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { ModalTemplate } from '@/components/ui/ModalTemplate/ModalTemplate'
import { useCreateReleases } from '@/hooks/useCreateReleases'
import { useFeatures } from '@/hooks/useFeatures'
import { useGetServices } from '@/hooks/useGetServices'
import { ReleaseCreateVO } from '@/models/ReleaseCreateVO'
import type { FormValues } from '@/utils/schemas/release.schema'
import { releaseSchema } from '@/utils/schemas/release.schema'

export function ReleasesModalCreate() {
  const { postRelease } = useCreateReleases()

  const { features } = useFeatures()
  const { services } = useGetServices()

  const form = useForm<FormValues>({
    initialValues: {
      releaseName: '',
      releaseDescription: '',
      releaseVersion: '',
      releaseStatus: 'Draft',
      releaseService: [],
      releaseFeatures: [],
      releaseTags: [],
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

  const handleSubmit = (values: FormValues) => {
    postRelease(new ReleaseCreateVO(values))
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

  const servicesOptions = services.map(s => ({
    label: s.name,
    value: String(s.id),
  }))

  const featuresOptions = features
    .filter(f => form.values.releaseService.includes(f.idService))
    .map(f => ({
      label: f.featureName,
      value: String(f.id),
    }))

  return (
    <ModalTemplate title="+ New Release" opened={false} onClose={() => form.reset()}>
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
            {...form.getInputProps('releaseDescription')}
            error={form.errors.releaseDescription}
            styles={inputStyles}
          />

          <Group grow align="flex-start">
            <TextInput
              label="VERSION"
              withAsterisk
              placeholder="2.1.0"
              {...form.getInputProps('releaseVersion')}
              error={form.errors.releaseVersion}
              styles={inputStyles}
            />

            <Input.Wrapper
              label="STATUS"
              required
              error={form.errors.releaseStatus}
              styles={inputStyles}
            >
              <SegmentedControl
                w="100%"
                data={['Draft', 'Progress', 'Active']}
                {...form.getInputProps('releaseStatus')}
                styles={{
                  root: { backgroundColor: '#FAF9F7' },
                  indicator: { backgroundColor: '#F26621' },
                }}
              />
            </Input.Wrapper>
          </Group>

          <MultiSelect
            label="SERVICE"
            placeholder="Select a service..."
            data={servicesOptions}
            searchable
            hidePickedOptions
            withAsterisk
            value={form.values.releaseService.map(String)}
            onChange={values => {
              form.setFieldValue('releaseService', values.map(Number))
              form.setFieldValue('releaseFeatures', [])
            }}
            error={form.errors.releaseService}
            styles={inputStyles}
          />

          <MultiSelect
            label="FEATURES"
            placeholder={
              form.values.releaseService.length === 0
                ? 'Requires prior service selection...'
                : 'Select features...'
            }
            data={featuresOptions}
            searchable
            hidePickedOptions
            withAsterisk
            disabled={form.values.releaseService.length === 0}
            value={form.values.releaseFeatures.map(String)}
            onChange={values => form.setFieldValue('releaseFeatures', values.map(Number))}
            error={form.errors.releaseFeatures}
            styles={inputStyles}
          />

          <TagsInput
            label="TAGS"
            placeholder="Type a tag and press Enter..."
            clearable
            withAsterisk
            {...form.getInputProps('releaseTags')}
            error={form.errors.releaseTags}
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
