/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Center, Stack } from '@mantine/core'
import { useNavigate } from 'react-router'
import { TestCasesModalCreate } from './TestCasesModalCreate'

export function TestCases() {
  const navigate = useNavigate()

  const gohome = () => {
    navigate('/')
  }
  return (
    <Center h="100vh">
      <Stack align="center">
        <h1>TestCases</h1>
        <button onClick={gohome}>go to home</button>
        <TestCasesModalCreate />
      </Stack>
    </Center>
  )
}
