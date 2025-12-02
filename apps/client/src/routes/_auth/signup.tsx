import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { PasswordInput } from '@/components/ui/password-input'
import { Box, Button, Card, Field, Input, Stack } from '@chakra-ui/react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { authClient } from '@/lib/auth-client'
import { useState } from 'react'

export const Route = createFileRoute('/_auth/signup')({
  component: RouteComponent,
})

const signupSchema = z
  .object({
    email: z.string().email('Please enter a valid email'),
    username: z.string().min(5, 'Username must be at least 5 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type SignupFormValues = z.infer<typeof signupSchema>

function RouteComponent() {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <SignupForm />
    </Box>
  )
}

function SignupForm() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  })

  const password = watch('password')

  useEffect(() => {
    if (dirtyFields.confirmPassword) {
      trigger('confirmPassword')
    }
  }, [password, dirtyFields.confirmPassword, trigger])

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setError(null)
      await authClient.signUp.email({
        name: data.username,
        email: data.email,
        password: data.password,
        callbackURL: '/',
      })

      navigate({ to: '/' })
    } catch (err) {
      setError('Failed to create account. Email might already exist.')
      console.error('Signup error:', err)
    }
  }

  return (
    <Card.Root w="full" maxW="sm" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Card.Header>
        <Card.Title>Create an Account</Card.Title>
        <Card.Description>Fill in the form to get started</Card.Description>
      </Card.Header>

      <Card.Body>
        <Stack gap={4}>
          {/* Email */}
          <Field.Root invalid={!!errors.email}>
            <Field.Label>Email</Field.Label>
            <Input type="email" autoComplete="email" {...register('email')} />
            <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
          </Field.Root>

          {/* Username */}
          <Field.Root invalid={!!errors.username}>
            <Field.Label>Username</Field.Label>
            <Input autoComplete="username" {...register('username')} />
            <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
          </Field.Root>

          {/* Password */}
          <Field.Root invalid={!!errors.password}>
            <Field.Label>Password</Field.Label>
            <PasswordInput
              type="password"
              autoComplete="new-password"
              {...register('password')}
            />
            <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
          </Field.Root>

          {/* Confirm Password */}
          <Field.Root invalid={!!errors.confirmPassword}>
            <Field.Label>Confirm Password</Field.Label>
            <PasswordInput
              type="password"
              autoComplete="new-password"
              {...register('confirmPassword')}
            />
            <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
          </Field.Root>
        </Stack>
      </Card.Body>

      <Card.Footer justifyContent="flex-end">
        <Button type="submit" loading={isSubmitting}>
          Sign up
        </Button>
      </Card.Footer>
    </Card.Root>
  )
}
