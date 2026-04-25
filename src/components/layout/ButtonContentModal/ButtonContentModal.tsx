/**
 * @file ButtonContentModal.tsx
 */

import { Badge, Box, Button, Divider, Group, Modal, Select, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

export type ReleaseStatus = 'Active' | 'Draft' | 'Progress'

export interface ReleaseData {
  title: string
  objective: string
  version: string
  tags: string
  creationDate: string
  releaseDate: string
  status: ReleaseStatus
  service?: string
  serviceId?: number | null // ID del servicio para el link dinámico
}

interface ButtonReleaseProps {
  data: ReleaseData
  onStatusChange?: (newStatus: ReleaseStatus) => void
}

export function ButtonContentModal({ data, onStatusChange }: ButtonReleaseProps) {
  const [opened, { open, close }] = useDisclosure(false)

  const getStatusStyles = (status: ReleaseStatus) => {
    switch (status) {
      case 'Active':
        return { bg: '#E5F7ED', color: '#1F8F4D' }
      case 'Progress':
        return { bg: '#FFF9DB', color: '#F59F00' }
      case 'Draft':
      default:
        return { bg: '#FEECEC', color: '#E03131' }
    }
  }

  const { bg: statusBg, color: statusColor } = getStatusStyles(data.status)

  const labelStyle = {
    color: '#8C8C94',
    fontSize: 11,
    fontFamily: 'Inter',
    fontWeight: 600 as const,
    width: 150,
  }
  const valueStyle = {
    color: '#1A1A1F',
    fontSize: 12,
    fontFamily: 'Inter',
    fontWeight: 600 as const,
  }
  const tagsArray = data.tags ? data.tags.split(',').map(t => t.trim()) : []

  return (
    <>
      <Modal.Root opened={opened} onClose={close} size={580} centered>
        <Modal.Overlay backgroundOpacity={0.55} blur={3} />
        <Modal.Content radius={16}>
          <Modal.Header px={32} pt={25} pb={15}>
            <Modal.Title
              style={{ color: '#1A1A1F', fontSize: 20, fontFamily: 'Inter', fontWeight: '700' }}
            >
              {data.title}
            </Modal.Title>
            <Modal.CloseButton iconSize={18} color="#8C8C94" />
          </Modal.Header>
          <Divider mx={32} color="#F0EDE8" />

          <Modal.Body px={32} py={24}>
            <Stack gap={12}>
              <Group align="flex-start">
                <Text style={labelStyle}>OBJECTIVE:</Text>
                <Text style={valueStyle}>{data.objective}</Text>
              </Group>
              <Group align="flex-start">
                <Text style={labelStyle}>VERSION:</Text>
                <Text style={valueStyle}>{data.version}</Text>
              </Group>
              <Group align="flex-start">
                <Text style={labelStyle}>TAGS:</Text>
                <Group gap={5}>
                  {tagsArray.map((tag, i) => (
                    <Badge key={i} variant="outline" color="gray" size="xs" radius="sm">
                      {tag}
                    </Badge>
                  ))}
                </Group>
              </Group>
              <Group align="flex-start">
                <Text style={labelStyle}>CREATION DATE:</Text>
                <Text style={valueStyle}>{data.creationDate}</Text>
              </Group>
              <Group align="flex-start">
                <Text style={labelStyle}>RELEASE DATE:</Text>
                <Text style={valueStyle}>{data.releaseDate}</Text>
              </Group>
              <Group align="center">
                <Text style={labelStyle}>STATUS:</Text>
                <Select
                  variant="filled"
                  size="xs"
                  radius="md"
                  data={['Active', 'Draft', 'Progress']}
                  value={data.status}
                  allowDeselect={false}
                  onChange={value => value && onStatusChange?.(value as ReleaseStatus)}
                  styles={{
                    input: {
                      backgroundColor: statusBg,
                      color: statusColor,
                      fontWeight: 700,
                      width: 120,
                      height: 24,
                      fontSize: 10,
                    },
                  }}
                />
              </Group>

              {/* LINK DINÁMICO EN MODAL */}
              <Group align="flex-start">
                <Text style={labelStyle}>SERVICE:</Text>
                {data.serviceId ? (
                  <Text
                    component="a"
                    href={`/services/${data.serviceId}`}
                    style={{ ...valueStyle, color: '#F26621', textDecoration: 'underline' }}
                  >
                    {data.service}
                  </Text>
                ) : (
                  <Text style={valueStyle}>---</Text>
                )}
              </Group>
            </Stack>
            <Box mt={30} display="flex" style={{ justifyContent: 'flex-end' }}>
              <Button onClick={close} color="orange.6" radius="md" size="xs">
                Close
              </Button>
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>

      {/* TARJETA VISIBLE */}
      <Box
        bg="#FFFFFF"
        onClick={open}
        w={360}
        style={{
          borderRadius: '12px',
          border: '1px solid #EDEBE5',
          padding: '16px',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text size="sm" fw={600} c="#1A1A1F">
            {data.title}
          </Text>
          <Badge bg={statusBg} c={statusColor} size="xs" radius="sm">
            {data.status}
          </Badge>
        </div>

        <Group gap={8} mt={4}>
          <Text size="xs" c="#8C8C94">
            {data.version}
          </Text>
          <Divider orientation="vertical" h={12} />
          {/* LINK DINÁMICO EN TARJETA */}
          {data.serviceId ? (
            <Text
              component="a"
              href={`/services/${data.serviceId}`}
              onClick={e => e.stopPropagation()}
              size="xs"
              fw={600}
              c="#F26621"
              style={{ textDecoration: 'none' }}
            >
              {data.service}
            </Text>
          ) : (
            <Text size="xs" fw={600} c="#F26621">
              Global
            </Text>
          )}
        </Group>

        <Group gap={4} mt={12}>
          {tagsArray.slice(0, 3).map((tag, i) => (
            <Badge
              key={i}
              variant="light"
              color="gray"
              size="xs"
              radius="xs"
              style={{ fontSize: '9px' }}
            >
              {tag}
            </Badge>
          ))}
        </Group>

        <Divider my={16} color="#EDEBE5" />

        <Group gap="xl">
          <Text size="xs" c="#8C8C94">
            L: {data.creationDate}
          </Text>
          <Text size="xs" c="#8C8C94">
            R: {data.releaseDate}
          </Text>
        </Group>
      </Box>
    </>
  )
}
