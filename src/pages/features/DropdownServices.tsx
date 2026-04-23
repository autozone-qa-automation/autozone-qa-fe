import { Select } from '@mantine/core'
import { IconChevronDown } from '@tabler/icons-react'
import { useGetServices } from '@/hooks/useGetServices'
import type { Service } from '@/types/service.types'

interface DropdownServicesProps {
  onChange?: (value: string | null) => void
}
export function DropdownServices({ onChange }: DropdownServicesProps) {
  const { services } = useGetServices()

  const options = services.map((service: Service) => ({
    value: service.id.toString(),
    label: service.name,
  }))

  return (
    <Select
      mb={'md'}
      placeholder="Order Management"
      searchable
      clearable
      nothingFoundMessage="No options found"
      rightSection={<IconChevronDown size={14} stroke={2} />}
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
