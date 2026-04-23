/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Autocomplete, Button, Container, Group, SimpleGrid, Stack } from '@mantine/core'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { useState } from 'react'
import { TitleHeader } from '@/components/layout/TitleHeader/TitleHeader'
import { useGetServices } from '@/hooks/servicesGetServices'
import type { Service } from '@/types/Service.types'
import { BaseCard } from './ServicesAdd'
import { ServicesList } from './ServicesCards'

export function Services() {
  const [searchQuery, setSearchQuery] = useState('')
  const { services, loading } = useGetServices()

  const handleAddService = () => {}

  return (
    <div>
      <TitleHeader
        title="Services"
        metaDetails={[loading ? 'Loading...' : `${services.length} services`, '0 test cases']}
        breadcrumbs={[{ title: 'Services', href: '/services' }]}
        actionComponent={
          <Button
            leftSection={<IconPlus size={16} stroke={2.5} />}
            color="orange.6"
            radius="md"
            size="md"
            fw={600}
            onClick={handleAddService}
          >
            Add Service
          </Button>
        }
      />

      <Container fluid px="md" mt="md">
        <Stack gap="md">
          <Group grow align="center">
            <Autocomplete
              placeholder="Search Services..."
              data={services?.map((s: Service) => s.name) || []}
              limit={5}
              ml="auto"
              size="xs"
              w="220px"
              value={searchQuery}
              onChange={setSearchQuery}
              leftSection={<IconSearch size={16} stroke={2.5} />}
            />
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
            <BaseCard onClick={handleAddService}>Add Service</BaseCard>

            <ServicesList searchQuery={searchQuery} />
          </SimpleGrid>
        </Stack>
      </Container>
    </div>
  )
}
