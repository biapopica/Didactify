import { createFileRoute } from '@tanstack/react-router'
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  useToken,
  Badge,
  Separator,
} from '@chakra-ui/react'

interface Module {
  title: string
  topics: string[]
}

interface Roadmap {
  title: string
  description: string
  modules: Module[]
}

interface RoadmapSearch {
  roadmap: string
}

export const Route = createFileRoute('/_loggedout/courses/generate/roadmap/')({
  validateSearch: (search: Record<string, unknown>): RoadmapSearch => {
    return {
      roadmap: String(search.roadmap || '{}'),
    }
  },
  component: RoadmapPage,
})

function RoadmapPage() {
  const { roadmap: roadmapJson } = Route.useSearch()

  let roadmap: Roadmap | null = null

  try {
    roadmap = JSON.parse(roadmapJson)
  } catch {
    roadmap = null
  }

  const gridLinesGray = useToken('colors', 'gray.950')
  const gradientTeal = `${useToken('colors', 'teal.400')}10`

  if (!roadmap || !roadmap.modules) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <Text color="red.300">Invalid roadmap data.</Text>
      </Flex>
    )
  }

  return (
    <Flex minH="100vh" px={4} py={16} justify="center" position="relative">
      {/* Background */}
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

      {/* Content */}
      <Box
        w="full"
        maxW="4xl"
        bg="gray.900"
        borderRadius="xl"
        borderWidth="1px"
        borderColor="whiteAlpha.200"
        boxShadow="0 0 50px rgba(56, 178, 172, 0.25)"
        p={10}
        position="relative"
      >
        <Stack gap={10}>
          {/* Header */}
          <Box textAlign="center">
            <Badge
              colorScheme="teal"
              mb={4}
              px={4}
              py={1}
              borderRadius="full"
              fontSize="xs"
              letterSpacing="0.1em"
            >
              Personalized Roadmap
            </Badge>

            <Heading size="lg" color="white" mb={4}>
              {roadmap.title}
            </Heading>

            <Text color="gray.400" maxW="2xl" mx="auto">
              {roadmap.description}
            </Text>
          </Box>

          <Separator borderColor="whiteAlpha.300" />

          {/* Modules */}
          <Stack gap={8}>
            {roadmap.modules.map((module, index) => (
              <Box
                key={index}
                bg="whiteAlpha.50"
                p={6}
                borderRadius="lg"
                borderWidth="1px"
                borderColor="whiteAlpha.200"
              >
                <Heading size="md" color="teal.300" mb={4}>
                  Module {index + 1}: {module.title}
                </Heading>

                <Stack pl={4} gap={2}>
                  {module.topics.map((topic, topicIndex) => (
                    <Text key={topicIndex} color="gray.300">
                      • {topic}
                    </Text>
                  ))}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Box>
    </Flex>
  )
}
