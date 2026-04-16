/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

export class EmailVO {
  // 1. Immutable property (cannot be changed after creation)
  private readonly _value: string;

  constructor(email: string) {
    this._value = this.validateAndFormat(email);
  }

  // 2. Self-validation logic
  private validateAndFormat(email: string): string {
    if (!email || email.trim() === '') {
      throw new Error('Email cannot be empty.');
    }

    // A basic regex for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error(`Invalid email format provided: ${email}`);
    }

    // We can also format data automatically (e.g., forcing lowercase)
    return email.toLowerCase().trim();
  }

  // Getter to easily access the raw string
  get value(): string {
    return this._value;
  }

  // 3. Comparability (VOs are equal if their values are equal)
  public equals(other: EmailVO): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    return this._value === other.value;
  }
}