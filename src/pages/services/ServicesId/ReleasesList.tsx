/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Accordion, Badge, Card, Group, Loader, Stack, Text } from '@mantine/core'
import type { ReleaseVO } from '@/models/ReleaseVO'

interface ReleasesListProps {
  releases: ReleaseVO[]
  loading: boolean
  error: string | null
}

export function ReleasesList({ releases, loading, error }: ReleasesListProps) {
  return (
    <Stack gap="sm">
      <Group justify="space-between">
        <Text fw={600} size="sm" c="dimmed" tt="uppercase">
          Last Releases
        </Text>
      </Group>

      <Card radius="md" padding={0} withBorder>
        <Accordion
          variant="filled"
          defaultValue="releases"
          styles={{
            control: {
              backgroundColor: 'var(--mantine-color-orange-6)',
              color: 'white',
              borderRadius: 'var(--mantine-radius-md) var(--mantine-radius-md) 0 0',
              '&:hover': {
                backgroundColor: 'var(--mantine-color-orange-7)',
              },
            },
            chevron: { color: 'white' },
          }}
        >
          <Accordion.Item value="releases" style={{ border: 'none' }}>
            <Accordion.Control>
              <Group gap="xs">
                <Text fw={500} size="sm">
                  Recent releases
                </Text>
                <Text size="xs" opacity={0.8}>
                  • {releases.length} releases
                </Text>
              </Group>
            </Accordion.Control>

            <Accordion.Panel>
              {loading ? (
                <Group gap="xs" p="md" justify="center">
                  <Loader size="xs" color="orange.6" />
                  <Text size="sm" c="dimmed">
                    Cargando releases...
                  </Text>
                </Group>
              ) : error ? (
                <Text size="sm" p="md" c="red" ta="center">
                  Error: {error}
                </Text>
              ) : releases.length === 0 ? (
                <Text size="sm" p="md" c="dimmed" ta="center">
                  No hay releases recientes para mostrar.
                </Text>
              ) : (
                <Stack gap={0}>
                  {releases.map((r, index) => (
                    <Group
                      key={r.releaseId}
                      wrap="nowrap"
                      justify="space-between"
                      gap={0}
                      p="sm"
                      style={{
                        borderBottom: index !== releases.length - 1 ? '1px solid #eee' : 'none',
                      }}
                    >
                      <Stack gap={2}>
                        <Text size="sm" fw={500}>
                          {r.releaseName}
                        </Text>
                        <Text size="xs" c="dimmed">
                          v{r.releaseVersion} ·{' '}
                          {new Date(r.releaseCreationDate).toLocaleDateString()}
                        </Text>
                      </Stack>
                      <Badge
                        color={
                          r.releaseStatus === 'Active'
                            ? 'teal'
                            : r.releaseStatus === 'Progress'
                              ? 'blue'
                              : 'gray'
                        }
                        variant="light"
                        size="sm"
                      >
                        {r.releaseStatus}
                      </Badge>
                    </Group>
                  ))}
                </Stack>
              )}
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Card>
    </Stack>
  )
}
