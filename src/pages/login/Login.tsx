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
  Divider,
  Flex,
  Group,
  Paper,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useLogin } from '@/hooks/useLogin'
import { type FormValues, loginschema } from '@/utils/schemas/login.schema'
import azBackground from '../../assets/AZ_bg.png'
import classes from './LoginModal.module.css'

/**
 * Login page component — Main authentication screen for QA-Zone.
 *
 * @component
 * @returns {React.ReactElement} Full-screen login form with background
 */
export function Login() {
  const [opened, { open }] = useDisclosure(false)
  const navigate = useNavigate()
  const { login, isLoading, error } = useLogin()

  useEffect(() => {
    if (error) {
      alert('Error logging in: ' + error)
    }
    open()
  }, [opened, open, error])

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

  /**
   * Handles login form submission.
   *
   * @async
   * @returns {Promise<void>}
   */
  const handleSubmit = async () => {
    const validated = form.validate()
    if (validated.hasErrors) return
    try {
      const user = await login({ mail: form.values.email, password: form.values.password })
      if (user) navigate('/')
    } catch {
      // error is handled in the hook
    }
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
            <Paper radius="xl" p="xl" bg="white" w={{ base: '90%', sm: 450 }} shadow="md">
              <Title order={3} ta="center" c="black" mb="md">
                LogIn into QA-Zone
              </Title>
              <Divider mb="xl" color="#EAEAEA" />
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
                      type="button"
                      bg="#F26621"
                      color="#FFFFFF"
                      radius="md"
                      size="md"
                      data-testid="login-submit-button"
                      onClick={() => void handleSubmit()}
                      disabled={isLoading}
                    >
                      Log-in
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Paper>
          </Container>
          <Container className={classes.loginLeftContainer} />
        </Flex>
      </BackgroundImage>
    </Box>
  )
}
