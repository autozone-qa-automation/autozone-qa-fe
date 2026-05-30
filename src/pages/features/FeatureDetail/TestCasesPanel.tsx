/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Accordion, Button, Card, Group, Stack, Text, UnstyledButton } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'
import { useGetTestCasesByFeature } from '@/hooks/useGetTestCasesByFeature'
import type { TestCaseVO } from '@/models/TestCaseVO'
import { testCaseService } from '@/services/testCasesService'

export function TestCasesPanel({ id }: { id: number }) {
  const { testCases, refetch } = useGetTestCasesByFeature(id)
  const [deletingTestCaseId, setDeletingTestCaseId] = useState<number | null>(null)
  const [deletedTestCaseIds, setDeletedTestCaseIds] = useState<Set<number>>(new Set())

  const handleDeleteTestCase = async (testCase: TestCaseVO) => {
    setDeletingTestCaseId(testCase.id)
    setDeletedTestCaseIds(prev => new Set(prev).add(testCase.id))

    try {
      await testCaseService.deactivate(testCase.id)
      notifications.show({
        title: '¡Éxito!',
        message: 'Test case eliminado correctamente',
        color: 'green',
      })
      await refetch()
    } catch (err) {
      notifications.show({
        title: 'No se pudo eliminar el test case',
        message: err instanceof Error ? err.message : 'Ocurrió un error inesperado.',
        color: 'red',
      })
      setDeletedTestCaseIds(prev => {
        const next = new Set(prev)
        next.delete(testCase.id)
        return next
      })
    } finally {
      setDeletingTestCaseId(null)
    }
  }

  const visibleTestCases = testCases.filter(
    testCase => testCase.active !== false && !deletedTestCaseIds.has(testCase.id)
  )

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
                  • {visibleTestCases.length} test cases
                </Text>
              </Group>
            </Accordion.Control>

            <Accordion.Panel>
              <Stack gap={0}>
                {visibleTestCases.map((testCase, index) => (
                  <Group
                    key={testCase.id}
                    wrap="nowrap"
                    justify="space-between"
                    gap={0}
                    style={{
                      borderBottom:
                        index !== visibleTestCases.length - 1 ? '1px solid #eee' : 'none',
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

                    <Button
                      type="button"
                      size="xs"
                      color="red"
                      variant="subtle"
                      mr="md"
                      loading={deletingTestCaseId === testCase.id}
                      disabled={deletingTestCaseId !== null}
                      onClick={event => {
                        event.preventDefault()
                        event.stopPropagation()
                        void handleDeleteTestCase(testCase)
                      }}
                    >
                      Eliminar
                    </Button>
                  </Group>
                ))}

                {visibleTestCases.length === 0 && (
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
