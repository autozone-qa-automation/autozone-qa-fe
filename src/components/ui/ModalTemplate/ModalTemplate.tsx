/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Button, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

interface ModalProps {
  textButton: string
  title: string
  children?: React.ReactNode
}

export function ModalTemplate({ textButton, title, children }: ModalProps) {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
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

      <Button variant="default" onClick={open}>
        {textButton}
      </Button>
    </>
  )
}
