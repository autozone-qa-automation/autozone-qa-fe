/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Button, Flex, Group, Paper, Stack, Text } from '@mantine/core'
import { useNavigate } from 'react-router'
import type { Feature } from '@/types/feature.types'

interface FeaturesListProps {
  data: Feature[]
}

export function FeaturesList({ data }: FeaturesListProps) {
  const navigate = useNavigate()
  return (
    <Stack gap="md">
      {data.map(feature => (
        <Paper
          key={feature.id}
          withBorder
          radius="md"
          p="md"
          style={{ borderLeft: '4px solid #F26621' }}
        >
          <Flex justify="space-between" align="center" wrap="wrap" gap="md">
            <Stack gap={6}>
              <Group gap="xs" align="baseline">
                <Text c="#F26621" fw={700} size="lg">
                  {feature.id}
                </Text>
                <Text c="dark.8" fw={700} size="lg">
                  {feature.featureName}
                </Text>
              </Group>
              <Text c="dimmed" size="sm" mb={4}>
                {feature.featureDescription}
              </Text>
            </Stack>

            <Group gap="xl" wrap="nowrap" align="center">
              <Group gap={0} wrap="nowrap">
                <Button
                  variant="subtle"
                  size="sm"
                  color="orange.7"
                  fw={600}
                  onClick={() => {
                    navigate(`/features/${feature.id}`)
                  }}
                >
                  View
                </Button>
              </Group>
            </Group>
          </Flex>
        </Paper>
      ))}
    </Stack>
  )
}
