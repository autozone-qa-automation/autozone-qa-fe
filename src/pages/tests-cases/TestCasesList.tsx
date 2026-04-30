/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Badge, Button, Table } from '@mantine/core'
import type { TestCaseVO } from '@/models/TestCaseVO'

export type Type = 'REGRESSION' | 'ON DEMAND'

interface TestCasesListProps {
  data: TestCaseVO[]
  onViewClick?: (testCase: TestCaseVO) => void
  onEditClick?: (id: number) => void
}

export function TestCasesList({ data, onViewClick, onEditClick }: TestCasesListProps) {
  const items = data.map(testCase => (
    <Table.Tr key={testCase.id}>
      <Table.Td style={{ textAlign: 'center', color: '#F26621' }}>{testCase.id}</Table.Td>
      <Table.Td
        style={{
          whiteSpace: 'normal',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          color: '#1A1A1F',
        }}
      >
        {testCase.title}
      </Table.Td>
      <Table.Td style={{ textAlign: 'center' }}>
        <Badge
          color={testCase.type === 'REGRESSION' ? '#FFF4ED' : '#E5F7ED'}
          c={testCase.type === 'REGRESSION' ? '#F26621' : '#1F8F4D'}
          radius="sm"
          style={{ textTransform: 'capitalize' }}
        >
          {testCase.type}
        </Badge>
      </Table.Td>
      <Table.Td style={{ textAlign: 'center', color: '#1A1A1F' }}>
        {testCase.featureName ?? testCase.relatedFeature}
      </Table.Td>
      <Table.Td style={{ textAlign: 'center' }}>
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
    <Table
      highlightOnHover
      style={{ tableLayout: 'fixed', width: '100%', backgroundColor: '#ffffff', color: 'black' }}
    >
      <Table.Thead>
        <Table.Tr style={{ backgroundColor: '#F7F6F4', color: '#8C8C94' }}>
          <Table.Th style={{ width: '50px', textAlign: 'center' }}>ID</Table.Th>
          <Table.Th style={{ width: '300px' }}>Test Case Name</Table.Th>
          <Table.Th style={{ width: '100px', textAlign: 'center' }}>Type</Table.Th>
          <Table.Th style={{ width: '300px', textAlign: 'center' }}>Related feature</Table.Th>
          <Table.Th style={{ width: '150px', textAlign: 'center' }}>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{items}</Table.Tbody>
    </Table>
  )
}
