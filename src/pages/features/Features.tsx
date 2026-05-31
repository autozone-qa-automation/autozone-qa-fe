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
  // H: filtro post eliminación de feature para dejar sólo los features activos
  // Evaluamos contra 0, false y '0' para prevenir cualquier mapeo que haga el backend/Zod (me da miedo Zod).
  // FILTRO ULTRA-DEFENSIVO: Protege contra la conversión de isActive -> active de Spring/Jackson
  const activeFeatures = features.filter((f: any) => {
    // Si f.active existe, usa ese; si no, intenta con f.isActive. Si ninguno existe, asume true por defecto.
    const isFeatureActive = f.active ?? f.isActive ?? true;

    // Filtra eliminando los que sean 0, false o '0'
    return isFeatureActive !== 0 && isFeatureActive !== false && isFeatureActive !== '0';
  });

  return (
    <div>
      <TitleHeader
        title="Features"
        metaDetails={['']}
        breadcrumbs={[{ title: 'Features', href: '#' }]}
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
      
      {/*H: Cambio de "features" por "activeFeatures" para renderizar solo los válidos */}
      {activeFeatures.length > 0 && !isLoading && !error && (
        <FeaturesList data={activeFeatures} />
      )}
      
      {/* H: Cambio "features" por "activeFeatures" para mostrar el letrero vacío si se borraron todos */}
      {!isLoading && activeFeatures.length === 0 && (
        <Text ta="center" c="#8C8C94" mt="xl" size="xl">
          No Features available
        </Text>
      )}
    </div>
  )
}