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
import type { User, UserRequest, UserResponse } from '@/types/user.types'

/**
 * Object encapsulating the
 * styles for the labels
 */
const labelStyles = {
  label: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#8C8C94',
    letterSpacing: '0.5px',
  },
}

/**
 * Interface describing the
 * props the components waits for
 */
interface UserCreateModalProps {
  onSuccess?: (createdUser?: UserResponse) => Promise<void> | void
  user?: User
  buttonLabel?: string
  showPassword?: boolean
  opened?: boolean
  onClose?: () => void
}

/**
 *
 * @function onSucces - Function triggered on submit success
 * @param user - A user information (for edit purposes)
 * @param buttonLabel - Text label for the modal
 * @param showPassword - Bool flag to either show or hide the password
 * @returns
 */
export function UserCreateModal({
  onSuccess,
  user,
  buttonLabel,
  showPassword = true,
  opened: controlledOpened,
  onClose: controlledOnClose,
}: UserCreateModalProps) {
  const isEdit = Boolean(user)
  const isControlled = controlledOpened !== undefined

  const [internalOpened, { open, close: internalClose }] = useDisclosure(false)
  const opened = isControlled ? controlledOpened : internalOpened
  const close = isControlled ? (controlledOnClose ?? (() => {})) : internalClose
  const [loading, setLoading] = useState(false)
  const [roleOptions, setRoleOptions] = useState<{ value: string; label: string }[]>([])

  /**
   * UseEffect to get all of the
   * avaliable roles once the modal opens
   */
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

  /**
   * Variable to hold the actual form data
   */
  const form = useForm<UserRequest>({
    initialValues: {
      name: user?.name ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      password: '',
      roleId: user?.roleId ?? 0,
      isActive: user?.isActive ?? true,
    },
    validate: {
      name: isNotEmpty('Name is required'),
      lastName: isNotEmpty('Last name is required'),
      email: isEmail('Valid email required'),
      password: showPassword ? isNotEmpty('Password is required') : undefined,
      roleId: v => (v > 0 ? null : 'Role is required'),
    },
  })

  /**
   * Middleware function to trigger a submit
   * @param values - The edited user info
   */
  const handleSubmit = async (values: UserRequest) => {
    setLoading(true)
    try {
      if (isEdit && user?.id) {
        await userService.update(user.id, {
          name: values.name,
          lastName: values.lastName,
          email: values.email,
          roleId: values.roleId,
          isActive: values.isActive,
        })
        notifications.show({
          title: 'Success!',
          message: 'User updated successfully',
          color: 'teal',
        })
      } else {
        const hashedPassword = await bcrypt.hash(values.password, 10)
        const createdUser = await userService.create({ ...values, password: hashedPassword })
        notifications.show({
          title: 'Success!',
          message: 'User created successfully',
          color: 'teal',
        })
        form.reset()
        close()
        await onSuccess?.(createdUser)
        return
      }
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
      {!isControlled && (
        <Button color="orange.6" radius="md" onClick={open} data-testid="user-create-open-btn">
          {buttonLabel ?? '+ New User'}
        </Button>
      )}

      <ModalTemplate opened={opened} onClose={close} title={isEdit ? 'Edit User' : 'New User'}>
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

            {showPassword && (
              <PasswordInput
                label="PASSWORD"
                placeholder="Min. 8 characters"
                withAsterisk
                {...form.getInputProps('password')}
                styles={labelStyles}
                data-testid="user-password-input"
              />
            )}

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
                {isEdit ? 'Save Changes' : 'Create User'}
              </Button>
            </Group>
          </Stack>
        </form>
      </ModalTemplate>
    </div>
  )
}
