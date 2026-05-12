/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */
import './Login.css'
import {
  BackgroundImage,
  Box,
  Button,
  Container,
  Flex,
  Group,
  Stack,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useEffect } from 'react'
import { type FormValues, loginschema } from '@/utils/schemas/login.schema'
import azBackground from '../../assets/AZ_bg.png'
import classes from './LoginModal.module.css'

export function Login() {
  const [opened, { open, close }] = useDisclosure(false)

  useEffect(() => {
    open()
  }, [open])

  const form = useForm<FormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: values => {
      const result = loginschema.safeParse(values)

      if (result.success) return {}

      const formErrors: Record<string, string> = {}
      result.error.issues.forEach(issue => {
        const path = issue.path.join('.')
        if (!formErrors[path]) {
          formErrors[path] = issue.message
        }
      })
      return formErrors
    },
    validateInputOnChange: true,
  })

  const handleSubmit = () => {
    return null
  }
  const inputStyles = {
    input: {
      backgroundColor: '#FAF9F7',
      borderColor: '#EDEBE5',
      borderRadius: '8px',
      color: '#B2B2B8',
    },
    label: { color: '#8C8C94', fontWeight: 500, fontSize: '12px' },
    required: { color: '#8C8C94' },
  }

  return (
    <Box h="100vh" w="100dvw">
      <BackgroundImage src={azBackground} radius="xs" h="100%" w="100%">
        <Flex>
          <Container className={classes.loginRightContainer}>
            <form>
              <Stack gap="md">
                <TextInput
                  label="Email"
                  withAsterisk
                  styles={inputStyles}
                  placeholder="e.g. user@example.com"
                  {...form.getInputProps('email')}
                  error={form?.errors?.email}
                  data-testid="login-email-input"
                />

                <TextInput
                  label="Password"
                  withAsterisk
                  type="password"
                  styles={inputStyles}
                  placeholder="Your password"
                  {...form.getInputProps('password')}
                  error={form?.errors?.password}
                  data-testid="login-password-input"
                />

                <Group justify="center" mt="xl">
                  <Button
                    type="submit"
                    bg="#F26621"
                    color="#FFFFFF"
                    radius="md"
                    size="md"
                    data-testid="login-submit-button"
                    onClick={handleSubmit}
                  >
                    Log-in
                  </Button>
                </Group>
              </Stack>
            </form>
          </Container>
          <Container className={classes.loginLeftContainer} />
        </Flex>
      </BackgroundImage>
    </Box>
  )
}
