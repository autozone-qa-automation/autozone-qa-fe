/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Button, Group, PasswordInput, Select, SimpleGrid, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'
import { ModalTemplate } from '@/components/ui/ModalTemplate/ModalTemplate'
import { userService } from '@/services/user.service'
import type { UserRequest } from '@/types/user.types'

const ROLE_OPTIONS = [
  { value: '1', label: 'Developer' },
  { value: '2', label: 'System Admin' },
]

const labelStyles = {
  label: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#8C8C94',
    letterSpacing: '0.5px',
  },
}

export function UserCreateModal({ onSuccess }: { onSuccess?: () => Promise<void> }) {
  const [opened, { open, close }] = useDisclosure(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<UserRequest>({
    initialValues: {
      name: '',
      lastname: '',
      email: '',
      password: '',
      idRole: 0,
    },
  })

  const handleSubmit = async (values: UserRequest) => {
    setLoading(true)
    try {
      await userService.create(values)
      notifications.show({ title: 'Success!', message: 'User created successfully', color: 'teal' })
      form.reset()
      close()
      await onSuccess?.()
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err instanceof Error ? err.message : 'Unexpected error',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button color="orange.6" radius="md" onClick={open} data-testid="user-create-open-btn">
        + New User
      </Button>

      <ModalTemplate opened={opened} onClose={close} title="New User">
        <form onSubmit={form.onSubmit(handleSubmit)} data-testid="user-create-form">
          <Stack gap="md">
            <SimpleGrid cols={2}>
              <TextInput
                label="NAME"
                placeholder="e.g. Santiago"
                withAsterisk
                {...form.getInputProps('name')}
                styles={labelStyles}
                data-testid="user-name-input"
              />
              <TextInput
                label="LAST NAME"
                placeholder="e.g. Estrada"
                withAsterisk
                {...form.getInputProps('lastname')}
                styles={labelStyles}
                data-testid="user-lastname-input"
              />
            </SimpleGrid>

            <TextInput
              label="EMAIL"
              placeholder="e.g. s.estrada@testflow.io"
              withAsterisk
              {...form.getInputProps('email')}
              styles={labelStyles}
              data-testid="user-email-input"
            />

            <PasswordInput
              label="PASSWORD"
              placeholder="Min. 8 characters"
              withAsterisk
              {...form.getInputProps('password')}
              styles={labelStyles}
              data-testid="user-password-input"
            />

            <Select
              label="ROLE"
              placeholder="Select a role..."
              data={ROLE_OPTIONS}
              withAsterisk
              value={form.values.idRole !== 0 ? String(form.values.idRole) : null}
              onChange={v => form.setFieldValue('idRole', v ? parseInt(v) : 0)}
              error={form.errors.idRole}
              styles={labelStyles}
              data-testid="user-role-select"
            />

            <Group justify="flex-end" mt="xl">
              <Button
                variant="outline"
                color="gray"
                radius="md"
                onClick={() => {
                  form.reset()
                  close()
                }}
                disabled={loading}
                data-testid="user-cancel-btn"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                bg="#f26621"
                radius="md"
                loading={loading}
                data-testid="user-submit-btn"
              >
                Create User
              </Button>
            </Group>
          </Stack>
        </form>
      </ModalTemplate>
    </div>
  )
}
