/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import {
  Autocomplete,
  Button,
  Container,
  Group,
  SegmentedControl,
  SimpleGrid,
  Stack,
} from '@mantine/core'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { useState } from 'react'
import { TitleHeader } from '@/components/layout/TitleHeader/TitleHeader'
import { BaseCard } from './ServicesAdd'
import { ServicesList } from './ServicesCards'

export function Services() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery] = useState('')

  return (
    <div>
      <TitleHeader
        title="Services"
        metaDetails={['0 services', '0 test cases']}
        breadcrumbs={[{ title: 'Services', href: '/services' }]}
        actionComponent={
          <Button
            leftSection={<IconPlus size={16} stroke={2.5} />}
            color="orange.6"
            radius="md"
            size="md"
            fw={600}
            onClick={() => console.log('Open modal')}
          >
            Add Service
          </Button>
        }
      />

      <Container fluid px="md" mt="md">
        <Stack gap="md">
          <Group grow align="center">
            <SegmentedControl
              value={activeFilter}
              onChange={setActiveFilter}
              data={[
                { label: 'All', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Draft', value: 'draft' },
                { label: 'Archived', value: 'archived' },
              ]}
              color="orange"
              style={{ flex: 2 }}
            />

            <Autocomplete
              placeholder="Search Services..."
              data={['Backend', 'Frontend', 'API']}
              limit={5}
              ml="auto"
              size="xs"
              w="220px"
              leftSection={<IconSearch size={16} stroke={2.5} />}
            />
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
            <BaseCard onClick={() => console.log('Add new service')}>Add Service</BaseCard>

            <ServicesList searchQuery={searchQuery} filter={activeFilter} />
          </SimpleGrid>
        </Stack>
      </Container>
    </div>
  )
}
