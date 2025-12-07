import {
  Box,
  Button,
  Text,
  Field,
  Input,
  Stack,
  Flex,
  Group,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

const generateSchema = z.object({
  input: z.string().min(5, 'Please enter a course topic').max(500),
})

type generateFormValues = z.infer<typeof generateSchema>

export default function CourseGeneratingForm() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<generateFormValues>({
    resolver: zodResolver(generateSchema),
    defaultValues: { input: '' },
    mode: 'onBlur',
  })

  const onSubmit = async (data: generateFormValues) => {
    try {
      console.log('Generating course for:', data.input)
    } catch (err) {
      setError('Something went wrong. Try again.')
    }
  }

  return (
    <Flex
      w="full"
      maxW="lg"
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      mt={10}
      direction="column"
      gap={8}
      px={4}
    >
      {error && (
        <Box color="red.400" fontSize="sm" textAlign="center">
          {error}
        </Box>
      )}

      <Field.Root invalid={!!errors.input}>
        <Field.Label color="gray.200">Course Topic</Field.Label>

        <Group attached w="full">
          <Input
            {...register('input')}
            autoComplete="off"
            placeholder="e.g. Learn JavaScript from zero"
            bg="whiteAlpha.100"
            borderColor="whiteAlpha.300"
            _focus={{
              borderColor: 'teal.400',
              boxShadow: '0 0 0 1px teal.400',
            }}
            color="white"
            flex="1"
          />

          <Button
            type="submit"
            size="lg"
            loading={isSubmitting}
            bg="teal.400"
            color="black"
            fontWeight="semibold"
            boxShadow="0 0 30px rgba(56, 178, 172, 0.7), 0 0 60px rgba(56, 178, 172, 0.4), 0 0 90px rgba(56, 178, 172, 0.2)"
            _hover={{
              bg: 'teal.300',
              boxShadow:
                '0 0 40px rgba(56, 178, 172, 0.9), 0 0 80px rgba(56, 178, 172, 0.5), 0 0 120px rgba(56, 178, 172, 0.3)',
            }}
          >
            Generate Course
          </Button>
        </Group>

        <Field.ErrorText>{errors.input?.message}</Field.ErrorText>
      </Field.Root>
    </Flex>
  )
}
