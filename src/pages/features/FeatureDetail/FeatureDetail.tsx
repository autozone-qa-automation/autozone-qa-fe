/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Button, Container, Divider, Group, Stack, Text } from '@mantine/core'
import { useParams } from 'react-router'
import { TitleHeader } from '@/components/layout/TitleHeader/TitleHeader'
import { useFeature } from '@/hooks/useGetFeature'
import { TestCasesPanel } from './TestCasesPanel'

export function FeatureDetail() {
  const { featureId } = useParams()
  const { feature } = useFeature(featureId || '')

  return (
    <Container size="md" mt="md">
      <TitleHeader
        title={feature?.featureName || 'Feature Detail'}
        metaDetails={['']}
        breadcrumbs={[
          { title: 'Features', href: '/features' },
          { title: feature?.featureName || 'Feature Detail', href: '#' },
        ]}
        actionComponent={
          <Group gap="xs">
            <Button size="xs" color="orange.6">
              Edit
            </Button>
            <Button size="xs" color="red" variant="outline">
              Delete
            </Button>
          </Group>
        }
      />

      <Stack gap={4} mt="md" mb={'md'}>
        <Text fw={600} size="sm" c="dimmed" tt="uppercase">
          Description
        </Text>
        <Text size="sm">{feature?.featureDescription || 'Sin descripción'}</Text>
      </Stack>

      <Divider mb="md" mt="md" />

      <TestCasesPanel id={Number(featureId)} />
    </Container>
  )
}
