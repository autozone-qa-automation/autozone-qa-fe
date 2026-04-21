/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import {
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
import { zodResolver } from 'mantine-form-zod-resolver'
import { z } from 'zod'
import { ModalTemplate } from '@/components/ui/ModalTemplate/ModalTemplate'

const schema = z.object({
    title: z
        .string()
        .min(1, { message: 'El nombre es obligatorio' })
        .max(30, { message: 'El nombre no puede exceder los 30 caracteres' }),
    relatedFeature: z
        .number({ message: 'El feature es obligatorio' })
        .min(1, { message: 'El feature es obligatorio' }),
    description: z
        .string()
        .max(300, { message: 'Máximo 300 caracteres' })
        .optional().default(''),
    preconditions: z
        .string()
        .max(300, { message: 'Máximo 300 caracteres' })
        .optional().default(''),
    inputs: z
        .string()
        .max(300, { message: 'Máximo 150 caracteres' })
        .optional().default(''),
    steps: z
        .string()
        .min(1, { message: 'Los pasos son obligatorios' })
        .max(500, { message: 'Máximo 500 caracteres' }),
    postconditions: z
        .string()
        .max(300, { message: 'Máximo 300 caracteres' })
        .optional().default(''),
    outputs: z
        .string()
        .min(1, { message: 'La salida esperada es obligatoria' })
        .max(300, { message: 'Máximo 300 caracteres' }),
    type: z.enum(['Regression', 'On demand']),

})

type FormValues = z.infer<typeof schema>

const DUMMY_FEATURES = [
    { value: '1', label: 'Feature 1' },
    { value: '2', label: 'Feature 2' },
    { value: '3', label: 'Feature 3' },
]

export function TestCasesModalCreate() {

    const form = useForm<FormValues>({
        initialValues: {
            title: '',
            relatedFeature: 0,
            description: '',
            preconditions: '',
            inputs: '',
            steps: '',
            postconditions: '',
            outputs: '',
            type: 'Regression',
        },
        validate: zodResolver(schema),
    })

    const handleSubmit = (values: FormValues) => {
        console.error(values)
    }

    return (
        <div>
            <ModalTemplate textButton="+ New Test Case" title="Create Test Case ">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack gap="md">
                        <TextInput
                            label="TEST CASE NAME"
                            placeholder="e.g. User Login Validation"
                            withAsterisk
                            {...form.getInputProps('title')}
                        />
                        <TextInput
                            label="ID"
                            value="Se generará automáticamente"
                            readOnly
                        />


                        <Select
                            label="FEATURE RELACIONADO"
                            placeholder="Buscar o seleccionar feature"
                            data={DUMMY_FEATURES}
                            searchable
                            nothingFoundMessage="No se encontraron features"
                            withAsterisk
                            value={form.values.relatedFeature ? String(form.values.relatedFeature) : null}
                            onChange={(val) => form.setFieldValue('relatedFeature', val ? Number(val) : 0)}
                            error={form.errors.relatedFeature}
                        />

                        <Stack gap={4}>
                            <Text size="sm" fw={500} c="dimmed">
                                TIPO*
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
                            {...form.getInputProps('description')}
                        />

                        <Textarea
                            label="PRECONDICIONES"
                            placeholder="Define el estado antes del test..."
                            {...form.getInputProps('preconditions')}
                        />

                        <Textarea
                            label="ENTRADAS"
                            placeholder="Datos de entrada necesarios para ejecutar el test..."
                            {...form.getInputProps('inputs')}
                        />

                        <Textarea
                            label="PASOS"
                            placeholder="Describe cada uno de los pasos..."
                            withAsterisk
                            {...form.getInputProps('steps')}
                        />

                        <Textarea
                            label="POSTCONDICIONES"
                            placeholder="Define el estado esperado después del test..."
                            {...form.getInputProps('postconditions')}
                        />

                        <Textarea
                            label="SALIDA ESPERADA"
                            placeholder="Datos de salida esperados..."
                            {...form.getInputProps('outputs')}
                        />

                        <Group justify="flex-end" mt="xl">
                            <Button variant="outline" color="gray" radius="md" onClick={() => form.reset()}>
                                Cancelar
                            </Button>
                            <Button type="submit" bg="#f46624" radius="md">
                                Crear Test Case
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </ModalTemplate>
        </div>
    )
}
