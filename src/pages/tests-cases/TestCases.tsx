/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { useNavigate } from 'react-router'
import classes from './TestCases.module.css'
import { TestCasesModalCreate } from './TestCasesModalCreate'

export function TestCases() {
  const navigate = useNavigate()

  const gohome = () => {
    navigate('/')
  }

  return (
    <div className={classes.container}>
      <h1>TestCases</h1>
      <button onClick={() => gohome()}>go to home</button>
      <TestCasesModalCreate />
    </div>
  )
}
