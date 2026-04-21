/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

<<<<<<< HEAD
import { Center, Stack } from '@mantine/core'
import { useNavigate } from 'react-router'
=======
import { useNavigate } from 'react-router'
import classes from './TestCases.module.css'
>>>>>>> c9802d57291a10d0f525b9ddcf63a8e6e949205b
import { TestCasesModalCreate } from './TestCasesModalCreate'

export function TestCases() {
  const navigate = useNavigate()

  const gohome = () => {
    navigate('/')
  }

  return (
<<<<<<< HEAD
    <Center h="100vh">
      <Stack align="center">
        <h1>TestCases</h1>
        <button onClick={gohome}>go to home</button>
        <TestCasesModalCreate />
      </Stack>
    </Center>
=======
    <div className={classes.container}>
      <h1>TestCases</h1>
      <button onClick={() => gohome()}>go to home</button>
      <TestCasesModalCreate />
    </div>
>>>>>>> c9802d57291a10d0f525b9ddcf63a8e6e949205b
  )
}
