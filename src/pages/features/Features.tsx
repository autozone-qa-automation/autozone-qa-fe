/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Text } from '@mantine/core'
import { TitleHeader } from '@/components/layout/TitleHeader/TitleHeader'
import { ConnectingDatabasePanel } from '@/components/ui/HandleStates/ConnectingDatabasePanel'
import { ErrorPanel } from '@/components/ui/HandleStates/ErrorPanel'
import { useFeatures } from '@/hooks/useFeatures'
import { DropdownServices } from './DropdownServices'
import { FeatureModalCreate } from './FeatureModalCreate'
import { FeaturesList } from './FeaturesList'

export function Features() {
  const { features, refetch, fetchFeaturesFiltered, error, isLoading } = useFeatures()

  if (features.length > 0) console.log("¿Qué propiedades tiene un feature aquí?:", features[0]);
  
  const activeFeatures = features.filter((f: any) => {
    const isFeatureActive = f.active ?? f.isActive ?? true;
    return isFeatureActive !== 0 && isFeatureActive !== false && isFeatureActive !== '0';
  });

  return (
    <div data-testid="features-page-container">
      <TitleHeader
        title="Features"
        metaDetails={['']}
        breadcrumbs={[ { title: 'Features', href: '#' } ]}
        actionComponent={<FeatureModalCreate onSuccess={refetch} />}
      />

      <DropdownServices
        onChange={(id: string | null) => {
          if (!id || id === 'all') {
            refetch()
            return
          }
          fetchFeaturesFiltered(id)
        }}
      />

      {isLoading && activeFeatures.length === 0 && <ConnectingDatabasePanel />}
      
      {error && <ErrorPanel error={error} />}
      
      {activeFeatures.length > 0 && !isLoading && !error && (
        <FeaturesList data={activeFeatures} />
      )}
      
      {!isLoading && activeFeatures.length === 0 && (
        <Text 
          data-testid="features-empty-message" 
          ta="center" 
          c="#8C8C94" 
          mt="xl" 
          size="xl"
        >
          No Features available
        </Text>
      )}
    </div>
  )
}