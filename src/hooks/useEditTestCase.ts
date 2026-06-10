/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { useForm } from '@mantine/form'
import {
  type NotificationData,
  showNotification as mantineShowNotification,
} from '@mantine/notifications'
import { useEffect, useState } from 'react'
import { useFeatures } from '@/hooks/useFeatures'
import type { TestCaseVO } from '@/models/TestCaseVO'
import { testCaseService } from '@/services/testCasesService'
import type { CreateTestCaseRequest } from '@/types/TestCases.types'
import { createTestCaseSchema } from '@/types/TestCases.types'

const showNotification = (notification: NotificationData): string =>
  mantineShowNotification(notification)

type FormValues = CreateTestCaseRequest

interface UseEditTestCaseState {
  isLoading: boolean
  error: string | null
}

const resolveFeatureId = (testCase: TestCaseVO | null): number => {
  if (!testCase) return 0
  return testCase.relatedFeature ?? 0
}

export const useEditTestCase = (
  activeTestCase: TestCaseVO | null,
  onClose: () => void,
  onRefresh: () => Promise<void>
) => {
  const [state] = useState<UseEditTestCaseState>({
    isLoading: false,
    error: null,
  })

  const [loading, setLoading] = useState(false)
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null)
  const { features } = useFeatures()

  const form = useForm<FormValues>({
    initialValues: {
      title: activeTestCase?.title ?? '',
      relatedFeature: resolveFeatureId(activeTestCase),
      description: activeTestCase?.description ?? '',
      preconditions: activeTestCase?.preconditions ?? '',
      inputs: activeTestCase?.inputs ?? '',
      steps: activeTestCase?.steps ?? '',
      postconditions: activeTestCase?.postconditions ?? '',
      expectedOutput: activeTestCase?.expectedOutput ?? '',
      type: (activeTestCase?.type as FormValues['type']) ?? 'REGRESSION',
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

  const featuresOptions = features.map(f => ({
    label: f.featureName,
    value: String(f.id),
  }))

  const handleSubmit = async (values: FormValues) => {
    if (!activeTestCase) return

    try {
      setLoading(true)
      setFormErrorMessage(null)

      await testCaseService.update(activeTestCase.id, values)

      await onRefresh()

      showNotification({
        title: 'Test case updated',
        message: 'The test case was updated successfully.',
        color: 'green',
        position: 'top-right',
      })

      onClose()
    } catch (submitError) {
      let message = 'An error occurred while updating the test case.'

      if (submitError instanceof Error) {
        if (
          submitError.message.includes('409') ||
          submitError.message.toLowerCase().includes('duplicat')
        ) {
          message = 'A test case with that title already exists.'
        } else if (submitError.message.includes('404')) {
          message = 'The test case was not found.'
        } else if (submitError.message.includes('400')) {
          message = 'Invalid data. Please review the form fields.'
        } else {
          message = submitError.message
        }
      }

      setFormErrorMessage(message)

      showNotification({
        title: 'Could not update',
        message,
        color: 'red',
        position: 'top-right',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = async () => {
    const validation = form.validate()

    if (validation.hasErrors) {
      const message = 'Please fix the form errors before continuing.'
      setFormErrorMessage(message)

      showNotification({
        title: 'Invalid form',
        message,
        color: 'yellow',
        position: 'top-right',
      })

      return
    }

    await handleSubmit(form.values)
  }

  useEffect(() => {
    form.setValues({
      title: activeTestCase?.title ?? '',
      relatedFeature: resolveFeatureId(activeTestCase),
      description: activeTestCase?.description ?? '',
      preconditions: activeTestCase?.preconditions ?? '',
      inputs: activeTestCase?.inputs ?? '',
      steps: activeTestCase?.steps ?? '',
      postconditions: activeTestCase?.postconditions ?? '',
      expectedOutput: activeTestCase?.expectedOutput ?? '',
      type: (activeTestCase?.type as FormValues['type']) ?? 'REGRESSION',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTestCase])

  return { ...state, handleEditClick, featuresOptions, form, loading, formErrorMessage }
}
