/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Modal } from '@mantine/core'

interface ModalProps {
  title?: string
  opened: boolean
  onClose: () => void
  children?: React.ReactNode
}

export function ModalTemplate({ title, opened, onClose, children }: ModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      radius={16}
      size={'40%'}
      padding="xl"
      styles={{
        title: {
          fontWeight: 700,
          fontSize: 26,
          color: '#1A1A1F',
          backgroundColor: '#FFFFFF',
        },
      }}
      centered
    >
      {children}
    </Modal>
  )
}
