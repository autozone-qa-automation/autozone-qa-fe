/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Badge, Box, Button, Modal, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus } from '@tabler/icons-react'
import { useState } from 'react'
import { TitleHeader } from '@/components/layout/TitleHeader/TitleHeader'
import type { TestCaseItem } from './TestCasesList'
import { TestCasesList } from './TestCasesList'

export function TestCases() {
  const myTestCases: TestCaseItem[] = [
    {
      id: 'TC-0042',
      name: 'Validate Payment on Checkout',
      type: 'Regression',
      priority: 'High',
      status: 'Pass',
      feature: 'Checkout Flow',
      description: 'Verify that a user can complete payment using a valid credit card.',
      preconditions: 'User has items in cart',
      postconditions: 'Order is created successfully',
      inputs: 'Valid card number, expiration date, CVV',
      steps: 'Go to checkout, enter valid payment details, confirm payment, submit order',
      testCount: 1,
    },
    {
      id: 'TC-0043',
      name: 'Checkout with Guest User',
      type: 'Regression',
      priority: 'High',
      status: 'Pass',
      feature: 'Feature2',
      description: 'Description2',
      preconditions: 'Preconditions2',
      postconditions: 'Postconditions2',
      inputs: 'Inputs2',
      steps: 'Steps2',
      testCount: 2,
    },
    {
      id: 'TC-0044',
      name: 'Apply Discount Code',
      type: 'On Demand',
      priority: 'Medium',
      status: 'Fail',
      feature: 'Feature3',
      description: 'Description3',
      preconditions: 'Preconditions3',
      postconditions: 'Postconditions3',
      inputs: 'Inputs3',
      steps: 'Steps3',
      testCount: 3,
    },
    {
      id: 'TC-0045',
      name: 'Empty Cart Redirect',
      type: 'Regression',
      priority: 'Low',
      status: 'Pass',
      feature: 'Feature4',
      description: 'Description4',
      preconditions: 'Preconditions4',
      postconditions: 'Postconditions4',
      inputs: 'Inputs4',
      steps: 'Steps4',
      testCount: 4,
    },
    {
      id: 'TC-0046',
      name: 'Address Validation on Checkout',
      type: 'Regression',
      priority: 'High',
      status: 'Pass',
      feature: 'Feature5',
      description: 'Description5',
      preconditions: 'Preconditions5',
      postconditions: 'Postconditions5',
      inputs: 'Inputs5',
      steps: 'Steps5',
      testCount: 5,
    },
    {
      id: 'TC-0047',
      name: 'Payment Failure Handling',
      type: 'Regression',
      priority: 'Critical',
      status: 'Fail',
      feature: 'Feature6',
      description: 'Description6',
      preconditions: 'Preconditions6',
      postconditions: 'Postconditions6',
      inputs: 'Inputs6',
      steps: 'Steps6',
      testCount: 6,
    },
    {
      id: 'TC-0048',
      name: 'Order Summary Accuracy',
      type: 'On Demand',
      priority: 'Medium',
      status: 'Pass',
      feature: 'Feature7',
      description: 'Description7',
      preconditions: 'Preconditions7',
      postconditions: 'Postconditions7',
      inputs: 'Inputs7',
      steps: 'Steps7',
      testCount: 7,
    },
    {
      id: 'TC-0049',
      name: 'Tax Calculation Verification',
      type: 'Regression',
      priority: 'Medium',
      status: 'Pending',
      feature: 'Feature8',
      description: 'Description8',
      preconditions: 'Preconditions8',
      postconditions: 'Postconditions8',
      inputs: 'Inputs8',
      steps: 'Steps8',
      testCount: 8,
    },
  ]

  const [opened, { open, close }] = useDisclosure(false)

  const [selectedTestCase, setSelectedTestCase] = useState<TestCaseItem | null>(null)

  const handleViewClick = (testCase: TestCaseItem) => {
    setSelectedTestCase(testCase)
    open()
  }

  const handleClose = () => {
    setSelectedTestCase(null)
    close()
  }

  return (
    <div>
      <Modal.Root opened={opened} onClose={handleClose}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title fw={700} mb="lg" c="#1A1A1F">
              {selectedTestCase?.name}
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
                FEATURE RELACIONADO
              </Text>
              <Text size="sm" c="#1A1A1F" mb="xs">
                {selectedTestCase?.feature}
              </Text>
              <Text size="md" c="#8C8C94">
                DESCRIPCIÓN
              </Text>
              <Text size="sm" c="#1A1A1F" mb="xs">
                {selectedTestCase?.description}
              </Text>
              <Text size="md" c="#8C8C94">
                TIPO
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
                PRECONDICIONES
              </Text>
              <Text size="sm" c="#1A1A1F" mb="xs">
                {selectedTestCase?.preconditions}
              </Text>
              <Text size="md" c="#8C8C94">
                POSTCONDICIONES
              </Text>
              <Text size="sm" c="#1A1A1F" mb="xs">
                {selectedTestCase?.postconditions}
              </Text>
              <Text size="md" c="#8C8C94">
                ENTRADAS
              </Text>
              <Text size="sm" c="#1A1A1F" mb="xs">
                {selectedTestCase?.inputs}
              </Text>
              <Text size="md" c="#8C8C94">
                PASOS
              </Text>
              <Text size="sm" c="#1A1A1F">
                {selectedTestCase?.steps}
              </Text>
              <Box h={50} />
              <Button ml="auto" variant="filled" color="#F26621" w={125} onClick={handleClose}>
                Volver
              </Button>
            </Stack>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>

      <TitleHeader
        title="Checkout Flow — Test Cases"
        metaDetails={['12 test cases', 'Regression + On Demand']}
        breadcrumbs={[
          { title: 'Releases', href: '/releases' },
          { title: 'Q2 2026 Regression', href: '#' },
          { title: 'Order Management', href: '#' },
          { title: 'Features', href: '#' },
          { title: 'Checkout Flow', href: '#' },
          { title: 'Test Cases', href: '#' },
        ]}
        actionComponent={
          <Button
            leftSection={<IconPlus size={16} stroke={2.5} />}
            color="orange.6"
            radius="md"
            size="md"
            fw={600}
            onClick={open}
          >
            New Test Case
          </Button>
        }
      />

      <TestCasesList data={myTestCases} onViewClick={handleViewClick} onEditClick={() => { }} />
    </div>
  )
}
