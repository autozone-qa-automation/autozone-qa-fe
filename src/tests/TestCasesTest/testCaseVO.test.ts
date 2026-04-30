/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { TestCaseVO } from '@/models/TestCaseVO'
import type { TestCase } from '@/types/testcase.types'

describe('TestCaseVO', () => {
  const mockData: TestCase = {
    id: 1,
    title: 'Login validation',
    relatedFeature: 101,
    description: 'Verify login works',
    type: 'REGRESSION',
    preconditions: 'None',
    postconditions: 'Session created',
    inputs: 'user@test.com / 1234',
    steps: '1. Enter credentials',
    expectedOutput: 'Success',
    featureName: 'Auth',
  }

  it('should create an instance with all properties', () => {
    const vo = new TestCaseVO(mockData)
    expect(vo.id).toBe(1)
    expect(vo.title).toBe('Login validation')
    expect(vo.featureName).toBe('Auth')
  })

  it('should return the title when calling getDisplayName', () => {
    const vo = new TestCaseVO(mockData)
    expect(vo.getDisplayName()).toBe('Login validation')
  })
})
