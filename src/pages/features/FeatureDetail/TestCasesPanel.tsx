/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Accordion, Button, Card, Group, Stack, Text, UnstyledButton } from '@mantine/core'
import { useGetTestCasesByFeature } from '@/hooks/useGetTestCasesByFeature'

export function TestCasesPanel({ id }: { id: number }) {
  const { testCases } = useGetTestCasesByFeature(id)

  return (
    <Stack gap="sm">
      <Group justify="space-between">
        <Text fw={600} size="sm" c="dimmed" tt="uppercase">
          Test Cases
        </Text>

        <Button size="xs" color="orange.6" radius="md">
          + Add Test Case
        </Button>
      </Group>

      <Card radius="md" padding={0} withBorder>
        <Accordion
          variant="filled"
          defaultValue="features"
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
          <Accordion.Item value="features" style={{ border: 'none' }}>
            <Accordion.Control>
              <Group gap="xs">
                <Text fw={500} size="sm">
                  Linked test cases
                </Text>
                <Text size="xs" opacity={0.8}>
                  • {testCases.length} test cases
                </Text>
              </Group>
            </Accordion.Control>

            <Accordion.Panel>
              <Stack gap={0}>
                {testCases.map((testCase, index) => (
                  <Group
                    key={testCase.id}
                    wrap="nowrap"
                    justify="space-between"
                    gap={0}
                    style={{
                      borderBottom: index !== testCases.length - 1 ? '1px solid #eee' : 'none',
                    }}
                  >
                    <UnstyledButton
                      component="a"
                      href={`#`}
                      p="sm"
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'background 0.2s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <Group gap="sm">
                        <Text size="xs" c="orange.6" fw={700}>
                          F{testCase.id}
                        </Text>
                        <Text size="sm" fw={400} c="dark">
                          {testCase.title}
                        </Text>
                      </Group>
                    </UnstyledButton>

                    <Button size="xs" color="red" variant="subtle" mr="md">
                      Eliminar
                    </Button>
                  </Group>
                ))}

                {testCases.length === 0 && (
                  <Text size="sm" p="md" c="dimmed" ta="center">
                    No hay test cases vinculados para este feature
                  </Text>
                )}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Card>
    </Stack>
  )
}
