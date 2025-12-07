import { authClient } from '@/lib/auth-client'
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Portal,
  Text,
  useToken,
} from '@chakra-ui/react'
import { CustomLink } from './CustomLink'
import { Menu } from '@chakra-ui/react'
import Logo from './Logo'

export default function Header() {
  const { data: session } = authClient.useSession()
  const isAuthenticated = !!session?.user
  const gradientTeal = `${useToken('colors', 'teal.400')}10`

  return (
    <Flex
      as="nav"
      width="100%"
      bg="black"
      align="center"
      justify="center"
      py={4}
    >
      <Flex width="80%" align="center" justify="space-between">
        <Logo />
        {isAuthenticated ? (
          <Menu.Root positioning={{ placement: 'bottom-end' }}>
            <Menu.Trigger asChild>
              <Button variant="outline" size="sm">
                Profile
              </Button>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="profile">Profile</Menu.Item>
                  <Menu.Item value="friends">Friends</Menu.Item>
                  <Menu.Item
                    value="log-out"
                    color="fg.error"
                    _hover={{ bg: 'bg.error', color: 'fg.error' }}
                  >
                    Log out
                  </Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
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

      {/* <Box
        position="absolute"
        inset={0}
        bg={`radial-gradient(ellipse at 60% -500px, ${gradientTeal} 0%, transparent 50%)`}
      /> */}
    </Flex>
  )
}
