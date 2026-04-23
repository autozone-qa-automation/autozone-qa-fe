/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Accordion, Button, Card, Group, Stack, Text } from '@mantine/core'

export interface FeatureItem {
  idFeature: number
  nombre: string
}

interface FeaturesListProps {
  data: FeatureItem[]
  onDeleteClick?: (id: number) => void
}

export function ServicesList({ data, onDeleteClick }: FeaturesListProps) {
  return (
    <Stack gap="sm">
      <Group justify="space-between">
        <Text fw={600} size="sm" c="dimmed" tt="uppercase">
          Features
        </Text>

        <Button size="xs" color="orange.6" radius="md">
          + Add Feature
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
                  Linked features
                </Text>
                <Text size="xs" opacity={0.8}>
                  • {data.length} features
                </Text>
              </Group>
            </Accordion.Control>

            <Accordion.Panel>
              <Stack gap={0} pt="xs">
                {data.map((feature, index) => (
                  <Group
                    key={feature.idFeature}
                    px="md"
                    py="sm"
                    justify="space-between"
                    style={{
                      borderBottom: index !== data.length - 1 ? '1px solid #eee' : 'none',
                    }}
                  >
                    <Group gap="sm">
                      <Text size="xs" c="orange.6" fw={700}>
                        F{feature.idFeature}
                      </Text>
                      <Text size="sm" fw={400}>
                        {feature.nombre}
                      </Text>
                    </Group>

                    <Button
                      size="xs"
                      color="red"
                      variant="subtle"
                      onClick={() => onDeleteClick?.(feature.idFeature)}
                    >
                      Eliminar
                    </Button>
                  </Group>
                ))}

                {data.length === 0 && (
                  <Text size="sm" p="md" c="dimmed" ta="center">
                    No hay features vinculadas para este servicio
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
