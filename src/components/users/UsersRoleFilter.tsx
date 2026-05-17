import { Select } from '@mantine/core'

interface UsersRoleFilterProps {
  data: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}

export function UsersRoleFilter({ data, value, onChange }: UsersRoleFilterProps) {
  return (
    <Select
      data={data}
      value={value}
      onChange={v => onChange(v ?? 'ALL')}
      style={{ width: 200 }}
      radius="md"
      styles={{
        input: {
          backgroundColor: '#ffffff',
          border: '1.5px solid #D1D5DB',
          color: '#374151',
          fontWeight: 500,
        },
      }}
    />
  )
}
