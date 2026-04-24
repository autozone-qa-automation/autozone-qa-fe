/**
 * @file ButtonContentModal.tsx
 * @description Componente de tarjeta de release que incluye un modal detallado y cambio de estado.
 */

import { Badge, Box, Button, Divider, Group, Modal, Select, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

/**
 * Estados posibles para un Release.
 */
export type ReleaseStatus = 'Active' | 'Draft' | 'Progress'

/**
 * Estructura de datos que representa un Release.
 */
export interface ReleaseData {
  title: string
  objective: string
  version: string
  tags: string
  creationDate: string
  releaseDate: string
  status: ReleaseStatus
  service?: string
}

/**
 * Propiedades del componente ButtonContentModal.
 */
interface ButtonReleaseProps {
  /** Datos del release a mostrar */
  data: ReleaseData
  /** Callback opcional para manejar el cambio de estado en el Select */
  onStatusChange?: (newStatus: ReleaseStatus) => void
}

/**
 * Componente que renderiza una tarjeta informativa de Release.
 * Al hacer clic, abre un modal con información detallada y permite editar el estatus.
 * * @param {ButtonReleaseProps} props - Propiedades del componente.
 * @returns {JSX.Element} Componente visual de tarjeta y modal.
 */
export function ButtonContentModal({ data, onStatusChange }: ButtonReleaseProps) {
  const [opened, { open, close }] = useDisclosure(false)

  /**
   * Determina los colores de fondo y texto basados en el estado actual.
   * @param {ReleaseStatus} status - El estado del release.
   * @returns {{ bg: string, color: string }} Objeto con los estilos de color.
   */
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
    letterSpacing: 0.5,
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
                      minHeight: 24,
                      fontSize: 10,
                    },
                  }}
                />
              </Group>

              <Group align="flex-start">
                <Text style={labelStyle}>SERVICE:</Text>
                <Text style={valueStyle}>{data.service || '---'}</Text>
              </Group>
            </Stack>

            <Box mt={30} display="flex" style={{ justifyContent: 'flex-end' }}>
              <Button
                onClick={close}
                styles={{
                  root: {
                    backgroundColor: '#F26621',
                    borderRadius: 8,
                    height: 32,
                    padding: '0 25px',
                  },
                  label: { color: 'white', fontSize: 13, fontFamily: 'Inter', fontWeight: '600' },
                }}
              >
                Close
              </Button>
            </Box>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>

      <Box
        bg="#FFFFFF"
        onClick={open}
        w={360}
        style={{
          borderRadius: '12px',
          border: '1px solid #EDEBE5',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{ fontSize: '15px', fontFamily: 'Inter', fontWeight: '600', color: '#1A1A1F' }}
            >
              {data.title}
            </span>

            <Box
              bg={statusBg}
              px={10}
              h="18px"
              style={{
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'Inter',
                  fontWeight: '600',
                  color: statusColor,
                }}
              >
                {data.status}
              </span>
            </Box>
          </div>

          <Group gap={8}>
            <span
              style={{ fontSize: '12px', fontFamily: 'Inter', fontWeight: '400', color: '#8C8C94' }}
            >
              {data.version}
            </span>
            <Divider orientation="vertical" h={12} />
            <span
              style={{ fontSize: '11px', fontFamily: 'Inter', fontWeight: '600', color: '#F26621' }}
            >
              {data.service || 'Global'}
            </span>
          </Group>
        </div>

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

        <div
          style={{
            width: '100%',
            height: '1px',
            backgroundColor: '#EDEBE5',
            marginTop: '16px',
            marginBottom: '16px',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'row', gap: '18px', alignItems: 'center' }}>
          <span
            style={{ fontSize: '11px', fontFamily: 'Inter', fontWeight: '400', color: '#8C8C94' }}
          >
            Launch Date: {data.creationDate}
          </span>
          <span
            style={{ fontSize: '11px', fontFamily: 'Inter', fontWeight: '400', color: '#8C8C94' }}
          >
            Release Date: {data.releaseDate}
          </span>
        </div>
      </Box>
    </>
  )
}
