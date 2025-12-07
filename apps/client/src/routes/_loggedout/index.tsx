import { createFileRoute } from '@tanstack/react-router'
import { Box, Center, useToken, Text } from '@chakra-ui/react'
import CourseGeneratingForm from '@/components/CourseGeneratingForm'

export const Route = createFileRoute('/_loggedout/')({
  component: App,
})

function App() {
  // Convert Chakra token to actual CSS color
  const gridLinesGray = useToken('colors', 'gray.950')
  const gradientTeal = `${useToken('colors', 'teal.400')}10`

  return (
    <Box
      position="relative"
      minH={`calc(100vh - 68px)`}
      bg="black"
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={8}
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
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        marginTop="32"
      >
        <Text fontSize="6xl" fontWeight="bold" color="white" textAlign="center">
          Learn Anything with <br />
          <Text
            as="span"
            color="teal.400"
            textShadow="0 0 500px rgba(56, 178, 172, 0.4)"
          >
            AI-Generated Courses
          </Text>
        </Text>
      </Box>

      <CourseGeneratingForm />
    </Box>
  )
}
