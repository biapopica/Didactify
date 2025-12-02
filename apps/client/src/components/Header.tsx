import { authClient } from '@/lib/auth-client'
import { Flex, HStack, Image, Text } from '@chakra-ui/react'
import { CustomLink } from './CustomLink'
import Logo from '@/assets/brain.png'

export default function Header() {
  const { data: session } = authClient.useSession()
  const isAuthenticated = !!session?.user
  console.log('IS AUTH', isAuthenticated)
  return (
    <Flex
      as="nav"
      width="80%"
      align="center"
      justify="space-between"
      px={8}
      py={4}
    >
      <CustomLink
        to="/"
        fontSize="xl"
        fontWeight="bold"
        color="blue.600"
        textDecoration="none"
        _hover={{ color: 'blue.700' }}
      >
        <HStack>
          <Image src={Logo} alt="Didactify" boxSize="32px" />
          <Text fontSize="xl" fontWeight="bold">
            Didactify
          </Text>
        </HStack>
      </CustomLink>

      {isAuthenticated ? (
        <Flex gap={4} align="center">
          <CustomLink
            to="/login"
            fontWeight="500"
            color="gray.700"
            textDecoration="none"
            px={4}
            py={2}
            borderRadius="md"
            transition="all 0.2s"
            _hover={{
              color: 'blue.600',
              bg: 'gray.100',
            }}
            _active={{
              color: 'blue.600',
              bg: 'gray.100',
            }}
          >
            Profile
          </CustomLink>
        </Flex>
      ) : (
        <Flex gap={4} align="center">
          <CustomLink
            to="/login"
            fontWeight="500"
            color="gray.700"
            textDecoration="none"
            px={4}
            py={2}
            borderRadius="md"
            transition="all 0.2s"
            _hover={{
              color: 'blue.600',
              bg: 'gray.100',
            }}
            _active={{
              color: 'blue.600',
              bg: 'gray.100',
            }}
          >
            Log in
          </CustomLink>

          <CustomLink
            to="/signup"
            fontWeight="500"
            color="white"
            bg="blue.600"
            textDecoration="none"
            px={6}
            py={2}
            borderRadius="md"
            transition="all 0.2s"
            _hover={{
              bg: 'blue.700',
            }}
            _active={{
              bg: 'blue.700',
            }}
          >
            Sign up
          </CustomLink>
        </Flex>
      )}
    </Flex>
  )
}
