import { Box, Button, Field, Input, Flex, Group } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import axios, { AxiosError } from 'axios'
import { useNavigate } from '@tanstack/react-router'

const generateSchema = z.object({
  input: z.string().min(5, 'Enter a course topic').max(500),
})

type generateFormValues = z.infer<typeof generateSchema>

interface Question {
  id: number
  text: string
  category?: string
}

interface QuestionsResponse {
  success: boolean
  topic: string
  result: Question[]
}

interface ErrorResponse {
  error: string
}

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
    setError(null)

    try {
      const response = await axios.post<QuestionsResponse>(
        'http://localhost:3000/api/courses/generate/questions',
        { topic: data.input },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      console.log('RESPONSE', response)
      navigate({
        to: '/courses/generate/questions',
        search: {
          topic: response.data.topic,
          questions: JSON.stringify(response.data?.result),
        },
      })
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<ErrorResponse>
        setError(
          axiosError.response?.data?.error || 'Failed to generate questions',
        )
      } else {
        setError('Something went wrong. Try again.')
      }
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
            boxShadow="0 0 20px rgba(56, 178, 172, 0.35)"
            _hover={{
              bg: 'teal.300',
              boxShadow: '0 0 28px rgba(56, 178, 172, 0.45)',
            }}
          >
            Generate
          </Button>
        </Group>

        <Field.ErrorText>{errors.input?.message}</Field.ErrorText>
      </Field.Root>
    </Flex>
  )
}
