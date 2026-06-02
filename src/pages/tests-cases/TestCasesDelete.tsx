/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Button } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'
import type { TestCaseVO } from '@/models/TestCaseVO'
import { testCaseService } from '@/services/testCasesService'

interface TestCasesDeleteProps {
  testCase: TestCaseVO
  onDeleted?: (testCase: TestCaseVO) => void | Promise<void>
}

export function TestCasesDelete({ testCase, onDeleted }: TestCasesDeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      await testCaseService.deactivate(testCase.id)
      notifications.show({
        title: '¡Éxito!',
        message: 'Test case eliminado correctamente',
        color: 'green',
      })
      await onDeleted?.(testCase)
    } catch (err) {
      notifications.show({
        title: 'No se pudo eliminar el test case',
        message: err instanceof Error ? err.message : 'Ocurrió un error inesperado.',
        color: 'red',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      ml="auto"
      variant="filled"
      color="#FF0000"
      w={125}
      loading={isDeleting}
      disabled={isDeleting}
      onClick={() => {
        void handleDelete()
      }}
    >
      Delete
    </Button>
  )
}
