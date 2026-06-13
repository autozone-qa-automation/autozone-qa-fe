import { Box, Button, Group, Stack, Text, Textarea, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useEffect, useState } from 'react'
import { ModalTemplate } from '@/components/ui/ModalTemplate/ModalTemplate'
import { useUpdateFeature } from '@/hooks/useUpdateFeature'
import type { Feature } from '@/types/feature.types'

interface FeatureEditModalProps {
  opened: boolean
  onClose: () => void
  feature?: Feature
  onUpdated?: (feature: Feature) => void
}

export function FeatureEditModal({ opened, onClose, feature, onUpdated }: FeatureEditModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const { updateFeature, loading } = useUpdateFeature()
  const isFeatureLoaded = Boolean(feature?.id && feature?.idService)

  useEffect(() => {
    if (feature) {
      setName(feature.featureName)
      setDescription(feature.featureDescription)
    }
  }, [feature])

  const handleSave = async () => {
    if (!isFeatureLoaded || !feature) {
      return
    }

    try {
      const updatedFeature = await updateFeature(String(feature.id), {
        featureName: name,
        featureDescription: description,
        idService: feature.idService,
      })

      onUpdated?.(updatedFeature)

      notifications.show({
        title: 'Success!',
        message: 'Feature updated successfully',
        color: 'teal',
        'data-testid': 'feature-edit-success-notification',
      })

      onClose()
    } catch (error) {
      console.error(error)
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to update feature',
        color: 'red',
        'data-testid': 'feature-edit-error-notification',
      })
    }
  }

  return (
    <ModalTemplate
      title="Edit Feature"
      opened={opened}
      onClose={onClose}
      testId="feature-edit-modal"
    >
      <Stack gap="lg">
        <Box>
          <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb={6}>
            Feature Name*
          </Text>

          <TextInput
            data-testid="feature-edit-name-input"
            value={name}
            onChange={event => setName(event.currentTarget.value)}
            radius="md"
            size="md"
            styles={{
              input: {
                height: 44,
                borderColor: '#E5E7EB',
              },
            }}
          />
        </Box>

        <Box>
          <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb={6}>
            Description
          </Text>

          <Textarea
            data-testid="feature-edit-description-input"
            value={description}
            onChange={event => setDescription(event.currentTarget.value)}
            minRows={4}
            radius="md"
            autosize
            styles={{
              input: {
                borderColor: '#E5E7EB',
              },
            }}
          />
        </Box>

        <Group justify="flex-end" mt="md">
          <Button
            data-testid="feature-edit-cancel-button"
            variant="outline"
            color="gray"
            radius="md"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            data-testid="feature-edit-save-button"
            color="orange.6"
            radius="md"
            disabled={!isFeatureLoaded}
            loading={loading}
            onClick={() => {
              void handleSave()
            }}
          >
            Save changes
          </Button>
        </Group>
      </Stack>
    </ModalTemplate>
  )
}
