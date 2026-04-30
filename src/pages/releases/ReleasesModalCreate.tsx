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
  TagsInput,
  Textarea,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import { ModalTemplate } from '@/components/ui/ModalTemplate/ModalTemplate'
import { useCreateReleases } from '@/hooks/useCreateReleases'
import { useFeatures } from '@/hooks/useFeatures'
import { useGetServices } from '@/hooks/useGetServices'
import { ReleaseCreateVO } from '@/models/ReleaseCreateVO'
import type { FormValues } from '@/utils/schemas/release.schema'
import { releaseSchema } from '@/utils/schemas/release.schema'

interface ReleaseCreateModalInterface {
  handleOnClose: () => void
}

export function ReleasesModalCreate({ handleOnClose }: ReleaseCreateModalInterface) {
  const { postRelease } = useCreateReleases()
  const [opened, { open, close }] = useDisclosure(false)

  const { features } = useFeatures()
  const { services } = useGetServices()

  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm<FormValues>({
    initialValues: {
      releaseName: '',
      releaseDescription: '',
      releaseVersion: '',
      releaseStatus: 'Draft',
      releaseServiceId: null,
      releaseFeatureIds: [],
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
    try {
      setLoading(true)
      postRelease(
        new ReleaseCreateVO({
          ...values,
          releaseCreationDate: new Date().toISOString().split('T')[0],
        })
      )
      close()
      form.reset()
      handleOnClose()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
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
    .filter(f => f.idService === form.values.releaseServiceId)
    .map(f => ({
      label: f.featureName,
      value: String(f.id),
    }))

  return (
    <div>
      <Button color="orange.6" radius="md" onClick={open}>
        + New Release
      </Button>
      <ModalTemplate opened={opened} onClose={close} title="Create Release">
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

            <Select
              label="SERVICE"
              placeholder="Select a service..."
              data={servicesOptions}
              searchable
              withAsterisk
              value={form.values.releaseServiceId ? String(form.values.releaseServiceId) : null}
              onChange={value => {
                form.setFieldValue('releaseServiceId', value ? Number(value) : null)
                form.setFieldValue('releaseFeaturesIds', [])
              }}
              error={form.errors.releaseService}
              styles={inputStyles}
            />

            <MultiSelect
              label="FEATURES"
              placeholder={
                !form.values.releaseServiceId
                  ? 'Requires prior service selection...'
                  : 'Select features...'
              }
              data={featuresOptions}
              searchable
              hidePickedOptions
              withAsterisk
              disabled={!form.values.releaseServiceId}
              value={form.values.releaseFeatureIds.map(String)}
              onChange={values => form.setFieldValue('releaseFeatureIds', values.map(Number))}
              error={form.errors.releaseFeaturesIds}
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
              <Button variant="outline" bg="#FFFFFF" color="#8C8C94" onClick={() => close()}>
                Cancel
              </Button>
              <Button type="submit" bg="#F26621" color="#FFFFFF">
                {loading ? 'Cargando' : 'Create Release'}
              </Button>
            </Group>
          </Stack>
        </form>
      </ModalTemplate>
    </div>
  )
}
