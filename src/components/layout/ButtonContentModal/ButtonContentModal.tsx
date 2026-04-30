/**
 * @file ButtonContentModal.tsx
 * @description Componente que renderiza una tarjeta de Release y un modal detallado.
 * Incluye lógica de estilos dinámicos basados en el estatus y navegación a servicios.
 * @author Tecnológico de Monterrey — Campus Chihuahua
 * @version 1.1.0 (2026)
 */

import { Badge, Box, Button, Divider, Group, Modal, Select, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

/** * Estatus permitidos para un Release.
 * @type {string}
 */
export type ReleaseStatus = 'Active' | 'Draft' | 'Progress'

/**
 * Interfaz que define la estructura de datos para la UI del Release.
 */
export interface ReleaseData {
  /** Nombre o título del lanzamiento */
  title: string
  /** Descripción del objetivo principal */
  objective: string
  /** Versión semántica (ej. 1.0.2) */
  version: string
  /** Cadena de texto con etiquetas separadas por comas */
  tags: string
  /** Fecha de creación en formato ISO o string legible */
  creationDate: string
  /** Fecha programada de lanzamiento */
  releaseDate: string
  /** Estatus actual del ciclo de vida */
  status: ReleaseStatus
  /** Nombre del servicio asociado (opcional) */
  service?: string
  /** ID único del servicio para redirección dinámica (opcional) */
  serviceId?: number | null
}

/**
 * Propiedades aceptadas por el componente ButtonContentModal.
 */
interface ButtonReleaseProps {
  /** Objeto de datos del release */
  data: ReleaseData
  /** Callback opcional para manejar el cambio de estatus desde el Select del modal */
  onStatusChange?: (newStatus: ReleaseStatus) => void
}

/**
 * Componente que muestra una tarjeta informativa que, al hacer clic, abre un modal con detalles.
 * * @param {ButtonReleaseProps} props - Propiedades del componente.
 * @returns {JSX.Element} Fragmento de React con Modal y Card.
 */
export function ButtonContentModal({ data, onStatusChange }: ButtonReleaseProps) {
  /** Hook para controlar el estado de apertura/cierre del modal */
  const [opened, { open, close }] = useDisclosure(false)

  /**
   * Determina los colores de fondo y texto basados en el estatus del release.
   * * @param {ReleaseStatus} status - Estatus del cual obtener estilos.
   * @returns {{bg: string, color: string}} Objeto con códigos hexadecimales.
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

  /** Estilos constantes para las etiquetas de información en el modal */
  const labelStyle = {
    color: '#8C8C94',
    fontSize: 11,
    fontFamily: 'Inter',
    fontWeight: 600 as const,
    width: 150,
  }

  /** Estilos constantes para los valores de información en el modal */
  const valueStyle = {
    color: '#1A1A1F',
    fontSize: 12,
    fontFamily: 'Inter',
    fontWeight: 600 as const,
  }

  /** Procesa el string de tags en un array para su renderizado individual */
  const tagsArray = data.tags ? data.tags.split(',').map(t => t.trim()) : []

  return (
    <>
      {/* SECCIÓN: MODAL DETALLADO */}
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

              {/* Redirección dinámica al servicio específico */}
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

      {/* SECCIÓN: TARJETA PREVIA (GRID VIEW) */}
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
          {/* Link dinámico: e.stopPropagation() previene que el clic abra también el modal */}
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

        {/* Muestra solo los primeros 3 tags en la vista de tarjeta */}
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
