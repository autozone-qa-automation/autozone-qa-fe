import { Button } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'

interface UsersNewButtonProps {
  onClick?: () => void
}

export function UsersNewButton({ onClick }: UsersNewButtonProps) {
  return (
    <Button
      leftSection={<IconPlus size={16} stroke={2.5} />}
      radius="md"
      size="md"
      fw={600}
      style={{ backgroundColor: '#F97316' }}
      onClick={onClick}
    >
      New User
    </Button>
  )
}
