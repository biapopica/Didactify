import { Box, Button, Card, Field, Input, Stack } from '@chakra-ui/react'
import { PasswordInput } from '@/components/ui/password-input'
import { authClient } from '@/lib/auth-client'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

export const Route = createFileRoute('/_auth/login')({
  component: RouteComponent,
})

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

function RouteComponent() {
  return (
    <Box
      minH={`calc(100vh - 68px)`}
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <LoginForm />
    </Box>
  )
}

function LoginForm() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null)
      await authClient.signIn.email({
        email: data.email,
        password: data.password,
        callbackURL: '/', // Redirect after login
      })
      // Navigation is handled by callbackURL
      navigate({ to: '/' })
    } catch (err) {
      setError('Invalid email or password')
      console.error('Login error:', err)
    }
  }

  return (
    <Card.Root w="full" maxW="sm" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Card.Header>
        <Card.Title>Log in</Card.Title>
        <Card.Description>Welcome back!</Card.Description>
      </Card.Header>

      <Card.Body>
        <Stack gap={4}>
          {error && (
            <Box color="red.500" fontSize="sm">
              {error}
            </Box>
          )}

          <Field.Root invalid={!!errors.email}>
            <Field.Label>Email</Field.Label>
            <Input {...register('email')} type="email" autoComplete="email" />
            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.password}>
            <Field.Label>Password</Field.Label>
            <PasswordInput
              {...register('password')}
              type="password"
              autoComplete="current-password"
            />
            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
          </Field.Root>
        </Stack>
      </Card.Body>

      <Card.Footer justifyContent="flex-end">
        <Button type="submit" loading={isSubmitting}>
          Log in
        </Button>
      </Card.Footer>
    </Card.Root>
  )
}
