/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { TitleHeader } from '@/components/layout/TitleHeader/TitleHeader'
import { useFeatures } from '@/hooks/useFeatures'
import { FeaturesList } from './FeaturesList'

export function Features() {
  const { features } = useFeatures()

  return (
    <div>
      <TitleHeader
        title="Order Management"
        metaDetails={['']}
        breadcrumbs={[
          { title: 'Releases', href: '/releases' },
          { title: 'Q2 2026 Regression', href: '#' },
          { title: 'Order Management', href: '#' },
          { title: 'Features', href: '#' },
        ]}
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

      <FeaturesList data={features} />
    </div>
  )
}
