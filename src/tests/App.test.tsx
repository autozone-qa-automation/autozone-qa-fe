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

import { render, waitFor } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('renders without crashing', async () => {
    render(<App />)

    await waitFor(() => {
      expect(document.body).toBeInTheDocument()
    })
  })
})
