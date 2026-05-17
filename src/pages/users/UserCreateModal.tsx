/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Button, Group, PasswordInput, Select, SimpleGrid, Stack, TextInput } from '@mantine/core'
import { isEmail, isNotEmpty, useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import bcrypt from 'bcryptjs'
import { useEffect, useState } from 'react'
import { ModalTemplate } from '@/components/ui/ModalTemplate/ModalTemplate'
import { roleService } from '@/services/role.service'
import { userService } from '@/services/user.service'
import type { UserRequest } from '@/types/user.types'

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
  const [roleOptions, setRoleOptions] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    if (!opened) return
    roleService
      .getAll()
      .then((roles: Array<{ id: number; permission: string }>) =>
        setRoleOptions(roles.map(r => ({ value: String(r.id), label: r.permission })))
      )
      .catch(() =>
        notifications.show({ title: 'Error', message: 'Failed to load roles', color: 'red' })
      )
  }, [opened])

  const form = useForm<UserRequest>({
    initialValues: {
      name: '',
      lastName: '',
      email: '',
      password: '',
      roleId: 0,
      isActive: true,
    },
    validate: {
      name: isNotEmpty('Name is required'),
      lastName: isNotEmpty('Last name is required'),
      email: isEmail('Valid email required'),
      password: isNotEmpty('Password is required'),
      roleId: v => (v > 0 ? null : 'Role is required'),
    },
  })

  const handleSubmit = async (values: UserRequest) => {
    setLoading(true)
    try {
      const hashedPassword = await bcrypt.hash(values.password, 10)
      await userService.create({ ...values, password: hashedPassword })
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
                {...form.getInputProps('lastName')}
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
              data={roleOptions}
              withAsterisk
              value={form.values.roleId !== 0 ? String(form.values.roleId) : null}
              onChange={v => form.setFieldValue('roleId', v ? parseInt(v) : 0)}
              error={form.errors.roleId}
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
