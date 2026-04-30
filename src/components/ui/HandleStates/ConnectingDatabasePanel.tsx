import { Center, Loader, Stack, Text } from '@mantine/core'

export function ConnectingDatabasePanel({ message }: { message?: string }) {
  return (
    <Center h={400}>
      <Stack align="center" gap="xs">
        <Loader color="orange.6" size="lg" type="dots" />
        <Text size="sm" c="dimmed" fw={500}>
          {message || 'Connecting to database...'}
        </Text>
      </Stack>
    </Center>
  )
}
