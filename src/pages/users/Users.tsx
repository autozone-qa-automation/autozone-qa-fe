import { Flex, Stack, Text, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useEffect, useState } from 'react'
import { ConnectingDatabasePanel } from '@/components/ui/HandleStates/ConnectingDatabasePanel'
import { UsersList } from '@/components/users/UsersList'
import { UsersRoleFilter } from '@/components/users/UsersRoleFilter'
import { useGetAllUsers } from '@/hooks/userGetUsers'
import { UserCreateModal } from './UserCreateModal'

export function Users() {
  const { users, loading, error, refetch } = useGetAllUsers()
  const [selectedRole, setSelectedRole] = useState<string>('ALL')

  useEffect(() => {
    if (error) {
      notifications.show({
        title: 'Connection Error',
        message: error,
        color: 'red',
        autoClose: 5000,
      })
    }
  }, [error])

  const roleOptions = [
    { value: 'ALL', label: 'All Users' },
    ...Array.from(
      new Map(
        users.filter(u => u.rolePermission).map(u => [u.roleId, u.rolePermission!.permission])
      ).entries()
    ).map(([value, label]) => ({ value: String(value), label })),
  ]

  const filteredUsers =
    selectedRole === 'ALL' ? users : users.filter(u => u.roleId === Number(selectedRole))

  if (loading) return <ConnectingDatabasePanel />

  return (
    <Stack gap="lg" px="xl">
      <Flex justify="space-between" align="flex-end">
        <Stack gap={2}>
          <Text size="xs" c="dimmed" fw={500} tt="uppercase" lts={0.5}>
            User Management
          </Text>
          <Title order={1} size="h2" fw={900} c="dark.8">
            Users
          </Title>
          <Text size="sm" c="dimmed" fw={400}>
            {filteredUsers.length} users
          </Text>
        </Stack>
        <UserCreateModal onSuccess={refetch} />
      </Flex>

      <UsersRoleFilter data={roleOptions} value={selectedRole} onChange={setSelectedRole} />

      <UsersList data={filteredUsers} />
    </Stack>
  )
}
