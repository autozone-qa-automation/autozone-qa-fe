import { Alert, Button, Center, Stack, Text } from '@mantine/core'
import { IconDatabaseOff, IconRefresh } from '@tabler/icons-react'

export function ErrorPanel({
  error,
  refetch,
}: {
  error: string | null
  refetch?: () => Promise<void>
}) {
  return (
    <Center h={450}>
      <Alert
        variant="light"
        color="red"
        title="Connection Error"
        icon={<IconDatabaseOff size={24} />}
        radius="md"
        w={450}
      >
        <Stack gap="md">
          <Text size="sm">{error}</Text>
          {refetch && (
            <Button
              variant="outline"
              color="red"
              size="xs"
              leftSection={<IconRefresh size={14} />}
              onClick={() => void refetch()}
              w="fit-content"
            >
              Retry Connection
            </Button>
          )}
        </Stack>
      </Alert>
    </Center>
  )
}
