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
import { useState } from 'react'
import { ModalTemplate } from '@/components/ui/ModalTemplate/ModalTemplate'
import { useTestCases } from '@/hooks/useCreateTestCase'
import { type CreateTestCaseRequest, createTestCaseSchema } from '@/types/TestCases.types'

type FormValues = CreateTestCaseRequest
const showNotification = (notification: NotificationData): string =>
  (mantineShowNotification as (payload: NotificationData) => string)(notification)

export function TestCasesModalCreate() {
  const featureOptions = [
    { value: '1', label: 'Checkout Flow' },
    { value: '2', label: 'Order Confirmation' },
    { value: '3', label: 'Payment Gateway' },
    { value: '4', label: 'Order History' },
    { value: '5', label: 'Cart Management' },
  ]
  const { create, loading, error } = useTestCases()
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null)

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
      type: 'Regression',
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
          title: 'Test case creado',
          message: 'El test case se creó correctamente.',
          color: 'green',
          position: 'top-right',
        })
      } else {
        showNotification({
          title: 'No se pudo crear',
          message: error ?? 'Ocurrió un error al crear el test case.',
          color: 'red',
          position: 'top-right',
        })
      }
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : 'Error inesperado al crear.'
      setFormErrorMessage(message)
      showNotification({
        title: 'Error inesperado',
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
        const message = 'Corrige los errores del formulario para continuar.'
        setFormErrorMessage(message)
        showNotification({
          title: 'Formulario invalido',
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
          : 'No se pudo validar el formulario.'
      setFormErrorMessage(message)
      showNotification({
        title: 'Error de validacion',
        message,
        color: 'red',
        position: 'top-right',
      })
    }
  }

  return (
    <div>
      <ModalTemplate textButton="+ Nuevo Test Case" title="Crear Test Case ">
        <form
          onSubmit={event => {
            event.preventDefault()
          }}
        >
          <Stack gap="md">
            <TextInput
              label="NOMBRE"
              placeholder="e.g. User Login Validation"
              withAsterisk
              error={form.errors.title}
              {...form.getInputProps('title')}
            />

            <TextInput label="ID" value="Se generará automáticamente" placeholder="" disabled />

            <Select
              label="FEATURE RELACIONADO"
              placeholder="Buscar o seleccionar feature"
              data={featureOptions}
              searchable
              nothingFoundMessage="No se encontraron features"
              withAsterisk
              value={form.values.relatedFeature ? String(form.values.relatedFeature) : null}
              onChange={val => form.setFieldValue('relatedFeature', val ? Number(val) : 0)}
              error={form.errors.relatedFeature}
            />

            <Stack gap={4}>
              <Text size="sm" fw={600} c="black">
                TIPO
              </Text>
              <SegmentedControl
                fullWidth
                color="orange"
                data={[
                  { label: 'Regresión', value: 'Regression' },
                  { label: 'On demand', value: 'On demand' },
                ]}
                {...form.getInputProps('type')}
                styles={{
                  root: { backgroundColor: '#f8f9fa' },
                  indicator: { backgroundColor: '#f46624' },
                }}
              />
            </Stack>

            <Textarea
              label="DESCRIPCIÓN"
              placeholder="Descripción del test case..."
              error={form.errors.description}
              {...form.getInputProps('description')}
            />

            <Textarea
              label="PRECONDICIONES"
              placeholder="Define el estado antes del test..."
              error={form.errors.preconditions}
              {...form.getInputProps('preconditions')}
            />

            <Textarea
              label="ENTRADAS"
              placeholder="Datos de entrada necesarios para ejecutar el test..."
              error={form.errors.inputs}
              {...form.getInputProps('inputs')}
            />

            <Textarea
              label="PASOS"
              placeholder="Describe cada uno de los pasos..."
              withAsterisk
              error={form.errors.steps}
              {...form.getInputProps('steps')}
            />

            <Textarea
              label="POSTCONDICIONES"
              placeholder="Define el estado esperado después del test..."
              error={form.errors.postconditions}
              {...form.getInputProps('postconditions')}
            />

            <Textarea
              label="SALIDA ESPERADA"
              placeholder="Datos de salida esperados..."
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
                Crear Test Case
              </Button>
            </Group>
          </Stack>
        </form>
      </ModalTemplate>
    </div>
  )
}
