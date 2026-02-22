import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Box,
  Button,
  Flex,
  Heading,
  Textarea,
  Text,
  Stack,
  useToken,
} from '@chakra-ui/react'
import { useState } from 'react'
import axios from 'axios'

interface Question {
  id: number
  text: string
  category?: string
}

interface QuestionsSearch {
  topic: string
  questions: string
}

export const Route = createFileRoute('/_loggedout/courses/generate/questions/')(
  {
    validateSearch: (search: Record<string, unknown>): QuestionsSearch => {
      return {
        topic: String(search.topic || ''),
        questions: String(search.questions || '[]'),
      }
    },
    component: QuestionsWizard,
  },
)

function QuestionsWizard() {
  const navigate = useNavigate()
  const { topic, questions: questionsJson } = Route.useSearch()
  const questions: Question[] = JSON.parse(questionsJson || '[]')

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const gridLinesGray = useToken('colors', 'gray.950')
  const gradientTeal = `${useToken('colors', 'teal.400')}10`

  const current = questions[step]
  const total = questions.length

  const handleNext = () => {
    if (step < total - 1) {
      setStep((s) => s + 1)
    }
  }

  const handleFinish = async () => {
    const result = questions.map((q) => ({
      id: q.id,
      question: q.text,
      answer: answers[q.id] || '',
    }))

    try {
      setIsSubmitting(true)
      setError(null)

      const response = await axios.post(
        'http://localhost:3000/api/courses/generate/roadmap',
        {
          topic,
          answers: result,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      console.log('Final course response:', response.data)

      navigate({
        to: '/courses/generate/roadmap',
        search: {
          roadmap: JSON.stringify(response.data),
        },
      })
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to generate final course')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1)
  }

  if (!current) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Text color="red.300">No questions provided.</Text>
      </Flex>
    )
  }

  return (
    <Flex
      minH={`calc(100vh - 68px)`}
      align="center"
      justify="center"
      px={4}
      position="relative"
    >
      <Box
        position="absolute"
        inset={0}
        bg={`radial-gradient(ellipse at 60% -500px, ${gradientTeal} 0%, transparent 50%)`}
      />

      <Box
        position="absolute"
        inset={0}
        bgImage={`linear-gradient(${gridLinesGray} 0.5px, transparent 0.5px),
                 linear-gradient(90deg, ${gridLinesGray} 0.5px, transparent 0.5px)`}
        bgSize="60px 60px"
        pointerEvents="none"
      />

      <Box
        w="full"
        maxW="lg"
        bg="gray.900"
        position="relative"
        borderRadius="xl"
        borderWidth="1px"
        borderColor="whiteAlpha.200"
        boxShadow="0 0 40px rgba(56, 178, 172, 0.25)"
        p={8}
      >
        <Stack gap={12}>
          <Box>
            <Text
              fontSize="xs"
              textTransform="uppercase"
              letterSpacing="0.15em"
              color="teal.300"
              mb={1}
            >
              Course Theme
            </Text>

            <Heading size="md" color="white">
              {topic}
            </Heading>

            <Text color="gray.400" fontSize="sm" mt={2}>
              Question {step + 1} of {total}
            </Text>
          </Box>

          <Stack>
            {error && (
              <Text color="red.400" fontSize="sm">
                {error}
              </Text>
            )}

            <Text color="white" mb={3} fontWeight="semibold">
              {current.text}
            </Text>

            <Textarea
              value={answers[current.id] ?? ''}
              onChange={(e) =>
                setAnswers((prev) => ({
                  ...prev,
                  [current.id]: e.target.value,
                }))
              }
              placeholder="Type your answer here..."
              bg="whiteAlpha.100"
              borderColor="whiteAlpha.300"
              _hover={{ borderColor: 'teal.400' }}
              _focus={{
                borderColor: 'teal.400',
                boxShadow: '0 0 0 1px rgba(56, 178, 172, 0.7)',
              }}
              color="white"
              minH="120px"
              resize="vertical"
            />

            <Flex justify="space-between" pt={8}>
              <Button
                onClick={handleBack}
                disabled={step === 0 || isSubmitting}
                variant="outline"
                colorScheme="teal"
              >
                Back
              </Button>

              {step < total - 1 ? (
                <Button
                  onClick={handleNext}
                  bg="teal.400"
                  color="black"
                  _hover={{ bg: 'teal.300' }}
                  px={8}
                  boxShadow="0 0 20px rgba(56, 178, 172, 0.6)"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleFinish}
                  loading={isSubmitting}
                  bg="teal.400"
                  color="black"
                  _hover={{ bg: 'teal.300' }}
                  px={8}
                  boxShadow="0 0 20px rgba(56, 178, 172, 0.6)"
                >
                  Finish
                </Button>
              )}
            </Flex>
          </Stack>
        </Stack>
      </Box>
    </Flex>
  )
}
