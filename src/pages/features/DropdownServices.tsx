/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Select } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import { useGetServices } from '@/hooks/useGetServices'
import type { Service } from '@/types/service.types'

interface DropdownServicesProps {
  onChange?: (value: string | null) => void
}
export function DropdownServices({ onChange }: DropdownServicesProps) {
  const { services } = useGetServices()

  const serviceOptions = services.map((service: Service) => ({
    value: service.id.toString(),
    label: service.name,
  }))

  const options = [{ value: 'all', label: 'All' }, ...serviceOptions]

  return (
    <Select
      mb={'md'}
      placeholder="Order Management"
      searchable
      nothingFoundMessage="No options found"
      leftSection={<IconChevronDown size={14} stroke={2} />}
      rightSection={null}
      radius="md"
      data={options}
      onChange={onChange}
      styles={{
        input: {
          fontWeight: 500,
          width: 200,
          color: '#333',
          cursor: 'pointer',
        },
      }}
    />
  )
}
