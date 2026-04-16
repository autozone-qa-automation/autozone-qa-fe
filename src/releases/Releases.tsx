/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { useNavigate } from 'react-router'

const Releases = () => {
  const navigate = useNavigate()

  const gohome = () => {
    navigate('/')
  }

  return (
    <div>
      <button onClick={() => gohome()}>go to home</button>
    </div>
  )
}

export default Releases
