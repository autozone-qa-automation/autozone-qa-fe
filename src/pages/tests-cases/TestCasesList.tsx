/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Badge, Button, Group, Indicator, Table, Text } from '@mantine/core'

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical'
export type StatusLevel = 'Pass' | 'Fail' | 'Pending'
export type Type = 'Regression' | 'On Demand'

export interface TestCaseItem {
  id: string
  name: string
  type: Type
  priority: PriorityLevel
  status: StatusLevel
  feature: string
  description: string
  preconditions: string
  postconditions: string
  inputs: string
  steps: string
  testCount: number
}

interface TestCasesListProps {
  data: TestCaseItem[]
  onViewClick?: (testCase: TestCaseItem) => void
  onEditClick?: (id: string) => void
}

const getPriorityColor = (priority: PriorityLevel) => {
  switch (priority) {
    case 'Low':
      return '#8C8C94'
    case 'Medium':
      return '#BF851A'
    case 'High':
      return '#F26621'
    case 'Critical':
      return '#D93333'
    default:
      return 'gray.5'
  }
}

const statusStyles = {
  Pass: { color: '#E5F7ED', c: '#1F8F4D' },
  Fail: { color: '#FFEDED', c: '#D93333' },
  Pending: { color: '#FFF5EB', c: '#BF851A' },
}

export function TestCasesList({ data, onViewClick, onEditClick }: TestCasesListProps) {
  const items = data.map(testCase => (
    <Table.Tr key={testCase.id}>
      <Table.Td style={{ color: '#F26621' }}>{testCase.id}</Table.Td>
      <Table.Td style={{ color: '#1A1A1F' }}>{testCase.name}</Table.Td>
      <Table.Td>
        <Badge
          color={testCase.type === 'Regression' ? '#FFF4ED' : '#E5F7ED'}
          c={testCase.type === 'Regression' ? '#F26621' : '#1F8F4D'}
          radius="sm"
          style={{ textTransform: 'capitalize' }}
        >
          {testCase.type}
        </Badge>
      </Table.Td>
      <Table.Td style={{ textAlign: 'right' }}>
        <Button
          variant="subtle"
          size="sm"
          color="orange.7"
          fw={600}
          onClick={() => onViewClick?.(testCase)}
        >
          View
        </Button>
        <Button
          variant="subtle"
          size="sm"
          color="gray.6"
          fw={600}
          onClick={() => onEditClick?.(testCase.id)}
        >
          Edit
        </Button>
      </Table.Td>
    </Table.Tr>
  ))

  return (
    <Table highlightOnHover style={{ backgroundColor: '#ffffff', color: 'black' }}>
      <Table.Thead>
        <Table.Tr style={{ backgroundColor: '#F7F6F4', color: '#8C8C94' }}>
          <Table.Th>ID</Table.Th>
          <Table.Th>Test Case Name</Table.Th>
          <Table.Th>Type</Table.Th>
          <Table.Th style={{ textAlign: 'center' }}>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{items}</Table.Tbody>
    </Table>
  )
}
