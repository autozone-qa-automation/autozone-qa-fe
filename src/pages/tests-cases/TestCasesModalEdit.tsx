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
import { ModalTemplate } from '@/components/ui/ModalTemplate/ModalTemplate'
import { useEditTestCase } from '@/hooks/useEditTestCase'
import type { TestCaseVO } from '@/models/TestCaseVO'

interface Props {
  opened: boolean
  onClose: () => void
  activeTestCase: TestCaseVO | null
  onRefresh: () => Promise<void>
}

export function TestCasesModalEdit({ opened, onClose, activeTestCase, onRefresh }: Props) {
  const { form, formErrorMessage, handleEditClick, featuresOptions, loading } = useEditTestCase(
    activeTestCase,
    onClose,
    onRefresh
  )
  return (
    <div>
      <ModalTemplate title="Edit Test Case" opened={opened} onClose={onClose}>
        <form
          onSubmit={event => {
            event.preventDefault()
          }}
        >
          <Stack gap="md">
            <TextInput
              value={form.values.title}
              label="NAME"
              placeholder="e.g. User Login Validation"
              withAsterisk
              error={form.errors.title}
              {...form.getInputProps('title')}
            />

            <Select
              label="RELATED FEATURE"
              placeholder="Search or select a feature"
              data={featuresOptions}
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

            <Group justify="flex-end" mt="xl">
              <Button
                type="button"
                bg="#f46624"
                radius="md"
                loading={loading}
                onClick={() => {
                  void handleEditClick()
                }}
              >
                Save Changes
              </Button>
            </Group>
          </Stack>
        </form>
      </ModalTemplate>
    </div>
  )
}
