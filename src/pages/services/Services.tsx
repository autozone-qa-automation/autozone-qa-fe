/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Autocomplete, Button, Container, Group, SimpleGrid, Stack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { useState } from 'react'
import { TitleHeader } from '@/components/layout/TitleHeader/TitleHeader'
import { useGetServices } from '@/hooks/useGetServices'
import type { Service } from '@/types/service.types'
import { BaseCard } from './ServicesAdd'
import { ServicesList } from './ServicesCards'
import { ServicesModalCreate } from './ServicesModalCreate'

export function Services() {
  const [searchQuery, setSearchQuery] = useState('')
  const { services, loading, error, refetch } = useGetServices()
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <div>
      <TitleHeader
        title="Services"
        metaDetails={[loading ? 'Loading...' : `${services.length} services`]}
        breadcrumbs={[{ title: 'Services', href: '/services' }]}
        actionComponent={
          <Button
            leftSection={<IconPlus size={16} stroke={2.5} />}
            color="orange.6"
            radius="md"
            onClick={open}
          >
            New Service
          </Button>
        }
      />

      <ServicesModalCreate opened={opened} onClose={close} onSuccess={refetch} />

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
            <BaseCard onClick={open}>New Service</BaseCard>

            <ServicesList
              searchQuery={searchQuery}
              services={services}
              loading={loading}
              error={error}
            />
          </SimpleGrid>
        </Stack>
      </Container>
    </div>
  )
}
