/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Badge, Box, Button, Modal, Select, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'
import { useState } from 'react'
import { TitleHeader } from '@/components/layout/TitleHeader/TitleHeader'
import { useTestCases } from '@/hooks/useGetTestCases'
import type { TestCaseVO } from '@/models/TestCaseVO'
import { TestCasesList } from './TestCasesList'
import { TestCasesModalCreate } from './TestCasesModalCreate'

export function TestCases() {
  const { testCases: myTestCases, isLoading, error } = useTestCases()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const [opened, { open, close }] = useDisclosure(false)

  const [selectedTestCase, setSelectedTestCase] = useState<TestCaseVO | null>(null)

  const [selectedFeature, setSelectedFeature] = useState<string | null>('ALL')

  const handleViewClick = (testCase: TestCaseVO) => {
    setSelectedTestCase(testCase)
    open()
  }

  const handleClose = () => {
    setSelectedTestCase(null)
    close()
  }

  const featureOptions = [
    { value: 'ALL', label: 'All features' },
    ...Array.from(
      new Set(myTestCases.map(tc => tc.featureName ?? `Feature ${tc.relatedFeature}`))
    ).map(feature => ({
      value: feature,
      label: feature,
    })),
  ]

  const filteredTestCases =
    selectedFeature === 'ALL' || selectedFeature === null
      ? myTestCases
      : myTestCases.filter(
          tc => (tc.featureName ?? `Feature ${tc.relatedFeature}`) === selectedFeature
        )

  if (error) {
    return (
      <Text ta="center" mt="xl" c="red">
        Error loading test cases
      </Text>
    )
  }

  return (
    <div>
      <Modal.Root opened={opened} onClose={handleClose}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title fw={700} mb="lg" c="#1A1A1F">
              {selectedTestCase?.title}
            </Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <Stack gap={0}>
              <Text size="md" c="#8C8C94">
                ID
              </Text>
              <Text size="sm" c="#F26621" mb="xs">
                {selectedTestCase?.id}
              </Text>
              <Text size="md" c="#8C8C94">
                RELATED FEATURE
              </Text>
              <Text size="sm" c="#1A1A1F" mb="xs">
                {selectedTestCase?.featureName ?? selectedTestCase?.relatedFeature}
              </Text>
              <Text size="md" c="#8C8C94">
                DESCRIPTION
              </Text>
              <Text size="sm" c="#1A1A1F" mb="xs">
                {selectedTestCase?.description}
              </Text>
              <Text size="md" c="#8C8C94">
                TYPE
              </Text>
              <Badge
                color="#F26621"
                size="xl"
                radius="md"
                fz="sm"
                style={{ textTransform: 'capitalize' }}
                mb="xs"
              >
                {selectedTestCase?.type}
              </Badge>
              <Text size="md" c="#8C8C94">
                PRECONDITIONS
              </Text>
              <Text size="sm" c="#1A1A1F" mb="xs">
                {selectedTestCase?.preconditions}
              </Text>
              <Text size="md" c="#8C8C94">
                POSTCONDITIONS
              </Text>
              <Text size="sm" c="#1A1A1F" mb="xs">
                {selectedTestCase?.postconditions}
              </Text>
              <Text size="md" c="#8C8C94">
                INPUT
              </Text>
              <Text size="sm" c="#1A1A1F" mb="xs">
                {selectedTestCase?.inputs}
              </Text>
              <Text size="md" c="#8C8C94">
                STEPS
              </Text>
              <Text size="sm" c="#1A1A1F">
                {selectedTestCase?.steps}
              </Text>
              <Box h={50} />
              <Button ml="auto" variant="filled" color="#FF0000" w={125} onClick={() => {}}>
                Delete
              </Button>
            </Stack>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>

      <TitleHeader
        title="Test Cases"
        metaDetails={[`${myTestCases.length} test cases`]}
        breadcrumbs={[
          { title: 'Releases', href: '/releases' },
          { title: 'Services', href: '/services' },
          { title: 'Features', href: '/features' },
          { title: 'Test Cases', href: '#' },
        ]}
        actionComponent={
          <Button
            leftSection={<IconPlus size={16} stroke={2.5} />}
            color="orange.6"
            radius="md"
            size="md"
            fw={600}
            onClick={() => setIsCreateModalOpen(true)}
          >
            New Test Case
          </Button>
        }
      />

      <Select
        style={{ width: 250 }}
        placeholder="All features"
        data={featureOptions}
        value={selectedFeature}
        onChange={setSelectedFeature}
      />

      <TestCasesModalCreate
        opened={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)} // Cierra el modal de creación
      />

      {isLoading ? (
        <Text ta="center" c="#8C8C94" mt="xl" size="xl">
          Loading...
        </Text>
      ) : filteredTestCases.length === 0 ? (
        <Text ta="center" c="#8C8C94" mt="xl" size="xl">
          No test cases available
        </Text>
      ) : (
        <TestCasesList
          data={filteredTestCases}
          onViewClick={handleViewClick}
          onEditClick={() => {}}
        />
      )}
    </div>
  )
}
