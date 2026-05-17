import { Badge, Button, Table } from '@mantine/core'
import type { User } from '@/types/user.types'

function roleBadgeStyle(permisionlevel: string | undefined): { bg: string; c: string } {
  const level = (permisionlevel ?? '').toLowerCase()
  if (level.includes('admin')) return { bg: '#F3EFFE', c: '#6D28D9' }
  if (level.includes('dev')) return { bg: '#FFF4EB', c: '#C2540A' }
  if (level.includes('read')) return { bg: '#ECFDF5', c: '#047857' }
  return { bg: '#F3F4F6', c: '#4B5563' }
}

interface UsersListProps {
  data: User[]
  onEditClick?: (user: User) => void
  onDeleteClick?: (user: User) => void
}

export function UsersList({ data, onEditClick, onDeleteClick }: UsersListProps) {
  const rows = data.map(user => {
    const roleLabel = user.role?.permisionlevel ?? `Role ${user.roleId}`
    const { bg, c } = roleBadgeStyle(user.role?.permisionlevel)

    return (
      <Table.Tr key={user.id}>
        <Table.Td style={{ color: '#F97316', fontWeight: 600, paddingLeft: 24 }}>
          {String(user.id).padStart(3, '0')}
        </Table.Td>
        <Table.Td style={{ color: '#111827', paddingLeft: 16 }}>
          {user.name} {user.lastName}
        </Table.Td>
        <Table.Td style={{ paddingLeft: 16, textAlign: 'center' }}>
          <Badge
            radius="sm"
            size="md"
            style={{
              backgroundColor: bg,
              color: c,
              textTransform: 'capitalize',
              border: 'none',
              fontWeight: 500,
              letterSpacing: 0.1,
            }}
          >
            {roleLabel}
          </Badge>
        </Table.Td>
        <Table.Td style={{ color: '#6B7280', textAlign: 'center', paddingLeft: 16 }}>
          {user.email}
        </Table.Td>
        <Table.Td style={{ textAlign: 'center' }}>
          <Button
            variant="subtle"
            size="xs"
            color="orange.6"
            fw={400}
            px={8}
            onClick={() => onEditClick?.(user)}
          >
            Edit
          </Button>
          <Button
            variant="subtle"
            size="xs"
            color="red.5"
            fw={400}
            px={8}
            onClick={() => onDeleteClick?.(user)}
          >
            Delete
          </Button>
        </Table.Td>
      </Table.Tr>
    )
  })

  return (
    <Table
      highlightOnHover
      withRowBorders={false}
      style={{ width: '100%', backgroundColor: '#ffffff' }}
    >
      <Table.Thead>
        <Table.Tr
          style={{
            backgroundColor: '#F7F6F4',
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <Table.Th
            style={{
              width: '80px',
              color: '#9CA3AF',
              fontWeight: 600,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              paddingLeft: 24,
            }}
          >
            ID
          </Table.Th>
          <Table.Th
            style={{
              color: '#9CA3AF',
              fontWeight: 600,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              paddingLeft: 16,
            }}
          >
            User Name
          </Table.Th>
          <Table.Th
            style={{
              width: '160px',
              color: '#9CA3AF',
              fontWeight: 600,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              textAlign: 'center',
              paddingLeft: 16,
            }}
          >
            Role
          </Table.Th>
          <Table.Th
            style={{
              color: '#9CA3AF',
              fontWeight: 600,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              textAlign: 'center',
              paddingLeft: 16,
            }}
          >
            Email
          </Table.Th>
          <Table.Th
            style={{
              width: '160px',
              color: '#9CA3AF',
              fontWeight: 600,
              fontSize: 12,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              textAlign: 'center',
            }}
          >
            Actions
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  )
}
