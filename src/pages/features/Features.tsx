/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Button } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { TitleHeader } from '@/components/layout/TitleHeader/TitleHeader'
import { useFeatures } from '@/hooks/useFeatures'
import { DropdownServices } from './DropdownServices'
import { FeaturesList } from './FeaturesList'

export function Features() {
  const { features, refetch, fetchFeaturesFiltered } = useFeatures()

  return (
    <div>
      <TitleHeader
        title="Features"
        metaDetails={['']}
        breadcrumbs={[{ title: 'Features', href: '#' }]}
        actionComponent={
          <Button
            leftSection={<IconPlus size={16} stroke={2.5} />}
            color="orange.6"
            radius="md"
            size="md"
            fw={600}
          >
            Add Feature
          </Button>
        }
      />

      <DropdownServices
        onChange={(id: string | null) => {
          if (!id) {
            refetch()
            return
          }

          void fetchFeaturesFiltered(id)
        }}
      />

      <FeaturesList data={features} />
    </div>
  )
}
