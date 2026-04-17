/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Badge, Button, Flex, Group, Indicator, Paper, Stack, Text } from '@mantine/core'

export type PriorityLevel = 'Low' | 'Medium' | 'High'
export type StatusLevel = 'Active' | 'Draft'

export interface FeatureItem {
  id: string
  name: string
  description: string
  testCount: number
  tags: string[]
  status: StatusLevel
  priority: PriorityLevel
}

interface FeaturesListProps {
  data: FeatureItem[]
  onViewClick?: (id: string) => void
  onEditClick?: (id: string) => void
}

const getPriorityColor = (priority: PriorityLevel) => {
  switch (priority) {
    case 'Low':
      return '#8C8C94'
    case 'Medium':
      return '#BF851A'
    case 'High':
      return '#F26621'
    default:
      return 'gray.5'
  }
}

export function FeaturesList({ data, onViewClick, onEditClick }: FeaturesListProps) {
  const items = data.map(feature => (
    <Paper
      key={feature.id}
      withBorder
      radius="md"
      p="md"
      style={{
        borderLeft: '4px solid #F26621',
      }}
    >
      <Flex justify="space-between" align="center" wrap="wrap" gap="md">
        <Stack gap={6}>
          <Group gap="xs" align="baseline">
            <Text c="#F26621" fw={700} size="lg">
              {feature.id}
            </Text>
            <Text c="dark.8" fw={700} size="lg">
              {feature.name}
            </Text>
          </Group>

          <Text c="dimmed" size="sm" mb={4}>
            {feature.description}
          </Text>

          <Group gap="sm">
            <Text c="dimmed" size="sm" fw={500}>
              {feature.testCount} Test Cases
            </Text>
            {feature.tags.map(tag => (
              <Badge
                key={tag}
                color="gray.2"
                c="gray.7"
                radius="sm"
                variant="filled"
                size="sm"
                style={{ textTransform: 'lowercase', fontWeight: 500 }}
              >
                {tag}
              </Badge>
            ))}
          </Group>
        </Stack>

        <Group gap="xl" wrap="nowrap" align="center">
          <Stack gap={8} align="flex-start" w={90}>
            <Badge
              color={feature.status === 'Active' ? '#E5F7ED' : '#FFF5EB'}
              c={feature.status === 'Active' ? '#1F8F4D' : '#BF851A'}
              radius="sm"
              style={{ textTransform: 'capitalize' }}
            >
              {feature.status}
            </Badge>

            <Group gap={6} wrap="nowrap">
              <Indicator
                size={10}
                color={getPriorityColor(feature.priority)}
                position="middle-center"
              />
              <Text c={getPriorityColor(feature.priority)} fw={500} size="sm">
                {feature.priority}
              </Text>
            </Group>
          </Stack>

          <Group gap={0} wrap="nowrap">
            <Button
              variant="subtle"
              size="sm"
              color="orange.7"
              fw={600}
              onClick={() => onViewClick?.(feature.id)}
            >
              View
            </Button>
            <Button
              variant="subtle"
              size="sm"
              color="gray.6"
              fw={600}
              onClick={() => onEditClick?.(feature.id)}
            >
              Edit
            </Button>
          </Group>
        </Group>
      </Flex>
    </Paper>
  ))

  return <Stack gap="md">{items}</Stack>
}
