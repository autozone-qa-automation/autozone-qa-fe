import { loginschema } from '../../../utils/schemas/login.schema'

describe('login.schema validations', () => {
  describe('Valid data', () => {
    it('should return success: true when provided a valid email and password', () => {
      const validData = {
        email: 'test@example.com',
        password: 'securePassword123',
      }

      const result = loginschema.safeParse(validData)

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(validData)
      }
    })
  })

  describe('Email validation', () => {
    it('should fail if the email is not in a valid format', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'securePassword123',
      }

      const result = loginschema.safeParse(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        const emailErrors = result.error.format().email
        expect(emailErrors?._errors).toContain('Invalid email address')
      }
    })

    it('should fail if the email exceeds 50 characters', () => {
      const longEmail = 'a'.repeat(40) + '@example.com'
      const invalidData = {
        email: longEmail,
        password: 'securePassword123',
      }

      const result = loginschema.safeParse(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        const emailErrors = result.error.format().email
        expect(emailErrors?._errors).toContain('Maximum 50 characters allowed')
      }
    })
  })

  describe('Password validation', () => {
    it('should fail if the password is empty', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      }

      const result = loginschema.safeParse(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        const passwordErrors = result.error.format().password
        expect(passwordErrors?._errors).toContain('Minimum 1 characters required')
      }
    })

    it('should fail if the password exceeds 100 characters', () => {
      const longPassword = 'a'.repeat(101)
      const invalidData = {
        email: 'test@example.com',
        password: longPassword,
      }

      const result = loginschema.safeParse(invalidData)

      expect(result.success).toBe(false)
      if (!result.success) {
        const passwordErrors = result.error.format().password
        expect(passwordErrors?._errors).toContain('Maximum 100 characters allowed')
      }
    })
  })
})
