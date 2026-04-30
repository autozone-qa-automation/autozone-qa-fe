/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import {
  Alert,
  Button,
  Group,
  SegmentedControl,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import {
  type NotificationData,
  showNotification as mantineShowNotification,
} from '@mantine/notifications'
import { useEffect, useState } from 'react'
import { ModalTemplate } from '@/components/ui/ModalTemplate/ModalTemplate'
import { useTestCases } from '@/hooks/useCreateTestCase'
import { featureService } from '@/services/features.service'
import type { Feature } from '@/types/feature.types'
import { type CreateTestCaseRequest, createTestCaseSchema } from '@/types/TestCases.types'

type FormValues = CreateTestCaseRequest
const showNotification = (notification: NotificationData): string =>
  (mantineShowNotification as (payload: NotificationData) => string)(notification)

interface Props {
  opened: boolean
  onClose: () => void
}
export function TestCasesModalCreate({ opened, onClose }: Props) {
  const [featureOptions, setFeatureOptions] = useState<{ value: string; label: string }[]>([])
  const { create, loading, error } = useTestCases()
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const features = await featureService.getAll()
        setFeatureOptions(
          features.map((f: Feature) => ({
            value: String(f.id),
            label: f.featureName,
          }))
        )
      } catch (err) {
        console.error('Error loading features', err)
      }
    }
    void loadFeatures()
  }, [])

  const form = useForm<FormValues>({
    initialValues: {
      title: '',
      relatedFeature: 0,
      description: '',
      preconditions: '',
      inputs: '',
      steps: '',
      postconditions: '',
      expectedOutput: '',
      type: 'REGRESSION',
    },
    validate: values => {
      const result = createTestCaseSchema.safeParse(values)
      if (result.success) {
        return {}
      }

      return result.error.issues.reduce<Record<string, string>>((acc, issue) => {
        const key = issue.path[0]
        if (typeof key === 'string' && !acc[key]) {
          acc[key] = issue.message
        }
        return acc
      }, {})
    },
    validateInputOnChange: true,
    validateInputOnBlur: true,
  })

  const handleSubmit = async (values: FormValues) => {
    try {
      setFormErrorMessage(null)
      const success = await create(values)
      if (success) {
        form.reset()
        showNotification({
          title: 'Test case created',
          message: 'The test case was created successfully.',
          color: 'green',
          position: 'top-right',
        })
      } else {
        showNotification({
          title: 'Could not create test case',
          message: error ?? 'An error occurred while creating the test case.',
          color: 'red',
          position: 'top-right',
        })
      }
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : 'Unexpected error occurred.'
      setFormErrorMessage(message)
      showNotification({
        title: 'Unexpected error',
        message,
        color: 'red',
        position: 'top-right',
      })
    }
  }

  const handleCreateClick = async () => {
    try {
      const validation = form.validate()
      if (validation.hasErrors) {
        const message = 'Please fix the validation errors before submitting the form.'
        setFormErrorMessage(message)
        showNotification({
          title: 'Invalid form',
          message,
          color: 'yellow',
          position: 'top-right',
        })
        return
      }
      setFormErrorMessage(null)
      await handleSubmit(form.values)
    } catch (validationError) {
      const message =
        validationError instanceof Error
          ? validationError.message
          : 'Form could not be submitted due to validation errors.'
      setFormErrorMessage(message)
      showNotification({
        title: 'Validation error',
        message,
        color: 'red',
        position: 'top-right',
      })
    }
  }

  return (
    <div>
      <ModalTemplate title="Create Test Case" opened={opened} onClose={onClose}>
        <form
          onSubmit={event => {
            event.preventDefault()
          }}
        >
          <Stack gap="md">
            <TextInput
              label="NAME"
              placeholder="e.g. User Login Validation"
              withAsterisk
              error={form.errors.title}
              {...form.getInputProps('title')}
            />

            {/*<TextInput label="ID" value="Automatically generated" placeholder="" disabled /> */}

            <Select
              label="RELATED FEATURE"
              placeholder="Search and select a related feature"
              data={featureOptions}
              searchable
              nothingFoundMessage="Features not found"
              withAsterisk
              value={form.values.relatedFeature ? String(form.values.relatedFeature) : null}
              onChange={val => form.setFieldValue('relatedFeature', val ? Number(val) : 0)}
              error={form.errors.relatedFeature}
            />

            <Stack gap={4}>
              <Text size="sm" fw={600} c="black">
                TYPE
              </Text>
              <SegmentedControl
                fullWidth
                color="orange"
                data={[
                  { label: 'Regression', value: 'REGRESSION' },
                  { label: 'On demand', value: 'ON_DEMAND' },
                ]}
                {...form.getInputProps('type')}
                styles={{
                  root: { backgroundColor: '#f8f9fa' },
                  indicator: { backgroundColor: '#f46624' },
                }}
              />
            </Stack>

            <Textarea
              label="DESCRIPTION"
              placeholder="Describe the test case in detail..."
              error={form.errors.description}
              {...form.getInputProps('description')}
            />

            <Textarea
              label="PRECONDITIONS"
              placeholder="Define the state required before executing the test..."
              error={form.errors.preconditions}
              {...form.getInputProps('preconditions')}
            />

            <Textarea
              label="INPUTS"
              placeholder="Inputs required for the test case..."
              error={form.errors.inputs}
              {...form.getInputProps('inputs')}
            />

            <Textarea
              label="STEPS"
              placeholder="Describe each step to execute the test case..."
              withAsterisk
              error={form.errors.steps}
              {...form.getInputProps('steps')}
            />

            <Textarea
              label="POSTCONDITIONS"
              placeholder="Define the state expected after executing the test..."
              error={form.errors.postconditions}
              {...form.getInputProps('postconditions')}
            />

            <Textarea
              label="EXPECTED OUTPUT"
              placeholder="Output expected after executing the test case..."
              withAsterisk
              error={form.errors.expectedOutput}
              {...form.getInputProps('expectedOutput')}
            />

            {formErrorMessage && <Alert color="yellow">{formErrorMessage}</Alert>}
            {error && <Alert color="red">{error}</Alert>}

            <Group justify="flex-end" mt="xl">
              <Button
                type="button"
                bg="#f46624"
                radius="md"
                loading={loading}
                onClick={() => {
                  void handleCreateClick()
                }}
              >
                Create Test Case
              </Button>
            </Group>
          </Stack>
        </form>
      </ModalTemplate>
    </div>
  )
}
