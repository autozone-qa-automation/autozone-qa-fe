/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Button, Container, Divider, Group, Stack, Text } from '@mantine/core'
import { useState } from 'react'
import { useParams } from 'react-router'
import { TitleHeader } from '@/components/layout/TitleHeader/TitleHeader'
import { ModalTemplate } from '@/components/ui/ModalTemplate/ModalTemplate'
import { useDeactivateFeature } from '@/hooks/useDeactivateFeature'
import { useFeature } from '@/hooks/useGetFeature'
import { FeatureEditModal } from './FeatureEditModal'
import { TestCasesPanel } from './TestCasesPanel'

export function FeatureDetail() {
  const { featureId } = useParams()

  const { feature, refetch } = useFeature(featureId || '')
  const { deactivateFeature } = useDeactivateFeature()

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleConfirmDelete = async () => {
    if (featureId) {
      await deactivateFeature(featureId)
      setIsDeleteOpen(false)
    }
  }

  return (
    <Container data-testid="feature-detail-page" size="md" mt="md">
      <TitleHeader
        title={feature?.featureName || 'Feature Detail'}
        titleTestId="feature-detail-title"
        metaDetails={['']}
        breadcrumbs={[
          { title: 'Features', href: '/features' },
          { title: feature?.featureName || 'Feature Detail', href: '#' },
        ]}
        actionComponent={
          <Group gap="xs">
            <Button
              data-testid="feature-detail-edit-button"
              size="xs"
              color="orange.6"
              onClick={() => setIsEditOpen(true)}
            >
              Edit
            </Button>

            <Button
              data-testid="feature-detail-delete-trigger-button"
              size="xs"
              color="red"
              variant="outline"
              onClick={() => setIsDeleteOpen(true)}
            >
              Delete
            </Button>
          </Group>
        }
      />

      <FeatureEditModal
        opened={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        feature={feature}
        onUpdated={() => {
          void refetch()
          setIsEditOpen(false)
        }}
      />

      <ModalTemplate
        opened={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Confirm Deletion"
      >
        <Stack gap="md" mt="xs">
          <Text data-testid="feature-delete-modal-message" size="sm">
            Would you like to delete this feature?
          </Text>

          <Group justify="flex-end" gap="xs" mt="md">
            <Button
              data-testid="feature-delete-modal-cancel-button"
              variant="subtle"
              color="gray"
              size="xs"
              onClick={() => setIsDeleteOpen(false)}
            >
              Cancel
            </Button>

            <Button
              data-testid="feature-delete-modal-confirm-button"
              color="red"
              size="xs"
              onClick={() => {
                void handleConfirmDelete()
              }}
            >
              Confirm
            </Button>
          </Group>
        </Stack>
      </ModalTemplate>

      <Stack gap={4} mt="md" mb="md">
        <Text data-testid="feature-description-label" fw={600} size="sm" c="dimmed" tt="uppercase">
          Description
        </Text>

        <Text data-testid="feature-detail-description-text" size="sm">
          {feature?.featureDescription || 'Sin descripción'}
        </Text>
      </Stack>

      <Divider mb="md" mt="md" />

      <TestCasesPanel id={Number(featureId)} />
    </Container>
  )
}
